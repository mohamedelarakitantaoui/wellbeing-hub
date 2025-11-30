import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getSystemAlerts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { isRead, type, severity } = req.query;

    const where: any = {};

    if (isRead !== undefined) {
      where.isRead = isRead === 'true';
    }

    if (type && typeof type === 'string') {
      where.type = type;
    }

    if (severity && typeof severity === 'string') {
      where.severity = severity;
    }

    const alerts = await prisma.systemAlert.findMany({
      where,
      orderBy: [
        { isRead: 'asc' },
        { severity: 'desc' },
        { createdAt: 'desc' },
      ],
      take: 100,
    });

    const unreadCount = await prisma.systemAlert.count({
      where: { isRead: false },
    });

    res.json({ alerts, unreadCount });
  } catch (error) {
    console.error('Get system alerts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const markAlertAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.sub;

    const alert = await prisma.systemAlert.findUnique({
      where: { id },
    });

    if (!alert) {
      res.status(404).json({ error: 'Alert not found' });
      return;
    }

    const updatedAlert = await prisma.systemAlert.update({
      where: { id },
      data: {
        isRead: true,
        readBy: userId,
        readAt: new Date(),
      },
    });

    res.json({ alert: updatedAlert });
  } catch (error) {
    console.error('Mark alert as read error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createSystemAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, severity, title, message, metadata } = req.body;

    if (!type || !severity || !title || !message) {
      res.status(400).json({ error: 'Type, severity, title, and message are required' });
      return;
    }

    const alert = await prisma.systemAlert.create({
      data: {
        type,
        severity,
        title,
        message,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    res.status(201).json({ alert });
  } catch (error) {
    console.error('Create system alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteSystemAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const alert = await prisma.systemAlert.findUnique({
      where: { id },
    });

    if (!alert) {
      res.status(404).json({ error: 'Alert not found' });
      return;
    }

    await prisma.systemAlert.delete({
      where: { id },
    });

    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    console.error('Delete system alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Auto-generate alerts based on platform metrics
export const generateAutoAlerts = async (): Promise<void> => {
  try {
    // Check for high wait times
    const waitingRooms = await prisma.supportRoom.findMany({
      where: { status: 'WAITING' },
      select: { createdAt: true },
    });

    if (waitingRooms.length > 0) {
      const avgWaitTime = waitingRooms.reduce((sum, room) => {
        return sum + (Date.now() - new Date(room.createdAt).getTime());
      }, 0) / waitingRooms.length / (1000 * 60); // minutes

      if (avgWaitTime > 5) {
        const existingAlert = await prisma.systemAlert.findFirst({
          where: {
            type: 'HIGH_WAIT_TIME',
            isRead: false,
            createdAt: { gte: new Date(Date.now() - 3600000) }, // Last hour
          },
        });

        if (!existingAlert) {
          await prisma.systemAlert.create({
            data: {
              type: 'HIGH_WAIT_TIME',
              severity: avgWaitTime > 10 ? 'HIGH' : 'MEDIUM',
              title: 'High Wait Time Detected',
              message: `Average wait time is ${Math.round(avgWaitTime)} minutes. Consider notifying more supporters.`,
              metadata: JSON.stringify({ avgWaitTime, waitingRooms: waitingRooms.length }),
            },
          });
        }
      }
    }

    // Check for unresolved crisis alerts
    const unresolvedCrisis = await prisma.crisisAlert.count({
      where: { status: 'PENDING' },
    });

    if (unresolvedCrisis > 0) {
      const existingAlert = await prisma.systemAlert.findFirst({
        where: {
          type: 'CRISIS',
          isRead: false,
          createdAt: { gte: new Date(Date.now() - 1800000) }, // Last 30 min
        },
      });

      if (!existingAlert) {
        await prisma.systemAlert.create({
          data: {
            type: 'CRISIS',
            severity: 'CRITICAL',
            title: 'Unresolved Crisis Alerts',
            message: `There are ${unresolvedCrisis} unresolved crisis alerts requiring immediate attention.`,
            metadata: JSON.stringify({ count: unresolvedCrisis }),
          },
        });
      }
    }

    console.log('✅ Auto alerts generated successfully');
  } catch (error) {
    console.error('Generate auto alerts error:', error);
  }
};
