'use client';

import AppHeader from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useAppUser, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isUserLoading } = useUser();
  const { appUser, isLoading: isAppUserLoading } = useAppUser();
  const router = useRouter();

  useEffect(() => {
    const isLoading = isUserLoading || isAppUserLoading;
    if (isLoading) {
      return; // Wait until all user data is loaded
    }

    if (!user) {
      router.push('/login'); // If no user, send to login
      return;
    }

    // An admin should not be in the regular app section.
    // If they land here, redirect them to the admin dashboard.
    const isAdmin = appUser?.roles?.includes('admin') || appUser?.roles?.includes('super_admin');
    if (isAdmin) {
      router.push('/admin/users');
      return;
    }
  }, [user, appUser, isUserLoading, isAppUserLoading, router]);

  const isLoading = isUserLoading || isAppUserLoading;
  const isAuthorized =
    user &&
    appUser &&
    !(appUser?.roles || []).some((role) => ['admin', 'super_admin'].includes(role));

  // Prevent rendering children if loading or if we are still determining authorization.
  // This shows a loading screen while checks are in progress.
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Only render children if the user is a confirmed, non-admin user.
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
