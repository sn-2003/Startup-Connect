"use client";

import { ArrowLeft, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
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
              Privacy Policy
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

            {/* Privacy Policy Content */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Privacy Policy
              </h2>
              
              <p className="text-slate-600 dark:text-slate-300">
                At StartupGram, we are committed to protecting your privacy and ensuring the security of your personal information.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                1. Information We Collect
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                We collect information you provide directly to us, such as when you create an account, submit a job application, or contact us for support.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                2. How We Use Your Information
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                We use the information we collect to provide, maintain, and improve our services, communicate with you, and ensure the security of our platform.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                3. Information Sharing
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                4. Data Security
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                5. Your Rights
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                You have the right to access, update, or delete your personal information. You can also opt out of certain communications from us.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                6. Cookies and Tracking
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                We use cookies and similar technologies to enhance your experience on our platform. You can control cookie settings through your browser.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                7. Changes to This Policy
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                8. Contact Us
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                If you have any questions about this privacy policy, please contact us at{" "}
                <a 
                  href="mailto:aistudio.team.co@gmail.com" 
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  aistudio.team.co@gmail.com
                </a>
              </p>

              {/* External Privacy Policy Link */}
              <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Complete Privacy Policy
                </h4>
                <p className="text-blue-800 dark:text-blue-200 mb-4">
                  For our complete and detailed privacy policy, please visit our external privacy policy page.
                </p>
                <Button
                  onClick={() => window.open('https://www.privacypolicies.com/live/d7d09eed-b0a3-4927-bbc9-2a6d67072306', '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  View Complete Privacy Policy
                  <ExternalLink className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 