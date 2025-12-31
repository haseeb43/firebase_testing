
"use client";

import { TransactionsContext } from '@/contexts/transactions-provider';
import { useContext } from 'react';

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};
