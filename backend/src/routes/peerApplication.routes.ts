import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import {
  submitApplication,
  getAllApplications,
  getApplication,
  approveApplication,
  rejectApplication,
  activatePeerAccount,
  getApplicationByToken,
  deleteApplication,
} from '../controllers/peerApplication.controller';

const router = Router();

// Public routes
router.post('/apply', submitApplication);
router.get('/activate/:token', getApplicationByToken);
router.post('/activate', activatePeerAccount);

// Admin-only routes
router.get('/', authMiddleware, roleMiddleware(['admin', 'counselor']), getAllApplications);
router.get('/:id', authMiddleware, roleMiddleware(['admin', 'counselor']), getApplication);
router.post('/:id/approve', authMiddleware, roleMiddleware(['admin']), approveApplication);
router.post('/:id/reject', authMiddleware, roleMiddleware(['admin']), rejectApplication);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteApplication);

export default router;
