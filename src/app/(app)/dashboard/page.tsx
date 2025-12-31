
"use client";

import DashboardStats from "@/components/dashboard/dashboard-stats";
import ProfitLossChart from "@/components/dashboard/profit-loss-chart";
import RecentTransactions from "@/components/dashboard/recent-transactions";
import { DashboardFilterProvider } from '@/contexts/dashboard-filter-provider';
import { DatePicker } from '@/components/dashboard/date-picker';
import React from "react";

function DashboardContent(): React.ReactElement {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <DatePicker />
      </div>
      
      <DashboardStats />
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfitLossChart />
        </div>
        <div>
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <DashboardFilterProvider>
      <DashboardContent />
    </DashboardFilterProvider>
  )
}
