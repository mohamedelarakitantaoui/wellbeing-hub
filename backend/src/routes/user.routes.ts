import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  saveMood,
  getMoodHistory,
  getProgressStats,
  getActivityLog,
} from '../controllers/user.controller';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/change-password', changePassword);
router.delete('/account', deleteAccount);

// Mood tracking
router.post('/mood', saveMood);
router.get('/mood/history', getMoodHistory);

// Progress and activity
router.get('/progress', getProgressStats);
router.get('/activity', getActivityLog);

export default router;
