/**
 * Private 1-on-1 Support Room Controller
 * Handles private support requests, room management, and routing
 */

import { Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

// Validation schemas
const requestSupportSchema = z.object({
  topic: z.enum(['stress', 'sleep', 'anxiety', 'academic', 'relationship', 'family', 'health', 'other']),
  urgency: z.enum(['low', 'medium', 'high', 'crisis']),
  initialMessage: z.string().min(1).max(1000).optional(),
});

const resolveRoomSchema = z.object({
  notes: z.string().optional(),
});

const sendMessageSchema = z.object({
  content: z.string().min(1).max(2000),
  type: z.enum(['text', 'emoji']).optional().default('text'),
});

const markAsReadSchema = z.object({
  messageIds: z.array(z.string()).optional(),
});

const archiveRoomSchema = z.object({
  archive: z.boolean(),
});

/**
 * Determine routing based on urgency and topic
 */
function determineRouting(urgency: string, topic: string): string {
  // Crisis always goes to professional counselor
  if (urgency === 'crisis') {
    return 'counselor';
  }
  
  // High urgency or sensitive topics go to counselor
  const counselorTopics = ['anxiety', 'health', 'family'];
  if (urgency === 'high' || counselorTopics.includes(topic)) {
    return 'counselor';
  }
  
  // Medium/low urgency can go to trained peer supporters
  return 'peer_supporter';
}

/**
 * POST /api/support/request
 * Student requests private support - creates a new support room
 */
export const requestSupport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = requestSupportSchema.parse(req.body);
    const studentId = req.user!.sub;

    // Check if student already has an active support room
    const existingRoom = await prisma.supportRoom.findFirst({
      where: {
        studentId,
        status: { in: ['WAITING', 'ACTIVE'] },
      },
    });

    if (existingRoom) {
      res.status(400).json({ 
        error: 'You already have an active support session',
        roomId: existingRoom.id,
      });
      return;
    }

    // Determine routing
    const routedTo = determineRouting(validatedData.urgency, validatedData.topic);

    // Create private support room
    const room = await prisma.supportRoom.create({
      data: {
        studentId,
        topic: validatedData.topic,
        urgency: validatedData.urgency,
        routedTo,
        initialMessage: validatedData.initialMessage,
        status: 'WAITING',
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            displayName: true,
            ageBracket: true,
          },
        },
      },
    });

    // Create initial message if provided
    if (validatedData.initialMessage) {
      await prisma.supportMessage.create({
        data: {
          roomId: room.id,
          senderId: studentId,
          content: validatedData.initialMessage,
        },
      });
    }

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: studentId,
        action: 'SUPPORT_ROOM_REQUESTED',
        eventType: 'SUPPORT_ROOM_REQUESTED',
        metadata: JSON.stringify({
          roomId: room.id,
          topic: validatedData.topic,
          urgency: validatedData.urgency,
          routedTo,
        }),
      },
    });

    console.log(`✅ Support room created: ${room.id} for student ${studentId}, routed to ${routedTo}`);

    res.status(201).json({
      room: {
        id: room.id,
        topic: room.topic,
        urgency: room.urgency,
        status: room.status,
        routedTo: room.routedTo,
        createdAt: room.createdAt,
      },
      message: `Connecting you with a ${routedTo.replace('_', ' ')}...`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Request support error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/support/queue
 * Get list of waiting support rooms (for counselors/peer supporters)
 */
export const getQueue = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userRole = req.user!.role;

    // Determine which rooms this user can see
    let routeFilter: string[] = [];
    if (userRole === 'counselor' || userRole === 'admin') {
      // Counselors can see all waiting rooms
      routeFilter = ['counselor', 'peer_supporter'];
    } else if (userRole === 'intern' || userRole === 'student') {
      // Peer supporters can only see peer_supporter routed rooms
      routeFilter = ['peer_supporter'];
    } else {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const waitingRooms = await prisma.supportRoom.findMany({
      where: {
        status: 'WAITING',
        routedTo: { in: routeFilter },
      },
      include: {
        student: {
          select: {
            id: true,
            displayName: true,
            ageBracket: true,
          },
        },
      },
      orderBy: [
        { urgency: 'desc' }, // Crisis first, then high, medium, low
        { createdAt: 'asc' }, // Older requests first
      ],
    });

    res.json({
      queue: waitingRooms.map((room: any) => ({
        id: room.id,
        student: {
          displayName: room.student.displayName || 'Anonymous',
          ageBracket: room.student.ageBracket,
        },
        topic: room.topic,
        urgency: room.urgency,
        initialMessage: room.initialMessage,
        waitingTime: Date.now() - room.createdAt.getTime(),
        createdAt: room.createdAt,
      })),
    });
  } catch (error) {
    console.error('Get queue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/support/rooms/:id/claim
 * Supporter claims a waiting support room
 */
export const claimRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const supporterId = req.user!.sub;
    const userRole = req.user!.role;

    // Verify user is a counselor or peer supporter
    const allowedRoles = ['counselor', 'intern', 'admin'];
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({ error: 'Only counselors and peer supporters can claim rooms' });
      return;
    }

    // Get the room
    const room = await prisma.supportRoom.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    if (!room) {
      res.status(404).json({ error: 'Support room not found' });
      return;
    }

    // Check if already claimed
    if (room.status !== 'WAITING') {
      res.status(400).json({ error: 'This support room has already been claimed' });
      return;
    }

    // Check if user can claim this type of room
    if (room.routedTo === 'counselor' && !['counselor', 'admin'].includes(userRole)) {
      res.status(403).json({ error: 'This room requires a professional counselor' });
      return;
    }

    // Claim the room
    const updatedRoom = await prisma.supportRoom.update({
      where: { id },
      data: {
        supporterId,
        status: 'ACTIVE',
        claimedAt: new Date(),
      },
      include: {
        student: {
          select: {
            id: true,
            displayName: true,
            ageBracket: true,
          },
        },
        supporter: {
          select: {
            id: true,
            name: true,
            displayName: true,
            role: true,
          },
        },
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: supporterId,
        action: 'SUPPORT_ROOM_CLAIMED',
        eventType: 'SUPPORT_ROOM_CLAIMED',
        metadata: JSON.stringify({
          roomId: room.id,
          studentId: room.studentId,
          supporterId,
          topic: room.topic,
          urgency: room.urgency,
        }),
      },
    });

    console.log(`✅ Room ${id} claimed by ${supporterId}`);

    res.json({
      room: updatedRoom,
      message: 'Support room claimed successfully',
    });
  } catch (error) {
    console.error('Claim room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/support/my-rooms
 * Get user's support rooms (student sees their requests, supporters see their assignments)
 */
export const getMyRooms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.sub;
    const userRole = req.user!.role;

    let rooms;

    if (userRole === 'student' || userRole === 'guest') {
      // Students see rooms where they are the student
      rooms = await prisma.supportRoom.findMany({
        where: { studentId: userId },
        include: {
          supporter: {
            select: {
              id: true,
              displayName: true,
              role: true,
            },
          },
          _count: {
            select: { messages: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      // Supporters see rooms where they are the supporter
      rooms = await prisma.supportRoom.findMany({
        where: { supporterId: userId },
        include: {
          student: {
            select: {
              id: true,
              displayName: true,
              ageBracket: true,
            },
          },
          _count: {
            select: { messages: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    res.json({ rooms });
  } catch (error) {
    console.error('Get my rooms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/support/rooms/:id
 * Get support room details
 */
export const getRoomDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.sub;

    const room = await prisma.supportRoom.findUnique({
      where: { id },
      include: {
        student: {
          select: {
            id: true,
            displayName: true,
            ageBracket: true,
          },
        },
        supporter: {
          select: {
            id: true,
            name: true,
            displayName: true,
            role: true,
          },
        },
      },
    });

    if (!room) {
      res.status(404).json({ error: 'Support room not found' });
      return;
    }

    // Verify access
    if (room.studentId !== userId && room.supporterId !== userId) {
      res.status(403).json({ error: 'Access denied to this support room' });
      return;
    }

    res.json({ room });
  } catch (error) {
    console.error('Get room details error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * GET /api/support/rooms/:id/messages
 * Get messages in a support room
 */
export const getRoomMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.sub;

    // Verify room access
    const room = await prisma.supportRoom.findUnique({
      where: { id },
      select: {
        studentId: true,
        supporterId: true,
      },
    });

    if (!room) {
      res.status(404).json({ error: 'Support room not found' });
      return;
    }

    if (room.studentId !== userId && room.supporterId !== userId) {
      res.status(403).json({ error: 'Access denied to this support room' });
      return;
    }

    // Get messages
    const messages = await prisma.supportMessage.findMany({
      where: { roomId: id },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Mark messages as read
    await prisma.supportMessage.updateMany({
      where: {
        roomId: id,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    res.json({ messages });
  } catch (error) {
    console.error('Get room messages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/support/rooms/:id/messages
 * Send a message in a support room
 */
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.sub;
    const validatedData = sendMessageSchema.parse(req.body);

    // Verify room access
    const room = await prisma.supportRoom.findUnique({
      where: { id },
      select: {
        studentId: true,
        supporterId: true,
        status: true,
      },
    });

    if (!room) {
      res.status(404).json({ error: 'Support room not found' });
      return;
    }

    if (room.studentId !== userId && room.supporterId !== userId) {
      res.status(403).json({ error: 'Access denied to this support room' });
      return;
    }

    if (room.status === 'RESOLVED' || room.status === 'CLOSED') {
      res.status(400).json({ error: 'This support session has ended' });
      return;
    }

    // Create message
    const message = await prisma.supportMessage.create({
      data: {
        roomId: id,
        senderId: userId,
        content: validatedData.content.trim(),
        type: validatedData.type || 'text',
        status: 'sent',
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            role: true,
          },
        },
      },
    });

    // Update room's lastMessage fields
    await prisma.supportRoom.update({
      where: { id },
      data: {
        lastMessageAt: message.createdAt,
        lastMessagePreview: validatedData.content.slice(0, 100),
      },
    });

    console.log(`✅ Message saved to DB via API: ${message.id}`);

    res.status(201).json({
      message: {
        id: message.id,
        content: message.content,
        type: message.type,
        senderId: message.sender.id,
        senderName: message.sender.displayName || 'Anonymous',
        senderRole: message.sender.role,
        timestamp: message.createdAt.toISOString(),
        status: message.status,
        isRead: message.isRead,
        readAt: message.readAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/support/rooms/:id/resolve
 * Mark support room as resolved
 */
export const resolveRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.sub;
    const validatedData = resolveRoomSchema.parse(req.body);

    // Verify room access
    const room = await prisma.supportRoom.findUnique({
      where: { id },
      select: {
        studentId: true,
        supporterId: true,
        status: true,
      },
    });

    if (!room) {
      res.status(404).json({ error: 'Support room not found' });
      return;
    }

    // Only the supporter can resolve the room
    if (room.supporterId !== userId) {
      res.status(403).json({ error: 'Only the assigned supporter can resolve this room' });
      return;
    }

    if (room.status === 'RESOLVED' || room.status === 'CLOSED') {
      res.status(400).json({ error: 'This room is already resolved' });
      return;
    }

    // Update room status
    const updatedRoom = await prisma.supportRoom.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        closedAt: new Date(),
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: userId,
        action: 'SUPPORT_ROOM_RESOLVED',
        eventType: 'SUPPORT_ROOM_RESOLVED',
        metadata: JSON.stringify({
          roomId: id,
          notes: validatedData.notes,
        }),
      },
    });

    console.log(`✅ Room ${id} resolved by supporter ${userId}`);

    res.json({
      room: updatedRoom,
      message: 'Support room resolved successfully',
    });
  } catch (error) {
    console.error('Resolve room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /api/support/rooms/:id/messages/read
 * Mark messages as read
 */
export const markMessagesAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.sub;
    const validatedData = markAsReadSchema.parse(req.body);

    // Verify room access
    const room = await prisma.supportRoom.findUnique({
      where: { id },
      select: {
        studentId: true,
        supporterId: true,
      },
    });

    if (!room) {
      res.status(404).json({ error: 'Support room not found' });
      return;
    }

    if (room.studentId !== userId && room.supporterId !== userId) {
      res.status(403).json({ error: 'Access denied to this support room' });
      return;
    }

    // Mark messages as read (all unread messages from other person)
    const result = await prisma.supportMessage.updateMany({
      where: {
        roomId: id,
        senderId: { not: userId },
        isRead: false,
        ...(validatedData.messageIds ? { id: { in: validatedData.messageIds } } : {}),
      },
      data: {
        isRead: true,
        readAt: new Date(),
        status: 'read',
      },
    });

    res.json({
      success: true,
      markedCount: result.count,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * DELETE /api/support/messages/:messageId
 * Soft delete a message (only sender can delete)
 */
export const deleteMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;
    const userId = req.user!.sub;

    // Find message and verify ownership
    const message = await prisma.supportMessage.findUnique({
      where: { id: messageId },
      select: {
        senderId: true,
        roomId: true,
        createdAt: true,
      },
    });

    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    if (message.senderId !== userId) {
      res.status(403).json({ error: 'You can only delete your own messages' });
      return;
    }

    // Check if message is too old to delete (e.g., 24 hours)
    const hoursSinceCreation = (Date.now() - message.createdAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceCreation > 24) {
      res.status(403).json({ error: 'Cannot delete messages older than 24 hours' });
      return;
    }

    // Soft delete the message
    await prisma.supportMessage.update({
      where: { id: messageId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        content: '[Message deleted]',
      },
    });

    res.json({
      success: true,
      message: 'Message deleted successfully',
      messageId,
      roomId: message.roomId,
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const editMessageSchema = z.object({
  content: z.string().min(1).max(2000),
});

/**
 * PATCH /api/support/messages/:messageId
 * Edit a message (only sender can edit within time limit)
 */
export const editMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { messageId } = req.params;
    const userId = req.user!.sub;
    const validatedData = editMessageSchema.parse(req.body);

    // Find message and verify ownership
    const message = await prisma.supportMessage.findUnique({
      where: { id: messageId },
      select: {
        senderId: true,
        roomId: true,
        createdAt: true,
        isDeleted: true,
      },
    });

    if (!message) {
      res.status(404).json({ error: 'Message not found' });
      return;
    }

    if (message.senderId !== userId) {
      res.status(403).json({ error: 'You can only edit your own messages' });
      return;
    }

    if (message.isDeleted) {
      res.status(400).json({ error: 'Cannot edit deleted messages' });
      return;
    }

    // Check if message is too old to edit (e.g., 1 hour)
    const minutesSinceCreation = (Date.now() - message.createdAt.getTime()) / (1000 * 60);
    if (minutesSinceCreation > 60) {
      res.status(403).json({ error: 'Cannot edit messages older than 1 hour' });
      return;
    }

    // Update message
    const updatedMessage = await prisma.supportMessage.update({
      where: { id: messageId },
      data: {
        content: validatedData.content.trim(),
        isEdited: true,
        editedAt: new Date(),
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            role: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: updatedMessage,
      roomId: message.roomId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Edit message error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * PATCH /api/support/rooms/:id/archive
 * Archive/unarchive room for current user
 */
export const archiveRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.sub;
    const { archive } = archiveRoomSchema.parse(req.body);

    // Verify room access
    const room = await prisma.supportRoom.findUnique({
      where: { id },
      select: {
        studentId: true,
        supporterId: true,
      },
    });

    if (!room) {
      res.status(404).json({ error: 'Support room not found' });
      return;
    }

    if (room.studentId !== userId && room.supporterId !== userId) {
      res.status(403).json({ error: 'Access denied to this support room' });
      return;
    }

    // Update archive status for the correct participant
    const isStudent = room.studentId === userId;
    const updatedRoom = await prisma.supportRoom.update({
      where: { id },
      data: isStudent
        ? { isArchivedForStudent: archive }
        : { isArchivedForSupporter: archive },
    });

    res.json({
      success: true,
      room: updatedRoom,
      message: archive ? 'Room archived successfully' : 'Room unarchived successfully',
    });
  } catch (error) {
    console.error('Archive room error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
