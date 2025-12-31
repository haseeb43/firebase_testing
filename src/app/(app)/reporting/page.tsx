
'use client';

import EntriesTable from '@/components/entries/entries-table';
import { useI18n } from '@/hooks/use-i18n';
import { DashboardFilterProvider } from '@/contexts/dashboard-filter-provider';
import { DatePicker } from '@/components/dashboard/date-picker';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

function ReportingContent() {
  const { t } = useI18n();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('reporting')}</h2>
          <p className="text-muted-foreground">{t('reporting_description')}</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <DatePicker />
            <Button onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                {t('print_report')}
            </Button>
        </div>
      </div>
      <EntriesTable />
    </div>
  );
}


export default function ReportingPage() {
    return (
        <DashboardFilterProvider>
            <ReportingContent />
        </DashboardFilterProvider>
    )
}
