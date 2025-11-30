import { Router } from 'express';
import passport from 'passport';
import { 
  register, 
  login, 
  getMe, 
  consent, 
  guestLogin,
  googleAuthCallback,
  microsoftAuthCallback
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Standard auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/guest', guestLogin);
router.get('/me', authMiddleware, getMe);
router.post('/consent', authMiddleware, consent);

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['email', 'profile'],
    session: false 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`
  }),
  googleAuthCallback
);

// Microsoft OAuth routes
router.get('/microsoft',
  passport.authenticate('microsoft', {
    scope: ['user.read'],
    session: false
  })
);

router.get('/microsoft/callback',
  passport.authenticate('microsoft', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=oauth_failed`
  }),
  microsoftAuthCallback
);

export default router;
