export type UserRole = 'student' | 'counselor' | 'intern' | 'moderator' | 'admin';

export interface User {
  name: string;
  role: UserRole;
  lastMood: string;
  upcomingSessions?: number;
  flaggedPosts?: number;
}

export function useUser(): User {
  // Mock data - replace with actual auth/API call later
  return {
    name: 'Mohamed Tantaoui',
    role: 'student',
    lastMood: '😊',
    upcomingSessions: 2,
    flaggedPosts: 3,
  };
}
