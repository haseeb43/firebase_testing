'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { WithId } from '@/firebase/firestore/use-collection';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { AppUser } from '@/lib/types';
import { collection, doc, Timestamp } from 'firebase/firestore';
import React, { createContext, useCallback, useMemo } from 'react';

// Since the flows are removed, we remove the imports
// import { createUser } from '@/ai/flows/create-user-flow';
// import { deleteUser as deleteUserFlow } from '@/ai/flows/delete-user-flow';

interface UsersContextType {
  users: WithId<AppUser>[];
  updateUser: (userId: string, data: Partial<AppUser>) => void;
  // deleteUser: (userId: string) => Promise<void>;
  // addUser: (email: string, password: string, kennitala: string) => Promise<void>;
  isLoading: boolean;
}

export const UsersContext = createContext<UsersContextType | undefined>(undefined);

// The type coming from Firestore will have a Timestamp for createdAt
type FirestoreAppUser = Omit<AppUser, 'createdAt'> & {
  createdAt?: Timestamp;
};

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const firestore = useFirestore();
  const { user } = useUser();

  const usersQuery = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users');
  }, [firestore, user]);

  const { data: firestoreUsers, isLoading } = useCollection<FirestoreAppUser>(usersQuery);

  const users = useMemo(() => {
    if (!firestoreUsers) return [];
    return firestoreUsers.map((user) => ({
      ...user,
      createdAt: user.createdAt ? user.createdAt.toDate() : new Date(), // Convert timestamp to Date
    }));
  }, [firestoreUsers]);

  const updateUser = useCallback(
    (userId: string, userData: Partial<AppUser>) => {
      if (!firestore) return;
      const userDocRef = doc(firestore, 'users', userId);
      updateDocumentNonBlocking(userDocRef, userData);
    },
    [firestore]
  );

  // The server-side flows are removed, so we remove these functions.
  // User creation is handled client-side. Deletion can be re-implemented if needed.
  /*
  const deleteUser = useCallback(async (userId: string) => {
    try {
        await deleteUserFlow({ uid: userId });
    } catch(error) {
        console.error("Error deleting user:", error);
        throw error;
    }
  }, []);

  const addUser = useCallback(async (email: string, password: string, kennitala: string) => {
    try {
      await createUser({ email, password, kennitala });
    } catch (error) {
      console.error("Error creating user:", error);
      throw error; 
    }
  }, []);
  */

  const value = useMemo(
    () => ({
      users,
      updateUser,
      // deleteUser,
      // addUser,
      isLoading,
    }),
    [users, updateUser, /*deleteUser, addUser,*/ isLoading]
  );

  return <UsersContext.Provider value={value}>{children}</UsersContext.Provider>;
}
