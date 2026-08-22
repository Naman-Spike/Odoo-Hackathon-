import { Router } from 'express';
import { checkIn, checkOut, getToday, getMyAttendance, getAllAttendance } from '../controllers/attendance.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/today', getToday);
router.get('/my', getMyAttendance);
router.get('/all', requireRole(['ADMIN']), getAllAttendance);

export default router;
