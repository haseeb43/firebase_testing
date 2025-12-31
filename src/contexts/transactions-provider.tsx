'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { WithId } from '@/firebase/firestore/use-collection';
import {
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import type { Transaction } from '@/lib/types';
import { collection, doc, Timestamp } from 'firebase/firestore';
import React, { createContext, useCallback, useMemo } from 'react';

interface TransactionsContextType {
  transactions: WithId<Transaction>[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateTransaction: (updatedTransaction: WithId<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  isLoading: boolean;
}

export const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

type FirestoreTransaction = Omit<Transaction, 'date'> & { date: Timestamp };

export function TransactionsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();

  const transactionsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/entries`);
  }, [user, firestore]);

  const { data, isLoading } = useCollection<FirestoreTransaction>(transactionsQuery);

  const transactions = useMemo(() => {
    if (!data) return [];
    return data
      .map((t) => ({
        ...t,
        date: t.date.toDate(),
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [data]);

  const addTransaction = useCallback(
    (transaction: Omit<Transaction, 'id' | 'date'>) => {
      if (!transactionsQuery) return;
      const newTransaction: Omit<Transaction, 'id'> = {
        ...transaction,
        date: new Date(),
      };
      addDocumentNonBlocking(transactionsQuery, newTransaction);
    },
    [transactionsQuery]
  );

  const updateTransaction = useCallback(
    (updatedTransaction: WithId<Transaction>) => {
      if (!user || !firestore) return;
      const { id, ...data } = updatedTransaction;
      const docRef = doc(firestore, `users/${user.uid}/entries`, id);
      updateDocumentNonBlocking(docRef, {
        ...data,
        date: new Date(data.date), // Ensure date is a JS Date
      });
    },
    [user, firestore]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      if (!user || !firestore) return;
      const docRef = doc(firestore, `users/${user.uid}/entries`, id);
      deleteDocumentNonBlocking(docRef);
    },
    [user, firestore]
  );

  const value = useMemo(
    () => ({
      transactions: transactions || [],
      addTransaction,
      updateTransaction,
      deleteTransaction,
      isLoading,
    }),
    [transactions, addTransaction, updateTransaction, deleteTransaction, isLoading]
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}
