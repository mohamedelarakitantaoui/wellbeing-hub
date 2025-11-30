import { Router } from 'express';
import { getMetrics } from '../controllers/admin.controller';
import { getAnalytics } from '../controllers/analytics.controller';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  resetUserPassword,
} from '../controllers/users.controller';
import {
  getActivityLogs,
  getActivitySummary,
} from '../controllers/activityLog.controller';
import {
  getSystemAlerts,
  markAlertAsRead,
  createSystemAlert,
  deleteSystemAlert,
} from '../controllers/alerts.controller';
import { getReports, exportReport } from '../controllers/reports.controller';
import {
  getSettings,
  updateSetting,
  batchUpdateSettings,
} from '../controllers/settings.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

// All admin routes require authentication + admin role
router.use(authMiddleware, roleMiddleware(['admin']));

// Metrics
router.get('/metrics', getMetrics);

// Analytics
router.get('/analytics', getAnalytics);

// User Management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.post('/users/:id/reset-password', resetUserPassword);

// Activity Logs
router.get('/activity-logs', getActivityLogs);
router.get('/activity-logs/summary', getActivitySummary);

// System Alerts
router.get('/alerts', getSystemAlerts);
router.patch('/alerts/:id/read', markAlertAsRead);
router.post('/alerts', createSystemAlert);
router.delete('/alerts/:id', deleteSystemAlert);

// Reports
router.get('/reports', getReports);
router.get('/reports/export', exportReport);

// Settings
router.get('/settings', getSettings);
router.patch('/settings', updateSetting);
router.post('/settings/batch', batchUpdateSettings);

export default router;
