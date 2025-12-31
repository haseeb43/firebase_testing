
"use client";

import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import EntriesTable from "@/components/entries/entries-table";
import { useI18n } from "@/hooks/use-i18n";
import { useState } from "react";
import AddEntryDialog from "@/components/entries/add-entry-dialog";
import { DashboardFilterProvider } from "@/contexts/dashboard-filter-provider";
import { DatePicker } from "@/components/dashboard/date-picker";

function EntriesContent() {
  const { t } = useI18n();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('manage_entries')}</h2>
          <p className="text-muted-foreground">
            {t('manage_entries_description')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <DatePicker />
            <Button onClick={() => setIsDialogOpen(true)} className="w-full sm:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" /> {t('add_new_entry')}
            </Button>
        </div>
      </div>
      <EntriesTable />
      <AddEntryDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
}


export default function EntriesPage() {
    return (
        <DashboardFilterProvider>
            <EntriesContent />
        </DashboardFilterProvider>
    )
}
