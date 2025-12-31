
"use client";

import * as React from "react";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
} from "lucide-react";
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
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
} from "@/components/ui/alert-dialog"

import type { Invoice } from "@/lib/types";
import { useI18n } from "@/hooks/use-i18n";
import { useInvoices } from "@/hooks/use-invoices";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function InvoicesTable() {
  const { t } = useI18n();
  const { invoices, updateInvoiceStatus, deleteInvoice } = useInvoices();
  const { toast } = useToast();

  const data: Invoice[] = React.useMemo(() => invoices, [invoices]);

  const handleSetStatus = (id: string, status: 'paid' | 'unpaid' | 'overdue') => {
    updateInvoiceStatus(id, status);
    toast({ title: t('invoice_status_updated') });
  };

  const handleDelete = (id: string) => {
    deleteInvoice(id);
    toast({ title: t('invoice_deleted'), variant: 'destructive' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('is-IS', { style: 'currency', currency: 'ISK' }).format(amount);
  };

  const columns: ColumnDef<Invoice>[] = React.useMemo(() => [
    {
      accessorKey: "invoiceNumber",
      header: t('invoice_no'),
      cell: ({ row }) => <div className="whitespace-nowrap">{row.getValue("invoiceNumber")}</div>,
    },
    {
      accessorKey: "clientName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t('client')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("clientName")}</div>,
    },
    {
      accessorKey: "issueDate",
      header: t('issue_date'),
      cell: ({ row }) => <div className="whitespace-nowrap">{row.original.issueDate.toLocaleDateString('en-CA')}</div>,
    },
    {
      accessorKey: "dueDate",
      header: t('due_date'),
      cell: ({ row }) => <div className="whitespace-nowrap">{row.original.dueDate.toLocaleDateString('en-CA')}</div>,
    },
    {
      accessorKey: "total",
      header: () => <div className="text-right">{t('amount')}</div>,
      cell: ({ row }) => <div className="text-right font-medium whitespace-nowrap">{formatCurrency(row.original.total)}</div>,
    },
    {
      accessorKey: "status",
      header: t('status'),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variant = {
          paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
          unpaid: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
          overdue: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
        }[status] ?? 'default';
        return <Badge className={`whitespace-nowrap ${variant}`}>{t(status as 'paid' | 'unpaid' | 'overdue')}</Badge>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const invoice = row.original;
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
                <DropdownMenuItem asChild>
                  <Link href={`/invoices/${invoice.id}`}>{t('view_invoice')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (invoice.id) {
                      handleSetStatus(invoice.id, 'paid');
                    } else {
                      console.error("Invoice ID is undefined.");
                    }
                  }}
                  disabled={invoice.status === 'paid'}
                >
                  {t('mark_as_paid')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-red-500 focus:text-red-500">{t('delete')}</DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
             <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('confirm_deletion_title')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('confirm_invoice_deletion_description')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    if (invoice.id) {
                      handleDelete(invoice.id)
                    } else {
                      console.error("Invoice ID is undefined.");
                    }
                  }}>
                    {t('delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
          </AlertDialog>
        );
      },
    },
  ], [t, invoices, handleDelete, handleSetStatus]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

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
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-4">
          <Input
            placeholder={`${t('filter_by_client')}...`}
            value={(table.getColumn("clientName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("clientName")?.setFilterValue(event.target.value)
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
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {t(column.id as any) || column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
  );
}
