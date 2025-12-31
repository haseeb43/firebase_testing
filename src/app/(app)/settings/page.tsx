
"use client";

import SettingsForm from "@/components/settings/settings-form";
import { useI18n } from "@/hooks/use-i18n";

export default function SettingsPage() {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('settings')}</h2>
        <p className="text-muted-foreground">{t('settings_description')}</p>
      </div>
      <SettingsForm />
    </div>
  );
}
