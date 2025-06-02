import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * PUBLIC_INTERFACE
 * POST /api/ai/generate-question
 * body: { prompt }
 */
router.post('/generate-question', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt required' });

    // Gemini/PaLM (Google) API proxy
    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) return res.status(500).json({ error: 'AI API key not configured' });

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        params: { key: GEMINI_KEY },
        headers: { 'Content-Type': 'application/json' }
      }
    );

    res.json({ result: response.data });
  } catch (err) {
    res.status(500).json({ error: 'AI generation failed', details: err.message });
  }
});

export default router;
