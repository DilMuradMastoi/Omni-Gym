import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gym_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('gym_auth_token');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('gym_auth_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/profile');
          setUser(res.data.user);
          localStorage.setItem('gym_auth_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.error('Session validation failed:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const saveAuthData = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('gym_auth_token', newToken);
    localStorage.setItem('gym_auth_user', JSON.stringify(newUser));
  };

  const login = async (email: string, password: string) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    saveAuthData(res.data.token, res.data.user);
  } catch (err: any) {
    // If backend 404s or is unreachable, fallback to mock user for demo
    if (err.response?.status === 404 || err.code === 'ERR_NETWORK') {
      console.warn('Backend server not found/unreachable. Falling back to mock auth.');
      
      const mockRole: UserRole = email.includes('admin') 
        ? 'Admin' 
        : email.includes('trainer') 
        ? 'Trainer' 
        : 'Member';

      const mockUser: User = {
        id: 'demo-user-123',
        name: email.split('@')[0].replace('.', ' '),
        email,
        role: mockRole,
      };

      saveAuthData('mock-demo-jwt-token', mockUser);
      return;
    }
    throw err;
  }
};

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    saveAuthData(res.data.token, res.data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('gym_auth_token');
    localStorage.removeItem('gym_auth_user');
  };

  const updateProfile = async (data: Partial<User>) => {
    const res = await api.put('/auth/profile', data);
    setUser(res.data.user);
    localStorage.setItem('gym_auth_user', JSON.stringify(res.data.user));
  };

  const demoLogin = async (role: UserRole) => {
    let email = 'admin@fitzone.com';
    let password = 'admin123';

    if (role === 'Trainer') {
      email = 'trainer.alex@fitzone.com';
      password = 'trainer123';
    } else if (role === 'Member') {
      email = 'member.david@fitzone.com';
      password = 'member123';
    }

    await login(email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        demoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
