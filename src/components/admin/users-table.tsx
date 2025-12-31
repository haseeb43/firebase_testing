'use client';

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
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
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAppUser as useCurrentAppUser } from '@/firebase';
import { useI18n } from '@/hooks/use-i18n';
import { useToast } from '@/hooks/use-toast';
import { useUsers } from '@/hooks/use-users';
import type { AppUser, Role } from '@/lib/types';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Switch } from '../ui/switch';

export default function UsersTable() {
  const { t } = useI18n();
  const { users, isLoading, updateUser } = useUsers();
  const { toast } = useToast();
  const { appUser: currentAdmin } = useCurrentAppUser();

  const handlePermissionChange = (userId: string, field: 'accessAllowed', value: boolean) => {
    updateUser(userId, { [field]: value });
    toast({
      title: t('permissions_updated'),
      description: `${t(field as 'accessAllowed')} ${t('permission_for_user')} ${userId} ${t(
        'was_updated'
      )}.`,
    });
  };

  const handleRoleChange = (
    userId: string,
    userRoles: Role[] | undefined,
    role: 'admin' | 'super_admin' | 'reporting',
    isEnabled: boolean
  ) => {
    let newRoles = userRoles ? [...userRoles] : [];

    if (isEnabled) {
      // Add the role if it doesn't exist
      if (!newRoles.includes(role)) {
        newRoles.push(role);
      }
      // If making a super_admin, also make them an admin
      if (role === 'super_admin' && !newRoles.includes('admin')) {
        newRoles.push('admin');
      }
    } else {
      // Remove the role
      newRoles = newRoles.filter((r) => r !== role);
      // If a super_admin is demoted from admin, also remove super_admin
      if (role === 'admin' && newRoles.includes('super_admin')) {
        newRoles = newRoles.filter((r) => r !== 'super_admin');
      }
    }

    // Ensure roles are unique
    newRoles = [...new Set(newRoles)];

    updateUser(userId, { roles: newRoles });
    toast({
      title: t('permissions_updated'),
      description: `User permissions were updated.`,
    });
  };

  const handleDeleteUser = async (userId: string) => {
    toast({
      title: 'Deletion Not Implemented',
      description: 'User deletion must be handled by a secure backend function.',
      variant: 'destructive',
    });
  };

  const columns: ColumnDef<AppUser>[] = React.useMemo(
    () => [
      {
        accessorKey: 'email',
        header: t('email'),
        cell: ({ row }) => (
          <div>
            <div className="flex items-center gap-2">
              <span>{row.getValue('email')}</span>
              <Badge variant="outline" className="capitalize">
                {row.original.plan}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">{row.original.kennitala}</div>
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Date Added',
        cell: ({ row }) => {
          const createdAt = row.original.createdAt;
          if (!createdAt) return 'N/A';
          // The date is already a Date object because of the context provider
          return createdAt.toLocaleDateString('en-CA');
        },
      },
      {
        accessorKey: 'roles-admin',
        header: () => <div className="text-center">{t('admin')}</div>,
        cell: ({ row }) => {
          const user = row.original;
          const isAdmin = user.roles?.includes('admin');
          const isSuperAdmin = user.roles?.includes('super_admin');

          // A super admin cannot have their admin role revoked directly.
          const isDisabled = isSuperAdmin;

          return (
            <div className="flex justify-center">
              <Switch
                checked={isAdmin}
                onCheckedChange={(value) => handleRoleChange(user.id, user.roles, 'admin', value)}
                disabled={isDisabled}
                aria-label="Is Admin"
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'roles-super_admin',
        header: () => <div className="text-center">{t('super_admin')}</div>,
        cell: ({ row }) => {
          const user = row.original;
          const isSuperAdmin = user.roles?.includes('super_admin');

          return (
            <div className="flex justify-center">
              <Switch
                checked={isSuperAdmin}
                onCheckedChange={(value) =>
                  handleRoleChange(user.id, user.roles, 'super_admin', value)
                }
                aria-label="Is Super Admin"
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'roles-reporting',
        header: () => <div className="text-center">{t('reporting')}</div>,
        cell: ({ row }) => {
          const user = row.original;
          const canViewReports = user.roles?.includes('reporting');

          return (
            <div className="flex justify-center">
              <Switch
                checked={canViewReports}
                onCheckedChange={(value) =>
                  handleRoleChange(user.id, user.roles, 'reporting', value)
                }
                aria-label="Has Reporting Access"
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'accessAllowed',
        header: () => <div className="text-center">{t('access_allowed')}</div>,
        cell: ({ row }) => {
          const user = row.original;
          return (
            <div className="flex justify-center">
              <Switch
                checked={user.accessAllowed}
                onCheckedChange={(value) => {
                  if (user.id) {
                    handlePermissionChange(user.id, 'accessAllowed', value);
                  }
                }}
                aria-label="Access Allowed"
              />
            </div>
          );
        },
      },
      {
        accessorKey: 'status',
        header: () => <div className="text-center">{t('status')}</div>,
        cell: ({ row }) => {
          const user = row.original;
          const status = user.accessAllowed ? 'active' : 'inactive';
          return (
            <div className="flex justify-center">
              <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                {t(status as 'active' | 'inactive')}
              </Badge>
            </div>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const user = row.original;
          // An admin cannot delete themselves.
          const isSelf = currentAdmin?.id === user.id;

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
                  <DropdownMenuSeparator />
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-red-500 focus:text-red-500" disabled={isSelf}>
                      {t('delete')}
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('confirm_deletion_title')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('confirm_user_deletion_description')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (user.id) {
                        handleDeleteUser(user.id);
                      }
                    }}
                  >
                    {t('delete')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          );
        },
      },
    ],
    [t, updateUser, currentAdmin]
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
                    {t('loading_users')}...
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
                    {t('no_users_found')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
