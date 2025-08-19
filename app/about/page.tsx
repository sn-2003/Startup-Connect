"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Rocket,
  Users,
  Target,
  Award,
  Globe,
  Heart,
  Shield,
  Zap,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  Star,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Linkedin,
  Twitter,
  Github,
  Instagram,
} from "lucide-react";

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Security: Prevent any potential XSS by ensuring clean state
    setIsVisible(true);
    
    // Check if user is authenticated
    const hasSessionCookie = document.cookie.includes('next-auth.session-token') || 
                            document.cookie.includes('__Secure-next-auth.session-token');
    setIsAuthenticated(hasSessionCookie);
    
    // Security: Add viewport meta tag for mobile security
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    document.head.appendChild(meta);

    // Security: Cleanup on unmount
    return () => {
      const existingMeta = document.querySelector('meta[name="viewport"]');
      if (existingMeta) {
        existingMeta.remove();
      }
    };
  }, []);

  const handleGoBack = () => {
    // Check if user is authenticated to determine where to go back
    const hasSessionCookie = document.cookie.includes('next-auth.session-token') || 
                            document.cookie.includes('__Secure-next-auth.session-token');
    
    if (hasSessionCookie) {
      router.push("/dashboard");
    } else {
      // For non-authenticated users, go to landing page instead of home
      router.push("/");
    }
  };

  const handleContact = () => {
    // Create a temporary link element to trigger mailto
    const mailtoLink = document.createElement('a');
    mailtoLink.href = 'mailto:aistudio.team.co@gmail.com';
    mailtoLink.click();
  };

  // Security: Sanitize any dynamic content
  const sanitizeText = (text: string): string => {
    return text.replace(/[<>]/g, '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="StartupGram Logo" width={34} height={34} className="h-8 w-8 object-contain" />
              <span className="font-bold text-xl text-slate-900 dark:text-white">
                StartupGram
              </span>
            </div>

            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isAuthenticated ? "Back to Home" : "Back to Home"}</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 transition-colors">
              🚀 About StartupGram
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Empowering{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Innovation
              </span>{" "}
              Through{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Connection
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 -mb-12 max-w-4xl mx-auto leading-relaxed">
              {sanitizeText("We're building the world's most comprehensive platform for startups, investors, and talent to connect, collaborate, and create the future together.")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
                🎯 Our Mission
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Democratizing{" "}
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Startup Success
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                {sanitizeText("We believe that great ideas should have equal opportunities to succeed. Our platform breaks down barriers, connects the right people, and provides the resources needed to turn innovative concepts into successful businesses.")}
              </p>
              <div className="space-y-4">
                {[
                  "Connect startups with the right investors",
                  "Provide access to top talent and resources",
                  "Create a transparent and fair ecosystem",
                  "Accelerate innovation across all industries"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700 dark:text-slate-300">{sanitizeText(item)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-2xl">
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { icon: TrendingUp, label: "Startups Launched", value: "25+" },
                      { icon: Users, label: "Active Investors", value: "150+" },
                      { icon: Target, label: "Success Rate", value: "95%" },
                      { icon: Globe, label: "Incubators", value: "10+" }
                    ].map((stat, index) => (
                      <div key={index} className="text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                          {sanitizeText(stat.value)}
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300">
                          {sanitizeText(stat.label)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
              💎 Our Values
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              What Drives{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Us Forward
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Heart,
                title: "Empathy",
                description: "We understand the challenges entrepreneurs face and build solutions that truly serve their needs.",
                color: "from-rose-500 to-pink-500"
              },
              {
                icon: Shield,
                title: "Trust",
                description: "Security and transparency are at the core of everything we do. Your data and privacy are our priority.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Zap,
                title: "Innovation",
                description: "We constantly push boundaries to create cutting-edge solutions that drive real results.",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Users,
                title: "Community",
                description: "We believe in the power of collaboration and building strong networks that support growth.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Target,
                title: "Excellence",
                description: "We strive for excellence in every feature, every interaction, and every outcome we deliver.",
                color: "from-purple-500 to-violet-500"
              },
              {
                icon: Globe,
                title: "Impact",
                description: "We measure success by the positive impact we create in the global startup ecosystem.",
                color: "from-indigo-500 to-blue-500"
              }
            ].map((value, index) => (
              <div key={index} className="group cursor-pointer transform transition-all duration-500 hover:scale-105">
                <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 border-0 shadow-lg group-hover:bg-white dark:group-hover:bg-slate-900">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300`}
                    >
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {sanitizeText(value.title)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {sanitizeText(value.description)}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-indigo-200">
              👤 Founder
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Meet the <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Founder</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              StartupGram is built and maintained by a passionate founder dedicated to empowering the next generation of entrepreneurs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 max-w-2xl mx-auto">
            {[
              {
                name: "S Nikhil ",
                role: "Founder & CEO",
                bio: "Passionate tech enthusiast and developer building the future of StartupGramivity. Founder of the SN Technologies and dedicated to helping the next generation of innovators.",
                expertise: ["Full-Stack Development", "Product Strategy", "Startup Ecosystem"],
                photo: "/nikhil-photo.jpg"
              }
            ].map((member, index) => (
              <div key={index} className="group cursor-pointer transform transition-all duration-500 hover:scale-105">
                <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:bg-white dark:group-hover:bg-slate-900">
                  <CardHeader>
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                      <Image 
                        src={member.photo} 
                        alt={`${member.name} photo`} 
                        width={96} 
                        height={96} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white text-center">
                      {sanitizeText(member.name)}
                    </CardTitle>
                    <CardDescription className="text-center text-blue-600 dark:text-blue-400 font-medium">
                      {sanitizeText(member.role)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                      {sanitizeText(member.bio)}
                    </p>
                    <div className="space-y-2 mb-6">
                      {member.expertise.map((skill, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                          <span className="text-sm text-slate-600 dark:text-slate-300">
                            {sanitizeText(skill)}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Social Media Links */}
                    <div className="flex justify-center space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <a 
                        href="https://www.linkedin.com/in/s-nikhil03" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                      >
                        <Linkedin className="w-4 h-4 text-white" />
                      </a>
                      <a 
                        href="https://x.com/PartEngineer_03" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
                      >
                        <Twitter className="w-4 h-4 text-white" />
                      </a>
                      <a 
                        href="https://www.instagram.com/nikhil.s.03" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-colors"
                      >
                        <Instagram className="w-4 h-4 text-white" />
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 md:p-16 shadow-2xl transform hover:scale-105 transition-all duration-500">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to{" "}
              <span className="text-yellow-300">Connect?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {sanitizeText("Have questions about our platform? Want to learn more about how we can help your startup succeed? We'd love to hear from you.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="mailto:aistudio.team.co@gmail.com">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get in Touch
                  <Mail className="ml-2 w-5 h-5" />
                </Button>
              </a>

              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/register")}
                className="border-2 border-white text-black hover:bg-white/10 text-lg px-8 py-4 transition-all duration-300"
              >
                Join Our Platform
                <ArrowLeft className="ml-2 w-5 h-5 rotate-180" />
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-blue-100">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Jaipur, Rajasthan, India
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                +91 7999121826
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                aistudio.team.co@gmail.com
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/logo.png" alt="StartupGram Logo" width={48} height={48} className="h-12 w-12 object-contain" />
                <span className="font-bold text-xl">StartupGram</span>
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                {sanitizeText("Empowering the next generation of entrepreneurs to build, scale, and succeed.")}
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://linkedin.com/company/startupgram" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://x.com/PartEngineer_03" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://www.instagram.com/startupgram.ai?igsh=ZTFxeWN3MGV0dTBv" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-white">Platform</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Job Board
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Discover Startups
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Resources
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Investor Network
                  </button>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-white">Company</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => router.push('/about')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push('/careers')}
                    className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h3 className="font-semibold text-lg mb-4 text-white">Contact</h3>
              <ul className="space-y-3">
                <li className="flex items-center text-slate-400">
                  <Mail className="w-4 h-4 mr-2" />
                  <a href="mailto:aistudio.team.co@gmail.com" className="hover:text-white transition-colors">
                    aistudio.team.co@gmail.com
                  </a>
                </li>
                <li className="flex items-center text-slate-400">
                  <Phone className="w-4 h-4 mr-2" />
                  <a href="tel:+917999121826" className="hover:text-white transition-colors">
                    +91 7999121826
                  </a>
                </li>
                <li className="flex items-center text-slate-400">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>Jaipur, Rajasthan, India</span>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-slate-500 mb-4 md:mb-0">
                © 2025 StartupGram. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-slate-400 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 