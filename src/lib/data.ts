import type { Transaction, Invoice } from './types';

export const mockTransactions: Omit<Transaction, 'id' | 'date' | 'vatRate'>[] = [];

export const mockInvoices: Invoice[] = [];
