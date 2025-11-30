import { Response } from 'express';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';
import bcrypt from 'bcryptjs';
import { logActivity } from '../lib/activityLogger';

// Get all users with pagination and filters
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      page = '1', 
      limit = '20', 
      role, 
      search,
      ageBracket 
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    
    if (role && typeof role === 'string') {
      where.role = role;
    }
    
    if (ageBracket && typeof ageBracket === 'string') {
      where.ageBracket = ageBracket;
    }
    
    if (search && typeof search === 'string') {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { displayName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          displayName: true,
          role: true,
          ageBracket: true,
          consentMinorOk: true,
          oauthProvider: true,
          profilePicture: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              bookingsAsStudent: true,
              triageForms: true,
              peerMessages: true,
              crisisAlerts: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single user by ID
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        bookingsAsStudent: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            counselor: {
              select: { id: true, displayName: true, name: true },
            },
          },
        },
        bookingsAsCounselor: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            student: {
              select: { id: true, displayName: true, name: true },
            },
          },
        },
        triageForms: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        crisisAlerts: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: {
            bookingsAsStudent: true,
            bookingsAsCounselor: true,
            triageForms: true,
            peerMessages: true,
            crisisAlerts: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new user (admin only)
export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      name,
      displayName,
      role,
      ageBracket,
    } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      res.status(400).json({ error: 'Email, password, and role are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({ error: 'User with this email already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        displayName: displayName || name || email.split('@')[0],
        role,
        ageBracket: ageBracket || 'ADULT',
        consentMinorOk: ageBracket === 'UNDER18' ? false : true,
      },
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

    // Log activity
    await logActivity({
      userId: req.user?.sub,
      action: 'CREATE_USER',
      entity: 'User',
      entityId: user.id,
      metadata: JSON.stringify({ createdUserEmail: email, role }),
    });

    res.status(201).json({ user });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user (admin only)
export const updateUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      name,
      displayName,
      role,
      ageBracket,
      consentMinorOk,
    } = req.body;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(displayName !== undefined && { displayName }),
        ...(role !== undefined && { role }),
        ...(ageBracket !== undefined && { ageBracket }),
        ...(consentMinorOk !== undefined && { consentMinorOk }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        displayName: true,
        role: true,
        ageBracket: true,
        consentMinorOk: true,
        updatedAt: true,
      },
    });

    // Log activity
    await logActivity({
      userId: req.user?.sub,
      action: 'UPDATE_USER',
      entity: 'User',
      entityId: id,
      metadata: JSON.stringify({ updatedFields: Object.keys(req.body) }),
    });

    res.json({ user: updatedUser });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete user (admin only)
export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Prevent admin from deleting themselves
    if (id === req.user?.sub) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    // Log activity
    await logActivity({
      userId: req.user?.sub,
      action: 'DELETE_USER',
      entity: 'User',
      entityId: id,
      metadata: JSON.stringify({ deletedUserEmail: user.email }),
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Reset user password (admin only)
export const resetUserPassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    // Log activity
    await logActivity({
      userId: req.user?.sub,
      action: 'RESET_USER_PASSWORD',
      entity: 'User',
      entityId: id,
      metadata: JSON.stringify({ userEmail: user.email }),
    });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
