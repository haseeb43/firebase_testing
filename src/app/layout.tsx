import { Toaster } from '@/components/ui/toaster';
import { I18nProvider } from '@/contexts/i18n-provider';
import { InvoicesProvider } from '@/contexts/invoices-provider';
import { SettingsProvider } from '@/contexts/settings-provider';
import { TransactionsProvider } from '@/contexts/transactions-provider';
import { AppUserProvider, FirebaseClientProvider } from '@/firebase';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
  // ...existing code...
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
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
