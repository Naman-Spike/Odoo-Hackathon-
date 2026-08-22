import { Router } from 'express';
import { getAllProfiles, getMyProfile, getProfile, updateMyProfile, updateProfile } from '../controllers/profile.controller.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileSchema } from '../schemas/profile.schema.js';

const router = Router();

router.use(requireAuth);

router.get('/', requireRole(['ADMIN']), getAllProfiles);
router.get('/me', getMyProfile);
router.get('/:userId', requireRole(['ADMIN']), getProfile);
router.put('/me', validate(updateProfileSchema), updateMyProfile);
router.put('/:userId', requireRole(['ADMIN']), validate(updateProfileSchema), updateProfile);

export default router;
