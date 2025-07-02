'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User } from '@/lib/types';
import { mockAPI } from '@/lib/mock-data';
import { generateToken, verifyToken, getStoredToken, setStoredToken, removeStoredToken } from '@/lib/auth';

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
    const token = getStoredToken();
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        setUser({
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          password: '', // Don't store password
          savedJobs: [],
          createdAt: new Date(),
        });
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await mockAPI.login(email, password);
      if (userData) {
        const token = generateToken(userData);
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
      const userData = await mockAPI.register(name, email, password);
      const token = generateToken(userData);
      setStoredToken(token);
      setUser(userData);
      return true;
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