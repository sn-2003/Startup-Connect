"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
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
              Terms and Conditions
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

            {/* Terms Content */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Terms and Conditions
              </h2>
              
              <p className="text-slate-600 dark:text-slate-300">
                Welcome to StartupGram, the comprehensive platform connecting startups, investors, and talent. These Terms and Conditions govern your use of our platform and services.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                1. Acceptance of Terms
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                By accessing and using StartupGram, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our platform. These terms apply to all users of the platform, including startups, investors, job seekers, and other participants.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                2. Platform Services
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                StartupGram provides the following services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Startup discovery and networking platform</li>
                <li>Job board for startup employment opportunities</li>
                <li>Investor networking and startup funding connections</li>
                <li>Incubator and accelerator program access</li>
                <li>AI mentor (Nova) for startup guidance</li>
                <li>Resource library and educational content</li>
                <li>Resume management and application tracking</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                3. User Accounts and Registration
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                To access certain features of StartupGram, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and update your account information</li>
                <li>Keep your account credentials secure and confidential</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                4. User Conduct and Responsibilities
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Post false, misleading, or fraudulent information</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use automated tools to scrape or collect data</li>
                <li>Interfere with the proper functioning of the platform</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                5. Startup and Job Posting Guidelines
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                When posting startup information or job opportunities:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Provide accurate and truthful information about your startup</li>
                <li>Ensure job postings comply with applicable employment laws</li>
                <li>Respect applicant privacy and handle applications professionally</li>
                <li>Do not discriminate based on protected characteristics</li>
                <li>Maintain confidentiality of sensitive business information</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                6. Investment and Financial Information
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                StartupGram facilitates connections between startups and investors but does not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Provide investment advice or financial recommendations</li>
                <li>Guarantee investment returns or startup success</li>
                <li>Act as a broker, dealer, or investment advisor</li>
                <li>Verify the accuracy of financial information shared by users</li>
              </ul>
              <p className="text-slate-600 dark:text-slate-300 mt-4">
                Users are responsible for conducting their own due diligence and seeking professional advice when making investment decisions.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                7. AI Mentor Service
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Our AI mentor (Nova) provides guidance and resources but:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Does not constitute professional legal, financial, or business advice</li>
                <li>Should not be the sole basis for business decisions</li>
                <li>May not be accurate or suitable for all situations</li>
                <li>Should be used in conjunction with professional consultation</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                8. Privacy and Data Protection
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using StartupGram, you consent to our collection and use of information as described in our Privacy Policy.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                9. Intellectual Property
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                StartupGram and its content are protected by intellectual property laws. You retain ownership of content you submit, but grant us a license to use, display, and distribute it on our platform. You may not use our trademarks, logos, or content without our written permission.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                10. Disclaimers and Limitations
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                StartupGram is provided "as is" without warranties of any kind. We are not liable for:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-300 ml-4">
                <li>Loss of data, profits, or business opportunities</li>
                <li>Damages resulting from user interactions or transactions</li>
                <li>Accuracy of information provided by other users</li>
                <li>Success or failure of business relationships formed through the platform</li>
                <li>Technical issues or service interruptions</li>
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                11. Termination
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                We may terminate or suspend your account at any time for violation of these terms. You may also terminate your account at any time. Upon termination, your right to use the platform ceases immediately.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                12. Modifications to Terms
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or platform notification. Continued use of the platform after changes constitutes acceptance of the new terms.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                13. Governing Law and Disputes
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                These Terms are governed by the laws of India. Any disputes will be resolved through binding arbitration in Jaipur, Rajasthan, India. You agree to waive any right to a jury trial or class action lawsuit.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                14. Contact Information
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                For questions about these Terms, please contact us at{" "}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 