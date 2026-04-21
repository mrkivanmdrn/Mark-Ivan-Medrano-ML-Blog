# ML Portfolio Blog — Full Stack App

A full-stack blog built for Mark Ivan Medrano's Mobile Legends Portfolio.  
**Stack:** React · Express · MongoDB · JWT Auth

---

## Project Structure

```
ml-blog/
├── backend/
│   ├── config/db.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── upload.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── post.routes.js
│   │   ├── comment.routes.js
│   │   └── admin.routes.js
│   ├── uploads/             ← image files saved here at runtime
│   ├── .env
│   ├── server.js
│   └── seedAdmin.js
└── frontend/
    ├── public/
    │   ├── index.html
    │   └── images/          ← ml-1.jpg through ml-6.jpg
    └── src/
        ├── api/axios.js
        ├── context/AuthContext.js
        ├── components/
        │   ├── Navbar.js
        │   ├── Footer.js
        │   └── ProtectedRoute.js
        ├── pages/            ← 11 pages
        ├── data/             ← mlResources.js, galleryImages.js
        ├── App.js
        ├── index.js
        └── index.css
```

---

## Setup & Run

### Prerequisites
- Node.js v18+
- MongoDB running locally (or MongoDB Atlas URI)

---

### 1. Backend

```bash
cd ml-blog/backend
npm install
```

Edit `.env` if needed (default uses local MongoDB):
```
MONGO_URI=mongodb://127.0.0.1:27017/mlportfolio
JWT_SECRET=mlportfolio_super_secret_key_change_in_production
PORT=5000
```

Create the admin account (run once only):
```bash
node seedAdmin.js
```

Start the server:
```bash
npm run dev        # with nodemon (auto-restarts on save)
# or
npm start          # without nodemon
```

Backend runs at: **http://localhost:5000**

---

### 2. Frontend

```bash
cd ml-blog/frontend
npm install
npm start
```

Frontend runs at: **http://localhost:3000**

---

## Default Admin Account
| Field    | Value             |
|----------|-------------------|
| Email    | admin@gmail.com   |
| Password | admin123          |

> Change the password immediately after first login via Profile → Change Password.

---

## API Endpoints

### Auth
| Method | Route                    | Access    | Description             |
|--------|--------------------------|-----------|-------------------------|
| POST   | /api/auth/register       | Public    | Create account          |
| POST   | /api/auth/login          | Public    | Login, get JWT          |
| GET    | /api/auth/me             | Protected | Get current user        |
| PUT    | /api/auth/profile        | Protected | Update name/bio/pic     |
| PUT    | /api/auth/change-password| Protected | Change password         |

### Posts
| Method | Route             | Access         | Description          |
|--------|-------------------|----------------|----------------------|
| GET    | /api/posts        | Public         | All published posts  |
| GET    | /api/posts/:id    | Public         | Single post          |
| POST   | /api/posts        | Member + Admin | Create post          |
| PUT    | /api/posts/:id    | Owner + Admin  | Edit post            |
| DELETE | /api/posts/:id    | Owner + Admin  | Delete post          |

### Comments
| Method | Route                  | Access         | Description       |
|--------|------------------------|----------------|-------------------|
| GET    | /api/comments/:postId  | Public         | Get all comments  |
| POST   | /api/comments/:postId  | Member + Admin | Add comment       |
| DELETE | /api/comments/:id      | Owner + Admin  | Delete comment    |

### Admin
| Method | Route                        | Access | Description             |
|--------|------------------------------|--------|-------------------------|
| GET    | /api/admin/users             | Admin  | All members             |
| PUT    | /api/admin/users/:id/status  | Admin  | Toggle active/inactive  |
| GET    | /api/admin/posts             | Admin  | All posts               |
| PUT    | /api/admin/posts/:id/remove  | Admin  | Remove post from public |

---

## Features

- ⚔️ Splash screen with auto-redirect
- 🌙 Dark / Light mode toggle (persisted in localStorage)
- 📝 Community blog — write, edit, delete posts with image uploads
- 💬 Comments on every post
- 🔐 JWT authentication — register, login, profile management
- ⭐ Admin panel — manage members (activate/deactivate) and posts (remove)
- 📸 Gallery page with ML highlights and tactical diagrams
- 📍 Contact page with Google Maps embed and resource table
- 📱 Fully responsive
