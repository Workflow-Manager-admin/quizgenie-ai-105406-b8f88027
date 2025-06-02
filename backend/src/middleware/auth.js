import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * PUBLIC_INTERFACE
 * Middleware: Require valid JWT token. Sets req.user.
 */
export const requireAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const token = auth.replace('Bearer ', '').trim();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select('-password');
    if (!req.user) throw new Error('User not found');
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
};

/**
 * PUBLIC_INTERFACE
 * Middleware: Require user is admin.
 */
export const requireAdmin = async (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
