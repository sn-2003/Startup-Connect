import React from 'react';

interface CookiesContentProps {
  className?: string;
}

export default function CookiesContent({ className = "" }: CookiesContentProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* 
        REPLACE THIS SECTION WITH YOUR ACTUAL COOKIE POLICY HTML CONTENT
        You can paste your HTML content here and it will be properly styled
      */}
      
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        Cookie Policy
      </h2>
      
      <p className="text-slate-600 dark:text-slate-300">
        This Cookie Policy explains how StartupGram uses cookies and similar technologies to recognize you when you visit our website.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        1. What Are Cookies
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        2. How We Use Cookies
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        We use cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        3. Types of Cookies We Use
      </h3>
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-medium text-slate-900 dark:text-white">
            Essential Cookies
          </h4>
          <p className="text-slate-600 dark:text-slate-300">
            These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-medium text-slate-900 dark:text-white">
            Performance Cookies
          </h4>
          <p className="text-slate-600 dark:text-slate-300">
            These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular.
          </p>
        </div>
        <div>
          <h4 className="text-lg font-medium text-slate-900 dark:text-white">
            Functional Cookies
          </h4>
          <p className="text-slate-600 dark:text-slate-300">
            These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
          </p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        4. Third-Party Cookies
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website, deliver advertisements on and through the website, and so on.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        5. Managing Cookies
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        6. Browser Settings
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        Most web browsers allow you to manage cookies through their settings preferences. To learn more about how to manage cookies, visit allaboutcookies.org.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        7. Updates to This Policy
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons.
      </p>

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
        8. Contact Us
      </h3>
      <p className="text-slate-600 dark:text-slate-300">
        If you have any questions about our use of cookies, please contact us at{" "}
        <a 
          href="mailto:aistudio.team.co@gmail.com" 
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          aistudio.team.co@gmail.com
        </a>
      </p>

      {/* 
        INSTRUCTIONS FOR REPLACING CONTENT:
        1. Replace all the content above with your actual Cookie Policy HTML
        2. Keep the className structure for proper styling
        3. Use the same heading structure (h2, h3, h4) for consistency
        4. Use the same text color classes for proper dark mode support
      */}
    </div>
  );
} 