# ProNet — Project Documentation (Updated)

**ProNet** is a modern developer networking and project collaboration platform.  
Developers can showcase projects, recruit collaborators by role, discover peers via tech stack filters, connect/chat, apply for collaboration, and interact with projects through **likes** and **forks**.

---

## 1. Tech Stack Overview

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19 (JSX), Vite 8, React Router v7 |
| **UI / Animations** | Framer Motion, Lucide React icons, Custom CSS (Glassmorphism) |
| **Backend** | Django 5.0+, Django REST Framework (DRF) |
| **Database** | MySQL 8.0+ (production) / SQLite3 (dev fallback) |
| **Auth** | Stateless LocalStorage sessions + Django PBKDF2 password hashing |
| **CORS** | `django-cors-headers` (all origins allowed in dev) |

---

## 2. Directory & File Structure

```
Project/
└── Pronet/
    ├── index.html                        # HTML entry point
    ├── vite.config.js                    # Vite bundler config
    ├── package.json                      # NPM deps & scripts
    ├── PRONET_PROJECT_DOCUMENTATION.md  # ← This file
    │
    ├── src/                              # React Frontend
    │   ├── main.jsx                      # App root & Provider setup
    │   ├── App.jsx                       # Route definitions
    │   ├── index.css                     # Global theme & glassmorphism tokens
    │   │
    │   ├── context/
    │   │   ├── AuthContext.jsx           # login / register / logout / session sync
    │   │   └── ThemeContext.jsx          # dark / light mode state
    │   │
    │   ├── pages/
    │   │   ├── Landing.jsx               # Hero / feature showcase
    │   │   ├── Auth.jsx                  # Login & Register tabs
    │   │   ├── Feed.jsx                  # Project discovery feed (search + tech filter)
    │   │   ├── ProjectDetail.jsx         # Full project view (like, fork, comment, sidebar)
    │   │   ├── CreateProject.jsx         # New project form
    │   │   ├── Profile.jsx               # User dashboard & owned project list
    │   │   ├── Connections.jsx           # Peer connections list + chat
    │   │   └── Requests.jsx              # Incoming collaboration requests
    │   │
    │   ├── components/
    │   │   ├── Navbar.jsx                # Top nav with route links & user badge
    │   │   ├── ProjectCard.jsx           # Project preview card (like + fork buttons)
    │   │   ├── ChatModal.jsx             # Real-time DM dialog
    │   │   ├── CollaborateModal.jsx      # Send collaboration request modal
    │   │   ├── ParticleBackground.jsx    # Canvas particle animation
    │   │   ├── GlassCard.jsx             # Glassmorphism card wrapper
    │   │   ├── Modal.jsx                 # Generic popup frame
    │   │   ├── Toast.jsx                 # Floating notification provider
    │   │   ├── Pill.jsx                  # TechPill / RolePill badge
    │   │   ├── Button.jsx                # Styled button variants
    │   │   ├── Input.jsx                 # Styled text input
    │   │   ├── Avatar.jsx                # User avatar (DiceBear)
    │   │   ├── Skeleton.jsx              # Loading skeleton placeholder
    │   │   ├── ThemeToggle.jsx           # Theme switch control
    │   │   └── PageTransition.jsx        # Route-change animation wrapper
    │   │
    │   └── data/
    │       └── mock.js                   # Fallback mock projects (used if API is offline)
    │
    └── django_backend/
        ├── manage.py                     # Django CLI runner
        ├── requirements.txt              # Python dependencies
        ├── .env.example                  # Environment variables template
        │
        ├── pronet_project/               # Django project config package
        │   ├── settings.py               # DB engine selection, CORS, installed apps
        │   ├── urls.py                   # Top-level router → /api/ prefix
        │   ├── wsgi.py
        │   └── asgi.py
        │
        └── api/                          # Main Django application
            ├── models.py                 # 8 DB models (inc. ProjectLike)
            ├── serializers.py            # DRF serializers (inc. liked_by_users, forked_from)
            ├── views.py                  # REST view functions (~744 lines)
            ├── urls.py                   # All API route patterns
            ├── admin.py                  # Django admin registrations
            └── apps.py                   # App config
```

---

