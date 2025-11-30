import passport from 'passport';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { socialLogin } from '../controllers/auth.controller';

export const setupMicrosoftStrategy = () => {
  passport.use(
    new MicrosoftStrategy(
      {
        clientID: process.env.MICROSOFT_CLIENT_ID!,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/microsoft/callback`,
        scope: ['user.read'],
        tenant: 'common', // Allow both personal and work/school accounts
      },
      async (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
        try {
          // Extract user data from Microsoft profile
          const email = profile.emails?.[0]?.value || profile.userPrincipalName;
          const name = profile.displayName;
          const profilePicture = profile.photos?.[0]?.value;

          if (!email) {
            return done(new Error('No email found in Microsoft profile'), undefined);
          }

          // Use the socialLogin function to find or create user
          const { user, token } = await socialLogin({
            email,
            name,
            displayName: name,
            provider: 'microsoft',
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
          console.error('Microsoft strategy error:', error);
          return done(error as Error, undefined);
        }
      }
    )
  );
};
