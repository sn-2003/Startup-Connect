'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/use-auth';
import { SessionProvider } from 'next-auth/react';
import Script from 'next/script';
import FloatableAiNova from '@/components/ui/floatable-ai-nova';
import { usePathname } from 'next/navigation';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { CoinNotificationProvider } from '@/components/providers/coin-notification-provider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showMobileNav = !pathname.startsWith('/hackathon');
  
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
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
            <CoinNotificationProvider>
              {children}
              <FloatableAiNova />
              {showMobileNav && <MobileBottomNav />}
            </CoinNotificationProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
