import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type = 'weekly', startDate, endDate } = req.query;

    let start: Date;
    let end: Date = new Date();

    if (startDate && endDate) {
      start = new Date(startDate as string);
      end = new Date(endDate as string);
    } else if (type === 'weekly') {
      start = new Date();
      start.setDate(start.getDate() - 7);
    } else if (type === 'monthly') {
      start = new Date();
      start.setMonth(start.getMonth() - 1);
    } else {
      start = new Date();
      start.setDate(start.getDate() - 7);
    }

    // Weekly/Monthly Usage Report
    const [
      totalUsers,
      newUsers,
      activeUsers,
      totalSessions,
      completedSessions,
      cancelledSessions,
      triageSubmissions,
      highRiskTriages,
      crisisAlerts,
      resolvedCrisis,
      peerMessages,
      flaggedMessages,
      peerRooms,
      supportRooms,
      resolvedSupport,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.user.count({
        where: {
          OR: [
            { triageForms: { some: { createdAt: { gte: start, lte: end } } } },
            { bookingsAsStudent: { some: { createdAt: { gte: start, lte: end } } } },
            { peerMessages: { some: { createdAt: { gte: start, lte: end } } } },
          ],
        },
      }),
      prisma.booking.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.booking.count({ 
        where: { 
          createdAt: { gte: start, lte: end },
          status: 'COMPLETED' 
        } 
      }),
      prisma.booking.count({ 
        where: { 
          createdAt: { gte: start, lte: end },
          status: 'CANCELLED' 
        } 
      }),
      prisma.triageForm.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.triageForm.count({ 
        where: { 
          createdAt: { gte: start, lte: end },
          riskFlag: true 
        } 
      }),
      prisma.crisisAlert.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.crisisAlert.count({ 
        where: { 
          createdAt: { gte: start, lte: end },
          status: 'RESOLVED' 
        } 
      }),
      prisma.peerMessage.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.peerMessage.count({ 
        where: { 
          createdAt: { gte: start, lte: end },
          flagged: true 
        } 
      }),
      prisma.peerRoom.count(),
      prisma.supportRoom.count({ where: { createdAt: { gte: start, lte: end } } }),
      prisma.supportRoom.count({ 
        where: { 
          createdAt: { gte: start, lte: end },
          status: 'RESOLVED' 
        } 
      }),
    ]);

    // Support types distribution
    const triagesByTopic = await prisma.triageForm.groupBy({
      by: ['topic'],
      _count: { topic: true },
      where: { createdAt: { gte: start, lte: end } },
      orderBy: { _count: { topic: 'desc' } },
    });

    const supportTypesDistribution = triagesByTopic.map(t => ({
      category: t.topic,
      count: t._count.topic,
      percentage: totalSessions > 0 ? ((t._count.topic / totalSessions) * 100).toFixed(1) : '0',
    }));

    // Average session duration (for completed bookings)
    const completedBookingsWithDuration = await prisma.booking.findMany({
      where: {
        createdAt: { gte: start, lte: end },
        status: 'COMPLETED',
      },
      select: {
        startAt: true,
        endAt: true,
      },
    });

    const totalDuration = completedBookingsWithDuration.reduce((sum, booking) => {
      const duration = new Date(booking.endAt).getTime() - new Date(booking.startAt).getTime();
      return sum + duration;
    }, 0);

    const avgSessionDuration = completedBookingsWithDuration.length > 0
      ? Math.round(totalDuration / completedBookingsWithDuration.length / (1000 * 60)) // minutes
      : 0;

    // Top counselors/supporters
    const topCounselors = await prisma.user.findMany({
      where: {
        role: { in: ['counselor', 'moderator'] },
        bookingsAsCounselor: {
          some: {
            createdAt: { gte: start, lte: end },
            status: 'COMPLETED',
          },
        },
      },
      select: {
        id: true,
        displayName: true,
        name: true,
        role: true,
        _count: {
          select: {
            bookingsAsCounselor: {
              where: {
                createdAt: { gte: start, lte: end },
                status: 'COMPLETED',
              },
            },
          },
        },
      },
      orderBy: {
        bookingsAsCounselor: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    const engagementReport = {
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
        type: type as string,
      },
      users: {
        total: totalUsers,
        new: newUsers,
        active: activeUsers,
        engagementRate: totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : '0',
      },
      sessions: {
        total: totalSessions,
        completed: completedSessions,
        cancelled: cancelledSessions,
        completionRate: totalSessions > 0 ? ((completedSessions / totalSessions) * 100).toFixed(1) : '0',
        avgDuration: `${avgSessionDuration} min`,
      },
      triage: {
        total: triageSubmissions,
        highRisk: highRiskTriages,
        riskRate: triageSubmissions > 0 ? ((highRiskTriages / triageSubmissions) * 100).toFixed(1) : '0',
      },
      crisis: {
        total: crisisAlerts,
        resolved: resolvedCrisis,
        resolutionRate: crisisAlerts > 0 ? ((resolvedCrisis / crisisAlerts) * 100).toFixed(1) : '0',
      },
      messaging: {
        totalMessages: peerMessages,
        flaggedMessages,
        flagRate: peerMessages > 0 ? ((flaggedMessages / peerMessages) * 100).toFixed(1) : '0',
      },
      support: {
        peerRooms,
        supportRooms,
        resolved: resolvedSupport,
        resolutionRate: supportRooms > 0 ? ((resolvedSupport / supportRooms) * 100).toFixed(1) : '0',
      },
      supportTypesDistribution,
      topCounselors: topCounselors.map(c => ({
        id: c.id,
        name: c.displayName || c.name,
        role: c.role,
        completedSessions: c._count.bookingsAsCounselor,
      })),
    };

    res.json({ report: engagementReport });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const exportReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { format = 'json' } = req.query;

    // Generate report data (placeholder for actual export implementation)
    await getReports(req, res);
    
    // In production, implement CSV/PDF export here
    // For now, return JSON
    if (format === 'csv') {
      res.status(501).json({ error: 'CSV export not yet implemented' });
      return;
    }

    if (format === 'pdf') {
      res.status(501).json({ error: 'PDF export not yet implemented' });
      return;
    }

    // JSON format already handled by getReports
  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
