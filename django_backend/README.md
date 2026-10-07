# Pronet Django Backend

A clean, robust, and scalable Django REST API backend for **Pronet** (Social Collaboration Platform for Project-Based Teamwork).

---

## 🚀 Quick Start

### 1. Start Django Backend Server

From the project root:
```powershell
npm run backend:django
```

Or directly using Python in `django_backend`:
```powershell
.\django_backend\venv\Scripts\python.exe django_backend\manage.py runserver 5000
```

The backend runs on **`http://localhost:5000`** (matching the frontend default).

---

## 🗄️ Database Setup

The backend works out-of-the-box using **SQLite** (`db.sqlite3`) for instant development, and is fully configured for **MySQL** (DBMS requirement).

### To Use MySQL:
1. Ensure your MySQL service (e.g., `MySQL80`) is running.
2. Create the database in MySQL:
   ```sql
   CREATE DATABASE pronet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Copy `.env.example` to `.env` in `django_backend`:
   ```ini
   USE_MYSQL=True
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=pronet
   DB_PORT=3306
   ```
4. Run migrations and seed data:
   ```powershell
   .\django_backend\venv\Scripts\python.exe django_backend\manage.py migrate
   .\django_backend\venv\Scripts\python.exe django_backend\manage.py seed_data
   ```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Backend health check & status |
| `GET` | `/api/test-db` | Test database connection and list users |
| `POST` | `/api/auth/register` | Register new user account (`user_name`, `email`, `password`, `title`, `location`) |
| `POST` | `/api/auth/login` | Login user (`email`, `password`) |
| `GET` | `/api/users/<user_name>` | Get user profile and stats |
| `PUT` | `/api/users/<user_name>` | Update user profile |
| `GET` | `/api/users/<user_name>/projects` | Get projects owned by user |
| `GET` | `/api/projects` | List all projects (supports `?search=` and `?tech=`) |
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects/<id>` | Get project details, collaborators, and comments |
| `POST` | `/api/projects/<id>/comments` | Add comment to a project |
| `GET` | `/api/requests` | List collaboration requests |
| `POST` | `/api/requests` | Submit collaboration request |
| `POST` | `/api/requests/<id>/respond` | Accept or decline request (`{"action": "accept"}`) |
| `GET` | `/api/connections` | List developer connections |

---

## 🧪 Running Tests

```powershell
.\django_backend\venv\Scripts\python.exe django_backend\manage.py test
```
All unit tests verify authentication, user projects, project creation, collaboration requests, and root health check.

---

## 👤 Admin Panel

Create an admin superuser:
```powershell
.\django_backend\venv\Scripts\python.exe django_backend\manage.py createsuperuser
```
Then visit `http://localhost:5000/admin/` to manage all models with a GUI.
