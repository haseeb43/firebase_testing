
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/hooks/use-i18n";
import { useDashboardFilter } from "@/contexts/dashboard-filter-provider";

export default function ProfitLossChart() {
  const { t } = useI18n();
  const { filteredTransactions: transactions } = useDashboardFilter();
  
  const monthlyData = transactions.reduce((acc, t) => {
      const month = t.date.toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
          acc[month] = { name: month, revenue: 0, expenses: 0 };
      }
      if (t.type === 'sale') {
          acc[month].revenue += t.amount;
      } else {
          acc[month].expenses += t.amount;
      }
      return acc;
  }, {} as Record<string, {name: string, revenue: number, expenses: number}>);

  const chartData = Object.values(monthlyData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profit_and_loss_overview')}</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--secondary))' }}
              contentStyle={{ 
                background: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
            <Legend />
            <Bar dataKey="revenue" name={t('total_revenue')} fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name={t('total_expenses')} fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
