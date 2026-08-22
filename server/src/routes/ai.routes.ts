import { Router } from 'express';
import { handleAIQuery } from '../controllers/ai.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/query', handleAIQuery);

export default router;
