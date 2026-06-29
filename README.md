# 🚀 Pulse – Full Stack Social Media Platform

Pulse is a modern full-stack social media application built with **React**, **Django REST Framework**, and **PostgreSQL**. Users can register, authenticate using JWT, create posts with images, like posts, comment, manage profiles, and interact through a clean and responsive interface.

---

## 🌐 Live Demo

### Frontend
https://django-react-social-media.vercel.app

### Backend API
https://django-react-social-media.onrender.com

---

# ✨ Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 📝 Create Text Posts
- 🖼 Upload Images (Cloudinary)
- ❤️ Like / Unlike Posts
- 💬 Comment System
- 👤 User Profiles
- 🔍 Search & Filtering
- 📱 Responsive Design
- 🌙 Modern UI
- 🔄 Automatic JWT Token Refresh
- ☁ Cloud Deployment

---

# 🛠 Tech Stack

## Frontend

- React 19
- Vite
- React Router
- Axios
- Framer Motion
- Tailwind CSS
- React Hot Toast
- Lucide React

## Backend

- Django
- Django REST Framework
- JWT Authentication
- Django Filter
- Cloudinary
- PostgreSQL (Neon)

## Deployment

- Vercel (Frontend)
- Render (Backend)
- Neon PostgreSQL
- Cloudinary

---

# 🏗 Architecture

```
                    React Frontend (Vercel)
                             │
                      Axios + JWT Tokens
                             │
                             ▼
                Django REST Framework API
                        (Render)
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
 PostgreSQL (Neon)      Cloudinary         JWT Authentication
```

---

# 📂 Project Structure

```
social_frontend/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── utils/
│   └── App.jsx
│
└── package.json


social_backend/
│
├── config/
├── users/
├── posts/
├── manage.py
└── requirements.txt
```

---

# 🔐 Authentication

Pulse uses **JSON Web Tokens (JWT)**.

- Login returns Access & Refresh Tokens.
- Access Token is attached automatically using Axios Interceptors.
- Expired tokens are refreshed automatically.
- Protected endpoints require authentication.

---

# 📡 Main API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/register/` | Register User |
| POST | `/api/token/` | Login |
| POST | `/api/token/refresh/` | Refresh JWT |
| GET | `/api/posts/` | Get Posts |
| POST | `/api/posts/` | Create Post |
| POST | `/api/posts/{id}/like/` | Like / Unlike Post |
| GET | `/api/profiles/` | User Profiles |
| GET | `/api/comments/` | Comments |

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/atishaya2020-gif/django-react-social-media.git
```

---

## Backend

```bash
cd social_backend

python -m venv env

env\Scripts\activate

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

---

## Frontend

```bash
cd social_frontend

npm install

npm run dev
```

---

# 🔑 Environment Variables

Backend `.env`

```env
SECRET_KEY=your_secret_key

DEBUG=True

DATABASE_URL=your_database_url

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

ALLOWED_HOSTS=localhost,127.0.0.1
```

Frontend `.env`

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

For production:

```env
VITE_API_BASE_URL=https://django-react-social-media.onrender.com
```

---

# ☁ Deployment

### Frontend

- Vercel

### Backend

- Render

### Database

- Neon PostgreSQL

### Image Storage

- Cloudinary

---

# 📸 Screenshots

> Add screenshots here.

Examples:

- Login Page
- Registration Page
- Home Feed
- Create Post
- User Profile
- Admin Dashboard

---

# 🚧 Future Improvements

- 🔔 Notifications
- 👥 Follow / Unfollow Users
- 💬 Real-time Chat
- 📩 Direct Messaging
- 🔖 Saved Posts
- 📖 Stories
- 📹 Reels / Videos
- 📧 Password Reset via Email
- 🔍 Advanced Search
- 🌐 OAuth Login (Google/GitHub)

---

# 👨‍💻 Author

**Atishaya Jain**

GitHub: https://github.com/atishaya2020-gif

LinkedIn: *(Add your LinkedIn profile link here)*

---

## ⭐ If you like this project

Give this repository a ⭐ on GitHub if you found it useful or inspiring!
