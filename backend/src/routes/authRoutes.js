import { Router } from 'express';
import { login, me, register } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import {
  loginValidation,
  registerValidation,
} from '../middleware/validators.js';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, me);

export { router as authRoutes };
