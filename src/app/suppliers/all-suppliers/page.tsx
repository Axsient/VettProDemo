"use client";

import React, { useState } from 'react';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicBadge,
  NeumorphicButton,
  NeumorphicStatsCard,
} from '@/components/ui/neumorphic';
import { Input } from '@/components/ui/input';
import { NeumorphicDataTable } from '@/components/ui/NeumorphicDataTable';
import { getSuppliers, getVettingHistoryForSupplier, getDocumentsForSupplier } from '@/lib/sample-data/supplierSample';
import { Supplier, VettingHistoryItem, SupplierDocument } from '@/types/supplier';
import { TableColumn } from '@/types/table';
import { PlusIcon, SearchIcon, FilterIcon, ShieldCheckIcon, MailIcon, BuildingIcon, MapPinIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Extend Supplier to satisfy table requirements
interface TableSupplier extends Supplier, Record<string, unknown> {}

const AllSuppliersPage: React.FC = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  
  // Get suppliers data
  const suppliers = getSuppliers();
  const tableSuppliers: TableSupplier[] = suppliers.map(supplier => ({ ...supplier }));

  const selectedVettingHistory: VettingHistoryItem[] = selectedSupplier
    ? getVettingHistoryForSupplier(selectedSupplier.id)
    : [];
  const selectedDocuments: SupplierDocument[] = selectedSupplier
    ? getDocumentsForSupplier(selectedSupplier.id)
    : [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Onboarding': return 'info';
      case 'High-Risk': return 'danger';
      case 'Archived': return 'default';
      default: return 'default';
    }
  };

  const getRiskVariant = (level: string) => {
    switch (level) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'danger';
      default: return 'default';
    }
  };

  const getBeeVariant = (status: string) => {
    if (status.includes('Level 1') || status.includes('Level 2')) return 'success';
    if (status.includes('Level 3') || status.includes('Level 4')) return 'info';
    if (status.includes('Non-Compliant')) return 'danger';
    return 'default';
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'Contract': return 'info';
      case 'Certificate': return 'success';
      case 'Invoice': return 'warning';
      case 'Compliance': return 'danger';
      default: return 'default';
    }
  };

  const formatDate = (value: string) => (
    value === 'N/A' ? 'N/A' : new Date(value).toLocaleDateString()
  );

  const getRiskScoreColor = (score: number) => {
    if (score === 0) return 'text-neumorphic-text-secondary';
    if (score <= 30) return 'text-green-500';
    if (score <= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

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
      cell: (value: unknown, row: TableSupplier) => (
        <NeumorphicBadge variant={getStatusVariant(String(row.status))}>
          {String(row.status)}
        </NeumorphicBadge>
      ),
    },
    {
      id: 'overallRiskScore',
      header: 'Risk Score',
      accessorKey: 'overallRiskScore',
      sortable: true,
      cell: (value: unknown, row: TableSupplier) => {
        const score = Number(row.overallRiskScore);
        return (
          <NeumorphicText className={`font-semibold ${getRiskScoreColor(score)}`}>
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
      cell: (value: unknown, row: TableSupplier) => (
        <NeumorphicBadge variant={getBeeVariant(String(row.beeStatus))}>
          {String(row.beeStatus)}
        </NeumorphicBadge>
      ),
    },
    {
      id: 'lastVettedDate',
      header: 'Last Vetted',
      accessorKey: 'lastVettedDate',
      sortable: true,
      cell: (value: unknown, row: TableSupplier) => (
        <NeumorphicText size="sm">{formatDate(String(row.lastVettedDate))}</NeumorphicText>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'id',
      cell: (value: unknown, row: TableSupplier) => (
        <NeumorphicButton
          className="text-xs px-2 py-1"
          onClick={() => setSelectedSupplier(suppliers.find(s => s.id === row.id) || null)}
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

        {/* Supplier profile modal */}
        <Dialog open={!!selectedSupplier} onOpenChange={(open) => !open && setSelectedSupplier(null)}>
          <DialogContent variant="neumorphic" className="sm:max-w-4xl">
            <DialogHeader variant="neumorphic">
              <DialogTitle variant="neumorphic">Supplier Profile</DialogTitle>
              <DialogDescription variant="neumorphic">
                Snapshot from sample data. Open the full profile for the complete dashboard view.
              </DialogDescription>
            </DialogHeader>

            {selectedSupplier && (
              <div className="space-y-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <NeumorphicBadge variant={getStatusVariant(selectedSupplier.status)}>
                        {selectedSupplier.status}
                      </NeumorphicBadge>
                      <NeumorphicBadge variant="info">{selectedSupplier.source}</NeumorphicBadge>
                      <NeumorphicBadge variant={getBeeVariant(selectedSupplier.beeStatus)}>
                        {selectedSupplier.beeStatus}
                      </NeumorphicBadge>
                    </div>
                    <div>
                      <NeumorphicHeading className="text-xl">{selectedSupplier.name}</NeumorphicHeading>
                      <NeumorphicText className="text-neumorphic-text-secondary">
                        {selectedSupplier.registrationNumber}
                      </NeumorphicText>
                    </div>
                  </div>
                  <NeumorphicStatsCard
                    title="Overall Risk Score"
                    value={selectedSupplier.overallRiskScore === 0 ? 'N/A' : selectedSupplier.overallRiskScore.toFixed(1)}
                    trend="neutral"
                    trendValue={selectedSupplier.lastVettedDate !== 'N/A' ? `Last vetted ${formatDate(selectedSupplier.lastVettedDate)}` : 'Not vetted yet'}
                    icon={<ShieldCheckIcon className={`w-5 h-5 ${getRiskScoreColor(selectedSupplier.overallRiskScore)}`} />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <NeumorphicCard className="p-4">
                    <NeumorphicText className="font-semibold">Contact</NeumorphicText>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex items-center gap-2 text-neumorphic-text-secondary">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{selectedSupplier.industry}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neumorphic-text-secondary">
                        <BuildingIcon className="w-4 h-4" />
                        <span>{selectedSupplier.source}</span>
                      </div>
                      <div className="flex items-center gap-2 text-neumorphic-text-secondary">
                        <MailIcon className="w-4 h-4" />
                        <span>{selectedSupplier.contactEmail}</span>
                      </div>
                    </div>
                  </NeumorphicCard>

                  <NeumorphicCard className="p-4">
                    <NeumorphicText className="font-semibold">Business Details</NeumorphicText>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <NeumorphicText size="sm" className="text-neumorphic-text-secondary">Contact</NeumorphicText>
                        <NeumorphicText size="sm" className="font-semibold">{selectedSupplier.contactPerson}</NeumorphicText>
                      </div>
                      <div className="flex justify-between">
                        <NeumorphicText size="sm" className="text-neumorphic-text-secondary">Industry</NeumorphicText>
                        <NeumorphicText size="sm" className="font-semibold">{selectedSupplier.industry}</NeumorphicText>
                      </div>
                      <div className="flex justify-between">
                        <NeumorphicText size="sm" className="text-neumorphic-text-secondary">Last Vetted</NeumorphicText>
                        <NeumorphicText size="sm" className="font-semibold">
                          {formatDate(String(selectedSupplier.lastVettedDate))}
                        </NeumorphicText>
                      </div>
                    </div>
                  </NeumorphicCard>

                  <NeumorphicCard className="p-4">
                    <NeumorphicText className="font-semibold">Compliance Signals</NeumorphicText>
                    <div className="mt-2 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-neumorphic-text-secondary">BEE Status</span>
                        <NeumorphicBadge variant={getBeeVariant(selectedSupplier.beeStatus)}>
                          {selectedSupplier.beeStatus}
                        </NeumorphicBadge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neumorphic-text-secondary">Overall Status</span>
                        <NeumorphicBadge variant={getStatusVariant(selectedSupplier.status)}>
                          {selectedSupplier.status}
                        </NeumorphicBadge>
                      </div>
                    </div>
                  </NeumorphicCard>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NeumorphicCard className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <NeumorphicText className="font-semibold">Recent Vetting Checks</NeumorphicText>
                      <NeumorphicBadge variant="info">{selectedVettingHistory.length} checks</NeumorphicBadge>
                    </div>
                    <div className="space-y-3">
                      {selectedVettingHistory.slice(0, 4).map(item => (
                        <div key={item.id} className="flex items-center justify-between text-sm">
                          <div>
                            <NeumorphicText className="font-medium">{item.checkName}</NeumorphicText>
                            <NeumorphicText size="sm" className="text-neumorphic-text-secondary">
                              {formatDate(String(item.dateCompleted))}
                            </NeumorphicText>
                          </div>
                          <div className="flex items-center gap-2">
                            <NeumorphicBadge variant={getRiskVariant(String(item.riskLevel))}>
                              {item.riskLevel === 'None' ? 'N/A' : item.riskLevel}
                            </NeumorphicBadge>
                            <NeumorphicBadge variant={getStatusVariant(String(item.status))}>
                              {item.status}
                            </NeumorphicBadge>
                          </div>
                        </div>
                      ))}
                      {selectedVettingHistory.length === 0 && (
                        <NeumorphicText size="sm" className="text-neumorphic-text-secondary">No checks captured yet.</NeumorphicText>
                      )}
                    </div>
                  </NeumorphicCard>

                  <NeumorphicCard className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <NeumorphicText className="font-semibold">Key Documents</NeumorphicText>
                      <NeumorphicBadge variant="info">{selectedDocuments.length} files</NeumorphicBadge>
                    </div>
                    <div className="space-y-3">
                      {selectedDocuments.slice(0, 4).map(doc => (
                        <div key={doc.id} className="flex items-center justify-between text-sm">
                          <div>
                            <NeumorphicText className="font-medium">{doc.name}</NeumorphicText>
                            <NeumorphicText size="sm" className="text-neumorphic-text-secondary">
                              Uploaded {formatDate(String(doc.uploadDate))}
                            </NeumorphicText>
                          </div>
                          <NeumorphicBadge variant={getCategoryVariant(String(doc.category))}>
                            {doc.category}
                          </NeumorphicBadge>
                        </div>
                      ))}
                      {selectedDocuments.length === 0 && (
                        <NeumorphicText size="sm" className="text-neumorphic-text-secondary">No documents captured yet.</NeumorphicText>
                      )}
                    </div>
                  </NeumorphicCard>
                </div>
              </div>
            )}

            <DialogFooter variant="neumorphic">
              <NeumorphicButton className="mr-2" onClick={() => setSelectedSupplier(null)}>
                Close
              </NeumorphicButton>
              {selectedSupplier && (
                <NeumorphicButton
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  onClick={() => {
                    const supplierId = selectedSupplier.id;
                    setSelectedSupplier(null);
                    router.push(`/suppliers/${supplierId}`);
                  }}
                >
                  Open full profile
                </NeumorphicButton>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </NeumorphicBackground>
  );
};

export default AllSuppliersPage; 
