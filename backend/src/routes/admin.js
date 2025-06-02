import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import Question from '../models/Question.js';
import Category from '../models/Category.js';

const router = express.Router();

// PUBLIC_INTERFACE
// GET /api/admin/questions
router.get('/questions', requireAuth, requireAdmin, async (req, res) => {
  const { categoryId } = req.query;
  const filter = categoryId ? { category: categoryId } : {};
  const questions = await Question.find(filter).populate('category').sort({ createdAt: -1 });
  res.json({ questions });
});

// PUBLIC_INTERFACE
// POST /api/admin/questions
router.post('/questions', requireAuth, requireAdmin, async (req, res) => {
  const { category, text, options, correctOption, explanation, aiGenerated } = req.body;
  if (!category || !text || !options || correctOption == null)
    return res.status(400).json({ error: 'Incomplete data' });
  const q = await Question.create({
    category,
    text,
    options,
    correctOption,
    explanation,
    createdBy: req.user._id,
    aiGenerated: !!aiGenerated,
  });
  res.status(201).json({ question: q });
});

// PUBLIC_INTERFACE
// PATCH /api/admin/questions/:id
router.patch('/questions/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id;
  const q = await Question.findByIdAndUpdate(id, req.body, { new: true });
  if (!q) return res.status(404).json({ error: 'Not found' });
  res.json({ question: q });
});

export default router;
