'use client';

import React from 'react';
import { NeumorphicDataTable } from '@/components/ui/NeumorphicDataTable';
import { TableColumn, TableAction, BulkAction } from '@/types/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit2, Trash2, Eye, Star, UserCheck, Mail, Download } from 'lucide-react';

// Sample data types
interface User extends Record<string, unknown> {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  lastLogin: string;
  projects: number;
  rating: number;
  department: string;
  joinDate: string;
}

// Sample data
const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@company.com',
    role: 'Senior Developer',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    lastLogin: '2024-01-15T10:30:00Z',
    projects: 12,
    rating: 4.8,
    department: 'Engineering',
    joinDate: '2022-03-15',
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@company.com',
    role: 'Product Manager',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    lastLogin: '2024-01-15T09:15:00Z',
    projects: 8,
    rating: 4.6,
    department: 'Product',
    joinDate: '2021-11-20',
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol.davis@company.com',
    role: 'Designer',
    status: 'pending',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    lastLogin: '2024-01-14T16:45:00Z',
    projects: 5,
    rating: 4.9,
    department: 'Design',
    joinDate: '2023-06-10',
  },
  {
    id: '4',
    name: 'David Wilson',
    email: 'david.wilson@company.com',
    role: 'DevOps Engineer',
    status: 'inactive',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    lastLogin: '2024-01-10T14:20:00Z',
    projects: 15,
    rating: 4.7,
    department: 'Engineering',
    joinDate: '2020-08-05',
  },
  {
    id: '5',
    name: 'Eva Martinez',
    email: 'eva.martinez@company.com',
    role: 'Marketing Specialist',
    status: 'active',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eva',
    lastLogin: '2024-01-15T11:00:00Z',
    projects: 3,
    rating: 4.5,
    department: 'Marketing',
    joinDate: '2023-02-28',
  },
];

// Column definitions with proper typing
const columns: TableColumn<User>[] = [
  {
    id: 'user',
    header: 'User',
    accessorKey: 'name',
    cell: (value: unknown, row: User) => (
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          {row.avatar && <AvatarImage src={row.avatar} alt={row.name} />}
          <AvatarFallback className="text-xs">
            {row.name.split(' ').map((n: string) => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-sm text-muted-foreground">{row.email}</div>
        </div>
      </div>
    ),
    sortable: true,
    filterable: true,
  },
  {
    id: 'role',
    header: 'Role',
    accessorKey: 'role',
    sortable: true,
    filterable: true,
    meta: {
      filterType: 'select',
      filterOptions: [
        { label: 'Senior Developer', value: 'Senior Developer' },
        { label: 'Product Manager', value: 'Product Manager' },
        { label: 'Designer', value: 'Designer' },
        { label: 'DevOps Engineer', value: 'DevOps Engineer' },
        { label: 'Marketing Specialist', value: 'Marketing Specialist' },
      ],
    },
  },
  {
    id: 'department',
    header: 'Department',
    accessorKey: 'department',
    sortable: true,
    filterable: true,
    meta: {
      filterType: 'select',
      filterOptions: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Product', value: 'Product' },
        { label: 'Design', value: 'Design' },
        { label: 'Marketing', value: 'Marketing' },
      ],
    },
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: (value: unknown, row: User) => {
      const statusColors: Record<User['status'], string> = {
        active: 'bg-green-500/10 text-green-500 border-green-500/20',
        inactive: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
        pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      };
      return (
        <Badge 
          variant="outline" 
          className={statusColors[row.status]}
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      );
    },
    sortable: true,
    filterable: true,
    meta: {
      filterType: 'select',
      filterOptions: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' },
      ],
    },
  },
  {
    id: 'projects',
    header: 'Projects',
    accessorKey: 'projects',
    cell: (value: unknown, row: User) => (
      <div className="text-center font-medium">
        {row.projects}
      </div>
    ),
    sortable: true,
    align: 'center',
  },
  {
    id: 'rating',
    header: 'Rating',
    accessorKey: 'rating',
    cell: (value: unknown, row: User) => (
      <div className="flex items-center space-x-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{row.rating}</span>
      </div>
    ),
    sortable: true,
    align: 'center',
  },
  {
    id: 'lastLogin',
    header: 'Last Login',
    accessorKey: 'lastLogin',
    cell: (value: unknown, row: User) => {
      const date = new Date(row.lastLogin);
      return (
        <div className="text-sm">
          <div>{date.toLocaleDateString()}</div>
          <div className="text-muted-foreground">
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      );
    },
    sortable: true,
  },
];

