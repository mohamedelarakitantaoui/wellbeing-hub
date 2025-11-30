import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api, setToken, getToken, removeToken } from '../lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  role: 'student' | 'counselor' | 'moderator' | 'admin';
  ageBracket?: string;
  consentMinorOk: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isMinor: boolean;
  needsConsent: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    email: string;
    password: string;
    displayName: string;
    age: number;
    role: string;
  }) => Promise<void>;
  logout: () => void;
  giveConsent: () => Promise<void>;
  requireRole: (role: string) => boolean;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Add a timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 5000);
        });

        const userPromise = api.getMe();
        const { user: userData } = await Promise.race([userPromise, timeoutPromise]) as { user: any };
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        // Clear invalid token
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const { user: userData, token } = await api.login({ email, password });
      setToken(token);
      setUser(userData);
      return userData; // Return user data for redirect logic
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    displayName: string;
    age: number;
    role: string;
  }) => {
    try {
      setError(null);
      setLoading(true);
      const { user: userData, token } = await api.register(data);
      setToken(token);
      setUser(userData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setError(null);
  };

  const giveConsent = async () => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      setError(null);
      const { user: userData } = await api.consent({
        userId: user.id,
        accepted: true,
      });
      setUser(userData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Consent submission failed';
      setError(message);
      throw err;
    }
  };

  const requireRole = (role: string): boolean => {
    return user?.role === role;
  };

  const clearError = () => {
    setError(null);
  };

  const isMinor = user?.ageBracket === 'UNDER18';
  const needsConsent = isMinor && !user?.consentMinorOk;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        isMinor,
        needsConsent,
        login,
        register,
        logout,
        giveConsent,
        requireRole,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
