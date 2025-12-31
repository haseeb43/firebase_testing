'use client';

import AppHeader from '@/components/app-header';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { UsersProvider } from '@/contexts/users-provider';
import { useAppUser, useAuth, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isUserLoading } = useUser();
  const { appUser, isLoading: isAppUserLoading } = useAppUser();
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    const isLoading = isUserLoading || isAppUserLoading;
    if (isLoading) {
      return; // Wait until all auth and profile data is loaded
    }

    // Case 1: No Firebase user is logged in at all.
    if (!user) {
      router.replace('/admin-login?error=not_logged_in');
      return;
    }

    // Case 2: Firebase user exists, but their Firestore profile doesn't exist.
    // This can happen for a split second or if creation failed. A non-existent appUser means they cannot be an admin.
    if (!appUser) {
      // Redirect non-admins/invalid users away from the admin section.
      router.replace('/dashboard?error=not_admin');
      return;
    }

    // Case 3: User profile exists, but they do not have an admin or super_admin role.
    const isAuthorizedAdmin =
      appUser.roles?.includes('admin') || appUser.roles?.includes('super_admin');
    if (!isAuthorizedAdmin) {
      router.replace('/dashboard?error=not_admin');
      return;
    }

    // Case 4: User is an admin, but their access has been deactivated.
    if (!appUser.accessAllowed) {
      // Sign out the deactivated admin and redirect them to the landing page with an error.
      auth.signOut();
      router.replace('/?error=deactivated');
      return;
    }
  }, [user, appUser, isUserLoading, isAppUserLoading, router, auth]);

  const isLoading = isUserLoading || isAppUserLoading;
  // This defines the conditions for a fully authorized and active admin.
  const isAuthorized =
    user &&
    appUser &&
    (appUser.roles?.includes('admin') || appUser.roles?.includes('super_admin')) &&
    appUser.accessAllowed;

  // Show a loading screen while we verify permissions.
  // Do not render children until we confirm the user is a fully authorized admin.
  if (isLoading || !isAuthorized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading & Verifying Permissions...</div>
      </div>
    );
  }

  // Only render the layout and children if the user is a confirmed, active admin.
  return (
    <UsersProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <AppHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </UsersProvider>
  );
}
