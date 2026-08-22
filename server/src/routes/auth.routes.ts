import { Router } from 'express';
import { signup, login, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { signupSchema, loginSchema } from '../schemas/auth.schema.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', requireAuth, getMe);

export default router;
