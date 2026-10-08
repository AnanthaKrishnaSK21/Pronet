from rest_framework import serializers
from .models import User, TechStack, Project, ProjectTechStack, Contributor, Request, Connection, ProjectLike


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'user_name', 'email', 'title', 'bio', 'location', 'github_url', 'avatar', 'skills', 'created_at']


class TechStackSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechStack
        fields = ['id', 'skill_name']


class ContributorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Contributor
        fields = ['id', 'user', 'role', 'joined_at']


class ProjectSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    tech = serializers.SerializerMethodField()
    collaborators = serializers.SerializerMethodField()
    forked_from = serializers.SerializerMethodField()
    liked_by_users = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'tagline', 'description', 'owner', 'tech',
            'roles_needed', 'github', 'stars', 'forks', 'collaborators',
            'comments', 'forked_from', 'liked_by_users', 'created_at'
        ]

    def get_tech(self, obj):
        return [assoc.tech.skill_name for assoc in obj.tech_associations.select_related('tech').all()]

    def get_collaborators(self, obj):
        collabs = obj.contributers.select_related('user').all()
        return [UserSerializer(c.user).data for c in collabs]

    def get_forked_from(self, obj):
        if not obj.forked_from:
            return None
        return {
            'id': obj.forked_from.id,
            'title': obj.forked_from.title,
            'owner_username': obj.forked_from.owner.user_name,
        }

    def get_liked_by_users(self, obj):
        return list(obj.likes.values_list('user__user_name', flat=True))



class RequestSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    project = serializers.SerializerMethodField()

    class Meta:
        model = Request
        fields = ['id', 'project', 'user', 'message', 'status', 'created_at']

    def get_project(self, obj):
        return {
            'id': obj.project.id,
            'title': obj.project.title,
            'tagline': obj.project.tagline,
        }


class ConnectionSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()

    class Meta:
        model = Connection
        fields = ['id', 'user', 'status', 'created_at']

    def get_user(self, obj):
        req_username = self.context.get('current_username')
        if req_username and obj.user1.user_name == req_username:
            return UserSerializer(obj.user2).data
        return UserSerializer(obj.user1).data
