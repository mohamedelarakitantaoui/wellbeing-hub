import express, { Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { errorHandler } from './middleware/error';
import { setupGoogleStrategy } from './lib/google.strategy';
import { setupMicrosoftStrategy } from './lib/microsoft.strategy';

// Routes
import authRoutes from './routes/auth.routes';
import triageRoutes from './routes/triage.routes';
import supportRoutes from './routes/support.routes';
import bookingRoutes from './routes/booking.routes';
import peerApplicationRoutes from './routes/peerApplication.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import crisisRoutes from './routes/crisis.routes';

export const createApp = (): Application => {
  const app = express();

  // Middleware
  app.use(cors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'http://localhost:5174',
    ],
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Initialize Passport for OAuth
  app.use(passport.initialize());
  
  // Setup OAuth strategies
  setupGoogleStrategy();
  setupMicrosoftStrategy();

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/triage', triageRoutes);
  app.use('/api/support', supportRoutes); // Private 1-on-1 support rooms
  app.use('/api/bookings', bookingRoutes); // Counseling bookings
  app.use('/api/peer-applications', peerApplicationRoutes); // Peer tutor applications
  app.use('/api/user', userRoutes); // User profile and settings
  app.use('/api/admin', adminRoutes); // Admin endpoints
  app.use('/api/crisis', crisisRoutes); // Crisis alerts and callbacks

  // Error handler
  app.use(errorHandler);

  return app;
};
