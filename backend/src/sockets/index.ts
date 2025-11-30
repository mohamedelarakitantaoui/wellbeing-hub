import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';
import { JWTPayload } from '../middleware/auth';

interface AuthSocket extends Socket {
  user?: JWTPayload;
}

let ioInstance: SocketIOServer | null = null;

export const getIO = (): SocketIOServer | null => {
  return ioInstance;
};

export const initializeSocket = (httpServer: HTTPServer): SocketIOServer => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:5174',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
      allowedHeaders: ['Authorization', 'Content-Type'],
    },
    transports: ['websocket', 'polling'],
    allowUpgrades: true,
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      console.error('❌ Socket authentication failed: No token provided');
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      socket.user = {
        sub: decoded.sub || decoded.id,
        role: decoded.role,
        ageBracket: decoded.ageBracket,
        hasConsent: decoded.hasConsent !== undefined ? decoded.hasConsent : decoded.consentMinorOk,
        displayName: decoded.displayName,
      };
      console.log(`✅ Socket authenticated: ${socket.user.sub} (${socket.user.role})`);
      next();
    } catch (err) {
      console.error('❌ Socket authentication failed: Invalid token', err);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthSocket) => {
    console.log('User connected:', socket.user?.sub);
    
    // Join user-specific room for direct messaging
    if (socket.user?.sub) {
      socket.join(`user:${socket.user.sub}`);
    }
    
    if (socket.user && ['counselor', 'intern', 'moderator', 'admin'].includes(socket.user.role)) {
      socket.join('counselors');
    }

    // Join private support room
    socket.on('join:support-room', async (data: { roomId: string }) => {
      try {
        const { roomId } = data;
        const userId = socket.user!.sub;

        // Verify room exists and user has access
        const room = await prisma.supportRoom.findUnique({
          where: { id: roomId },
          select: {
            id: true,
            studentId: true,
            supporterId: true,
            status: true,
            topic: true,
          },
        });

        if (!room) {
          socket.emit('error', { message: 'Support room not found' });
          return;
        }

        // Only student and assigned supporter can join
        if (room.studentId !== userId && room.supporterId !== userId) {
          socket.emit('room_access_denied', { message: 'Access denied to this private room' });
          return;
        }

        // Join the private room
        socket.join(`support:${roomId}`);
        
        // Notify user they joined
        socket.emit('support_room_joined', { 
          roomId, 
          topic: room.topic,
          status: room.status,
        });
        
        // Notify others in room
        socket.to(`support:${roomId}`).emit('user:joined', {
          userId: socket.user!.sub,
          timestamp: new Date(),
        });
        
        // Send presence update to newly joined user about other participants
        const otherUserId = room.studentId === userId ? room.supporterId : room.studentId;
        if (otherUserId) {
          const otherUserSockets = await io.in(`user:${otherUserId}`).fetchSockets();
          if (otherUserSockets.length > 0) {
            socket.emit('presence:update', {
              userId: otherUserId,
              status: 'online',
              timestamp: new Date(),
            });
          }
        }

        console.log(`✅ User ${userId} joined private support room: ${roomId}`);
      } catch (error) {
        console.error('❌ Join support room error:', error);
        socket.emit('error', { message: 'Failed to join support room' });
      }
    });

    // Send message in private support room
    socket.on('message:send', async (data: { roomId: string; content: string }) => {
      try {
        const { roomId, content } = data;
        const userId = socket.user!.sub;

        if (!content || content.trim().length === 0) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        // Verify room access
        const room = await prisma.supportRoom.findUnique({
          where: { id: roomId },
          select: {
            id: true,
            studentId: true,
            supporterId: true,
            status: true,
          },
        });

        if (!room) {
          socket.emit('error', { message: 'Support room not found' });
          return;
        }

        if (room.studentId !== userId && room.supporterId !== userId) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }

        if (room.status === 'RESOLVED' || room.status === 'CLOSED') {
          socket.emit('error', { message: 'This support session has ended' });
          return;
        }

        // Create message in database
        const message = await prisma.supportMessage.create({
          data: {
            roomId,
            senderId: userId,
            content: content.trim(),
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

        // Broadcast to both participants with complete message data
        const messagePayload = {
          id: message.id,
          content: message.content,
          senderId: message.sender.id,
          senderName: message.sender.displayName || 'Anonymous',
          senderRole: message.sender.role,
          timestamp: message.createdAt.toISOString(),
          isRead: message.isRead,
        };

        io.to(`support:${roomId}`).emit('message:received', messagePayload);

        console.log(`✅ Message saved to DB and sent in support room ${roomId}`);
      } catch (error) {
        console.error('❌ Send support message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Notify when support request is made (for counselors queue)
    socket.on('support_requested', async (data: { roomId: string }) => {
      try {
        const { roomId } = data;

        const room = await prisma.supportRoom.findUnique({
          where: { id: roomId },
          include: {
            student: {
              select: {
                displayName: true,
                ageBracket: true,
              },
            },
          },
        });

        if (room) {
          // Notify counselors about new support request
          io.to('counselors').emit('new_support_request', {
            roomId: room.id,
            student: {
              displayName: room.student.displayName || 'Anonymous',
              ageBracket: room.student.ageBracket,
            },
            topic: room.topic,
            urgency: room.urgency,
            routedTo: room.routedTo,
            createdAt: room.createdAt,
          });

          console.log(`📢 New support request broadcasted to counselors`);
        }
      } catch (error) {
        console.error('❌ Support requested broadcast error:', error);
      }
    });

    // Notify when room is claimed
    socket.on('room_claimed', async (data: { roomId: string; supporterId: string }) => {
      try {
        const { roomId } = data;

        const room = await prisma.supportRoom.findUnique({
          where: { id: roomId },
          include: {
            supporter: {
              select: {
                displayName: true,
                role: true,
              },
            },
          },
        });

        if (room) {
          // Notify student that their room was claimed
          io.to(`support:${roomId}`).emit('support_room_claimed', {
            roomId,
            supporter: {
              displayName: room.supporter?.displayName,
              role: room.supporter?.role,
            },
            message: `${room.supporter?.displayName || 'A counselor'} has joined your support session`,
          });

          console.log(`✅ Room ${roomId} claimed notification sent`);
        }
      } catch (error) {
        console.error('❌ Room claimed notification error:', error);
      }
    });

    // Typing indicator for private rooms
    socket.on('typing:start', (data: { roomId: string }) => {
      const { roomId } = data;
      socket.to(`support:${roomId}`).emit('typing:update', {
        userId: socket.user!.sub,
        isTyping: true,
      });
    });

    socket.on('typing:stop', (data: { roomId: string }) => {
      const { roomId } = data;
      socket.to(`support:${roomId}`).emit('typing:update', {
        userId: socket.user!.sub,
        isTyping: false,
      });
    });

    // Edit message
    socket.on('message:edit', async (data: { messageId: string; content: string }) => {
      try {
        const { messageId, content } = data;
        const userId = socket.user!.sub;

        if (!content || content.trim().length === 0) {
          socket.emit('error', { message: 'Message cannot be empty' });
          return;
        }

        // Find and verify ownership
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
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        if (message.senderId !== userId) {
          socket.emit('error', { message: 'You can only edit your own messages' });
          return;
        }

        if (message.isDeleted) {
          socket.emit('error', { message: 'Cannot edit deleted messages' });
          return;
        }

        // Check time limit (1 hour)
        const minutesSinceCreation = (Date.now() - message.createdAt.getTime()) / (1000 * 60);
        if (minutesSinceCreation > 60) {
          socket.emit('error', { message: 'Cannot edit messages older than 1 hour' });
          return;
        }

        // Update message
        const updatedMessage = await prisma.supportMessage.update({
          where: { id: messageId },
          data: {
            content: content.trim(),
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

        // Broadcast to room
        const payload = {
          id: updatedMessage.id,
          content: updatedMessage.content,
          senderId: updatedMessage.sender.id,
          senderName: updatedMessage.sender.displayName || 'Anonymous',
          senderRole: updatedMessage.sender.role,
          timestamp: updatedMessage.createdAt.toISOString(),
          isRead: updatedMessage.isRead,
          isEdited: updatedMessage.isEdited,
          editedAt: updatedMessage.editedAt?.toISOString(),
        };

        io.to(`support:${message.roomId}`).emit('message:edited', payload);
        console.log(`✅ Message ${messageId} edited in room ${message.roomId}`);
      } catch (error) {
        console.error('❌ Edit message error:', error);
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    // Delete message
    socket.on('message:delete', async (data: { messageId: string }) => {
      try {
        const { messageId } = data;
        const userId = socket.user!.sub;

        // Find and verify ownership
        const message = await prisma.supportMessage.findUnique({
          where: { id: messageId },
          select: {
            senderId: true,
            roomId: true,
            createdAt: true,
          },
        });

        if (!message) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        if (message.senderId !== userId) {
          socket.emit('error', { message: 'You can only delete your own messages' });
          return;
        }

        // Check time limit (24 hours)
        const hoursSinceCreation = (Date.now() - message.createdAt.getTime()) / (1000 * 60 * 60);
        if (hoursSinceCreation > 24) {
          socket.emit('error', { message: 'Cannot delete messages older than 24 hours' });
          return;
        }

        // Soft delete
        await prisma.supportMessage.update({
          where: { id: messageId },
          data: {
            isDeleted: true,
            deletedAt: new Date(),
            content: '[Message deleted]',
          },
        });

        // Broadcast to room
        io.to(`support:${message.roomId}`).emit('message:deleted', {
          messageId,
          roomId: message.roomId,
        });

        console.log(`✅ Message ${messageId} deleted in room ${message.roomId}`);
      } catch (error) {
        console.error('❌ Delete message error:', error);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // Leave support room
    socket.on('leave:support-room', (data: { roomId: string }) => {
      const { roomId } = data;
      socket.to(`support:${roomId}`).emit('user:left', {
        userId: socket.user!.sub,
        timestamp: new Date(),
      });
      socket.leave(`support:${roomId}`);
      console.log(`👋 User ${socket.user?.sub} left support room ${roomId}`);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.user?.sub);
    });
  });

  ioInstance = io;
  return io;
};
