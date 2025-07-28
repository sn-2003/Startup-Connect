"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ArrowLeft, Eye, EyeOff, Sparkles, Users, Briefcase, TrendingUp, BookOpen, Globe } from "lucide-react"
import { signIn } from "next-auth/react"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

export default function AuthForm() {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleBackClick = () => {
    console.log('Back button clicked');
    try {
      router.push("/");
    } catch (error) {
      console.log('Router failed, using window.location');
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      if (errorParam === "OAuthAccountNotLinked") {
        setError("An account with the same email already exists. Please use the same provider you used originally.")
      } else if (errorParam === "AccessDenied") {
        setError("Access denied. Please try a different account.")
      } else if (errorParam === "Callback") {
        setError("Social login failed. Please try again.")
      } else {
        setError("Social login was cancelled or failed. Please try again.")
      }
    }
  }, [searchParams])

  const handleTabChange = () => {
    setError("")
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      if (res?.ok) {
        router.push("/dashboard")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    }
    setLoading(false)
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        const res = await signIn("credentials", {
          redirect: false,
          email,
          password,
        })
        if (res?.ok) {
          router.push("/dashboard")
        } else {
          setError("Login after registration failed.")
        }
      } else {
        const data = await response.json()
        setError(data.error || "Registration failed.")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    }
    setLoading(false)
  }

  const stats = [
    { icon: Users, label: "150+ Investors Network", color: "text-blue-600" },
    { icon: BookOpen, label: "25+ Resources", color: "text-green-600" },
    { icon: Globe, label: "10+ Incubators", color: "text-purple-600" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-[60]">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="flex items-center space-x-2 text-slate-900 bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Landing</span>
        </Button>
      </div>


      <div className="flex min-h-screen relative">
        {/* Left Side - Branding */}
        <div className="hidden lg:block lg:w-1/2 fixed left-0 top-0 h-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-purple-600 to-indigo-700"></div>
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Decorative Elements */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white/10 rounded-full blur-lg"></div>

          <div className="relative z-10 flex flex-col justify-center px-16 pt-24 text-white h-full">
            <div className="w-full">
              <div className="flex items-center space-x-3 mb-8">
                <div className="relative">
                  <Image
                    src="/logo.png"
                    alt="StartupGram Logo"
                    width={48}
                    height={48}
                    className="h-12 w-12 object-contain"
                  />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">StartupGram</h1>
                  <p className="text-blue-100 text-sm">The Startup Professional Network</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-4xl font-bold leading-tight mb-4">
                    Your startup journey
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                      starts here
                    </span>
                  </h2>
                  <p className="text-xl text-blue-100 leading-relaxed">
                    Connect with founders, discover opportunities, and build the future of innovation together.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {stats.map((stat, index) => (
                    <div
                      key={stat.label}
                      className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                    >
                      <div className="p-2 bg-white/20 rounded-lg">
                        <stat.icon className="h-5 w-5" />
                      </div>
                      <span className="font-medium">{stat.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-2 text-sm text-blue-100">
                  <Sparkles className="h-4 w-4" />
                  <span>Join thousands of entrepreneurs and innovators</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 lg:ml-[50%] flex items-center justify-center p-8 lg:p-16 min-h-screen">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <Card className="border-0 shadow-2xl shadow-slate-200/50">
              <Tabs defaultValue="login" className="w-full" onValueChange={handleTabChange}>
                <CardHeader className="text-center pb-8">
                  <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
                    <Image
                      src="/logo.png"
                      alt="StartupGram Logo"
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain"
                    />
                    <div>
                      <h1 className="text-xl font-bold text-slate-900">StartupGram</h1>
                      <p className="text-slate-600 text-sm">The Startup Professional Network</p>
                    </div>
                  </div>

                  <CardTitle className="text-2xl font-bold text-slate-900 mb-2">Welcome back</CardTitle>
                  <CardDescription className="text-slate-600">Sign in to continue your startup journey</CardDescription>

                  <TabsList className="grid w-full grid-cols-2 mt-6 bg-slate-100">
                    <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Login Form */}
                  <TabsContent value="login" className="space-y-4">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email address</Label>
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="login-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            required
                            className="h-12 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                      >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Register Form */}
                  <TabsContent value="register" className="space-y-4">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-name">Full name</Label>
                        <Input
                          id="register-name"
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email address</Label>
                        <Input
                          id="register-email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          required
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="register-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            required
                            className="h-12 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                      >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </CardContent>
              </Tabs>

              <div className="px-6 pb-6">
                <p className="text-xs text-slate-500 text-center">
                  By continuing, you agree to our{" "}
                  <button
                    onClick={() => router.push("/terms")}
                    className="text-blue-600 hover:underline"
                  >
                    Terms
                  </button>{" "}
                  and{" "}
                  <button
                    onClick={() => router.push("/privacy")}
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </button>
                </p>
              </div>
            </Card>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-2">
              <div className="flex justify-center space-x-6 text-sm">
                <button
                  onClick={() => router.push("/terms")}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => router.push("/privacy")}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => router.push("/cookies")}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cookie Policy
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
