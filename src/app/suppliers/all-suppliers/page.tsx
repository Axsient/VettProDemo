"use client";

import React, { useState } from 'react';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicBadge,
  NeumorphicButton
} from '@/components/ui/neumorphic';
import { Input } from '@/components/ui/input';
import { NeumorphicDataTable } from '@/components/ui/NeumorphicDataTable';
import { getSuppliers } from '@/lib/sample-data/supplierSample';
import { Supplier } from '@/types/supplier';
import { TableColumn } from '@/types/table';
import { PlusIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// Extend Supplier to satisfy table requirements
interface TableSupplier extends Supplier, Record<string, unknown> {}

const AllSuppliersPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Get suppliers data
  const suppliers = getSuppliers();
  const tableSuppliers: TableSupplier[] = suppliers.map(supplier => ({ ...supplier }));

  // Define table columns
  const columns: TableColumn<TableSupplier>[] = [
    {
      id: 'name',
      header: 'Supplier Name',
      accessorKey: 'name',
      sortable: true,
      filterable: true,
      cell: (value: unknown, row: TableSupplier) => (
        <div className="flex flex-col">
          <NeumorphicText className="font-semibold">{String(row.name)}</NeumorphicText>
          <NeumorphicText size="sm" className="text-neumorphic-text-secondary">
            {String(row.registrationNumber)}
          </NeumorphicText>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      filterable: true,
      cell: (value: unknown, row: TableSupplier) => {
        const getStatusVariant = (status: string) => {
          switch (status) {
            case 'Active': return 'success';
            case 'Onboarding': return 'info';
            case 'High-Risk': return 'danger';
            case 'Archived': return 'default';
            default: return 'default';
          }
        };
        return (
          <NeumorphicBadge variant={getStatusVariant(String(row.status))}>
            {String(row.status)}
          </NeumorphicBadge>
        );
      },
    },
    {
      id: 'overallRiskScore',
      header: 'Risk Score',
      accessorKey: 'overallRiskScore',
      sortable: true,
      cell: (value: unknown, row: TableSupplier) => {
        const score = Number(row.overallRiskScore);
        const getRiskColor = (score: number) => {
          if (score <= 3) return 'text-green-500';
          if (score <= 6) return 'text-yellow-500';
          return 'text-red-500';
        };
        return (
          <NeumorphicText className={`font-semibold ${getRiskColor(score)}`}>
            {score === 0 ? 'N/A' : score.toFixed(1)}
          </NeumorphicText>
        );
      },
    },
    {
      id: 'industry',
      header: 'Industry',
      accessorKey: 'industry',
      sortable: true,
      filterable: true,
      cell: (value: unknown, row: TableSupplier) => (
        <NeumorphicText size="sm">{String(row.industry)}</NeumorphicText>
      ),
    },
    {
      id: 'beeStatus',
      header: 'BEE Status',
      accessorKey: 'beeStatus',
      sortable: true,
      filterable: true,
      cell: (value: unknown, row: TableSupplier) => {
        const getBeeVariant = (status: string) => {
          if (status.includes('Level 1') || status.includes('Level 2')) return 'success';
          if (status.includes('Level 3') || status.includes('Level 4')) return 'info';
          if (status.includes('Non-Compliant')) return 'danger';
          return 'default';
        };
        return (
          <NeumorphicBadge variant={getBeeVariant(String(row.beeStatus))}>
            {String(row.beeStatus)}
          </NeumorphicBadge>
        );
      },
    },
    {
      id: 'lastVettedDate',
      header: 'Last Vetted',
      accessorKey: 'lastVettedDate',
      sortable: true,
      cell: (value: unknown, row: TableSupplier) => (
        <NeumorphicText size="sm">
          {String(row.lastVettedDate) === 'N/A' ? 'N/A' : new Date(String(row.lastVettedDate)).toLocaleDateString()}
        </NeumorphicText>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'id',
      cell: (value: unknown, row: TableSupplier) => (
        <NeumorphicButton
          className="text-xs px-2 py-1"
          onClick={() => {
            router.push(`/suppliers/${row.id}`);
          }}
        >
          View Profile
        </NeumorphicButton>
      ),
    },
  ];

  // Filter suppliers based on search term
  const filteredSuppliers = tableSuppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <NeumorphicBackground>
      <div className="container mx-auto p-6">
        <NeumorphicCard className="p-6">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <NeumorphicHeading>All Suppliers</NeumorphicHeading>
              <NeumorphicText className="text-neumorphic-text-secondary mt-2">
                Manage and monitor all registered suppliers in the system
              </NeumorphicText>
            </div>
            <NeumorphicButton
              onClick={() => {
                router.push('/suppliers/add-new-supplier');
              }}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Add New Supplier
            </NeumorphicButton>
          </div>

          {/* Search and Filter Section */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neumorphic-text-secondary" />
              <Input
                type="text"
                placeholder="Search suppliers by name, registration number, or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <NeumorphicButton
              onClick={() => {
                toast.info('Advanced filters coming soon!');
              }}
            >
              <FilterIcon className="w-4 h-4 mr-2" />
              Filters
            </NeumorphicButton>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <NeumorphicCard className="p-4">
              <NeumorphicText size="sm" className="text-neumorphic-text-secondary">Total Suppliers</NeumorphicText>
              <NeumorphicText className="text-2xl font-bold">{suppliers.length}</NeumorphicText>
            </NeumorphicCard>
            <NeumorphicCard className="p-4">
              <NeumorphicText size="sm" className="text-neumorphic-text-secondary">Active</NeumorphicText>
              <NeumorphicText className="text-2xl font-bold text-green-500">
                {suppliers.filter(s => s.status === 'Active').length}
              </NeumorphicText>
            </NeumorphicCard>
            <NeumorphicCard className="p-4">
              <NeumorphicText size="sm" className="text-neumorphic-text-secondary">High-Risk</NeumorphicText>
              <NeumorphicText className="text-2xl font-bold text-red-500">
                {suppliers.filter(s => s.status === 'High-Risk').length}
              </NeumorphicText>
            </NeumorphicCard>
            <NeumorphicCard className="p-4">
              <NeumorphicText size="sm" className="text-neumorphic-text-secondary">Onboarding</NeumorphicText>
              <NeumorphicText className="text-2xl font-bold text-blue-500">
                {suppliers.filter(s => s.status === 'Onboarding').length}
              </NeumorphicText>
            </NeumorphicCard>
          </div>

          {/* Data Table */}
          <NeumorphicDataTable
            data={filteredSuppliers}
            columns={columns}
            features={{
              search: false, // We handle search externally
              sorting: true,
              filtering: true,
              pagination: true,
            }}
            pagination={{ pageSize: 10 }}
          />
        </NeumorphicCard>
      </div>
    </NeumorphicBackground>
  );
};

export default AllSuppliersPage; 