## 3. Database Schema (8 Tables)

### ER Overview

```
users ──< projects >── project_ts >── techstack
  │           │
  │           ├──< contributers
  │           ├──< requests
  │           ├──< project_likes      ← NEW
  │           └──(self FK) forked_from ← NEW
  │
  └──< connections (user1, user2)
```

---

### Table Definitions

#### `users`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | INT | PK, Auto-Increment |
| `user_name` | VARCHAR(150) | Unique, Not Null |
| `email` | VARCHAR(254) | Unique, Not Null |
| `password` | VARCHAR(255) | PBKDF2 hashed |
| `title` | VARCHAR(255) | Default: `"Full-Stack Developer"` |
| `bio` | TEXT | Default: passions blurb |
| `location` | VARCHAR(150) | Default: `"Bengaluru, India"` |
| `github_url` | VARCHAR(255) | |
| `avatar` | VARCHAR(500) | DiceBear SVG URL |
| `skills` | JSON | Array of skill strings |
| `created_at` | DATETIME | Auto |

---

#### `projects`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | VARCHAR(50) | PK, generated as `p_<8hex>` |
| `title` | VARCHAR(255) | Not Null |
| `tagline` | VARCHAR(350) | |
| `description` | TEXT | |
| `owner_id` | INT | FK → `users.id` CASCADE |
| `stars` | INT | Default 0 — incremented/decremented by like toggle |
| `forks` | INT | Default 0 — incremented on each successful fork |
| `forked_from_id` | VARCHAR(50) | FK → `projects.id` SET NULL — **NEW** |
| `roles_needed` | JSON | Array of role strings |
| `comments` | JSON | Array of `{id, user, text, time, created_at}` |
| `github` | VARCHAR(255) | |
| `created_at` | DATETIME | Auto, ordered DESC |

> **Note:** `forked_from_id` is `NULL` for original projects and set to the source project's ID for any fork.

---

#### `project_likes` — **NEW TABLE**
Stores one row per unique user-project like. Used for toggle like/unlike and to populate `liked_by_users` in API responses.

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | INT | PK, Auto-Increment |
| `project_id` | VARCHAR(50) | FK → `projects.id` CASCADE |
| `user_id` | INT | FK → `users.id` CASCADE |
| `created_at` | DATETIME | Auto |
| — | — | Unique together: `(project_id, user_id)` |

---

#### `techstack`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | INT | PK |
| `skill_name` | VARCHAR(100) | Unique |

---

#### `project_ts` (Junction: Projects ↔ TechStack)
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | INT | PK |
| `project_id` | VARCHAR(50) | FK → `projects.id` CASCADE |
| `tech_id` | INT | FK → `techstack.id` CASCADE |
| — | — | Unique together: `(project_id, tech_id)` |

---

#### `contributers`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | INT | PK |
| `project_id` | VARCHAR(50) | FK → `projects.id` CASCADE |
| `user_id` | INT | FK → `users.id` CASCADE |
| `role` | VARCHAR(100) | Default `'Contributor'` |
| `joined_at` | DATETIME | Auto |
| — | — | Unique together: `(project_id, user_id)` |

> Owner is automatically inserted as `'Owner & Lead'` on project creation.

---

#### `requests`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | INT | PK |
| `project_id` | VARCHAR(50) | FK → `projects.id` CASCADE |
| `user_id` | INT | FK → `users.id` CASCADE |
| `message` | TEXT | |
| `status` | VARCHAR(20) | `'pending'` / `'accepted'` / `'declined'` |
| `created_at` | DATETIME | Auto, ordered DESC |

---

#### `connections`
| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | INT | PK |
| `user1_id` | INT | FK → `users.id` CASCADE |
| `user2_id` | INT | FK → `users.id` CASCADE |
| `status` | VARCHAR(20) | `'pending'` / `'connected'` / `'declined'` |
| `messages` | JSON | Array of `{id, sender, receiver, text, time, created_at, read}` |
| `created_at` | DATETIME | Auto |
| — | — | Unique together: `(user1_id, user2_id)` |

---

## 4. API Endpoints Reference

**Base URL:** `http://localhost:5000/api`

