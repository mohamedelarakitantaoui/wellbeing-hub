import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface JWTPayload {
  sub: string;          // userId or guestId
  role: 'student' | 'staff' | 'faculty' | 'counselor' | 'intern' | 'admin' | 'guest' | 'moderator';
  ageBracket?: 'UNDER18' | 'ADULT';
  hasConsent?: boolean;  // for minors only
  displayName?: string;  // "Anonymous Panda" or regular name
  
  // Legacy fields for backward compatibility
  id?: string;
  consentMinorOk?: boolean;
}

export interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Normalize the payload to ensure consistency
    req.user = {
      sub: decoded.sub || decoded.id!, // Use 'sub' or fall back to legacy 'id'
      role: decoded.role,
      ageBracket: decoded.ageBracket,
      hasConsent: decoded.hasConsent !== undefined ? decoded.hasConsent : decoded.consentMinorOk,
      displayName: decoded.displayName,
    };
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }

    next();
  };
};

// Token verification helper for WebSocket authentication
export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
};
