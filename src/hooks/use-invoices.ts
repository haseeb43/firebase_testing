
"use client";

import { InvoicesContext } from '@/contexts/invoices-provider';
import { useContext } from 'react';

export const useInvoices = () => {
  const context = useContext(InvoicesContext);
  if (context === undefined) {
    throw new Error('useInvoices must be used within an InvoicesProvider');
  }
  return context;
};
