import { User } from './types';

export const generateToken = (user: User): string => {
  const tokenData = {
    id: user.id,
    email: user.email,
    name: user.name,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days from now
  };
  
  return btoa(JSON.stringify(tokenData));
};

export const verifyToken = (token: string): any => {
  try {
    const decoded = JSON.parse(atob(token));
    
    // Check if token is expired
    if (decoded.exp && Date.now() > decoded.exp) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
};

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth-token');
};

export const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('auth-token', token);
};

export const removeStoredToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('auth-token');
};

export const getCurrentUser = (): any => {
  const token = getStoredToken();
  if (!token) return null;
  return verifyToken(token);
};