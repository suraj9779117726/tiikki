import { Router } from 'express';
import { deleteTask, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import {
  taskIdValidation,
  updateTaskValidation,
} from '../middleware/validators.js';

const router = Router();

router.use(protect);

router.put('/:id', updateTaskValidation, updateTask);
router.delete('/:id', taskIdValidation, deleteTask);

export { router as taskRoutes };
