import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyToken } from '../middleware/auth';
import prisma from '../lib/prisma';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

export const setupWebSocket = (httpServer: HTTPServer) => {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'http://localhost:5174',
      ],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return next(new Error('Authentication required'));
      }

      const decoded = verifyToken(token) as any;
      socket.userId = decoded.sub;
      socket.userRole = decoded.role;
      
      console.log(`🔌 WebSocket authenticated: ${socket.userId} (${socket.userRole})`);
      next();
    } catch (error) {
      console.error('WebSocket auth error:', error);
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join user-specific room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
      
      // Join role-specific rooms
      if (socket.userRole === 'counselor' || socket.userRole === 'moderator') {
        socket.join('supporters');
      }
      if (socket.userRole === 'admin') {
        socket.join('admins');
      }
      
      // Broadcast presence update
      io.to('supporters').emit('presence:update', {
        userId: socket.userId,
        status: 'online',
        timestamp: new Date(),
      });
    }

    // Support Room Events
    socket.on('join:support-room', async ({ roomId }: { roomId: string }) => {
      try {
        const room = await prisma.supportRoom.findUnique({
          where: { id: roomId },
          include: {
            student: { select: { id: true } },
            supporter: { select: { id: true } },
          },
        });

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Check if user is participant
        if (room.student.id !== socket.userId && room.supporter?.id !== socket.userId) {
          socket.emit('error', { message: 'Not authorized for this room' });
          return;
        }

        socket.join(`support-room:${roomId}`);
        console.log(`📱 User ${socket.userId} joined support room ${roomId}`);

        // Emit to room that user joined
        socket.to(`support-room:${roomId}`).emit('user:joined', {
          userId: socket.userId,
          timestamp: new Date(),
        });
        
        // Send presence update to user who just joined
        const otherUserId = room.student.id === socket.userId ? room.supporter?.id : room.student.id;
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
      } catch (error) {
        console.error('Error joining support room:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    socket.on('leave:support-room', ({ roomId }: { roomId: string }) => {
      socket.leave(`support-room:${roomId}`);
      socket.to(`support-room:${roomId}`).emit('user:left', {
        userId: socket.userId,
        timestamp: new Date(),
      });
      
      // Send presence update
      socket.to(`support-room:${roomId}`).emit('presence:update', {
        userId: socket.userId,
        status: 'offline',
        timestamp: new Date(),
      });
    });

    // Chat message events
    socket.on('message:send', async ({ roomId, content }: { roomId: string; content: string }) => {
      try {
        // Verify user is in the room
        const room = await prisma.supportRoom.findUnique({
          where: { id: roomId },
          include: {
            student: { select: { id: true, displayName: true } },
            supporter: { select: { id: true, displayName: true } },
          },
        });

        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        if (room.student.id !== socket.userId && room.supporter?.id !== socket.userId) {
          socket.emit('error', { message: 'Not authorized' });
          return;
        }

        // Save message to database
        const message = await prisma.supportMessage.create({
          data: {
            roomId: roomId,
            senderId: socket.userId!,
            content,
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
        
        // Update room's last message
        await prisma.supportRoom.update({
          where: { id: roomId },
          data: {
            lastMessageAt: message.createdAt,
            lastMessagePreview: content.slice(0, 100),
          },
        });

        // Emit to all room participants
        io.to(`support-room:${roomId}`).emit('message:received', {
          id: message.id,
          content: message.content,
          type: message.type,
          senderId: message.senderId,
          senderName: message.sender.displayName,
          senderRole: message.sender.role,
          timestamp: message.createdAt,
          status: message.status,
        });

        console.log(`💬 Message sent in room ${roomId} by ${socket.userId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicator
    socket.on('typing:start', ({ roomId }: { roomId: string }) => {
      socket.to(`support-room:${roomId}`).emit('typing:update', {
        userId: socket.userId,
        isTyping: true,
      });
    });

    socket.on('typing:stop', ({ roomId }: { roomId: string }) => {
      socket.to(`support-room:${roomId}`).emit('typing:update', {
        userId: socket.userId,
        isTyping: false,
      });
    });
    
    // Message read receipts
    socket.on('message:read', async ({ roomId, messageIds }: { roomId: string; messageIds: string[] }) => {
      try {
        // Update messages as read
        await prisma.supportMessage.updateMany({
          where: {
            id: { in: messageIds },
            senderId: { not: socket.userId },
          },
          data: {
            isRead: true,
            status: 'read',
          },
        });
        
        // Notify sender that messages were read
        socket.to(`support-room:${roomId}`).emit('messages:read', {
          messageIds,
          readBy: socket.userId,
          readAt: new Date(),
        });
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Queue updates for supporters
    socket.on('queue:subscribe', async () => {
      if (socket.userRole !== 'counselor' && socket.userRole !== 'moderator') {
        socket.emit('error', { message: 'Not authorized' });
        return;
      }

      socket.join('support-queue');
      
      // Send current queue
      const queue = await prisma.supportRoom.findMany({
        where: { status: 'WAITING', supporterId: null },
        include: {
          student: {
            select: { id: true, displayName: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      socket.emit('queue:update', { queue });
    });

    socket.on('queue:unsubscribe', () => {
      socket.leave('support-queue');
    });

    // Admin live updates
    socket.on('admin:subscribe', () => {
      if (socket.userRole !== 'admin') {
        socket.emit('error', { message: 'Not authorized' });
        return;
      }
      socket.join('admin-dashboard');
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
      
      // Broadcast offline presence
      if (socket.userId) {
        io.to('supporters').emit('presence:update', {
          userId: socket.userId,
          status: 'offline',
          timestamp: new Date(),
        });
      }
    });
  });

  // Helper function to broadcast queue updates
  const broadcastQueueUpdate = async () => {
    try {
      const queue = await prisma.supportRoom.findMany({
        where: { status: 'WAITING', supporterId: null },
        include: {
          student: {
            select: { id: true, displayName: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      io.to('support-queue').emit('queue:update', { queue });
      io.to('supporters').emit('queue:count', { count: queue.length });
    } catch (error) {
      console.error('Error broadcasting queue update:', error);
    }
  };

  // Helper function to broadcast admin metrics
  const broadcastAdminMetrics = async () => {
    try {
      const metrics = {
        activeUsers: io.sockets.sockets.size,
        activeSupportRooms: await prisma.supportRoom.count({ where: { status: 'ACTIVE' } }),
        queueLength: await prisma.supportRoom.count({ where: { status: 'WAITING', supporterId: null } }),
      };

      io.to('admin-dashboard').emit('metrics:update', metrics);
    } catch (error) {
      console.error('Error broadcasting admin metrics:', error);
    }
  };

  // Periodic updates
  setInterval(broadcastQueueUpdate, 30000); // Every 30 seconds
  setInterval(broadcastAdminMetrics, 60000); // Every minute

  return io;
};
