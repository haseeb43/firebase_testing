
"use client";

import CreateInvoiceForm from "@/components/invoices/create-invoice-form";
import { useI18n } from "@/hooks/use-i18n";

export default function NewInvoicePage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('create_invoice')}</h2>
        <p className="text-muted-foreground">{t('create_invoice_description')}</p>
      </div>
      <CreateInvoiceForm />
    </div>
  );
}
