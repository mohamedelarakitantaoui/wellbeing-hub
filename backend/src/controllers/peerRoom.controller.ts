/**
 * Peer Room Controller
 * Handles all peer room and message operations
 */

import { Response } from 'express';
import prisma from '../lib/prisma';
import { moderateContent, canAccessRoom } from '../lib/moderation';
import { AuthRequest } from '../middleware/auth';

/**
 * GET /api/rooms
 * List all peer rooms
 */
export async function listRooms(_req: AuthRequest, res: Response) {
  try {
    const rooms = await prisma.peerRoom.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        topic: true,
        isMinorSafe: true,
        createdAt: true,
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return res.json({ rooms });
  } catch (error) {
    console.error('Error listing rooms:', error);
    return res.status(500).json({ error: 'Failed to list rooms' });
  }
}

/**
 * GET /api/rooms/:slug
 * Get room metadata
 */
export async function getRoomMetadata(req: AuthRequest, res: Response) {
  try {
    const { slug } = req.params;

    const room = await prisma.peerRoom.findUnique({
      where: { slug },
      select: {
        id: true,
        slug: true,
        title: true,
        topic: true,
        isMinorSafe: true,
        createdAt: true,
        _count: {
          select: {
            messages: true,
          },
        },
      },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user can access this room
    const user = req.user;
    if (user) {
      const accessCheck = canAccessRoom(
        user.ageBracket,
        user.hasConsent ?? false,
        room.isMinorSafe
      );

      if (!accessCheck.allowed) {
        return res.status(403).json({ error: accessCheck.reason });
      }
    }

    return res.json(room);
  } catch (error) {
    console.error('Error fetching room metadata:', error);
    return res.status(500).json({ error: 'Failed to fetch room metadata' });
  }
}

/**
 * GET /api/rooms/:slug/messages
 * Get paginated messages for a room
 * Query params: cursor (message ID), limit (default 50), since (timestamp)
 */
export async function getRoomMessages(req: AuthRequest, res: Response) {
  try {
    const { slug } = req.params;
    const limit = parseInt(req.query.limit as string) || 50;
    const cursor = req.query.cursor as string | undefined;
    const since = req.query.since as string | undefined;

    // Verify room exists
    const room = await prisma.peerRoom.findUnique({
      where: { slug },
      select: { id: true, isMinorSafe: true },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user can access this room
    const user = req.user;
    if (user) {
      const accessCheck = canAccessRoom(
        user.ageBracket,
        user.hasConsent ?? false,
        room.isMinorSafe
      );

      if (!accessCheck.allowed) {
        return res.status(403).json({ error: accessCheck.reason });
      }
    }

    // Build query
    const where: any = { roomId: room.id };
    
    if (since) {
      where.createdAt = {
        gte: new Date(since),
      };
    }

    // Fetch messages with pagination
    const messages = await prisma.peerMessage.findMany({
      where,
      take: limit + 1, // Fetch one extra to check if there are more
      ...(cursor && {
        skip: 1, // Skip the cursor
        cursor: {
          id: cursor,
        },
      }),
      orderBy: {
        createdAt: 'asc', // Changed to ascending for proper chat order
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            name: true,
          },
        },
      },
    });

    // Check if there are more messages
    const hasMore = messages.length > limit;
    const returnMessages = hasMore ? messages.slice(0, -1) : messages;

    // Get next cursor
    const nextCursor = hasMore ? messages[limit - 1].id : null;

    // Transform messages to include author field for frontend compatibility
    const transformedMessages = returnMessages.map((msg) => ({
      id: msg.id,
      body: msg.body,
      createdAt: msg.createdAt,
      flagged: msg.flagged,
      flags: JSON.parse(msg.flags),
      author: {
        id: msg.author.id,
        displayName: msg.author.displayName || msg.author.name,
      },
    }));

    return res.json({
      messages: transformedMessages, // Already in ascending order
      nextCursor,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching room messages:', error);
    return res.status(500).json({ error: 'Failed to fetch messages' });
  }
}

/**
 * POST /api/rooms/:slug/messages
 * Create a new message in a room
 * Body: { body: string }
 */
export async function createMessage(req: AuthRequest, res: Response) {
  try {
    const { slug } = req.params;
    const { body } = req.body;
    const user = req.user!;

    // Validate input
    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      return res.status(400).json({ error: 'Message body is required' });
    }

    if (body.length > 1000) {
      return res.status(400).json({ error: 'Message too long (max 1000 characters)' });
    }

    // Check user role
    const allowedRoles = ['student', 'counselor'];
    if (!allowedRoles.includes(user.role.toLowerCase())) {
      return res.status(403).json({ error: 'Only students and counselors can post messages' });
    }

    // Verify room exists
    const room = await prisma.peerRoom.findUnique({
      where: { slug },
      select: { id: true, isMinorSafe: true, title: true },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if user can access this room
    const accessCheck = canAccessRoom(
      user.ageBracket,
      user.hasConsent ?? false,
      room.isMinorSafe
    );

    if (!accessCheck.allowed) {
      return res.status(403).json({ error: accessCheck.reason });
    }

    // Check if user is under 18 and has consent
    if (user.ageBracket === 'UNDER18' && !user.hasConsent) {
      return res.status(403).json({ 
        error: 'Parental consent required for minors to post messages' 
      });
    }

    // Moderate content
    const moderation = moderateContent(body, room.isMinorSafe);

    // Create message
    const message = await prisma.peerMessage.create({
      data: {
        roomId: room.id,
        authorId: user.sub,
        body: body.trim(),
        flagged: moderation.flagged,
        flags: JSON.stringify(moderation.flags),
      },
      include: {
        author: {
          select: {
            id: true,
            displayName: true,
            name: true,
          },
        },
      },
    });

    // Log flagged messages
    if (moderation.flagged) {
      await prisma.auditLog.create({
        data: {
          actorId: user.sub,
          eventType: 'MESSAGE_FLAGGED',
          action: 'MESSAGE_FLAGGED',
          metadata: JSON.stringify({
            messageId: message.id,
            roomSlug: slug,
            roomTitle: room.title,
            flags: moderation.flags,
            preview: body.substring(0, 100),
          }),
        },
      });

      console.warn(`⚠️  Message flagged in room ${slug}:`, {
        messageId: message.id,
        userId: user.sub,
        flags: moderation.flags,
      });
    }

    return res.status(201).json(message);
  } catch (error) {
    console.error('Error creating message:', error);
    return res.status(500).json({ error: 'Failed to create message' });
  }
}
