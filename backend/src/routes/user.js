import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import User from '../models/User.js';
import Result from '../models/Result.js';

const router = express.Router();

// PUBLIC_INTERFACE
// GET /api/user/profile
router.get('/profile', requireAuth, async (req, res) => {
  return res.json({ user: req.user.toJSONSafe() });
});

// PUBLIC_INTERFACE
// GET /api/user/results
router.get('/results', requireAuth, async (req, res) => {
  const results = await Result.find({ user: req.user._id })
    .populate('category')
    .sort({ createdAt: -1 });
  return res.json({ results });
});

export default router;
