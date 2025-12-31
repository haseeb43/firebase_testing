'use client';

import { useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { CompanySettings } from '@/lib/types';
import { doc } from 'firebase/firestore';
import React, { createContext, useCallback, useMemo } from 'react';

interface SettingsContextType {
  settings: CompanySettings;
  setSettings: (settings: CompanySettings) => void;
  isLoading: boolean;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: CompanySettings = {
  companyName: 'bókhald',
  logoUrl: '',
  kennitala: '',
  vatNumber: '',
  address: '',
  city: '',
  postalCode: '',
  bank: '',
  branch: '',
  accountNumber: '',
  vatRate: 24,
  nextInvoiceNumber: 1,
  lastInvoiceYear: new Date().getFullYear(),
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const firestore = useFirestore();

  const settingsDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, `users/${user.uid}/companySettings`, 'default');
  }, [user, firestore]);

  const { data: settingsData, isLoading: isSettingsLoading } =
    useDoc<CompanySettings>(settingsDocRef);

  const settings = useMemo(() => {
    // Ensure lastInvoiceYear has a default value if it's missing from Firestore
    const currentYear = new Date().getFullYear();
    const firestoreSettings = settingsData
      ? { ...settingsData, lastInvoiceYear: settingsData.lastInvoiceYear ?? currentYear }
      : {};
    return { ...defaultSettings, ...firestoreSettings };
  }, [settingsData]);

  const setSettings = useCallback(
    (newSettings: CompanySettings) => {
      if (!settingsDocRef) return;

      const updatedSettings = { ...settings, ...newSettings };

      setDocumentNonBlocking(settingsDocRef, updatedSettings, { merge: true });
    },
    [settingsDocRef, settings]
  );

  const value = useMemo(
    () => ({
      settings,
      setSettings,
      isLoading: isSettingsLoading,
    }),
    [settings, isSettingsLoading, setSettings]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
