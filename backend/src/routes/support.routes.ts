import { Router } from 'express';
import { authMiddleware, roleMiddleware } from '../middleware/auth';
import {
  requestSupport,
  getQueue,
  claimRoom,
  getMyRooms,
  getRoomDetails,
  getRoomMessages,
  sendMessage,
  resolveRoom,
  markMessagesAsRead,
  deleteMessage,
  editMessage,
  archiveRoom,
} from '../controllers/support.controller';

const router = Router();

// All support routes require authentication
router.use(authMiddleware);

// Student endpoints
router.post('/request', requestSupport); // Request private support
router.get('/my-rooms', getMyRooms); // Get my support rooms

// Supporter endpoints (counselors, peer supporters)
router.get('/queue', roleMiddleware(['counselor', 'intern', 'admin']), getQueue); // View waiting students

// Room-specific endpoints
router.get('/rooms/:id', getRoomDetails); // Get room details
router.get('/rooms/:id/messages', getRoomMessages); // Get messages
router.post('/rooms/:id/messages', sendMessage); // Send message
router.patch('/rooms/:id/messages/read', markMessagesAsRead); // Mark messages as read
router.post('/rooms/:id/claim', roleMiddleware(['counselor', 'intern', 'admin']), claimRoom); // Claim a room
router.post('/rooms/:id/resolve', roleMiddleware(['counselor', 'intern', 'admin']), resolveRoom); // Resolve room
router.patch('/rooms/:id/archive', archiveRoom); // Archive/unarchive room

// Message-specific endpoints
router.delete('/messages/:messageId', deleteMessage); // Delete message (soft delete)
router.patch('/messages/:messageId', editMessage); // Edit message

export default router;