// Row actions with proper typing
const rowActions: TableAction<User>[] = [
  {
    id: 'view',
    label: 'View Profile',
    icon: Eye,
    onClick: (row: User) => {
      console.log('View user:', row.name);
    },
  },
  {
    id: 'edit',
    label: 'Edit User',
    icon: Edit2,
    onClick: (row: User) => {
      console.log('Edit user:', row.name);
    },
    disabled: (row: User) => row.status === 'inactive',
  },
  {
    id: 'email',
    label: 'Send Email',
    icon: Mail,
    onClick: (row: User) => {
      console.log('Email user:', row.email);
    },
  },
  {
    id: 'delete',
    label: 'Delete User',
    icon: Trash2,
    variant: 'destructive',
    onClick: (row: User) => {
      console.log('Delete user:', row.name);
    },
    hidden: (row: User) => row.status === 'active',
  },
];

// Bulk actions with proper typing
const bulkActions: BulkAction<User>[] = [
  {
    id: 'activate',
    label: 'Activate Users',
    icon: UserCheck,
    onClick: (rows: User[]) => {
      console.log('Activate users:', rows.map(r => r.name));
    },
    disabled: (rows: User[]) => rows.every(r => r.status === 'active'),
  },
  {
    id: 'export',
    label: 'Export Selected',
    icon: Download,
    onClick: (rows: User[]) => {
      console.log('Export users:', rows.map(r => r.name));
    },
  },
  {
    id: 'delete',
    label: 'Delete Selected',
    icon: Trash2,
    variant: 'destructive',
    onClick: (rows: User[]) => {
      console.log('Delete users:', rows.map(r => r.name));
    },
  },
];

// Row details component
const UserDetailsComponent: React.FC<{ row: User; onClose: () => void }> = ({ row }) => (
  <div className="space-y-4">
    <div className="flex items-center space-x-4">
      <Avatar className="h-16 w-16">
        {row.avatar && <AvatarImage src={row.avatar} alt={row.name} />}
        <AvatarFallback className="text-lg">
          {row.name.split(' ').map((n: string) => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-xl font-semibold">{row.name}</h3>
        <p className="text-muted-foreground">{row.role}</p>
        <p className="text-sm text-muted-foreground">{row.department}</p>
      </div>
    </div>
    
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="font-medium mb-2">Contact Information</h4>
        <p className="text-sm">Email: {row.email}</p>
        <p className="text-sm">Joined: {new Date(row.joinDate).toLocaleDateString()}</p>
      </div>
      <div>
        <h4 className="font-medium mb-2">Performance</h4>
        <p className="text-sm">Projects: {row.projects}</p>
        <p className="text-sm">Rating: {row.rating}/5.0</p>
        <p className="text-sm">Status: {row.status}</p>
      </div>
    </div>
    
    <div>
      <h4 className="font-medium mb-2">Recent Activity</h4>
      <p className="text-sm text-muted-foreground">
        Last login: {new Date(row.lastLogin).toLocaleString()}
      </p>
    </div>
  </div>
);

export function DataTableDemo() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Advanced Data Table Demo</h2>
        <p className="text-muted-foreground">
          This demo showcases all advanced features including custom cell rendering, 
          avatars, badges, row actions, bulk operations, and detailed row expansion.
        </p>
      </div>
      
      <NeumorphicDataTable<User>
        data={sampleUsers}
        columns={columns}
        rowActions={rowActions}
        bulkActions={bulkActions}
        features={{
          search: true,
          sorting: true,
          filtering: true,
          pagination: true,
          selection: 'multiple',
          columnVisibility: true,
          columnResizing: true,
          export: true,
          density: true,
          bulkActions: true,
          rowActions: true,
          rowExpansion: true,
        }}
        rowDetails={{
          component: UserDetailsComponent,
          title: (row: User) => `${row.name} - User Details`,
        }}
        export={{
          filename: 'users-data',
          formats: ['csv', 'json'],
        }}
        pagination={{
          pageSize: 5,
          showSizeSelector: true,
          pageSizeOptions: [5, 10, 20, 50],
        }}
        sorting={{
          multiSort: true,
        }}
        onRowClick={(row: User) => console.log('Row clicked:', row.name)}
        onRowDoubleClick={(row: User) => console.log('Row double-clicked:', row.name)}
      />
    </div>
  );
} 