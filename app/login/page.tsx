'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import AuthForm from '@/components/auth/auth-form';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect to dashboard on first login, otherwise to home page
      const redirectPath = user.firstLogin ? '/dashboard' : '/';
      router.push(redirectPath);
      
      // If it's the first login, we'll update the firstLogin flag after redirecting
      // The actual update happens in the auth-options.ts signIn event
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return <AuthForm />;
}