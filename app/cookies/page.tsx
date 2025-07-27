"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CookiesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Cookie Policy
            </h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 md:p-12">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {/* Last Updated */}
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-8 pb-4 border-b border-slate-200 dark:border-slate-700">
              Last updated: January 2025
            </div>

            {/* Cookie Policy Content */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Cookie Policy
              </h2>
              
              <p className="text-slate-600 dark:text-slate-300">
                This Cookie Policy explains how StartupGram uses cookies and similar technologies to recognize you when you visit our platform and how we use this information to provide you with a better experience.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                1. What Are Cookies
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They help websites remember information about your visit, such as your preferred language and other settings, which can make your next visit easier and the site more useful to you.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                2. How We Use Cookies
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                StartupGram uses cookies to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Remember your login status and preferences</li>
                <li>Provide personalized content and recommendations</li>
                <li>Analyze how our platform is used to improve user experience</li>
                <li>Ensure the security of your account</li>
                <li>Enable certain features like the AI mentor chat</li>
                <li>Track job applications and startup interactions</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                3. Types of Cookies We Use
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white">
                    Essential Cookies
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    These cookies are necessary for the platform to function properly. They enable core functionality such as security, network management, and accessibility. You may disable these by changing your browser settings, but this may affect how the platform functions.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4 mt-2">
                    <li>Authentication cookies (login sessions)</li>
                    <li>Security cookies (CSRF protection)</li>
                    <li>Session management cookies</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white">
                    Performance Cookies
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    These cookies help us understand how visitors interact with our platform by collecting and reporting information anonymously. This helps us improve our platform's performance and user experience.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4 mt-2">
                    <li>Analytics cookies (Google Analytics)</li>
                    <li>Error tracking cookies</li>
                    <li>Performance monitoring cookies</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white">
                    Functional Cookies
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    These cookies enable enhanced functionality and personalization, such as remembering your preferences, language settings, and providing personalized content like job recommendations and startup suggestions.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4 mt-2">
                    <li>Preference cookies (language, theme)</li>
                    <li>Personalization cookies (job recommendations)</li>
                    <li>AI mentor interaction cookies</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-slate-900 dark:text-white">
                    Marketing Cookies
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    These cookies are used to track visitors across websites to display relevant and engaging advertisements for our users.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 ml-4 mt-2">
                    <li>Advertising cookies</li>
                    <li>Social media integration cookies</li>
                    <li>Retargeting cookies</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                4. Third-Party Cookies
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                We may use third-party services that set cookies on our platform:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li><strong>Google Analytics:</strong> To analyze platform usage and improve user experience</li>
                <li><strong>Supabase:</strong> For authentication and database management</li>
                <li><strong>NextAuth.js:</strong> For secure user authentication</li>
                <li><strong>Social Media Platforms:</strong> For sharing and integration features</li>
                <li><strong>Payment Processors:</strong> For any future payment features</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                5. Cookie Duration
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Cookies on our platform may be:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
                <li><strong>Persistent Cookies:</strong> Cookies that remain on your device for a set period or until manually deleted</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                6. Managing Your Cookie Preferences
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li><strong>Browser Settings:</strong> Most browsers allow you to refuse cookies or delete them</li>
                <li><strong>Platform Settings:</strong> You can adjust certain preferences within your StartupGram account</li>
                <li><strong>Third-Party Opt-outs:</strong> Use opt-out tools provided by third-party services</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                7. Specific Platform Features
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Our platform uses cookies for specific features:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li><strong>AI Mentor (Nova):</strong> Cookies help remember your conversation history and preferences</li>
                <li><strong>Job Applications:</strong> Track application status and save preferences</li>
                <li><strong>Startup Discovery:</strong> Remember your search preferences and favorite startups</li>
                <li><strong>Resume Management:</strong> Store your resume upload preferences and settings</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                8. Mobile Applications
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                If you access StartupGram through a mobile application, similar technologies may be used to collect information about your device and usage patterns. These technologies serve similar purposes to cookies and are governed by this policy.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                9. Updates to This Policy
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on our platform and updating the "Last updated" date.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                10. Your Rights
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Depending on your location, you may have certain rights regarding cookies and similar technologies, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>The right to be informed about our use of cookies</li>
                <li>The right to opt out of non-essential cookies</li>
                <li>The right to access and control your personal data</li>
                <li>The right to delete cookies from your device</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                11. Contact Us
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at{" "}
                <a 
                  href="mailto:aistudio.team.co@gmail.com" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  aistudio.team.co@gmail.com
                </a>
                {" "}or call us at{" "}
                <a 
                  href="tel:+917999121826" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  +91 7999121826
                </a>
              </p>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Last Updated:</strong> January 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 