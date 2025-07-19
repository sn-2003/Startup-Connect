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
import Image from 'next/image';


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
          <div className="flex items-center gap-1 mb-3">
  <Image
    src="/logo.png"
    alt="StartupConnect Logo"
    width={80}
    height={80}
  />
  <div>
    <h1 className="text-2xl font-bold text-gray-900">StartupConnect</h1>
    <p className="text-gray-600 text-sm">The Startup Professional Network</p>
  </div>
</div>



          <div className="mb-8">
            <div className="flex items-center text-yellow-600 mb-4">
              <span className="text-sm">⭐ Be a part of growing network</span>
            </div>

            <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              Unlock Your Startup<br />Career Potential
            </h2>

            <p className="text-gray-600 mb-8 text-base">
              Join a vibrant network of forward-thinkers, founders, and innovators.
              Discover startups, apply for jobs, and explore resources to grow your career or venture
            </p>
          </div>

          <div className="space-y-4">
            <FeatureItem
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              title="Discover top talent"
              description="Easily post or find jobs at the most talented job pool in the startup ecosystem"
            />
            <FeatureItem
              iconBg="bg-teal-100"
              iconColor="text-teal-600"
              title="Meet Founders & Innovators"
              description="With more than 150+ testified investors connect with the right people to grow your network"
            />
            <FeatureItem
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              title="Explore Ventures & Resources"
              description="Browse startup profiles, tools, and curated guides to level up your journey"
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
                        className="focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-shadow duration-300"
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
                        className="focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-shadow duration-300"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full hover:shadow-lg hover:shadow-blue-400/40 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                      disabled={loading}
                    >
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
                        className="focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-shadow duration-300"
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
                        className="focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-shadow duration-300"
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
                        className="focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-shadow duration-300"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full hover:shadow-lg hover:shadow-blue-400/40 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300"
                      disabled={loading}
                    >
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
