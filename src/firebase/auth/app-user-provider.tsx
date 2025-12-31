
'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { doc } from 'firebase/firestore';
import type { AppUser } from '@/lib/types';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import type { WithId } from '@/firebase/firestore/use-collection';

interface AppUserContextType {
  appUser: WithId<AppUser> | null;
  isLoading: boolean;
}

const AppUserContext = createContext<AppUserContextType | undefined>(undefined);

export function AppUserProvider({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: appUser, isLoading: isAppUserLoading } = useDoc<AppUser>(userDocRef);

  const value = useMemo(() => ({
    appUser,
    isLoading: isUserLoading || isAppUserLoading,
  }), [appUser, isUserLoading, isAppUserLoading]);

  return (
    <AppUserContext.Provider value={value}>
      {children}
    </AppUserContext.Provider>
  );
}

export const useAppUser = () => {
  const context = useContext(AppUserContext);
  if (context === undefined) {
    throw new Error('useAppUser must be used within an AppUserProvider');
  }
  return context;
};
