import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getActivityLogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      page = '1',
      limit = '50',
      userId,
      action,
      entity,
      startDate,
      endDate,
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (userId && typeof userId === 'string') {
      where.userId = userId;
    }

    if (action && typeof action === 'string') {
      where.action = action;
    }

    if (entity && typeof entity === 'string') {
      where.entity = entity;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate as string);
      }
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              displayName: true,
              name: true,
              role: true,
            },
          },
        },
      }),
      prisma.activityLog.count({ where }),
    ]);

    res.json({
      logs,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getActivitySummary = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalLogs,
      last24Hours,
      lastWeek,
      topActions,
      topUsers,
    ] = await Promise.all([
      prisma.activityLog.count(),
      prisma.activityLog.count({ where: { createdAt: { gte: twentyFourHoursAgo } } }),
      prisma.activityLog.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      prisma.activityLog.groupBy({
        by: ['action'],
        _count: { action: true },
        orderBy: { _count: { action: 'desc' } },
        take: 10,
      }),
      prisma.activityLog.groupBy({
        by: ['userId'],
        _count: { userId: true },
        where: { userId: { not: null } },
        orderBy: { _count: { userId: 'desc' } },
        take: 10,
      }),
    ]);

    // Get user details for top users
    const topUserIds = topUsers.map((u: any) => u.userId).filter(Boolean) as string[];
    const userDetails = await prisma.user.findMany({
      where: { id: { in: topUserIds } },
      select: { id: true, displayName: true, name: true, email: true, role: true },
    });

    const topUsersWithDetails = topUsers.map((u: any) => {
      const user = userDetails.find(ud => ud.id === u.userId);
      return {
        userId: u.userId,
        displayName: user?.displayName || user?.name,
        email: user?.email,
        role: user?.role,
        activityCount: u._count.userId,
      };
    });

    res.json({
      summary: {
        totalLogs,
        last24Hours,
        lastWeek,
        topActions: topActions.map((a: any) => ({ action: a.action, count: a._count.action })),
        topUsers: topUsersWithDetails,
      },
    });
  } catch (error) {
    console.error('Get activity summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
