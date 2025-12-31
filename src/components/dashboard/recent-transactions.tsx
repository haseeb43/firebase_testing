
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { useDashboardFilter } from "@/contexts/dashboard-filter-provider";
import { useMemo } from "react";

export default function RecentTransactions() {
  const { t } = useI18n();
  const { filteredTransactions: transactions } = useDashboardFilter();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('is-IS').format(amount);
  };

  const recentTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);
  }, [transactions]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>{t('recent_transactions')}</CardTitle>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="/entries">
            {t('view_all')}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-6">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center gap-4">
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarFallback className={transaction.type === 'sale' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}>
                {transaction.category.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-1 flex-1">
              <p className="text-sm font-medium leading-none truncate">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">{transaction.category}</p>
            </div>
            <div className={`ml-auto font-medium ${transaction.type === 'sale' ? 'text-green-600' : 'text-red-600'}`}>
              {transaction.type === 'sale' ? '+' : '-'}
              {formatCurrency(transaction.amount)} ISK
            </div>
          </div>
        ))}
         {recentTransactions.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No transactions for this period.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
