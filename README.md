
# 💪 Gym Enthusiasts Platform

A fullstack web application designed for fitness lovers to connect, share workout content, and communicate in real-time. Built with **React.js**, **Nest.js**, and **TypeScript**, the project demonstrates a modern monorepo architecture with both frontend and backend integrated in a scalable manner.

---

## 📁 Project Structure

```
- apps/
  - api/       # Backend API server (NestJS)
  - ui/        # Frontend client (React + Vite)
- .turbo/      # TurboRepo cache and pipeline config
- package.json # Root monorepo dependencies
```

---

## 🔧 Tech Stack

### Frontend
- React.js
- TypeScript
- Vite
- React Router
- Axios
- CSS Modules

### Backend
- Nest.js
- TypeORM
- PostgreSQL
- JWT Authentication
- Gmail SMTP (Email Verification)
- WebSocket (Chat)
- Cloudinary (Image Uploads)

---

## ✅ Features

### 🧑‍💻 User Authentication
- Email verification during sign-up
- JWT-based login & token refresh system
- Google OAuth support

### 📸 Post & Feed
- Create/edit/delete posts with image uploads (Cloudinary)
- Pagination for post listing
- Detailed post view and user-specific post management

### 💬 Real-Time Chat
- Socket-based chat using WebSocketGateway in NestJS

### 🧑‍💼 User Profile
- Editable profile (nickname, social links, profile picture)
- Limited nickname change policy (only once)

### 🔒 Access Control
- Route protection using custom guards (NestJS)
- Token validation in Axios interceptors

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/your-repo/project-name.git
cd project-name
```

### 2. Install Dependencies

```bash
# From root
npm install
```

### 3. Environment Setup

Create `.env` files in both `/apps/api` and `/apps/ui`. Set the required keys like DB credentials, JWT secret, SMTP config, and frontend URL.

### 4. Start Dev Servers

```bash
# Backend
cd apps/api
npm run start:dev

# Frontend
cd apps/ui
npm run dev
```

---

## 📂 Notable Folders

### `/apps/api/src`
- `auth/`: handles login, register, token handling, and guards
- `posts/`: CRUD for posts and images
- `chats/`: chat gateway and messaging
- `users/`: profile info, social links, nickname policy

### `/apps/ui/src`
- `components/`: UI components like Cards, Post, NavBar, etc.
- `common/`: utility functions (token handling, API, regex, etc.)
- `assets/`: images and icons used in UI

---

## 🌐 Deployment

- Designed to be deployed using **Render** or **Vercel**
- Docker support included for backend via `dockerfile` and `docker-compose.yaml`

---

## 🙋‍♂️ Author

Built with passion by a junior fullstack developer passionate about frontend development and building user-centered applications.

---

## 📜 License

MIT License
