import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// PUBLIC_INTERFACE
// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
    if (password.length < 6) return res.status(400).json({ error: 'Password too short' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    // First user = admin
    const role = (await User.countDocuments({})) === 0 ? 'admin' : 'user';
    const user = await User.create({ email, password, name, role });
    return res.status(201).json({ user: user.toJSONSafe() });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
});

// PUBLIC_INTERFACE
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    return res.json({ token, user: user.toJSONSafe() });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed' });
  }
});

// PUBLIC_INTERFACE
// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  return res.json({ user: req.user.toJSONSafe() });
});

export default router;
