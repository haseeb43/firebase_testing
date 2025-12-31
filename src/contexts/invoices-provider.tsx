'use client';

import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import type { WithId } from '@/firebase/firestore/use-collection';
import {
  addDocumentNonBlocking,
  deleteDocumentNonBlocking,
  updateDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { useSettings } from '@/hooks/use-settings';
import type { Invoice } from '@/lib/types';
import { collection, doc, Timestamp } from 'firebase/firestore';
import React, { createContext, useCallback, useMemo } from 'react';

interface InvoicesContextType {
  invoices: WithId<Invoice>[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => void;
  updateInvoiceStatus: (id: string, status: 'paid' | 'unpaid' | 'overdue') => void;
  deleteInvoice: (id: string) => void;
  isLoading: boolean;
  getInvoiceById: (id: string) => WithId<Invoice> | undefined;
}

export const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined);

type FirestoreInvoice = Omit<Invoice, 'issueDate' | 'dueDate' | 'items'> & {
  issueDate: Timestamp;
  dueDate: Timestamp;
  items: (Omit<Invoice['items'][0], 'id'> & { id?: string })[];
};

export function InvoicesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { settings, setSettings } = useSettings();

  const invoicesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, `users/${user.uid}/invoices`);
  }, [user, firestore]);

  const { data, isLoading } = useCollection<FirestoreInvoice>(invoicesQuery);

  const invoices = useMemo(() => {
    if (!data) return [];
    return data
      .map((inv) => ({
        ...inv,
        issueDate: inv.issueDate.toDate(),
        dueDate: inv.dueDate.toDate(),
        items: inv.items.map((item) => ({ ...item, id: item.id || crypto.randomUUID() })),
      }))
      .sort((a, b) => {
        if (!a.invoiceNumber || !b.invoiceNumber) return 0;
        // Sort by invoice number descending
        const numA = parseInt(a.invoiceNumber.split('-')[1]);
        const yearA = parseInt(a.invoiceNumber.split('-')[0]);
        const numB = parseInt(b.invoiceNumber.split('-')[1]);
        const yearB = parseInt(b.invoiceNumber.split('-')[0]);
        if (yearA !== yearB) return yearB - yearA;
        return numB - numA;
      });
  }, [data]);

  const addInvoice = useCallback(
    (invoice: Omit<Invoice, 'id' | 'invoiceNumber'>) => {
      if (!invoicesQuery || !user) return;

      const issueYear = invoice.issueDate.getFullYear();
      const { nextInvoiceNumber, lastInvoiceYear } = settings;

      let newInvoiceSequenceNumber: number;
      let newLastInvoiceYear: number;

      if (issueYear > lastInvoiceYear) {
        newInvoiceSequenceNumber = 1;
        newLastInvoiceYear = issueYear;
      } else {
        newInvoiceSequenceNumber = nextInvoiceNumber;
        newLastInvoiceYear = lastInvoiceYear;
      }

      const formattedInvoiceNumber = `${issueYear}-${String(newInvoiceSequenceNumber).padStart(
        3,
        '0'
      )}`;

      const newInvoice = {
        ...invoice,
        invoiceNumber: formattedInvoiceNumber,
      };

      addDocumentNonBlocking(invoicesQuery, newInvoice);

      setSettings({
        ...settings,
        nextInvoiceNumber: newInvoiceSequenceNumber + 1,
        lastInvoiceYear: newLastInvoiceYear,
      });
    },
    [invoicesQuery, user, settings, setSettings]
  );

  const updateInvoiceStatus = useCallback(
    (id: string, status: 'paid' | 'unpaid' | 'overdue') => {
      if (!user || !firestore) return;
      const docRef = doc(firestore, `users/${user.uid}/invoices`, id);
      updateDocumentNonBlocking(docRef, { status });
    },
    [user, firestore]
  );

  const deleteInvoice = useCallback(
    (id: string) => {
      if (!user || !firestore) return;
      const docRef = doc(firestore, `users/${user.uid}/invoices`, id);
      deleteDocumentNonBlocking(docRef);
    },
    [user, firestore]
  );

  const getInvoiceById = useCallback(
    (id: string) => {
      return (invoices || []).find((inv) => inv.id === id);
    },
    [invoices]
  );

  const value = useMemo(
    () => ({
      invoices: invoices || [],
      addInvoice,
      updateInvoiceStatus,
      deleteInvoice,
      isLoading,
      getInvoiceById,
    }),
    [invoices, addInvoice, updateInvoiceStatus, deleteInvoice, isLoading, getInvoiceById]
  );

  return <InvoicesContext.Provider value={value}>{children}</InvoicesContext.Provider>;
}
