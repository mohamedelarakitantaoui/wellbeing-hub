import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middleware/auth';

// Animal names for guest users
const ANIMAL_NAMES = [
  'Panda', 'Koala', 'Dolphin', 'Penguin', 'Otter', 'Fox', 'Raccoon', 'Hedgehog',
  'Bunny', 'Squirrel', 'Owl', 'Deer', 'Turtle', 'Seal', 'Whale', 'Butterfly',
  'Hummingbird', 'Robin', 'Swan', 'Peacock', 'Flamingo', 'Parrot', 'Elephant',
  'Giraffe', 'Zebra', 'Kangaroo', 'Sloth', 'Llama', 'Alpaca', 'Red Panda'
];

// Helper function to get random animal name
const getRandomAnimalName = (): string => {
  const randomIndex = Math.floor(Math.random() * ANIMAL_NAMES.length);
  return ANIMAL_NAMES[randomIndex];
};

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2).optional(),
  displayName: z.string().min(2),
  age: z.number().int().min(13).max(100),
  role: z.enum(['student', 'counselor', 'moderator', 'admin']),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const consentSchema = z.object({
  userId: z.string(),
  accepted: z.boolean(),
});

const guestSchema = z.object({
  ageBracket: z.enum(['UNDER18', 'ADULT']),
  hasConsent: z.boolean(),
});

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    // Block admin role registration
    if (validatedData.role && (validatedData.role.toLowerCase() === 'admin' || validatedData.role.toLowerCase() === 'administrator')) {
      res.status(403).json({ error: 'You cannot self-register as administrator.' });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    // Determine age bracket and consent status
    const ageBracket = validatedData.age < 18 ? 'UNDER18' : 'ADULT';
    const consentMinorOk = validatedData.age >= 18; // Adults don't need consent flow

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name,
        displayName: validatedData.displayName,
        role: validatedData.role,
        ageBracket,
        consentMinorOk,
      },
      select: {
        id: true,
        email: true,
        name: true,
        displayName: true,
        role: true,
        ageBracket: true,
        consentMinorOk: true,
        createdAt: true,
      },
    });

    // Generate JWT
    const token = jwt.sign(
      { 
        sub: user.id,
        role: user.role, 
        ageBracket: user.ageBracket as 'UNDER18' | 'ADULT' | undefined,
        hasConsent: user.consentMinorOk,
        displayName: user.displayName || user.name || user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Check password
    const isValidPassword = await bcrypt.compare(validatedData.password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { 
        sub: user.id,
        role: user.role, 
        ageBracket: user.ageBracket as 'UNDER18' | 'ADULT' | undefined,
        hasConsent: user.consentMinorOk,
        displayName: user.displayName || user.name || user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        displayName: user.displayName,
        role: user.role,
        ageBracket: user.ageBracket,
        consentMinorOk: user.consentMinorOk,
      },
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check if user is a guest
    if (req.user!.role === 'guest') {
      // Return guest user data from JWT
      res.json({ 
        user: {
          id: req.user!.sub,
          role: req.user!.role,
          ageBracket: req.user!.ageBracket,
          displayName: req.user!.displayName,
          consentMinorOk: req.user!.hasConsent || false,
        }
      });
      return;
    }

    // For regular users, fetch from database
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      select: {
        id: true,
        email: true,
        name: true,
        displayName: true,
        role: true,
        ageBracket: true,
        consentMinorOk: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const consent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validatedData = consentSchema.parse(req.body);

    // Verify the user exists and is a minor
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.ageBracket !== 'UNDER18') {
      res.status(400).json({ error: 'Consent flow only applies to minors' });
      return;
    }

    if (!validatedData.accepted) {
      res.status(400).json({ error: 'Consent must be accepted to continue' });
      return;
    }

    // Update user consent status
    const updatedUser = await prisma.user.update({
      where: { id: validatedData.userId },
      data: { consentMinorOk: true },
      select: {
        id: true,
        email: true,
        name: true,
        displayName: true,
        role: true,
        ageBracket: true,
        consentMinorOk: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        actorId: validatedData.userId,
        action: 'CONSENT_ACCEPTED',
        eventType: 'CONSENT_ACCEPTED',
        metadata: JSON.stringify({
          timestamp: new Date().toISOString(),
          userAgent: req.headers['user-agent'],
        }),
      },
    });

    res.json({ user: updatedUser });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Consent error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * POST /api/auth/guest
 * Create a guest (anonymous) session
 */
export const guestLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = guestSchema.parse(req.body);

    // Generate guest ID and display name
    const guestId = `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const displayName = `Anonymous ${getRandomAnimalName()}`;

    // Create JWT for guest user
    const token = jwt.sign(
      {
        sub: guestId,
        role: 'guest',
        ageBracket: validatedData.ageBracket,
        hasConsent: validatedData.hasConsent,
        displayName: displayName,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' } // Shorter expiry for guest sessions
    );

    // Return guest user data
    const guestUser = {
      id: guestId,
      role: 'guest',
      ageBracket: validatedData.ageBracket,
      hasConsent: validatedData.hasConsent,
      displayName: displayName,
      consentMinorOk: validatedData.hasConsent,
    };

    console.log(`✅ Guest user created: ${displayName} (${guestId})`);

    res.status(201).json({
      user: guestUser,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    console.error('Guest login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Social Login Handler (Google & Microsoft OAuth)
 * Find user by email or create new user, then generate JWT
 */
interface SocialLoginData {
  email: string;
  name?: string;
  displayName?: string;
  provider: 'google' | 'microsoft';
  providerId: string;
  profilePicture?: string;
}

export const socialLogin = async (data: SocialLoginData): Promise<{ user: any; token: string }> => {
  try {
    const { email, name, displayName, provider, providerId, profilePicture } = data;

    // Optional: Restrict to AUI email domain
    // if (process.env.RESTRICT_TO_AUI_DOMAIN === 'true' && !email.endsWith('@aui.ma')) {
    //   throw new Error('Only AUI email addresses (@aui.ma) are allowed');
    // }

    // Check if user exists by email
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, create new user
    if (!user) {
      // Generate a random password for OAuth users (they won't use it)
      const randomPassword = await bcrypt.hash(Math.random().toString(36).substring(2, 15), 10);

      user = await prisma.user.create({
        data: {
          email,
          password: randomPassword,
          name: name || displayName || email.split('@')[0],
          displayName: displayName || name || email.split('@')[0],
          role: 'student', // Default role for OAuth users
          ageBracket: 'ADULT', // Default to adult for OAuth (university students)
          consentMinorOk: true, // Adults don't need consent
          oauthProvider: provider,
          oauthProviderId: providerId,
          profilePicture: profilePicture,
        },
      });

      console.log(`✅ New OAuth user created: ${user.email} (${provider})`);
    } else {
      // Update OAuth info if user exists but signed in with OAuth for first time
      if (!user.oauthProvider || !user.oauthProviderId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            oauthProvider: provider,
            oauthProviderId: providerId,
            profilePicture: profilePicture || user.profilePicture,
          },
        });
      }
      console.log(`✅ Existing user logged in via OAuth: ${user.email} (${provider})`);
    }

    // Generate JWT token (7-day expiration)
    const token = jwt.sign(
      {
        sub: user.id,
        role: user.role,
        ageBracket: user.ageBracket as 'UNDER18' | 'ADULT' | undefined,
        hasConsent: user.consentMinorOk,
        displayName: user.displayName || user.name || user.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        displayName: user.displayName,
        role: user.role,
        ageBracket: user.ageBracket,
        consentMinorOk: user.consentMinorOk,
        profilePicture: user.profilePicture,
      },
      token,
    };
  } catch (error) {
    console.error('Social login error:', error);
    throw error;
  }
};

/**
 * GET /api/auth/google
 * Initiate Google OAuth flow
 */
export const googleAuth = () => {
  // Handled by passport middleware
};

/**
 * GET /api/auth/google/callback
 * Google OAuth callback handler
 */
export const googleAuthCallback = (req: Request, res: Response): void => {
  try {
    const user = req.user as any;

    if (!user || !user.token) {
      console.error('Google callback failed: No user or token found');
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
      return;
    }

    console.log('✅ Google OAuth successful:', user.displayName);

    // Redirect to frontend with JWT token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${user.token}`);
  } catch (error) {
    console.error('Google callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
  }
};

/**
 * GET /api/auth/microsoft
 * Initiate Microsoft OAuth flow
 */
export const microsoftAuth = () => {
  // Handled by passport middleware
};

/**
 * GET /api/auth/microsoft/callback
 * Microsoft OAuth callback handler
 */
export const microsoftAuthCallback = (req: Request, res: Response): void => {
  try {
    const user = req.user as any;

    if (!user || !user.token) {
      console.error('Microsoft callback failed: No user or token found');
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
      return;
    }

    console.log('✅ Microsoft OAuth successful:', user.displayName);

    // Redirect to frontend with JWT token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${user.token}`);
  } catch (error) {
    console.error('Microsoft callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
  }
};
