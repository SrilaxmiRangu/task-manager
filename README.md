🔗Live Demo: https://task-manager-kohl-xi.vercel.app

# Task Management System

A full-stack task tracker with authentication, filtering, and analytics.

## Tech Stack

Frontend: React (Vite), React Router, Recharts, Axios. Backend: Node.js, Express. Database: MongoDB. Auth: JWT, bcrypt.

## Setup

Backend: cd backend, npm install, create .env with PORT/MONGO_URI/JWT_SECRET, then npm run dev.
Frontend: cd frontend, npm install, npm run dev. Open localhost:5173.

## API Endpoints

POST /api/auth/signup, POST /api/auth/login, GET/POST/PUT/DELETE /api/tasks, PATCH /api/tasks/:id/complete, GET /api/tasks/analytics.

## Design Decisions

JWT authentication, indexed MongoDB queries, server-side pagination, global error handling middleware.
