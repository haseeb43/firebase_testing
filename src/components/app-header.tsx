'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/firebase';
import { useI18n } from '@/hooks/use-i18n';
import { Translations } from '@/lib/types';
import { CircleUser, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import LanguageSwitcher from './shared/language-switcher';

const pageTitles: { [key: string]: string } = {
  '/dashboard': 'dashboard',
  '/entries': 'entries',
  '/invoices': 'invoices',
  '/reporting': 'reporting',
  '/settings': 'settings',
};

export default function AppHeader() {
  const pathname = usePathname();
  const { t } = useI18n();
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    auth.signOut();
    router.push('/');
  };

  const getPageTitle = () => {
    const key = Object.keys(pageTitles).find((key) => pathname.startsWith(key));
    return key ? t(pageTitles[key] as keyof Translations) : 'Fjármál Land';
  };

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 sticky top-0 z-30">
      <div className="md:hidden">
        <SidebarTrigger variant="outline" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </SidebarTrigger>
      </div>

      <div className="hidden md:block">
        <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
      </div>

      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4 justify-end">
        <div className="hidden md:block">
          <LanguageSwitcher inHeader={true} />
        </div>
        <div className="md:hidden">
          <LanguageSwitcher isCollapsed inHeader={true} />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUser className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('profile')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">{t('settings')}</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>{t('log_out')}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
