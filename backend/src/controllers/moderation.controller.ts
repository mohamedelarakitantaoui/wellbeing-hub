/**
 * Moderation Controller
 * Handles moderator actions on flagged content
 */

import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

/**
 * POST /api/mod/rooms/:slug/flag
 * Moderator action on a flagged message
 * Body: { messageId: string, action: 'approve' | 'remove' | 'muteUser' }
 */
export async function moderateMessage(req: AuthRequest, res: Response) {
  try {
    const { slug } = req.params;
    const { messageId, action } = req.body;
    const moderator = req.user!;

    // Validate input
    if (!messageId || !action) {
      return res.status(400).json({ error: 'messageId and action are required' });
    }

    if (!['approve', 'remove', 'muteUser'].includes(action)) {
      return res.status(400).json({ 
        error: 'Invalid action. Must be: approve, remove, or muteUser' 
      });
    }

    // Verify room exists
    const room = await prisma.peerRoom.findUnique({
      where: { slug },
      select: { id: true, title: true },
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Get the message
    const message = await prisma.peerMessage.findUnique({
      where: { id: messageId },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            displayName: true,
          },
        },
      },
    });

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.roomId !== room.id) {
      return res.status(400).json({ error: 'Message does not belong to this room' });
    }

    let result;

    switch (action) {
      case 'approve':
        // Unflag the message
        result = await prisma.peerMessage.update({
          where: { id: messageId },
          data: {
            flagged: false,
            flags: JSON.stringify([]),
          },
        });

        await prisma.auditLog.create({
          data: {
            actorId: moderator.id!,
            action: 'MESSAGE_APPROVED',
            eventType: 'MESSAGE_FLAGGED',
            roomId: room.id,
            metadata: JSON.stringify({
              messageId,
              roomSlug: slug,
              roomTitle: room.title,
              authorId: message.authorId,
              preview: message.body.substring(0, 100),
            }),
          },
        });

        return res.json({ message: 'Message approved', data: result });

      case 'remove':
        // Delete the message
        await prisma.peerMessage.delete({
          where: { id: messageId },
        });

        await prisma.auditLog.create({
          data: {
            actorId: moderator.id!,
            action: 'MESSAGE_REMOVED',
            eventType: 'MESSAGE_FLAGGED',
            roomId: room.id,
            metadata: JSON.stringify({
              messageId,
              roomSlug: slug,
              roomTitle: room.title,
              authorId: message.authorId,
              preview: message.body.substring(0, 100),
            }),
          },
        });

        return res.json({ message: 'Message removed' });

      case 'muteUser':
        // For now, just log it. In a real app, you'd update user status
        await prisma.auditLog.create({
          data: {
            actorId: moderator.id!,
            action: 'USER_MUTED',
            eventType: 'MESSAGE_FLAGGED',
            roomId: room.id,
            metadata: JSON.stringify({
              userId: message.authorId,
              userEmail: message.author?.email,
              roomSlug: slug,
              roomTitle: room.title,
              messageId,
              preview: message.body.substring(0, 100),
            }),
          },
        });

        // Could add a "mutedUntil" field to User model in future
        console.warn(`⚠️  User ${message.author?.email} muted by ${moderator.id}`);

        return res.json({ 
          message: 'User muted (note: muting not fully implemented yet - logged only)' 
        });

      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Error in moderateMessage:', error);
    return res.status(500).json({ error: 'Failed to moderate message' });
  }
}

/**
 * GET /api/mod/flagged
 * Get all flagged messages across all rooms
 */
export async function getFlaggedMessages(req: AuthRequest, res: Response) {
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

    return res.json({ messages: flaggedMessages, count: flaggedMessages.length });
  } catch (error) {
    console.error('Error fetching flagged messages:', error);
    return res.status(500).json({ error: 'Failed to fetch flagged messages' });
  }
}
