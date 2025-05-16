
# 💪 Gym Enthusiasts Platform

A fullstack web application built to connect fitness lovers, share workout experiences, and foster real-time community engagement. This project demonstrates a scalable monorepo architecture using **React.js**, **Nest.js**, and **TypeScript**.

---

## 🧠 Project Background

Inspired by my personal journey of staying consistently engaged with fitness,  
I felt the need for a platform where users could share information, motivate each other, and engage in real-time communication.  
This led me to design and build a web platform optimized for interactive sharing and social connection.

---

## 📁 Project Structure

```
- apps/
  - api/       # Backend API server (NestJS)
  - ui/        # Frontend client (React + Vite)
- .turbo/      # TurboRepo cache and build pipeline
- package.json # Root monorepo configuration
```

---

## 🔧 Tech Stack

### 🖥️ Frontend
- **React.js**: Component-based UI library
- **TypeScript**: Statically-typed JavaScript
- **Vite**: Lightning-fast build tool
- **React Router**: Page navigation
- **Axios**: API requests
- **CSS Modules**: Component-scoped styling

### 🛠 Backend
- **Nest.js**: Scalable server-side framework
- **TypeORM**: ORM for PostgreSQL
- **PostgreSQL**: Relational database
- **JWT**: Access and refresh token handling
- **Gmail SMTP**: Email verification
- **WebSocket (Gateway)**: Real-time chat
- **Cloudinary**: Image uploads and CDN

---

## ✅ Features

### 🔐 Authentication
- User registration and login
- Email verification via tokenized links
- JWT-based access and refresh token issuance
- Google OAuth login support

### 📝 Post & Feed
- Create, edit, delete posts with image uploads (via Cloudinary)
- Infinite scrolling feed with post pagination
- Post detail view and user-specific post management

### 💬 Real-Time Chat
- WebSocket-based 1:1 real-time chat
- Chat room creation, entry, and message flow

### 🧑‍🎨 User Profile
- One-time nickname change enforcement
- Uploadable profile image
- Social links (e.g., GitHub, Instagram)
- Viewable user profile page

### 🛡 Access Control & UX
- Axios interceptors for token refresh logic
- Custom guards in NestJS for route protection
- Conditional rendering based on login state

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/project-name.git
cd project-name
```

### 2. Install Dependencies

```bash
npm install  # from the root directory
```

### 3. Environment Setup

Create `.env` files in both `apps/api` and `apps/ui`, and add the following:

- **API**
  - `DATABASE_URL`
  - `JWT_SECRET`, `JWT_EXPIRES_IN`
  - `EMAIL_USER`, `EMAIL_PASS` (Gmail SMTP)
  - `CLOUDINARY_*`
- **UI**
  - `VITE_API_BASE_URL`

### 4. Run Development Servers

```bash
# Backend
cd apps/api
npm run start:dev

# Frontend
cd apps/ui
npm run dev
```

---

## 📂 Folder Overview

### 📦 `/apps/api/src`
- `auth/`: Login, register, token & email logic
- `posts/`: Post CRUD + image upload interceptor
- `chats/`: WebSocket gateway, chat rooms, messages
- `users/`: Profile editing, nickname policy, social links

### 💻 `/apps/ui/src`
- `components/`: UI components like Cards, Login, NavBar, etc.
- `common/`: Axios configs, token handlers, date formatters
- `assets/`: Image and SVG assets used across UI

---

## 🌐 Deployment

- **Backend**: Ready for Docker + Render deployment
  - Includes `dockerfile`, `docker-compose.yaml`
- **Frontend**: Vite build ready for deployment on Vercel or Render
- `.env.production` files should be configured per environment

---

## 🙋‍♂️ Author

This project was built to support a fitness-focused real-time community.  
It reflects my passion for fullstack development and delivering meaningful user experiences.

---

## 📜 License

MIT License

