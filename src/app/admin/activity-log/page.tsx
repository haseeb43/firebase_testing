
'use client';

import ActivityLogTable from '@/components/admin/activity-log-table';
import { useI18n } from '@/hooks/use-i18n';

export default function ActivityLogPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('activity_log')}</h2>
        <p className="text-muted-foreground">{t('activity_log_description')}</p>
      </div>
      <ActivityLogTable />
    </div>
  );
}
