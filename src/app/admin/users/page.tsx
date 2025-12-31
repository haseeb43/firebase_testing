
'use client';

import { useI18n } from '@/hooks/use-i18n';
import UsersTable from '@/components/admin/users-table';

export default function UserManagementPage() {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('user_management')}</h2>
          <p className="text-muted-foreground">{t('user_management_description')}</p>
        </div>
      </div>
      <UsersTable />
    </div>
  );
}
