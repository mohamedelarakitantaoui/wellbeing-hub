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
export const getRooms = async (_req: AuthRequest, res: Response): Promise<void> => {
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

    res.json({ rooms });
  } catch (error) {
    console.error('Error listing rooms:', error);
    res.status(500).json({ error: 'Failed to list rooms' });
  }
};

/**
 * GET /api/rooms/:id
 * Get room metadata (using ID for compatibility, but slug is preferred)
 */
export const getRoom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Try to find by slug first, then by ID
    const room = await prisma.peerRoom.findFirst({
      where: {
        OR: [
          { slug: id },
          { id: id },
        ],
      },
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
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    // Check if user can access this room
    const user = req.user;
    if (user) {
      const accessCheck = canAccessRoom(
        user.ageBracket || null,
        user.consentMinorOk || false,
        room.isMinorSafe
      );

      if (!accessCheck.allowed) {
        res.status(403).json({ error: accessCheck.reason });
        return;
      }
    }

    res.json({ room });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
};

/**
 * POST /api/rooms/:id/message
 * Create a new message in a room
 */
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user!;

    // Validate input
    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    if (content.length > 1000) {
      res.status(400).json({ error: 'Message too long (max 1000 characters)' });
      return;
    }

    // Check user role
    const allowedRoles = ['student', 'counselor'];
    if (!allowedRoles.includes(user.role.toLowerCase())) {
      res.status(403).json({ error: 'Only students and counselors can post messages' });
      return;
    }

    // Find room by slug or ID
    const room = await prisma.peerRoom.findFirst({
      where: {
        OR: [
          { slug: id },
          { id: id },
        ],
      },
      select: { id: true, isMinorSafe: true, title: true, slug: true },
    });

    if (!room) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    // Check if user can access this room
    const accessCheck = canAccessRoom(
      user.ageBracket || null,
      user.consentMinorOk || false,
      room.isMinorSafe
    );

    if (!accessCheck.allowed) {
      res.status(403).json({ error: accessCheck.reason });
      return;
    }

    // Check if user is under 18 and has consent
    if (user.ageBracket === 'UNDER18' && !user.consentMinorOk) {
      res.status(403).json({ 
        error: 'Parental consent required for minors to post messages' 
      });
      return;
    }

    // Moderate content
    const moderation = moderateContent(content, room.isMinorSafe);

    // Create message
    const message = await prisma.peerMessage.create({
      data: {
        roomId: room.id,
        authorId: user.id!,
        body: content.trim(),
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
          actorId: user.id!,
          action: 'MESSAGE_FLAGGED',
          eventType: 'MESSAGE_FLAGGED',
          roomId: room.id,
          metadata: JSON.stringify({
            messageId: message.id,
            roomSlug: room.slug,
            roomTitle: room.title,
            flags: moderation.flags,
            preview: content.substring(0, 100),
          }),
        },
      });

      console.warn(`⚠️  Message flagged in room ${room.slug}:`, {
        messageId: message.id,
        userId: user.id,
        flags: moderation.flags,
      });
    }

    res.status(201).json({ message });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'Failed to create message' });
  }
};

/**
 * GET /api/rooms/moderation/flagged
 * Get all flagged messages
 */
export const getFlaggedMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;

    const flaggedMessages = await prisma.peerMessage.findMany({
      where: {
        flagged: true,
      },
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        room: {
          select: {
            slug: true,
            title: true,
          },
        },
        author: {
          select: {
            id: true,
            email: true,
            displayName: true,
            name: true,
          },
        },
      },
    });

    res.json({ messages: flaggedMessages, count: flaggedMessages.length });
  } catch (error) {
    console.error('Error fetching flagged messages:', error);
    res.status(500).json({ error: 'Failed to fetch flagged messages' });
  }
};

