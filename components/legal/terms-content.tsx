import React from 'react';

interface TermsContentProps {
  className?: string;
}

export default function TermsContent({ className = "" }: TermsContentProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* 
        REPLACE THIS SECTION WITH YOUR ACTUAL TERMS AND CONDITIONS HTML CONTENT
        You can paste your HTML content here and it will be properly styled
      */}
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        Terms and Conditions
      </h2>
      
      <p className="text-slate-600 dark:text-slate-300">
        Welcome to StartupGram. These Terms and Conditions govern your use of our platform and services.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        1. Acceptance of Terms
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        By accessing and using StartupGram, you accept and agree to be bound by the terms and provision of this agreement.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        2. Use License
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        Permission is granted to temporarily download one copy of the materials (information or software) on StartupGram's website for personal, non-commercial transitory viewing only.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        3. Disclaimer
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        The materials on StartupGram's website are provided on an 'as is' basis. StartupGram makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        4. Limitations
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        In no event shall StartupGram or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on StartupGram's website.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        5. Accuracy of Materials
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        The materials appearing on StartupGram's website could include technical, typographical, or photographic errors. StartupGram does not warrant that any of the materials on its website are accurate, complete or current.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        6. Links
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        StartupGram has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by StartupGram of the site.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        7. Modifications
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        StartupGram may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        8. Governing Law
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
      </p>

      {/* 
        INSTRUCTIONS FOR REPLACING CONTENT:
        1. Replace all the content above with your actual Terms and Conditions HTML
        2. Keep the className structure for proper styling
        3. Use the same heading structure (h2, h3) for consistency
        4. Use the same text color classes for proper dark mode support
      */}
    </div>
  );
} 