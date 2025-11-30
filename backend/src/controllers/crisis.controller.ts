import { Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { getIO } from '../sockets';
// Temporarily disabled Redis job
// import { addCrisisAlertJob } from '../jobs/crisisAlert.job';

const crisisAlertSchema = z.object({
  message: z.string().min(1),
});

export const createCrisisAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = crisisAlertSchema.parse(req.body);

    // Create crisis alert
    const alert = await prisma.crisisAlert.create({
      data: {
        userId: req.user!.id,
        message: validatedData.message,
      },
      include: {
        user: {
          select: { 
            id: true, 
            name: true, 
            displayName: true,
            email: true,
            ageBracket: true,
          },
        },
      },
    });

    // Emit real-time notification to all counselors via Socket.IO
    const io = getIO();
    if (io && alert.user) {
      io.to('counselors').emit('crisis:alert', {
        id: alert.id,
        userId: alert.userId,
        userName: alert.user.displayName || alert.user.name || 'Student',
        userEmail: alert.user.email,
        ageBracket: alert.user.ageBracket,
        message: alert.message,
        status: alert.status,
        createdAt: alert.createdAt,
      });
      console.log('🚨 CRISIS ALERT emitted to counselors via Socket.IO');
    }

    // Queue background job for notification (disabled - Redis not installed)
    // await addCrisisAlertJob({
    //   alertId: alert.id,
    //   userId: alert.userId,
    //   userName: alert.user.name || 'Unknown',
    //   userEmail: alert.user.email,
    //   message: alert.message,
    // });
    
    // Log alert
    console.log('🚨 CRISIS ALERT:', {
      id: alert.id,
      user: alert.user?.displayName || alert.user?.name || 'Unknown',
      message: alert.message
    });

    res.status(201).json({
      alert: {
        id: alert.id,
        message: 'Crisis alert received. Help is on the way.',
        status: alert.status,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Create crisis alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCrisisAlerts = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const alerts = await prisma.crisisAlert.findMany({
      where: {
        status: { in: ['PENDING', 'ACKNOWLEDGED'] },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, ageBracket: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ alerts });
  } catch (error) {
    console.error('Get crisis alerts error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCrisisAlert = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'ACKNOWLEDGED', 'RESOLVED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status' });
      return;
    }

    const alert = await prisma.crisisAlert.update({
      where: { id },
      data: { status },
    });

    res.json({ alert });
  } catch (error) {
    console.error('Update crisis alert error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
