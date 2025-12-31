'use client';

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  CreditCard,
  Landmark,
  MoreHorizontal,
  Wallet,
} from 'lucide-react';
import * as React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useDashboardFilter } from '@/contexts/dashboard-filter-provider';
import type { WithId } from '@/firebase';
import { useI18n } from '@/hooks/use-i18n';
import { useToast } from '@/hooks/use-toast';
import { useTransactions } from '@/hooks/use-transactions';
import type { Transaction } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import AddEntryDialog from './add-entry-dialog';

export default function EntriesTable() {
  const { t } = useI18n();
  const { deleteTransaction } = useTransactions();
  const { toast } = useToast();
  // Use dashboard filter if available, otherwise fall back to all transactions
  const dashboardFilter = useDashboardFilter();
  const { transactions } = useTransactions();

  const displayTransactions = dashboardFilter ? dashboardFilter.filteredTransactions : transactions;

  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<
    WithId<Transaction> | undefined
  >(undefined);

  const data: WithId<Transaction>[] = React.useMemo(
    () => displayTransactions,
    [displayTransactions]
  );

  const handleEdit = (transaction: WithId<Transaction>) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast({ title: t('entry_deleted') });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('is-IS', { style: 'currency', currency: 'ISK' }).format(amount);
  };

  const columns: ColumnDef<WithId<Transaction>>[] = React.useMemo(
    () => [
      {
        accessorKey: 'date',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('date')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="whitespace-nowrap">{row.original.date.toLocaleDateString('en-CA')}</div>
        ),
      },
      {
        accessorKey: 'description',
        header: t('description'),
        cell: ({ row }) => <div className="font-medium">{row.getValue('description')}</div>,
      },
      {
        accessorKey: 'category',
        header: t('category'),
      },
      {
        accessorKey: 'paymentMethod',
        header: t('payment_method'),
        cell: ({ row }) => {
          const paymentMethod = row.getValue('paymentMethod') as string;
          const Icon =
            {
              card: CreditCard,
              cash: Wallet,
              bank: Landmark,
            }[paymentMethod] || CreditCard;

          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center justify-center">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t(paymentMethod as 'card' | 'cash' | 'bank')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        },
      },
      {
        accessorKey: 'type',
        header: t('type'),
        cell: ({ row }) => {
          const type = row.getValue('type') as string;
          return (
            <Badge
              variant={type === 'sale' ? 'default' : 'secondary'}
              className={`whitespace-nowrap ${
                type === 'sale'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
              }`}
            >
              {t(type as 'sale' | 'expense')}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'vatRate',
        header: () => <div className="text-right">{t('vat')}</div>,
        cell: ({ row }) => {
          const vatRate = parseFloat(row.getValue('vatRate'));
          return <div className="text-right whitespace-nowrap">{vatRate}%</div>;
        },
      },
      {
        accessorKey: 'amount',
        header: () => <div className="text-right">{t('amount')}</div>,
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('amount'));
          const type = row.original.type;
          return (
            <div
              className={`text-right font-medium whitespace-nowrap ${
                type === 'sale' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatCurrency(amount)}
            </div>
          );
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <AlertDialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t('actions')}</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => handleEdit(transaction)}>
                    {t('edit')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500">
                      {t('delete')}
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('confirm_deletion_title')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('confirm_deletion_description')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(transaction.id)}>
                    {t('delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          );
        },
      },
    ],
    [t, deleteTransaction]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    paymentMethod: false,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 pb-4">
            <Input
              placeholder={`${t('filter_by_description')}...`}
              value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
              onChange={(event) =>
                table.getColumn('description')?.setFilterValue(event.target.value)
              }
              className="w-full sm:max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto w-full sm:w-auto">
                  {t('columns')} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {t(column.id as any)}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {t('no_results')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {t('previous')}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t('next')}
            </Button>
          </div>
        </CardContent>
      </Card>
      <AddEntryDialog
        key={selectedTransaction?.id}
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTransaction(undefined);
          }
          setIsEditDialogOpen(open);
        }}
        transaction={selectedTransaction}
      />
    </>
  );
}
