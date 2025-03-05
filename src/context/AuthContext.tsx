import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // In development, we'll use mock data
        if (process.env.NODE_ENV === 'development') {
          setTimeout(() => {
            setUser({
              id: 1,
              username: 'demo',
              email: 'demo@example.com',
              role: 'admin',
            });
            setIsAuthenticated(true);
            setLoading(false);
          }, 500);
          return;
        }

        // In production, we'll use the actual API
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    // In development, we'll use mock data
    if (process.env.NODE_ENV === 'development') {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          localStorage.setItem('token', 'mock-jwt-token');
          setUser({
            id: 1,
            username: 'demo',
            email: 'demo@example.com',
            role: 'admin',
          });
          setIsAuthenticated(true);
          resolve();
        }, 800);
      });
    }

    // In production, we'll use the actual API
    const { token, user } = await authService.login(username, password);
    localStorage.setItem('token', token);
    setUser(user);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
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

export default AuthContext; 