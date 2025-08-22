import express from 'express';
import {
  getDashboard,
  getDevelopers,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById
} from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// GET /api/admin/dashboard
router.get('/dashboard', getDashboard);

// GET /api/admin/developers - for task assignment
router.get('/developers', getDevelopers);

// User management routes
// GET /api/admin/users
router.get('/users', getAllUsers);

// POST /api/admin/users
router.post('/users', createUser);

// GET /api/admin/users/:id
router.get('/users/:id', getUserById);

// PUT /api/admin/users/:id
router.put('/users/:id', updateUser);

// DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser);

export default router;
