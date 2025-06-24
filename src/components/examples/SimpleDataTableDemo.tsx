'use client';

import React from 'react';
import { NeumorphicDataTable } from '@/components/ui/NeumorphicDataTable';
import { TableColumn, TableAction, BulkAction } from '@/types/table';
import { Edit2, Trash2, Eye, UserCheck, Mail } from 'lucide-react';

// Simple data types
interface SimpleUser extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  projects: number;
}

// Sample data
const sampleUsers: SimpleUser[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    role: 'Senior Developer',
    status: 'active',
    projects: 12,
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@company.com',
    role: 'Product Manager',
    status: 'active',
    projects: 8,
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol.davis@company.com',
    role: 'UX Designer',
    status: 'inactive',
    projects: 15,
  },
];

export function SimpleDataTableDemo() {
  // Define columns
  const columns: TableColumn<SimpleUser>[] = [
    {
      id: 'name',
      header: 'Name',
      accessorKey: 'name',
      sortable: true,
      filterable: true,
      width: 200,
    },
    {
      id: 'email',
      header: 'Email',
      accessorKey: 'email',
      sortable: true,
      filterable: true,
      width: 250,
    },
    {
      id: 'role',
      header: 'Role',
      accessorKey: 'role',
      sortable: true,
      filterable: true,
      width: 150,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      filterable: true,
      width: 100,
    },
    {
      id: 'projects',
      header: 'Projects',
      accessorKey: 'projects',
      sortable: true,
      filterable: true,
      width: 80,
    },
  ];

  // Define row actions
  const rowActions: TableAction<SimpleUser>[] = [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: (user) => {
        alert(`Viewing details for ${user.name}`);
      },
    },
    {
      id: 'edit',
      label: 'Edit User',
      icon: Edit2,
      onClick: (user) => {
        alert(`Editing ${user.name}`);
      },
    },
    {
      id: 'delete',
      label: 'Delete User',
      icon: Trash2,
      onClick: (user) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
          alert(`Deleted ${user.name}`);
        }
      },
      variant: 'destructive',
    },
  ];

  // Define bulk actions
  const bulkActions: BulkAction<SimpleUser>[] = [
    {
      id: 'activate-all',
      label: 'Activate Selected',
      icon: UserCheck,
      onClick: (users) => {
        alert(`Activating ${users.length} users`);
      },
    },
    {
      id: 'send-email',
      label: 'Send Email',
      icon: Mail,
      onClick: (users) => {
        alert(`Sending email to ${users.length} users`);
      },
    },
    {
      id: 'delete-all',
      label: 'Delete Selected',
      icon: Trash2,
      onClick: (users) => {
        if (confirm(`Are you sure you want to delete ${users.length} users?`)) {
          alert(`Deleted ${users.length} users`);
        }
      },
      variant: 'destructive',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">
          Simple Data Table Demo
        </h2>
        <p className="text-muted-foreground">
          A basic example showcasing the core features of the neumorphic data table.
        </p>
      </div>

      <NeumorphicDataTable
        data={sampleUsers}
        columns={columns}
        features={{
          search: true,
          sorting: true,
          filtering: true,
          pagination: true,
          selection: 'multiple',
          columnVisibility: true,
          export: true,
          density: true,
          bulkActions: true,
          rowActions: true,
        }}
        rowActions={rowActions}
        bulkActions={bulkActions}
        onRowClick={(user) => {
          console.log('Row clicked:', user);
        }}
        onRowDoubleClick={(user) => {
          console.log('Row double-clicked:', user);
        }}
        className="w-full"
      />
    </div>
  );
} 