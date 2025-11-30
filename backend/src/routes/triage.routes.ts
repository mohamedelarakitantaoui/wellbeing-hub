import { Router } from 'express';
import { createTriage, getMyTriages } from '../controllers/triage.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, createTriage);
router.get('/my', authMiddleware, getMyTriages);

export default router;
