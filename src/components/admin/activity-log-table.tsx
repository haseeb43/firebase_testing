'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import * as React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useI18n } from '@/hooks/use-i18n';
import type { ActivityLog } from '@/lib/types';
import { collection, orderBy, query, Timestamp } from 'firebase/firestore';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/button';

// Define the type for logs coming from Firestore with a Timestamp
type FirestoreActivityLog = Omit<ActivityLog, 'timestamp'> & {
  timestamp: Timestamp;
};

export default function ActivityLogTable() {
  const { t } = useI18n();
  const firestore = useFirestore();

  const activityLogQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'activityLogs'), orderBy('timestamp', 'desc'));
  }, [firestore]);

  const { data: firestoreLogs, isLoading } = useCollection<FirestoreActivityLog>(activityLogQuery);

  const logs: ActivityLog[] = React.useMemo(() => {
    if (!firestoreLogs) return [];
    return firestoreLogs.map((log) => ({
      ...log,
      timestamp: log.timestamp.toDate(),
    }));
  }, [firestoreLogs]);

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns: ColumnDef<ActivityLog>[] = React.useMemo(
    () => [
      {
        accessorKey: 'timestamp',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {t('timestamp')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => new Date(row.getValue('timestamp')).toLocaleString(),
      },
      {
        accessorKey: 'userEmail',
        header: t('user_email'),
      },
      {
        accessorKey: 'action',
        header: t('action'),
      },
      {
        accessorKey: 'details',
        header: t('details'),
        cell: ({ row }) => (
          <pre className="text-xs bg-muted p-2 rounded-md">
            {JSON.stringify(row.getValue('details'), null, 2)}
          </pre>
        ),
      },
    ],
    [t]
  );

  const table = useReactTable({
    data: logs,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {t('loading_logs')}...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
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
  );
}