| Category | Method | Route | Description |
| :--- | :--- | :--- | :--- |
| **System** | GET | `/` | API health, table list & endpoint map |
| **System** | GET | `/test-db` | Test DB connectivity, return all users |
| **Auth** | POST | `/auth/register` | Register new user (hashes password) |
| **Auth** | POST | `/auth/login` | Authenticate by email or username |
| **Users** | GET | `/users/<user_name>` | Get user profile |
| **Users** | PUT | `/users/<user_name>` | Update user profile fields |
| **Users** | GET | `/users/<user_name>/projects` | Get all projects owned by user |
| **Projects** | GET | `/projects` | List all projects (`?tech=` and `?q=` filters) |
| **Projects** | POST | `/projects` | Create a new project |
| **Projects** | GET | `/projects/<id>` | Get single project (with tech, collaborators, likes) |
| **Projects** | DELETE | `/projects/<id>` | Delete project (owner only) |
| **Projects** | POST | `/projects/<id>/comments` | Post a comment (stored in JSON field) |
| **Likes** | POST | `/projects/<id>/like` | **Toggle like/unlike** — body: `{user_name}` |
| **Forks** | POST | `/projects/<id>/fork` | **Fork project** — body: `{user_name}` |
| **Requests** | GET | `/requests?user=<name>` | Get pending collaboration requests for user |
| **Requests** | POST | `/requests` | Send collaboration request |
| **Requests** | POST | `/requests/<id>/respond` | Accept or decline a request |
| **Connections** | GET | `/connections?username=<name>` | List all users + connection status |
| **Connections** | POST | `/connections/request` | Send / cancel / accept connection request |
| **Connections** | POST | `/connections/<id>/respond` | Respond to connection request |
| **Messages** | GET | `/connections/messages?user1=&user2=` | Fetch chat messages for a connection |
| **Messages** | POST | `/connections/messages` | Send a chat message |

---

## 5. Likes & Forks — Detailed Flow

### 5.1 Likes

#### Backend (`views.py: like_project`)
- Route: `POST /api/projects/<id>/like`
- Body: `{ "user_name": "<username>" }`
- Uses a **`transaction.atomic()`** block to safely toggle:
  - If a `ProjectLike` row exists for `(project, user)` → **delete it** (unlike), decrement `project.stars`.
  - If no row exists → **create** a `ProjectLike` row (like), increment `project.stars`.
- Returns: `{ "liked": bool, "stars": int }`

#### Serializer (`serializers.py: ProjectSerializer`)
- `stars` — current like count on the project row (integer).
- `liked_by_users` — list of `user_name` strings of all users who liked the project. Generated via:
  ```python
  obj.likes.values_list('user__user_name', flat=True)
  ```

#### Frontend (`ProjectCard.jsx` & `ProjectDetail.jsx`)
- **Optimistic UI:** State is updated *before* the API call. If the call fails, state is reverted.
- `isLiked` is derived from `project.liked_by_users.includes(currentUsername)`.
- Heart icon turns filled rose-red when liked; shown count = `project.stars`.
- Both `ProjectCard` and `ProjectDetail` implement identical like logic independently.

---

### 5.2 Forks

#### Backend (`views.py: fork_project`)
- Route: `POST /api/projects/<id>/fork`
- Body: `{ "user_name": "<username>" }`
- **Validations:**
  - Cannot fork your own project (`owner_id == user.id` → 400).
  - Cannot fork the same project twice (`Project.objects.filter(owner=user, forked_from=original).exists()` → 400).
- On success (inside `transaction.atomic()`):
  1. Creates a new `Project` row: title `"<Original Title> (Fork)"`, copies tagline, description, roles, github, tech.
  2. Sets `forked_from = original` on the new project.
  3. Copies all `ProjectTechStack` associations from original to fork.
  4. Creates a `Contributor` row for the forking user as `'Owner & Lead'`.
  5. Increments `original.forks` by 1.
- Returns: Full serialized forked project (`201 Created`).

#### Serializer (`serializers.py: ProjectSerializer`)
- `forks` — count of times the project has been forked (integer).
- `forked_from` — `null` for originals, or `{ id, title, owner_username }` for forks:
  ```python
  def get_forked_from(self, obj):
      if not obj.forked_from: return None
      return {
          'id': obj.forked_from.id,
          'title': obj.forked_from.title,
          'owner_username': obj.forked_from.owner.user_name,
      }
  ```

