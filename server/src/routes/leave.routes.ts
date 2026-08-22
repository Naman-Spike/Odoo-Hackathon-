import { Router } from 'express';
import { createLeave, getMyLeaves, getLeaveBalance, getPendingLeaves, getAllLeaves, reviewLeave } from '../controllers/leave.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createLeaveSchema, reviewLeaveSchema } from '../schemas/leave.schema.js';

const router = Router();

router.use(requireAuth);

router.post('/', validate(createLeaveSchema), createLeave);
router.get('/my', getMyLeaves);
router.get('/balance', getLeaveBalance);
router.get('/pending', requireRole(['ADMIN']), getPendingLeaves);
router.get('/all', requireRole(['ADMIN']), getAllLeaves);
router.put('/:id/review', requireRole(['ADMIN']), validate(reviewLeaveSchema), reviewLeave);

export default router;
