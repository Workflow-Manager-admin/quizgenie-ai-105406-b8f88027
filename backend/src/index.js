import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { createServer } from 'http';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import categoryRoutes from './routes/category.js';
import quizRoutes from './routes/quiz.js';
import adminRoutes from './routes/admin.js';
import aiRoutes from './routes/ai.js';

// Load env
dotenv.config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env' });

const app = express();
const httpServer = createServer(app);

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', time: new Date().toISOString() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 QuizGenie AI backend running on port ${PORT}`);
});
