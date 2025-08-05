import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  addComment
} from '../controllers/taskController.js';
import { authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// All task routes require authentication
router.use(authenticateToken);

// POST /api/tasks - Create new task
router.post('/', createTask);

// GET /api/tasks - Get all tasks with filtering and pagination
router.get('/', getTasks);

// GET /api/tasks/:id - Get task by ID
router.get('/:id', getTaskById);

// PUT /api/tasks/:id - Update task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', deleteTask);

// POST /api/tasks/:id/comments - Add comment to task
router.post('/:id/comments', addComment);

export default router;
