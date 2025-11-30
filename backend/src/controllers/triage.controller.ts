import { Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import { detectRisk } from '../lib/riskDetection';

const triageSchema = z.object({
  topic: z.string().min(1),
  moodScore: z.number().min(1).max(10),
  urgency: z.enum(['low', 'medium', 'high', 'crisis']),
  message: z.string().optional(),
});

export const createTriage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = triageSchema.parse(req.body);

    // Detect risk based on message content, mood score, and urgency
    const riskFlag = validatedData.message
      ? detectRisk(validatedData.message)
      : false;
    
    const lowMoodRisk = validatedData.moodScore < 3;
    const isHighRisk = riskFlag || lowMoodRisk || validatedData.urgency === 'crisis';

    // Determine routing based on risk, urgency, and mood
    let route: 'CRISIS' | 'BOOK' | 'PEER';
    let urgencyLevel: 'low' | 'medium' | 'high' | 'crisis';
    
    if (isHighRisk) {
      route = 'CRISIS';
      urgencyLevel = 'crisis';
    } else if (validatedData.urgency === 'high') {
      route = 'BOOK';
      urgencyLevel = 'high';
    } else if (validatedData.urgency === 'medium') {
      route = 'PEER';
      urgencyLevel = 'medium';
    } else {
      route = 'PEER';
      urgencyLevel = 'low';
    }

    // Save triage form
    const triageForm = await prisma.triageForm.create({
      data: {
        userId: req.user!.sub,
        topic: validatedData.topic,
        moodScore: validatedData.moodScore,
        urgency: urgencyLevel,
        message: validatedData.message,
        riskFlag: isHighRisk,
        route,
      },
    });

    // If high risk, create a crisis alert
    if (isHighRisk) {
      await prisma.crisisAlert.create({
        data: {
          userId: req.user!.sub,
          message: validatedData.message || `High-risk triage detected: ${validatedData.topic}`,
        },
      });
    }

    // Create private support room for PEER and BOOK routes
    let supportRoom = null;
    if (route === 'PEER' || route === 'BOOK') {
      // Determine routing for support room
      const routedTo = route === 'BOOK' || urgencyLevel === 'high' || ['anxiety', 'health', 'family'].includes(validatedData.topic.toLowerCase())
        ? 'counselor'
        : 'peer_supporter';

      supportRoom = await prisma.supportRoom.create({
        data: {
          studentId: req.user!.sub,
          topic: validatedData.topic.toLowerCase(),
          urgency: urgencyLevel,
          routedTo,
          initialMessage: validatedData.message,
          status: 'WAITING',
        },
      });

      // Create initial message if provided
      if (validatedData.message) {
        await prisma.supportMessage.create({
          data: {
            roomId: supportRoom.id,
            senderId: req.user!.sub,
            content: validatedData.message,
          },
        });
      }

      console.log(`✅ Support room created: ${supportRoom.id} for triage ${triageForm.id}`);
    }

    // Build response based on route
    let response: any = {
      id: triageForm.id,
      route,
      riskFlag,
    };

    if (route === 'CRISIS') {
      response = {
        ...response,
        numbers: ['141', '112'],
        bannerText: 'If you feel unsafe, please call now.',
      };
    } else if (route === 'BOOK' && supportRoom) {
      response = {
        ...response,
        counselorFilters: {
          topic: validatedData.topic,
        },
        supportRoom: {
          id: supportRoom.id,
          topic: supportRoom.topic,
          urgency: supportRoom.urgency,
          routedTo: supportRoom.routedTo,
          status: supportRoom.status,
        },
        message: `Connecting you with a professional counselor...`,
      };
    } else if (route === 'PEER' && supportRoom) {
      response = {
        ...response,
        supportRoom: {
          id: supportRoom.id,
          topic: supportRoom.topic,
          urgency: supportRoom.urgency,
          routedTo: supportRoom.routedTo,
          status: supportRoom.status,
        },
        message: `Connecting you with a ${supportRoom.routedTo.replace('_', ' ')}...`,
      };
    }

    res.status(201).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Create triage error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMyTriages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const triages = await prisma.triageForm.findMany({
      where: { userId: req.user!.sub },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({ triages });
  } catch (error) {
    console.error('Get triages error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
