
"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import InvoicesTable from "@/components/invoices/invoices-table";
import { useI18n } from "@/hooks/use-i18n";
import Link from "next/link";

export default function InvoicesPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('manage_invoices')}</h2>
          <p className="text-muted-foreground">
            {t('manage_invoices_description')}
          </p>
        </div>
        <Button asChild>
          <Link href="/invoices/new">
            <PlusCircle className="mr-2 h-4 w-4" /> {t('create_invoice')}
          </Link>
        </Button>
      </div>
      <InvoicesTable />
    </div>
  );
}
