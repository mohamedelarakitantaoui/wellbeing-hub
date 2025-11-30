import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { socialLogin } from '../controllers/auth.controller';

export const setupGoogleStrategy = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
        scope: ['email', 'profile'],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          // Extract user data from Google profile
          const email = profile.emails?.[0]?.value;
          const name = profile.displayName;
          const profilePicture = profile.photos?.[0]?.value;

          if (!email) {
            return done(new Error('No email found in Google profile'), undefined);
          }

          // Use the socialLogin function to find or create user
          const { user, token } = await socialLogin({
            email,
            name,
            displayName: name,
            provider: 'google',
            providerId: profile.id,
            profilePicture,
          });

          // Return user with token attached for the callback handler
          return done(null, { 
            sub: user.id,
            role: user.role as any,
            ageBracket: user.ageBracket as any,
            hasConsent: user.consentMinorOk,
            displayName: user.displayName || user.name || user.email,
            token 
          });
        } catch (error) {
          console.error('Google strategy error:', error);
          return done(error as Error, undefined);
        }
      }
    )
  );

  // Serialize user for session (not used with JWT but required by Passport)
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });

  passport.deserializeUser((user: any, done) => {
    done(null, user);
  });
};
