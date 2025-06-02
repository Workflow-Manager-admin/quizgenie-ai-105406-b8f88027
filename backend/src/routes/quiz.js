import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Question from '../models/Question.js';
import Result from '../models/Result.js';
import Category from '../models/Category.js';

const router = express.Router();

// PUBLIC_INTERFACE
// GET /api/quiz/start/:categoryId
// returns a random set of questions for a category
router.get('/start/:categoryId', requireAuth, async (req, res) => {
  const { categoryId } = req.params;
  const N = 5; // number of questions
  const questions = await Question.aggregate([
    { $match: { category: { $eq: new Category()._id.constructor(categoryId) }, isActive: true } },
    { $sample: { size: N } },
    {
      $project: {
        text: 1,
        options: 1,
        _id: 1,
      }
    }
  ]);
  res.json({ questions });
});

// PUBLIC_INTERFACE
// POST /api/quiz/submit
router.post('/submit', requireAuth, async (req, res) => {
  const { categoryId, answers } = req.body;
  if (!categoryId || !Array.isArray(answers))
    return res.status(400).json({ error: 'Invalid payload' });

  const questions = await Question.find({
    category: categoryId,
    _id: { $in: answers.map((a) => a.question) }
  });

  let correctCount = 0, answerRecords = [];

  for (const answer of answers) {
    const q = questions.find(q => q._id.toString() === answer.question);
    const correct = q && answer.answer === q.correctOption;
    if (correct) correctCount++;
    answerRecords.push({
      question: answer.question,
      answer: answer.answer,
      correct,
    });
  }

  const score = correctCount;
  const result = await Result.create({
    user: req.user._id,
    category: categoryId,
    answers: answerRecords,
    score,
    completedAt: new Date()
  });

  // Update user stats
  req.user.stats.quizzesTaken = (req.user.stats.quizzesTaken || 0) + 1;
  req.user.stats.correctAnswers = (req.user.stats.correctAnswers || 0) + correctCount;
  req.user.stats.lastQuizDate = new Date();
  await req.user.save();

  res.status(201).json({ score, resultId: result._id });
});

export default router;
