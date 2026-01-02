import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
// Only import StatusBar on client side with types
import { I18nProvider } from '@/contexts/i18n-provider';
import { InvoicesProvider } from '@/contexts/invoices-provider';
import { SettingsProvider } from '@/contexts/settings-provider';
import { TransactionsProvider } from '@/contexts/transactions-provider';
import { AppUserProvider, FirebaseClientProvider } from '@/firebase';
import { cn } from '@/lib/utils';
import type { StatusBarPlugin, Style as StatusBarStyle } from '@capacitor/status-bar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
let StatusBar: StatusBarPlugin | undefined;
let Style: typeof StatusBarStyle | undefined;
if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const statusBarModule = require('@capacitor/status-bar');
  StatusBar = statusBarModule.StatusBar;
  Style = statusBarModule.Style;
}

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'bókhald',
  description: 'Modern Bookkeeping for Iceland',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Set up Capacitor StatusBar on client side
  useEffect(() => {
    if (StatusBar && Style) {
      StatusBar.setOverlaysWebView({ overlay: true });
      StatusBar.setStyle({ style: Style.Dark }); // or Style.Light
    }
  }, []);
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased', inter.className)}>
        <FirebaseClientProvider>
          <SettingsProvider>
            <AppUserProvider>
              <I18nProvider>
                <TransactionsProvider>
                  <InvoicesProvider>
                    {children}
                    <Toaster />
                  </InvoicesProvider>
                </TransactionsProvider>
              </I18nProvider>
            </AppUserProvider>
          </SettingsProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