#### Frontend (`ProjectCard.jsx` & `ProjectDetail.jsx`)
- Fork button only shown to **non-owners** (`!isOwnProject`). Owners see a static fork count display instead.
- On click, sets `forking = true` (disables button, shows "Forking…") while awaiting API.
- On success: increments displayed fork count locally, shows a success toast, and navigates to the new forked project page (`/project/<new_id>`) after a 1.2–1.5 s delay.
- On failure: shows an error toast with the API message.
- Forked projects display a **"Forked from `<title>` by @`<owner>`"** banner (with GitFork icon), linking back to the original.

---

## 6. ProjectSerializer — Full Field Map

```python
fields = [
    'id',            # e.g. "p_a1b2c3d4"
    'title',
    'tagline',
    'description',
    'owner',         # nested UserSerializer
    'tech',          # list of skill_name strings (from project_ts → techstack)
    'roles_needed',  # JSON array
    'github',
    'stars',         # int — like count (mirrors project_likes rows)
    'forks',         # int — fork count
    'collaborators', # list of UserSerializer (from contributers)
    'comments',      # JSON array from project.comments field
    'forked_from',   # null | {id, title, owner_username}
    'liked_by_users',# list of user_name strings who liked this project
    'created_at',
]
```

---

## 7. Frontend Routes & Page Responsibilities

| Route | Component | Key Responsibilities |
| :--- | :--- | :--- |
| `/` | `Landing.jsx` | Hero + features intro, CTA buttons |
| `/auth` | `Auth.jsx` | Login / Register tab form, calls AuthContext |
| `/feed` | `Feed.jsx` | Fetch all projects, search bar, tech filter pills, renders `ProjectCard` grid |
| `/project/:id` | `ProjectDetail.jsx` | Full project view, like/fork/comment, collaborator sidebar |
| `/create` | `CreateProject.jsx` | Multi-step project creation form |
| `/profile` | `Profile.jsx` | User's own projects, profile edit form |
| `/requests` | `Requests.jsx` | Incoming collab requests, accept/decline actions |
| `/connections` | `Connections.jsx` | All users list + connection status, `ChatModal` |

---

## 8. Global State (React Context)

### `AuthContext.jsx`
Wraps the entire app. Provides:

| Value | Type | Description |
| :--- | :--- | :--- |
| `user` | Object \| null | Currently logged-in user from localStorage |
| `isAuthenticated` | Boolean | `!!user` |
| `loading` | Boolean | True while syncing with backend on mount |
| `login(email, password)` | Function | POST `/auth/login`, sets user in state & localStorage |
| `register({...})` | Function | POST `/auth/register`, then auto-logs in |
| `logout()` | Function | Clears state & localStorage |
| `updateUser(fields)` | Function | Merges partial updates into stored user |

On mount, AuthContext re-fetches the logged-in user's profile from `/api/users/<user_name>` to keep data fresh.

### `ThemeContext.jsx`
Provides `theme` and `toggleTheme`. Applied as a CSS class to the root element.

---

## 9. Environment Variables (`.env`)

Copy `django_backend/.env.example` to `django_backend/.env`:

```env
USE_MYSQL=False          # Set True to use MySQL

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pronet
DB_PORT=3306

PORT=5000
SECRET_KEY=your-secret-key
DEBUG=True
```

When `USE_MYSQL=False`, Django uses a local `db.sqlite3` file — zero config needed for local dev.

---

## 10. How to Run Locally

### Backend (Django)

```bash
cd django_backend

# Create & activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # macOS/Linux

# Install Python dependencies
pip install -r requirements.txt

# Run migrations (creates all 8 tables)
python manage.py makemigrations api
python manage.py migrate

# Start Django on port 5000
python manage.py runserver 5000
```

Or use the NPM shortcut from the project root:
```bash
npm run backend:django
```

### Frontend (React + Vite)

```bash
# From Pronet/ root
npm install
npm run dev
```

Frontend runs at: **http://localhost:5173**  
Backend API at: **http://localhost:5000/api**
