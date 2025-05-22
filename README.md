# 💪 Gym Enthusiasts Platform

A fullstack web application built to connect fitness lovers, share workout experiences, and foster real-time community engagement. This project demonstrates a scalable monorepo architecture using **React.js**, **Nest.js**, and **TypeScript**.

---

## 🔗 Live Demo

🌍 [https://project-gym-enthusiasts-ui.vercel.app/](https://project-gym-enthusiasts-ui.vercel.app/)

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
- **Bootstrap + React Bootstrap**: UI styling and responsive layout
- **React OAuth Google**: Google login integration
- **Moment.js + Timezone**: Date formatting and time zone handling
- **zxcvbn**: Password strength estimation

### 🛠 Backend

- **Nest.js**: Scalable server-side framework
- **TypeORM**: ORM for PostgreSQL
- **PostgreSQL**: Relational database
- **JWT**: Access and refresh token handling
- **Gmail SMTP**: Email verification
- **WebSocket (Gateway)**: Real-time chat
- **Cloudinary**: Image uploads and CDN
- **Google Auth Library**: Google OAuth user handling
- **class-validator, class-transformer**: DTO validation and transformation
- **multer**: File upload handling middleware

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

### 📸 Image Upload & Optimization

- Upload multiple images per post using Cloudinary
- Optimized image delivery via CDN
- Preview feature and responsive display on UI

### 📧 Email Verification Workflow

- Secure email verification via tokenized links
- Resend verification support
- Prevents sign-up completion before verification

### 🧑‍🎨 User Profile

- One-time nickname change enforcement
- Uploadable profile image
- Social links (e.g., GitHub, Instagram)
- Viewable user profile page

### 🛠 Robust Project Architecture

- Monorepo structure with TurboRepo
- Separation of concerns between frontend and backend
- Environment-based configuration for scalable deployment

### 🛡 Access Control & UX

- Axios interceptors for token refresh logic
- Custom guards in NestJS for route protection
- Conditional rendering based on login state

### 📆 Token Refresh & Auto-Logout

- Automatically refreshes expired access tokens
- Handles token expiration and redirects securely
- Improves long-session user experience

### 🧪 Form Validation & Input Feedback

- Regex-based email and nickname validation
- Password strength meter with real-time feedback
- Disabled button states and visual input alerts

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

- **Backend**: Ready for Docker + Fly.io deployment  
  Includes `dockerfile`, `docker-compose.yaml`
- **Frontend**: Vite build ready for deployment on Vercel or Render
- `.env.production` files should be configured per environment

---

## 🛡 Admin Test Account

For demo and evaluation purposes, an admin account is available for interviewers.

### 🔐 Admin Login Info

- **Login Page**: [https://project-gym-enthusiasts-ui.vercel.app/auth/login/email](https://project-gym-enthusiasts-ui.vercel.app/auth/login/email)
- **Email**: `admin@su.com`
- **Password**: `admin`

> This account has elevated privileges:
>
> - View and manage all user posts
> - Delete or update any post
> - Access user profile information
> - Manage social links of any user

Please use this account only for demonstration and testing purposes. Do not share it publicly.

---

## 🙋‍♂️ Author

This project was built to support a fitness-focused real-time community.  
It reflects my passion for fullstack development and delivering meaningful user experiences.

---

## 👨‍💻 Developer Introduction

| <img src="https://res.cloudinary.com/dbb5z072p/image/upload/v1747551539/KakaoTalk_20250518_155826430_jyk6cm.jpg" width="150" style="border-radius: 50%; margin-bottom: 1rem;" alt="Profile Photo" /> |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
|                                                                                           **Kim Suhyeon**                                                                                            |
|                                                     Fullstack Developer with a passion for community building and fitness-oriented applications.                                                     |

---

## 📜 License

MIT License

---

## 📞 Contact

**Name**: Kim Suhyeon  
**Email**: [01057557503a@gmail.com](mailto:01057557503a@gmail.com)  
**Instagram**: [@suhyeon.ts](https://instagram.com/suhyeon.ts)  
**LinkedIn**: [Suhyeon Kim](https://www.linkedin.com/in/suhyeon-kim-bb934b2b6/)
