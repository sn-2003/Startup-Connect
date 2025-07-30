'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/use-auth';
import { SessionProvider } from 'next-auth/react';
import Script from 'next/script';
import FloatableAiNova from '@/components/ui/floatable-ai-nova';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-B3WWJWVEYT"
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-B3WWJWVEYT');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <AuthProvider>
            {children}
            <FloatableAiNova />
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}