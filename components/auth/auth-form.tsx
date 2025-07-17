'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Rocket } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function AuthForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (res?.ok) {
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        const res = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (res?.ok) {
          router.push('/dashboard');
        } else {
          setError('Login after registration failed.');
        }
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left Content Panel */}
      <div className="flex-1 flex flex-col justify-center p-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <Rocket className="h-10 w-10 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">StartupConnect</h1>
              <p className="text-gray-600 text-sm">Professional Network</p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center text-yellow-600 mb-4">
              <span className="text-sm">⭐ Trusted by 50,000+ professionals</span>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Gateway to the
              <br />
              Startup Ecosystem
            </h2>

            <p className="text-gray-600 mb-8">
              Connect with innovative startups, discover exciting opportunities,
              and accelerate your career in the most dynamic companies.
            </p>
          </div>

          <div className="space-y-4">
            <FeatureItem
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              title="Connect with Startups"
              description="Discover exciting opportunities at innovative companies"
            />
            <FeatureItem
              iconBg="bg-teal-100"
              iconColor="text-teal-600"
              title="Accelerate Growth"
              description="Fast-track your career with startup experience"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              }
            />
            <FeatureItem
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              title="Premium Network"
              description="Connect with top entrepreneurs and professionals"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
            />
          </div>
        </div>
      </div>

      {/* Right Login/Register Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Card>
            <Tabs defaultValue="login" className="w-full">
              <CardHeader className="text-center">
                <CardTitle className="text-xl mb-2">Welcome</CardTitle>
                <CardDescription>
                  Sign in to access your dashboard
                </CardDescription>
                <TabsList className="grid w-full grid-cols-2 mt-4">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Sign Up</TabsTrigger>
                </TabsList>
              </CardHeader>

              <CardContent>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Enter your password"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="Create a password"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                  </form>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface FeatureItemProps {
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  iconBg,
  iconColor,
  title,
  description,
  icon,
}) => (
  <div className="flex items-center mb-4">
    <div className={`p-3 rounded-full ${iconBg}`}>
      {icon || (
        <svg
          className={`h-6 w-6 ${iconColor}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7-7 7M5 5l7 7-7 7"
          />
        </svg>
      )}
    </div>
    <div className="ml-4">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  </div>
);
