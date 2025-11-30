import { JWTPayload } from '../middleware/auth';

declare global {
  namespace Express {
    interface User extends JWTPayload {
      token?: string;
    }
    
    interface Request {
      user?: JWTPayload;
    }
  }
}
