'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, JWTPayload } from '@/lib/types';
import { apiClient } from '@/lib/api-client';
import { getCurrentUser, setStoredToken, removeStoredToken } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser: JWTPayload | null = getCurrentUser();
    if (currentUser) {
      // Convert the JWT payload to a User object
      setUser({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        password: '', // Don't store password
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(email, password);
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        setStoredToken(token);
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.register(name, email, password);
      if (response.success && response.data) {
        const { user: userData, token } = response.data;
        setStoredToken(token);
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    removeStoredToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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