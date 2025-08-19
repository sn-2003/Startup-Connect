import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const useAuthRedirect = () => {
  const router = useRouter();
  const { user, loading } = useAuth();

  const requireAuth = (callback: () => void) => {
    if (!user && !loading) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return false;
    }
    callback();
    return true;
  };

  const requireAuthHref = (path: string) => {
    if (!user && !loading) {
      return `/login?callbackUrl=${encodeURIComponent(path)}`;
    }
    return path;
  };

  return { requireAuth, requireAuthHref, user, loading };
};

// List of protected routes that require authentication
const protectedRoutes = [
  '/my-startups',
  '/tools',
  '/investors',
  '/incubators',
  '/resources',
  '/saved-jobs',
  '/my-applications',
  '/my-resume',
  '/dashboard',
  '/profile',
  '/settings'
];

export const isProtectedRoute = (path: string) => {
  return protectedRoutes.some(route => path.startsWith(route));
};
