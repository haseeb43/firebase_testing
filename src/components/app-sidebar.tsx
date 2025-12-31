'use client';

import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAppUser } from '@/firebase';
import { useI18n } from '@/hooks/use-i18n';
import { useSettings } from '@/hooks/use-settings';
import {
  BarChart3,
  BookCopy,
  Building2,
  FileText,
  History,
  LayoutDashboard,
  Settings,
  Shield,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './shared/language-switcher';
import { Skeleton } from './ui/skeleton';

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { settings, isLoading } = useSettings();
  const { appUser } = useAppUser();

  const isAdmin = appUser?.roles?.includes('admin') || appUser?.roles?.includes('super_admin');
  const isSuperAdmin = appUser?.roles?.includes('super_admin');
  const canViewReporting = appUser?.roles?.includes('reporting') || isAdmin;

  const regularMenuItems = [
    { href: '/dashboard', label: t('dashboard'), icon: <LayoutDashboard /> },
    { href: '/entries', label: t('entries'), icon: <BookCopy /> },
    { href: '/invoices', label: t('invoices'), icon: <FileText /> },
    ...(canViewReporting
      ? [{ href: '/reporting', label: t('reporting'), icon: <BarChart3 /> }]
      : []),
    { href: '/settings', label: t('settings'), icon: <Settings /> },
  ];

  const adminMenuItems = [
    { href: '/admin/users', label: t('user_management'), icon: <Shield /> },
    ...(isSuperAdmin
      ? [{ href: '/admin/activity-log', label: t('activity_log'), icon: <History /> }]
      : []),
  ];

  const menuItems = isAdmin ? adminMenuItems : regularMenuItems;

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="size-8 rounded-lg" />
          ) : settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt="Company Logo"
              width={32}
              height={32}
              className="size-8 rounded-lg object-contain"
            />
          ) : (
            <div className="flex items-center justify-center size-8 bg-primary rounded-lg text-primary-foreground">
              <Building2 size={20} />
            </div>
          )}
          {isLoading ? (
            <Skeleton className="h-5 w-32" />
          ) : (
            <span className="font-semibold text-lg text-sidebar-foreground truncate">
              {settings.companyName}
            </span>
          )}
        </Link>
      </SidebarHeader>

      <SidebarMenu className="flex-1">
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <span>
                  {item.icon}
                  <span>{item.label}</span>
                </span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>

      <SidebarFooter className="items-center">
        <div className="w-full group-data-[collapsible=icon]:hidden">
          <LanguageSwitcher />
        </div>
        <div className="w-full hidden group-data-[collapsible=icon]:block">
          <LanguageSwitcher isCollapsed />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
