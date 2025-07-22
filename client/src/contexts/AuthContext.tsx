import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, authService } from '../services/auth';
import { useSessionTimeout } from '../hooks/useSessionTimeout';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ requiresMfa?: boolean }>;
  register: (data: any) => Promise<void>;
  verifyMfa: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Session timeout hook
  useSessionTimeout(() => {
    setUser(null);
  });

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        const userData = authService.getCurrentUser();
        
        if (token && userData) {
          // Validate token by making a test request
          try {
            await authService.refreshToken();
            setUser(userData);
          } catch (error) {
            // Token is invalid, clear auth data
            await authService.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      if (response.requiresMfa) {
        return { requiresMfa: true };
      }
      
      setUser(response.user);
      return {};
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      await authService.register(data);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyMfa = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      const response = await authService.verifyMfa({ email, code });
      setUser(response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshAuth = async () => {
    try {
      const response = await authService.refreshToken();
      setUser(response.user);
    } catch (error) {
      console.error('Refresh auth error:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    verifyMfa,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};