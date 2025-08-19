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
  Briefcase,
  Users,
  Heart,
  Zap,
  Globe,
  Clock,
  MapPin,
  DollarSign,
  Star,
  CheckCircle,
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  Rocket,
  Target,
  Award,
  Lightbulb,
  Shield,
} from "lucide-react";

export default function CareersPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
    
    // Check if user is authenticated
    const hasSessionCookie = document.cookie.includes('next-auth.session-token') || 
                            document.cookie.includes('__Secure-next-auth.session-token');
    setIsAuthenticated(hasSessionCookie);
  }, []);

  const handleGoBack = () => {
    const hasSessionCookie = document.cookie.includes('next-auth.session-token') || 
                            document.cookie.includes('__Secure-next-auth.session-token');
    
    if (hasSessionCookie) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  const handleApply = (position: string) => {
    window.open(`mailto:aistudio.team.co@gmail.com?subject=Application for ${position} position at StartupGram`, '_blank');
  };

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
              <span>{isAuthenticated ? "Back to Dashboard" : "Back to Landing"}</span>
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
              🚀 Join Our Team
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              Build the Future of{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Startup
              </span>{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Innovation
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              {sanitizeText("Join our mission to democratize startup success. We're looking for passionate individuals who want to make a real impact in the startup ecosystem.")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                View Open Positions
                <Briefcase className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => document.getElementById('culture')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-lg px-8 py-4 border-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
              >
                Our Culture
                <Heart className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section id="culture" className="py-20 px-4 bg-white/50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700 border-green-200">
              💎 Our Culture
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Why Work at{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                StartupGram?
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              {sanitizeText("We believe in creating an environment where innovation thrives, collaboration flourishes, and every team member can make a meaningful impact.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Rocket,
                title: "Innovation First",
                description: "We encourage creative thinking and bold ideas. Every team member has the opportunity to shape our product and company direction.",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Remote-First Culture",
                description: "Work from anywhere in the world. We believe in flexibility and trust our team to deliver exceptional results.",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Heart,
                title: "Work-Life Balance",
                description: "We understand that great work comes from happy, well-rested people. Flexible hours and unlimited PTO.",
                color: "from-rose-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Fast-Paced Growth",
                description: "Join a rapidly growing startup where you can wear multiple hats and accelerate your career development.",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Shield,
                title: "Transparent Culture",
                description: "Open communication, regular all-hands meetings, and complete transparency about company goals and challenges.",
                color: "from-purple-500 to-violet-500"
              },
              {
                icon: Award,
                title: "Competitive Benefits",
                description: "Competitive salary, equity options, health insurance, and continuous learning opportunities.",
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
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
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

      {/* Open Positions Section */}
      <section id="open-positions" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
              🎯 Open Positions
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Join Our{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Growing Team
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              {sanitizeText("We're always looking for talented individuals who are passionate about startups and technology. Check out our current openings below.")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[
              {
                title: "Senior Full-Stack Developer",
                type: "Full-time",
                location: "Remote",
                salary: "Negotiable",
                experience: "3+ years",
                description: "Join our core development team to build and scale our platform. You'll work on cutting-edge technologies and have a direct impact on our product roadmap.",
                requirements: [
                  "Strong experience with React, Next.js, and TypeScript",
                  "Proficiency in Node.js and database design",
                  "Experience with cloud platforms (AWS/Azure/GCP)",
                  "Excellent problem-solving and communication skills",
                  "Passion for startups and entrepreneurship"
                ],
                benefits: [
                  "Competitive salary and equity",
                  "Remote-first culture",
                  "Flexible working hours",
                  "Professional development budget",
                  "Health insurance"
                ]
              },
              {
                title: "Product Manager",
                type: "Full-time",
                location: "Remote",
                salary: "Negotiable",
                experience: "2+ years",
                description: "Drive product strategy and execution for our startup platform. Work closely with founders, developers, and users to build features that matter.",
                requirements: [
                  "Experience in B2B SaaS or startup ecosystem",
                  "Strong analytical and user research skills",
                  "Excellent communication and stakeholder management",
                  "Data-driven decision making",
                  "Understanding of startup challenges and needs"
                ],
                benefits: [
                  "Competitive salary and equity",
                  "Remote-first culture",
                  "Flexible working hours",
                  "Professional development budget",
                  "Health insurance"
                ]
              },
              {
                title: "Marketing Specialist",
                type: "Full-time",
                location: "Remote",
                salary: "Negotiable",
                experience: "1+ years",
                description: "Help us grow our community and reach more startups and investors. Create compelling content and execute marketing campaigns.",
                requirements: [
                  "Experience in digital marketing and content creation",
                  "Knowledge of startup ecosystem and B2B marketing",
                  "Proficiency in social media and email marketing",
                  "Creative thinking and analytical skills",
                  "Passion for helping startups succeed"
                ],
                benefits: [
                  "Competitive salary and equity",
                  "Remote-first culture",
                  "Flexible working hours",
                  "Professional development budget",
                  "Health insurance"
                ]
              },
              {
                title: "Customer Success Manager",
                type: "Full-time",
                location: "Remote",
                salary: "Negotiable",
                experience: "1+ years",
                description: "Ensure our users get the most value from our platform. Build relationships with startups and help them achieve their goals.",
                requirements: [
                  "Experience in customer success or account management",
                  "Excellent communication and relationship-building skills",
                  "Understanding of startup challenges and needs",
                  "Data analysis and reporting skills",
                  "Empathy and problem-solving mindset"
                ],
                benefits: [
                  "Competitive salary and equity",
                  "Remote-first culture",
                  "Flexible working hours",
                  "Professional development budget",
                  "Health insurance"
                ]
              }
            ].map((position, index) => (
              <div key={index} className="group cursor-pointer transform transition-all duration-500 hover:scale-105">
                <Card className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:bg-white dark:group-hover:bg-slate-900">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {sanitizeText(position.title)}
                        </CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {position.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {position.location}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {position.experience}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {position.salary}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                      {sanitizeText(position.description)}
                    </CardDescription>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Requirements:</h4>
                      <ul className="space-y-2">
                        {position.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              {sanitizeText(req)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-slate-900 dark:text-white mb-3">Benefits:</h4>
                      <ul className="space-y-2">
                        {position.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              {sanitizeText(benefit)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => handleApply(position.title)}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      Apply Now
                      <Mail className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 md:p-16 shadow-2xl transform hover:scale-105 transition-all duration-500">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Don't See the Right{" "}
              <span className="text-yellow-300">Fit?</span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {sanitizeText("We're always looking for talented individuals who are passionate about startups and innovation. Send us your resume and let's start a conversation!")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => handleApply("General Position")}
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Send Your Resume
                <Mail className="ml-2 w-5 h-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/about")}
                className="border-2 border-white text-black hover:bg-white/10 text-lg px-8 py-4 transition-all duration-300"
              >
                Learn More About Us
                <ArrowLeft className="ml-2 w-5 h-5 rotate-180" />
              </Button>
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