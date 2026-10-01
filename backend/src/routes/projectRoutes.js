import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProject,
  listProjects,
  updateProject,
} from '../controllers/projectController.js';
import { createTask, listTasks } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import {
  createProjectValidation,
  createTaskValidation,
  listTasksValidation,
  projectIdValidation,
  updateProjectValidation,
} from '../middleware/validators.js';

const router = Router();

router.use(protect);

router.get('/', listProjects);
router.post('/', createProjectValidation, createProject);
router.get('/:id', projectIdValidation, getProject);
router.put('/:id', updateProjectValidation, updateProject);
router.delete('/:id', projectIdValidation, deleteProject);

router.get('/:projectId/tasks', listTasksValidation, listTasks);
router.post('/:projectId/tasks', createTaskValidation, createTask);

export { router as projectRoutes };
