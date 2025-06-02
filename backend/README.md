# QuizGenie AI Backend

Node.js + Express + MongoDB + JWT authentication.

## Getting Started

1. Make sure you have MongoDB running (local or via Docker).
2. Copy `.env.example` to `.env` and set secrets/keys.
3. Run `npm install`.
4. Run `npm run dev`.

## Scripts

- `npm run dev` — start dev server (nodemon)
- `npm start` — production server

## API Endpoints (Main)

- `POST /api/auth/register`: Register user
- `POST /api/auth/login`: Login user, get JWT token
- `GET /api/auth/me`: Auth token -> get profile
- `GET /api/category`: List categories
- `POST /api/category`: [admin] Add category
- `GET /api/quiz/start/:categoryId`: Get quiz questions
- `POST /api/quiz/submit`: Submit answers
- `GET /api/admin/questions`: [admin] All questions
- `POST /api/admin/questions`: [admin] Add question
- `PATCH /api/admin/questions/:id`: [admin] Edit question
- `POST /api/ai/generate-question`: [AI] Generate AI questions via Gemini

## Deployment

Built for deployment on any Node-compatible host. For Docker, use the `Dockerfile`.

---
