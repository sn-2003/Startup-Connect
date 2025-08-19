'use client';

import { createContext, useContext, ReactNode } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email?: string, password?: string) => Promise<void>;
  register: (name?: string, email?: string, password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const user = session?.user || null;
  const loading = status === 'loading';

  const login = async () => {
    await signIn();
  };

  const register = async () => {
    await signIn(); // Registration handled by provider
  };

  const logout = () => {
    signOut();
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