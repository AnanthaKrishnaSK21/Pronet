from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import User, Project, CollaborationRequest


class PronetApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create(
            user_name="testuser",
            email="test@example.com",
            title="Tester",
            bio="Bio test",
            location="Bengaluru",
            skills=["Python", "Django"]
        )
        self.user.set_password("secret123")
        self.user.save()

        self.project = Project.objects.create(
            id="test_p1",
            title="Test Project",
            tagline="Tagline test",
            description="Description test",
            owner=self.user,
            tech=["Python", "Django"],
            roles_needed=["Backend Dev"]
        )

    def test_root_and_test_db(self):
        res = self.client.get('/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("Pronet Django backend is running", res.data["message"])

        res2 = self.client.get('/api/test-db')
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertTrue(len(res2.data) >= 1)

    def test_auth_register_and_login(self):
        # Register new user
        reg_res = self.client.post('/api/auth/register', {
            "user_name": "newuser",
            "email": "new@example.com",
            "password": "password123",
            "title": "Frontend Engineer"
        }, format='json')
        self.assertEqual(reg_res.status_code, status.HTTP_201_CREATED)

        # Login with new user
        login_res = self.client.post('/api/auth/login', {
            "email": "new@example.com",
            "password": "password123"
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)
        self.assertEqual(login_res.data["user"]["user_name"], "newuser")

        # Login with bad password
        bad_login = self.client.post('/api/auth/login', {
            "email": "new@example.com",
            "password": "wrong"
        }, format='json')
        self.assertEqual(bad_login.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_projects_crud(self):
        # List projects
        res = self.client.get('/api/projects')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)

        # Create project
        create_res = self.client.post('/api/projects', {
            "title": "Second Project",
            "tagline": "Second Tagline",
            "description": "Some description",
            "owner_name": "testuser",
            "tech": ["React", "Django"],
            "roles": ["Fullstack"]
        }, format='json')
        self.assertEqual(create_res.status_code, status.HTTP_201_CREATED)

        # User projects
        user_p = self.client.get('/api/users/testuser/projects')
        self.assertEqual(user_p.status_code, status.HTTP_200_OK)
        self.assertEqual(len(user_p.data), 2)

    def test_collaboration_requests(self):
        # Create request
        req_res = self.client.post('/api/requests', {
            "project_id": "test_p1",
            "user_name": "testuser",
            "message": "I want to collaborate"
        }, format='json')
        self.assertEqual(req_res.status_code, status.HTTP_201_CREATED)
        req_id = req_res.data["id"]

        # Respond to request (accept)
        resp = self.client.post(f'/api/requests/{req_id}/respond', {
            "action": "accept"
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("accepted", resp.data["message"])
