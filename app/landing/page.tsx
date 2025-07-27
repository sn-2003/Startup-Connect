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
  ArrowRight,
  Rocket,
  Users,
  TrendingUp,
  Star,
  CheckCircle,
  Target,
  Lightbulb,
  Zap,
  Globe,
  Award,
  ChevronDown,
  Menu,
  X,
  Briefcase,
  BookOpen,
  Search,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
  Sparkles,
  LinkedinIcon,
} from "lucide-react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      const sections = ["hero", "features", "stats", "platform", "cta"];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (
          element &&
          scrollPosition >= element.offsetTop &&
          scrollPosition < element.offsetTop + element.offsetHeight
        ) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const handleGetStarted = () => {
    router.push("/register");
  };

  const handleSignIn = () => {
    router.push("/login");
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

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {["Features", "Stats", "Platform"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                    activeSection === item.toLowerCase()
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => router.push("/about")}
                className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300"
              >
                About
              </button>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
            <div className="px-4 py-4 space-y-4">
              {["Features", "Stats", "Platform"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {item}
                </button>
              ))}
              <button
                onClick={() => router.push("/about")}
                className="block w-full text-left text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                About
              </button>
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="ghost"
                  onClick={handleSignIn}
                  className="justify-start"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleGetStarted}
                  className="justify-start bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 transition-colors">
              🚀 Connecting Innovation & Investment
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Where{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse">
                Startups
              </span>{" "}
              Meet{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Success
              </span>
              <span className="block text-lg md:text-2xl font-semibold text-blue-700 mt-4">
                Now with your own AI mentor, Nova, for personalized startup guidance!
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Connect with investors, discover talent pool, and accelerate
              your startup journey in the most comprehensive ecosystem for
              innovation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Launch Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("features")}
                className="text-lg px-8 py-4 border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
              >
                Explore Features
                <ChevronDown className="ml-2 w-5 h-5 animate-bounce" />
              </Button>
              <Button
                size="lg"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    // Try to open the chat widget if present
                    const chatBtn = document.querySelector('[aria-label="Open AI Mentor Chat"]');
                    if (chatBtn) {
                      (chatBtn as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    } else {
                      // Fallback: redirect to dashboard or login
                      const isLoggedIn = !!window.localStorage.getItem('nextauth.session-token') || !!window.localStorage.getItem('__Secure-next-auth.session-token');
                      if (isLoggedIn) {
                        router.push('/dashboard');
                      } else {
                        router.push('/login');
                      }
                    }
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Sparkles className="mr-2 w-5 h-5" /> Try Nova
              </Button>
            </div>

            {/* Floating Cards Animation */}
            <div className="relative max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {[
                  {
                    icon: Rocket,
                    title: "Launch",
                    desc: "From idea to market",
                    delay: "0s",
                  },
                  {
                    icon: TrendingUp,
                    title: "Scale",
                    desc: "Accelerated growth",
                    delay: "0.2s",
                  },
                  {
                    icon: Target,
                    title: "Connect",
                    desc: "Find your startup job",
                    delay: "0.4s",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                    style={{ animationDelay: item.delay }}
                  >
                    <Card className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:bg-white/80 dark:group-hover:bg-slate-800/80">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-2">
                          {item.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
                          {item.desc}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-4 bg-white/50 dark:bg-slate-800/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-700 border-indigo-200">
              🌟 Everything You Need
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Every Stage
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              From initial concept to successful exit, our platform provides the
              tools and connections you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Investor Network",
                description:
                  "Connect with VCs, angels, and institutional investors actively seeking opportunities.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Lightbulb,
                title: "Idea Validation",
                description:
                  "Get feedback directly from your userbase and validate your concept before investing time and money.",
                color: "from-amber-500 to-orange-500",
              },
              {
                icon: Zap,
                title: "Access to Job Board",
                description:
                  "No hassle of finding the right people, we have a job board dedicated to startups.",
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: Globe,
                title: "Incubators",
                description:
                  "Access to incubators and accelerators to help you grow your startup.",
                color: "from-purple-500 to-violet-500",
              },
              {
                icon: Award,
                title: "Growth Analytics",
                description:
                  "Track your progress with detailed analytics and actionable insights.",
                color: "from-indigo-500 to-blue-500",
              },
              {
                icon: Sparkles,
                title: "AI Mentor",
                description:
                  "Get personalized guidance, resources, and answers from Nova, your AI startup mentor—right inside your dashboard.",
                color: "from-blue-500 to-indigo-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
              >
                <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 border-0 shadow-lg group-hover:bg-white dark:group-hover:bg-slate-900">
                  <CardHeader>
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
              📈 Proven Results
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Numbers That{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Speak Growth
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              
              {
                number: "25+",
                label: "Startups Launched",
                icon: TrendingUp,
              },
              { number: "150+", label: "Active Investors", icon: Users },
              { number: "10+", label: "Incubators", icon: Globe },
              { number: "95%", label: "Success Rate", icon: Star },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer transform transition-all duration-500 hover:scale-110"
              >
                <Card className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:from-blue-50 group-hover:to-indigo-50 dark:group-hover:from-slate-700 dark:group-hover:to-slate-800">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300">
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {stat.number}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 font-medium">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section
        id="platform"
        className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
              🚀 Explore Our Platform
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Everything You Need in{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                One Platform
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Discover opportunities, find talent, and access valuable resources
              all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Briefcase,
                title: "Job Board",
                description:
                  "Find your next career opportunity at innovative startups. From early-stage to unicorns, discover roles that match your passion.",
                features: [
                  "Remote & On-site roles",
                  "Equity packages",
                  "Direct founder contact",
                ],
                color: "from-blue-500 to-cyan-500",
                link: "/dashboard",
              },
              {
                icon: Search,
                title: "Discover Startups",
                description:
                  "Explore the most promising startups across all industries. Get insights into funding rounds, team growth, and market traction.",
                features: ["Funding analytics", "Team insights", "Market data"],
                color: "from-green-500 to-emerald-500",
                link: "/startups",
              },
              {
                icon: BookOpen,
                title: "Resources",
                description:
                  "Access comprehensive guides, templates, and tools to accelerate your startup journey from ideation to scaling.",
                features: [
                  "Startup playbooks",
                  "Legal templates",
                  "Growth strategies",
                ],
                color: "from-purple-500 to-violet-500",
                link: "/dashboard",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group cursor-pointer transform transition-all duration-500 hover:scale-105"
                onClick={() => router.push(feature.link)}
              >
                <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:bg-white dark:group-hover:bg-slate-900">
                  <CardHeader>
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-4">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-base">
                      {feature.description}
                    </CardDescription>
                    <ul className="space-y-2 mb-6">
                      {feature.features.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-slate-600 dark:text-slate-300"
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 md:p-16 shadow-2xl transform hover:scale-105 transition-all duration-500">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your{" "}
              <span className="text-yellow-300">Startup Dream?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Be a part of the community that is helping startups grow and succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
            </div>
            <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Free to start
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                No hidden fees
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
                Empowering the next generation of entrepreneurs to build, scale, and succeed.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://linkedin.com/company/startupgram" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:aistudio.team.co@gmail.com"
                  className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Mail className="w-5 h-5" />
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
                <button
                  onClick={() => router.push('/privacy')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => router.push('/terms')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Terms of Service
                </button>
                <button
                  onClick={() => router.push('/cookies')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cookie Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 