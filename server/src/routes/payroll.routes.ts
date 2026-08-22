import { Router } from 'express';
import { getMyPayroll, getAllPayroll, updatePayroll } from '../controllers/payroll.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updatePayrollSchema } from '../schemas/payroll.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/my', getMyPayroll);
router.get('/all', requireRole(['ADMIN']), getAllPayroll);
router.put('/:userId', requireRole(['ADMIN']), validate(updatePayrollSchema), updatePayroll);

export default router;
