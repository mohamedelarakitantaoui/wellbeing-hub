import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

export const getAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { days = 30 } = req.query;
    const daysNum = parseInt(days as string, 10) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    // User Growth Timeline
    const users = await prisma.user.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, role: true },
      orderBy: { createdAt: 'asc' },
    });

    const userGrowthTimeline = generateTimelineData(users, daysNum, 'createdAt');

    // Daily Messages
    const messages = await prisma.peerMessage.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailyMessages = generateTimelineData(messages, daysNum, 'createdAt');

    // Daily Sessions
    const sessions = await prisma.booking.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true, status: true },
      orderBy: { createdAt: 'asc' },
    });

    const dailySessions = generateTimelineData(sessions, daysNum, 'createdAt');

    // Risk Level Distribution
    const triages = await prisma.triageForm.findMany({
      where: { createdAt: { gte: startDate } },
      select: { urgency: true },
    });

    const riskLevelDistribution = {
      low: triages.filter(t => t.urgency === 'low').length,
      medium: triages.filter(t => t.urgency === 'medium').length,
      high: triages.filter(t => t.urgency === 'high').length,
      crisis: triages.filter(t => t.urgency === 'crisis').length,
    };

    // Support Category Breakdown
    const triageTopics = await prisma.triageForm.findMany({
      where: { createdAt: { gte: startDate } },
      select: { topic: true },
    });

    const supportCategoryBreakdown = triageTopics.reduce((acc: any, t) => {
      acc[t.topic] = (acc[t.topic] || 0) + 1;
      return acc;
    }, {});

    // Peak Hours (message distribution by hour)
    const allMessages = await prisma.peerMessage.findMany({
      where: { createdAt: { gte: startDate } },
      select: { createdAt: true },
    });

    const peakHours = Array(24).fill(0);
    allMessages.forEach(msg => {
      const hour = new Date(msg.createdAt).getHours();
      peakHours[hour]++;
    });

    // Peer Tutor Performance Metrics
    const moderators = await prisma.user.findMany({
      where: { role: 'moderator' },
      select: {
        id: true,
        displayName: true,
        name: true,
        supportRoomsAsSupporter: {
          where: { 
            status: 'RESOLVED',
            createdAt: { gte: startDate }
          },
          select: {
            id: true,
            createdAt: true,
            closedAt: true,
          },
        },
        peerMessages: {
          where: { createdAt: { gte: startDate } },
          select: { id: true },
        },
      },
    });

    const peerTutorPerformanceMetrics = moderators.map(mod => {
      const resolvedRooms = mod.supportRoomsAsSupporter.length;
      const totalMessages = mod.peerMessages.length;
      const avgResponseTime = mod.supportRoomsAsSupporter.length > 0
        ? mod.supportRoomsAsSupporter.reduce((sum, room) => {
            if (room.closedAt) {
              const duration = new Date(room.closedAt).getTime() - new Date(room.createdAt).getTime();
              return sum + duration;
            }
            return sum;
          }, 0) / mod.supportRoomsAsSupporter.length / (1000 * 60) // Convert to minutes
        : 0;

      return {
        id: mod.id,
        name: mod.displayName || mod.name || 'Unknown',
        resolvedSessions: resolvedRooms,
        totalMessages,
        avgResponseTime: Math.round(avgResponseTime),
      };
    }).sort((a, b) => b.resolvedSessions - a.resolvedSessions).slice(0, 10);

    // Retention Rate (users who came back)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const oldUsers = await prisma.user.count({
      where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
    });

    const returningUsers = await prisma.user.count({
      where: {
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
        OR: [
          { triageForms: { some: { createdAt: { gte: thirtyDaysAgo } } } },
          { bookingsAsStudent: { some: { createdAt: { gte: thirtyDaysAgo } } } },
          { peerMessages: { some: { createdAt: { gte: thirtyDaysAgo } } } },
        ],
      },
    });

    const retentionRate = oldUsers > 0 ? ((returningUsers / oldUsers) * 100).toFixed(1) : '0';

    // Repeat Support Usage
    const usersWithMultipleSessions = await prisma.user.findMany({
      where: {
        bookingsAsStudent: {
          some: { createdAt: { gte: startDate } },
        },
      },
      select: {
        bookingsAsStudent: {
          where: { createdAt: { gte: startDate } },
          select: { id: true },
        },
      },
    });

    const repeatSupportUsage = usersWithMultipleSessions.filter(
      u => u.bookingsAsStudent.length > 1
    ).length;

    res.json({
      analytics: {
        userGrowthTimeline,
        dailyMessages,
        dailySessions,
        dailyNewUsers: userGrowthTimeline,
        peerTutorPerformanceMetrics,
        riskLevelDistribution,
        supportCategoryBreakdown,
        peakHours: peakHours.map((count, hour) => ({ hour, count })),
        retentionRate: `${retentionRate}%`,
        repeatSupportUsage,
        timeRange: {
          days: daysNum,
          start: startDate.toISOString(),
          end: new Date().toISOString(),
        },
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to generate timeline data
function generateTimelineData(items: any[], days: number, dateField: string) {
  const timeline: any[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const count = items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= date && itemDate < nextDate;
    }).length;
    
    timeline.push({
      date: date.toISOString().split('T')[0],
      count,
    });
  }
  
  return timeline;
}
