import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import Category from '../models/Category.js';

const router = express.Router();

// PUBLIC_INTERFACE
// GET /api/category
router.get('/', async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  res.json({ categories });
});

// PUBLIC_INTERFACE
// POST /api/category [admin only]
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const existing = await Category.findOne({ name });
  if (existing) return res.status(409).json({ error: 'Category exists' });
  const category = await Category.create({
    name,
    description,
    createdBy: req.user._id,
  });
  res.status(201).json({ category });
});

export default router;
