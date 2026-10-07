from django.core.management.base import BaseCommand
from api.models import User, TechStack, Project, ProjectTechStack, Contributor, Request, Connection


class Command(BaseCommand):
    help = 'Seeds initial data for Pronet using the 7 core DBMS tables'

    def handle(self, *args, **options):
        self.stdout.write("Seeding database across all 7 Pronet tables (users, projects, techstack, project_ts, contributers, requests, connections)...")

        def AV(seed):
            return f"https://api.dicebear.com/9.x/notionists/svg?seed={seed}&backgroundColor=b6e3f4,c0aede,d1d4f9"

        # 1. USERS
        users_data = [
            {
                "user_name": "aaravk",
                "email": "aarav@example.com",
                "password": "password123",
                "title": "Full-Stack Developer · DBMS Enthusiast",
                "bio": "Building developer tools by day, breaking them by night. Into distributed systems, Postgres internals, and clean UI.",
                "location": "Bengaluru, India",
                "skills": ["React", "Node.js", "PostgreSQL", "Python", "Docker", "System Design", "TypeScript", "GraphQL"],
                "github_url": "aaravk",
                "avatar": AV("aarav")
            },
            {
                "user_name": "meerai",
                "email": "meera@example.com",
                "password": "password123",
                "title": "ML Engineer",
                "bio": "Working on high-throughput ML models and distributed training pipelines.",
                "location": "Hyderabad, India",
                "skills": ["Python", "PyTorch", "Docker", "React"],
                "github_url": "meerai",
                "avatar": AV("meera")
            },
            {
                "user_name": "rohanv",
                "email": "rohan@example.com",
                "password": "password123",
                "title": "Backend Engineer",
                "bio": "Specialized in WAL internals, Go and high concurrency systems.",
                "location": "Pune, India",
                "skills": ["Go", "PostgreSQL", "Redis", "Docker"],
                "github_url": "rohanv",
                "avatar": AV("rohan")
            },
            {
                "user_name": "sarac",
                "email": "sara@example.com",
                "password": "password123",
                "title": "Product Designer & UI Engineer",
                "bio": "Crafting thoughtful user experiences and responsive interactive designs.",
                "location": "Mumbai, India",
                "skills": ["React", "TailwindCSS", "Figma", "TypeScript"],
                "github_url": "sarac",
                "avatar": AV("sara")
            },
            {
                "user_name": "devikan",
                "email": "devika@example.com",
                "password": "password123",
                "title": "Mobile Developer",
                "bio": "Building native and cross-platform mobile apps.",
                "location": "Kochi, India",
                "skills": ["Swift", "Kotlin", "React Native", "TypeScript"],
                "github_url": "devikan",
                "avatar": AV("devika")
            },
            {
                "user_name": "kabirm",
                "email": "kabir@example.com",
                "password": "password123",
                "title": "DevOps Engineer",
                "bio": "Cloud architecture, Kubernetes, and automated deployment pipelines.",
                "location": "Delhi, India",
                "skills": ["Kubernetes", "Docker", "Rust", "Terraform"],
                "github_url": "kabirm",
                "avatar": AV("kabir")
            },
            {
                "user_name": "ishaanr",
                "email": "ishaan@example.com",
                "password": "password123",
                "title": "Frontend Engineer",
                "bio": "Design systems and animation geek.",
                "location": "Chennai, India",
                "skills": ["React", "Next.js", "TailwindCSS"],
                "github_url": "ishaanr",
                "avatar": AV("ishaan")
            },
            {
                "user_name": "ananyag",
                "email": "ananya@example.com",
                "password": "password123",
                "title": "Data Scientist",
                "bio": "Computer vision and retail analytics pipelines.",
                "location": "Bengaluru, India",
                "skills": ["Python", "PostgreSQL", "OpenCV", "Docker"],
                "github_url": "ananyag",
                "avatar": AV("ananya")
            }
        ]

        created_users = {}
        for u in users_data:
            user, created = User.objects.get_or_create(
                user_name=u['user_name'],
                defaults={
                    "email": u['email'],
                    "title": u['title'],
                    "bio": u['bio'],
                    "location": u['location'],
                    "skills": u['skills'],
                    "github_url": u['github_url'],
                    "avatar": u['avatar']
                }
            )
            if created or not user.password:
                user.set_password(u['password'])
                user.save()
            created_users[u['user_name']] = user

        # 2. TECHSTACK & 3. PROJECTS & 4. PROJECT_TS & 5. CONTRIBUTERS
        projects_data = [
            {
                "id": "p1",
                "title": "PulseDB — Realtime Analytics Engine",
                "tagline": "A blazing-fast realtime analytics DB built on top of Postgres logical replication.",
                "description": "PulseDB streams row-level changes from Postgres into a columnar cache for sub-second analytics dashboards. Looking for people who love query planners, WAL internals, and building rock-solid infra. Currently has a working ingestion pipeline and a basic query API — needs a front-end dashboard and more ingestion connectors.",
                "owner": "aaravk",
                "tech": ["PostgreSQL", "Rust", "Redis", "Docker"],
                "roles_needed": ["Frontend Dev", "DevOps"],
                "stars": 214,
                "forks": 38,
                "github": "https://github.com/aaravk/pulsedb",
                "collaborators": [
                    {"user": "aaravk", "role": "Lead Architect"},
                    {"user": "meerai", "role": "ML/Analytics"},
                    {"user": "rohanv", "role": "Storage Engine"},
                    {"user": "kabirm", "role": "Infra"}
                ]
            },
            {
                "id": "p2",
                "title": "CampusConnect",
                "tagline": "A LinkedIn-for-students platform to find hackathon teammates on campus.",
                "description": "CampusConnect helps university students discover teammates by skill and interest for hackathons, side projects, and study groups. MVP has auth, profile, and matching algorithm done. We need help with the chat feature and mobile responsiveness.",
                "owner": "sarac",
                "tech": ["React", "Node.js", "GraphQL", "TailwindCSS"],
                "roles_needed": ["Mobile Dev", "Backend Dev"],
                "stars": 96,
                "forks": 21,
                "github": "https://github.com/sarac/campusconnect",
                "collaborators": [
                    {"user": "sarac", "role": "UI/UX Lead"},
                    {"user": "devikan", "role": "Mobile App"},
                    {"user": "ishaanr", "role": "Frontend"}
                ]
            },
            {
                "id": "p3",
                "title": "ShelfSense",
                "tagline": "Computer-vision powered inventory tracking for small retail stores.",
                "description": "ShelfSense uses a lightweight CV model to detect stock levels from shelf photos and auto-generates restock alerts. Backend and model pipeline are done; we need a polished merchant dashboard and onboarding flow.",
                "owner": "ananyag",
                "tech": ["Python", "React", "Docker", "PostgreSQL"],
                "roles_needed": ["Frontend Dev", "UI/UX Designer"],
                "stars": 152,
                "forks": 30,
                "github": "https://github.com/ananyag/shelfsense",
                "collaborators": [
                    {"user": "ananyag", "role": "Computer Vision Lead"},
                    {"user": "aaravk", "role": "Full-Stack Dev"}
                ]
            },
            {
                "id": "p4",
                "title": "Nimbus CLI",
                "tagline": "A delightfully fast, plugin-based CLI for managing multi-cloud infra.",
                "description": "Nimbus wraps AWS/GCP/Azure CLIs behind one unified plugin architecture with a TUI. Core plugin loader and AWS support are stable. Looking for folks to build GCP/Azure plugins and improve the TUI.",
                "owner": "kabirm",
                "tech": ["Rust", "Kubernetes", "Docker"],
                "roles_needed": ["Systems Engineer"],
                "stars": 341,
                "forks": 64,
                "github": "https://github.com/kabirm/nimbus-cli",
                "collaborators": [
                    {"user": "kabirm", "role": "Creator & Lead"},
                    {"user": "rohanv", "role": "Core CLI Dev"}
                ]
            },
            {
                "id": "p5",
                "title": "EchoNotes",
                "tagline": "Voice-first note-taking app with on-device transcription and semantic search.",
                "description": "EchoNotes transcribes voice memos on-device using Whisper.cpp and lets you semantically search past notes. iOS app is in beta. We need an Android build and a web companion app.",
                "owner": "devikan",
                "tech": ["TypeScript", "Next.js", "TailwindCSS"],
                "roles_needed": ["Mobile Dev", "Frontend Dev"],
                "stars": 88,
                "forks": 12,
                "github": "https://github.com/devikan/echonotes",
                "collaborators": [
                    {"user": "devikan", "role": "Lead iOS Dev"},
                    {"user": "meerai", "role": "Speech AI"}
                ]
            },
            {
                "id": "p6",
                "title": "GraphForge",
                "tagline": "Visual query builder for GraphQL APIs with live schema introspection.",
                "description": "GraphForge lets you drag-and-drop build GraphQL queries against any schema, with live validation and codegen for React hooks. Core builder UI works; we need help with the codegen module and docs site.",
                "owner": "meerai",
                "tech": ["React", "GraphQL", "TypeScript", "Node.js"],
                "roles_needed": ["Backend Dev", "Technical Writer"],
                "stars": 176,
                "forks": 45,
                "github": "https://github.com/meerai/graphforge",
                "collaborators": [
                    {"user": "meerai", "role": "Founder"},
                    {"user": "aaravk", "role": "React Hooks Engine"},
                    {"user": "ananyag", "role": "Query Parser"}
                ]
            }
        ]

        for p_data in projects_data:
            owner = created_users[p_data["owner"]]
            project, _ = Project.objects.get_or_create(
                id=p_data["id"],
                defaults={
                    "title": p_data["title"],
                    "tagline": p_data["tagline"],
                    "description": p_data["description"],
                    "owner": owner,
                    "roles_needed": p_data["roles_needed"],
                    "stars": p_data["stars"],
                    "forks": p_data["forks"],
                    "github": p_data["github"]
                }
            )

            # techstack & project_ts
            for tech_name in p_data.get("tech", []):
                tech_obj, _ = TechStack.objects.get_or_create(skill_name=tech_name)
                ProjectTechStack.objects.get_or_create(project=project, tech=tech_obj)

            # contributers
            for col_info in p_data.get("collaborators", []):
                col_user = created_users.get(col_info["user"])
                if col_user:
                    Contributor.objects.get_or_create(
                        project=project,
                        user=col_user,
                        defaults={"role": col_info["role"]}
                    )

        # 6. REQUESTS
        requests_data = [
            {
                "user": "rohanv",
                "project": "p1",
                "message": "I've worked extensively with Postgres WAL and logical decoding — would love to help build the connectors.",
                "status": "pending"
            },
            {
                "user": "ishaanr",
                "project": "p1",
                "message": "I'm a frontend dev with dashboard experience (built 3 Grafana plugins). Can jump in on the UI.",
                "status": "pending"
            },
            {
                "user": "devikan",
                "project": "p6",
                "message": "I write technical docs for a living. Happy to help document GraphForge's codegen module.",
                "status": "pending"
            },
            {
                "user": "ananyag",
                "project": "p1",
                "message": "DevOps here — I can help containerize the ingestion pipeline and set up CI.",
                "status": "pending"
            }
        ]

        for r_info in requests_data:
            r_user = created_users.get(r_info["user"])
            r_proj = Project.objects.filter(id=r_info["project"]).first()
            if r_user and r_proj:
                Request.objects.get_or_create(
                    project=r_proj,
                    user=r_user,
                    defaults={"message": r_info["message"], "status": r_info["status"]}
                )

        # 7. CONNECTIONS
        aarav = created_users["aaravk"]
        for u_name, other_u in created_users.items():
            if u_name != "aaravk":
                Connection.objects.get_or_create(
                    user1=aarav,
                    user2=other_u,
                    defaults={"status": "connected"}
                )

        self.stdout.write(self.style.SUCCESS("Successfully seeded all 7 Pronet tables!"))
