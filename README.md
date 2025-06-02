# QuizGenie AI

Production-ready full-stack QuizGenie AI application.

## Features

- Modern, clean React frontend (sidebar navigation, responsive, light theme)
- Node.js/Express backend, JWT authentication, role-based admin controls
- MongoDB for users, categories, quizzes, results
- AI question generation using Gemini/PaLM API
- Secure environment variable management
- Ready for local development and deployment

---

## Directory Structure

```
- backend/          # Node.js Express API, models, routes
- quizgenie_ai/     # React frontend
```

## Environment Setup

### 1. Backend

1. `cd backend`
2. `cp .env.example .env` and fill secrets (MONGODB_URI, JWT_SECRET, etc)
3. `npm install`
4. `npm run dev` (development, with hot reload via nodemon)
5. For production: `npm run start`

#### Backend environment vars:
- `PORT` (default: 5000)
- `MONGODB_URI` (Mongo connection string)
- `JWT_SECRET`
- `GEMINI_API_KEY` (Google Gemini/PaLM API Key for AI)
- `CLIENT_URL` (frontend domain for CORS)

### 2. Frontend

1. `cd quizgenie_ai`
2. `npm install`
3. `npm start`
4. For production build: `npm run build`

---

## Deployment

- Both frontend and backend are decoupled and can be hosted on [Vercel](https://vercel.com), [Netlify](https://netlify.com), [Render](https://render.com), DigitalOcean, AWS, or traditional VPS.
- Set the backend `PORT` (e.g. 5000), and `CLIENT_URL` for CORS config.
- Configure all sensitive keys as environment variables (never commit them).

---

## Quick Start (Development)

```
# 1. Start MongoDB locally, e.g., via Docker or local install

# 2. Backend
cd backend
cp .env.example .env
# Set env vars in .env
npm install
npm run dev

# 3. Frontend (in new terminal)
cd quizgenie_ai
npm install
npm start
```

Open frontend at [http://localhost:3000](http://localhost:3000). Backend runs on [http://localhost:5000](http://localhost:5000).

---

## Theme

- Primary: #1976d2 (blue)
- Accent: #ff9800 (orange)
- Secondary: #fff (white)
- Mode: light

---

## LICENSE

MIT
