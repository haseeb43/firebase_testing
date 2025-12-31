export type CompanySettings = {
  companyName: string;
  logoUrl: string;
  kennitala: string;
  vatNumber: string;
  address: string;
  city: string;
  postalCode: string;
  bank: string;
  branch: string;
  accountNumber: string;
  vatRate: number;
  nextInvoiceNumber: number;
  lastInvoiceYear: number;
};

export type Transaction = {
  id?: string;
  date: Date;
  description: string;
  category: string;
  amount: number;
  type: 'sale' | 'expense';
  vatRate: number;
  paymentMethod: 'cash' | 'card' | 'bank';
};

export type Invoice = {
  id?: string;
  invoiceNumber: string;
  clientName: string;
  clientAddress: string;
  clientKennitala: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  status: 'paid' | 'unpaid' | 'overdue';
  total: number;
  subtotal: number;
  vatAmount: number;
};

export type InvoiceItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
};

export type Language = 'en' | 'is' | 'es' | 'pl';

export type Translations = {
  [key: string]: string;
};

export type Locale = {
  [key in Language]: Translations;
};

export type Role = 'super_admin' | 'admin' | 'editor' | 'viewer' | 'reporting';
export type Plan = 'free' | 'pro' | 'enterprise';

export type AppUser = {
  id: string;
  email: string | null;
  kennitala?: string;
  accessAllowed: boolean;
  roles: Role[];
  plan: Plan;
  createdAt: Date;
};

export type ActivityLog = {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  timestamp: Date;
  details: Record<string, any>;
};
