import express from 'express';
import { login, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/profile
router.get('/profile', authenticateToken, getProfile);

export default router;
