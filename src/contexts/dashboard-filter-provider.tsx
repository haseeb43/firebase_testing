'use client';

import type { WithId } from '@/firebase';
import { useTransactions } from '@/hooks/use-transactions';
import type { Transaction } from '@/lib/types';
import { isSameDay, isSameMonth, isSameYear } from 'date-fns';
import React, { createContext, useContext, useMemo, useState } from 'react';

export type FilterPeriod = 'day' | 'month' | 'year' | 'all';

interface DashboardFilterContextType {
  period: FilterPeriod;
  setPeriod: (period: FilterPeriod) => void;
  date: Date;
  setDate: (date: Date) => void;
  filteredTransactions: WithId<Transaction>[];
  isLoading: boolean;
}

const DashboardFilterContext = createContext<DashboardFilterContextType | undefined>(undefined);

export function DashboardFilterProvider({ children }: { children: React.ReactNode }) {
  const [period, setPeriod] = useState<FilterPeriod>('all');
  const [date, setDate] = useState<Date>(new Date());
  const { transactions, isLoading } = useTransactions();

  const filteredTransactions = useMemo(() => {
    // If transactions are not yet loaded or are null/undefined, return an empty array.
    // This is the key fix to prevent the PDF generation from failing.
    if (!transactions) return [];

    switch (period) {
      case 'day':
        return transactions.filter((t) => isSameDay(t.date, date));
      case 'month':
        return transactions.filter((t) => isSameMonth(t.date, date));
      case 'year':
        return transactions.filter((t) => isSameYear(t.date, date));
      case 'all':
      default:
        return transactions;
    }
  }, [transactions, period, date]);

  const value = useMemo(
    () => ({
      period,
      setPeriod,
      date,
      setDate,
      filteredTransactions,
      isLoading,
    }),
    [period, date, filteredTransactions, isLoading]
  );

  return (
    <DashboardFilterContext.Provider value={value}>{children}</DashboardFilterContext.Provider>
  );
}

export const useDashboardFilter = () => {
  const context = useContext(DashboardFilterContext);
  if (context === undefined) {
    throw new Error('useDashboardFilter must be used within a DashboardFilterProvider');
  }
  return context;
};
