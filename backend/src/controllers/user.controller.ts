import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';

// Get current user profile with stats
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const userId = req.user?.sub;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        displayName: true,
        role: true,
        ageBracket: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get statistics for student users
    let stats = {};
    if (user.role === 'student') {
      const [totalBookings, completedBookings, activeSupportRooms, triageSubmissions] = await Promise.all([
        prisma.booking.count({ where: { studentId: userId } }),
        prisma.booking.count({ where: { studentId: userId, status: 'COMPLETED' } }),
        prisma.supportRoom.count({ where: { studentId: userId, status: { in: ['WAITING', 'ACTIVE'] } } }),
        prisma.triageForm.count({ where: { userId } }),
      ]);

      stats = {
        totalBookings,
        completedBookings,
        activeSupportRooms,
        triageSubmissions,
      };
    }

    return res.json({ 
      user,
      ...(user.role === 'student' && { stats }),
    });
  } catch (error) {
    next(error);
    return;
  }
};

// Update user profile
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const userId = req.user?.sub;
    const { name, displayName } = req.body;

    if (!name && !displayName) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (displayName) updateData.displayName = displayName;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        displayName: true,
        role: true,
        ageBracket: true,
      },
    });

    return res.json({
      message: 'Profile updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
    return;
  }
};

// Change password
export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const userId = req.user?.sub;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        error: 'New password must be at least 6 characters long' 
      });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    console.log(`🔑 Password changed for user: ${user.email}`);

    return res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
    return;
  }
};

// Delete account
export const deleteAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const userId = req.user?.sub;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete account' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Delete user (cascade delete will handle related records)
    await prisma.user.delete({
      where: { id: userId },
    });

    console.log(`🗑️  Account deleted: ${user.email}`);

    return res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    next(error);
    return;
  }
};

// Save mood entry
export const saveMood = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const userId = req.user?.sub;
    const { moodScore, note } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!moodScore || moodScore < 1 || moodScore > 5) {
      return res.status(400).json({ error: 'Mood score must be between 1 and 5' });
    }

    // Store mood as triage entry for now (can create separate MoodLog table later)
    const mood = await prisma.triageForm.create({
      data: {
        userId,
        moodScore,
        topic: 'mood_check',
        urgency: moodScore <= 2 ? 'high' : moodScore === 3 ? 'medium' : 'low',
        message: note || '',
        riskFlag: moodScore <= 2,
      },
    });

    return res.json({ mood, message: 'Mood saved successfully' });
  } catch (error) {
    next(error);
    return;
  }
};

// Get mood history
export const getMoodHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.sub;
    const days = parseInt(req.query.days as string) || 30;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const moods = await prisma.triageForm.findMany({
      where: {
        userId,
        topic: 'mood_check',
        createdAt: { gte: startDate },
      },
      select: {
        id: true,
        moodScore: true,
        message: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ moods });
  } catch (error) {
    next(error);
  }
};

// Get user progress stats
export const getProgressStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.sub;

    const [
      totalBookings,
      completedBookings,
      totalTriages,
      moodEntries,
    ] = await Promise.all([
      prisma.booking.count({ where: { studentId: userId } }),
      prisma.booking.count({ where: { studentId: userId, status: 'COMPLETED' } }),
      prisma.triageForm.count({ where: { userId } }),
      prisma.triageForm.count({ where: { userId, topic: 'mood_check' } }),
    ]);

    // Get mood trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentMoods = await prisma.triageForm.findMany({
      where: {
        userId,
        topic: 'mood_check',
        createdAt: { gte: sevenDaysAgo },
      },
      select: { moodScore: true },
    });

    const avgMood = recentMoods.length > 0
      ? recentMoods.reduce((sum, m) => sum + m.moodScore, 0) / recentMoods.length
      : 0;

    res.json({
      stats: {
        totalBookings,
        completedBookings,
        totalTriages,
        moodEntries,
        avgMoodLast7Days: avgMood.toFixed(1),
        streakDays: moodEntries > 0 ? Math.min(moodEntries, 7) : 0, // Simplified
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get activity log
export const getActivityLog = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.sub;
    const limit = parseInt(req.query.limit as string) || 20;

    const activities = await prisma.triageForm.findMany({
      where: { userId },
      select: {
        id: true,
        topic: true,
        moodScore: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.json({ activities });
  } catch (error) {
    next(error);
  }
};
