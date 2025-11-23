"use client";

import React from 'react';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicBadge,
  NeumorphicButton,
  NeumorphicTabs
} from '@/components/ui/neumorphic';
import { NeumorphicDataTable } from '@/components/ui/NeumorphicDataTable';
import { getSuppliers, getVettingHistoryForSupplier, getDocumentsForSupplier, getSupplierReportData, SupplierReportData } from '@/lib/sample-data/supplierSample';
import { VettingHistoryItem, SupplierDocument } from '@/types/supplier';
import { TableColumn } from '@/types/table';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  ArrowLeftIcon, 
  BuildingIcon, 
  MailIcon, 
  MapPinIcon,
  ShieldCheckIcon,
  CalendarIcon,
  UploadIcon,
  DownloadIcon,
  ExternalLinkIcon
} from 'lucide-react';

interface SupplierProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

// Extend types for table compatibility
interface TableVettingHistoryItem extends VettingHistoryItem, Record<string, unknown> {}
interface TableSupplierDocument extends SupplierDocument, Record<string, unknown> {}

const SupplierProfilePage: React.FC<SupplierProfilePageProps> = ({ params }) => {
  const router = useRouter();
  const { id } = React.use(params);
  
  // Get supplier data
  const suppliers = getSuppliers();
  const supplier = suppliers.find(s => s.id === id);
  
  // Get related data
  const vettingHistory = getVettingHistoryForSupplier(id);
  const documents = getDocumentsForSupplier(id);
  const reportData: SupplierReportData = getSupplierReportData(id);

  // Table data with proper typing
  const tableVettingHistory: TableVettingHistoryItem[] = vettingHistory.map(item => ({ ...item }));
  const tableDocuments: TableSupplierDocument[] = documents.map(doc => ({ ...doc }));

  // If supplier not found, show error
  if (!supplier) {
    return (
      <NeumorphicBackground>
        <div className="container mx-auto p-6">
          <NeumorphicCard className="p-6 text-center">
            <NeumorphicHeading>Supplier Not Found</NeumorphicHeading>
            <NeumorphicText className="text-neumorphic-text-secondary mt-2 mb-4">
              The supplier with ID &quot;{id}&quot; could not be found.
            </NeumorphicText>
            <NeumorphicButton onClick={() => router.push('/suppliers/all-suppliers')}>
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to All Suppliers
            </NeumorphicButton>
          </NeumorphicCard>
        </div>
      </NeumorphicBackground>
    );
  }

  // Vetting History table columns
  const vettingColumns: TableColumn<TableVettingHistoryItem>[] = [
    {
      id: 'checkName',
      header: 'Check Name',
      accessorKey: 'checkName',
      sortable: true,
      cell: (value: unknown, row: TableVettingHistoryItem) => (
        <NeumorphicText className="font-medium">{String(row.checkName)}</NeumorphicText>
      ),
    },
    {
      id: 'dateCompleted',
      header: 'Date',
      accessorKey: 'dateCompleted',
      sortable: true,
      cell: (value: unknown, row: TableVettingHistoryItem) => (
        <NeumorphicText size="sm">
          {String(row.dateCompleted) === 'N/A' ? 'N/A' : new Date(String(row.dateCompleted)).toLocaleDateString()}
        </NeumorphicText>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (value: unknown, row: TableVettingHistoryItem) => {
        const getStatusVariant = (status: string) => {
          switch (status) {
            case 'Completed': return 'success';
            case 'Pending': return 'warning';
            case 'Failed': return 'danger';
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
      id: 'riskLevel',
      header: 'Risk Level',
      accessorKey: 'riskLevel',
      sortable: true,
      cell: (value: unknown, row: TableVettingHistoryItem) => {
        const getRiskVariant = (level: string) => {
          switch (level) {
            case 'Low': return 'success';
            case 'Medium': return 'warning';
            case 'High': return 'danger';
            default: return 'default';
          }
        };
        return (
          <NeumorphicBadge variant={getRiskVariant(String(row.riskLevel))}>
            {String(row.riskLevel)}
          </NeumorphicBadge>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'reportUrl',
      cell: (value: unknown, row: TableVettingHistoryItem) => (
        <NeumorphicButton
          className="text-xs px-2 py-1"
          onClick={() => {
            if (String(row.reportUrl) !== '#') {
              window.open(String(row.reportUrl), '_blank');
            } else {
              toast.info('Report not available yet');
            }
          }}
        >
          <ExternalLinkIcon className="w-3 h-3 mr-1" />
          View Report
        </NeumorphicButton>
      ),
    },
  ];

  // Documents table columns
  const documentsColumns: TableColumn<TableSupplierDocument>[] = [
    {
      id: 'name',
      header: 'Document Name',
      accessorKey: 'name',
      sortable: true,
      cell: (value: unknown, row: TableSupplierDocument) => (
        <NeumorphicText className="font-medium">{String(row.name)}</NeumorphicText>
      ),
    },
    {
      id: 'category',
      header: 'Category',
      accessorKey: 'category',
      sortable: true,
      filterable: true,
      cell: (value: unknown, row: TableSupplierDocument) => {
        const getCategoryVariant = (category: string) => {
          switch (category) {
            case 'Contract': return 'info';
            case 'Certificate': return 'success';
            case 'Invoice': return 'warning';
            case 'Compliance': return 'danger';
            default: return 'default';
          }
        };
        return (
          <NeumorphicBadge variant={getCategoryVariant(String(row.category))}>
            {String(row.category)}
          </NeumorphicBadge>
        );
      },
    },
    {
      id: 'uploadDate',
      header: 'Upload Date',
      accessorKey: 'uploadDate',
      sortable: true,
      cell: (value: unknown, row: TableSupplierDocument) => (
        <NeumorphicText size="sm">
          {new Date(String(row.uploadDate)).toLocaleDateString()}
        </NeumorphicText>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'fileUrl',
      cell: (value: unknown, row: TableSupplierDocument) => (
        <NeumorphicButton
          className="text-xs px-2 py-1"
          onClick={() => {
            toast.success(`Downloading ${row.name}...`);
          }}
        >
          <DownloadIcon className="w-3 h-3 mr-1" />
          Download
        </NeumorphicButton>
      ),
    },
  ];

  // Helper functions
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Onboarding': return 'info';
      case 'High-Risk': return 'danger';
      case 'Archived': return 'default';
      default: return 'default';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score === 0) return 'text-gray-500';
    if (score <= 30) return 'text-green-500';
    if (score <= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <NeumorphicBackground>
      <div className="container mx-auto p-6">
        {/* Back Button */}
        <div className="mb-6">
          <NeumorphicButton
            onClick={() => router.push('/suppliers/all-suppliers')}
            className="px-3 py-2"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Suppliers
          </NeumorphicButton>
        </div>

        {/* Profile Header Card */}
        <NeumorphicCard className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            {/* Left side - Company info */}
            <div className="flex items-center gap-6">
              {/* Company Logo/Initials */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[var(--neumorphic-radius-lg)] flex items-center justify-center">
                <NeumorphicText className="text-white text-2xl font-bold">
                  {supplier.name.split(' ').map(word => word[0]).join('').substring(0, 2)}
                </NeumorphicText>
              </div>
              
              {/* Company details */}
              <div>
                <NeumorphicHeading className="mb-2">{supplier.name}</NeumorphicHeading>
                <NeumorphicText className="text-neumorphic-text-secondary mb-2">
                  {supplier.registrationNumber}
                </NeumorphicText>
                <div className="flex items-center gap-2">
                  <NeumorphicBadge variant={getStatusVariant(supplier.status)}>
                    {supplier.status}
                  </NeumorphicBadge>
                  <NeumorphicBadge variant="info">
                    {supplier.source}
                  </NeumorphicBadge>
                </div>
              </div>
            </div>

            {/* Right side - Risk score */}
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-2">
                <div className="w-full h-full rounded-full border-8 border-neumorphic-border flex items-center justify-center">
                  <div className="text-center">
                    <NeumorphicText className={`text-2xl font-bold ${getRiskScoreColor(supplier.overallRiskScore)}`}>
                      {supplier.overallRiskScore === 0 ? 'N/A' : supplier.overallRiskScore.toFixed(1)}
                    </NeumorphicText>
                  </div>
                </div>
              </div>
              <NeumorphicText size="sm" className="text-neumorphic-text-secondary">
                Overall Risk Score
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>

        {/* Main Content Card with Tabs */}
        <NeumorphicCard className="p-6">
          <NeumorphicTabs defaultValue="overview">
            <NeumorphicTabs.List>
              <NeumorphicTabs.Trigger value="overview">Overview</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="vetting-history">Vetting History</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="documents">Documents</NeumorphicTabs.Trigger>
              <NeumorphicTabs.Trigger value="risk-analysis">Risk Analysis</NeumorphicTabs.Trigger>
            </NeumorphicTabs.List>

            {/* Tab 1: Overview */}
            <NeumorphicTabs.Content value="overview">
              <div className="space-y-6">
                {/* Key Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <BuildingIcon className="w-4 h-4 text-blue-500" />
                      <NeumorphicText size="sm" className="font-medium text-neumorphic-text-secondary">Contact Person</NeumorphicText>
                    </div>
                    <NeumorphicText className="font-semibold">{supplier.contactPerson}</NeumorphicText>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MailIcon className="w-4 h-4 text-green-500" />
                      <NeumorphicText size="sm" className="font-medium text-neumorphic-text-secondary">Email</NeumorphicText>
                    </div>
                    <NeumorphicText className="font-semibold">{supplier.contactEmail}</NeumorphicText>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheckIcon className="w-4 h-4 text-purple-500" />
                      <NeumorphicText size="sm" className="font-medium text-neumorphic-text-secondary">BEE Status</NeumorphicText>
                    </div>
                    <NeumorphicText className="font-semibold">{supplier.beeStatus}</NeumorphicText>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4 text-orange-500" />
                      <NeumorphicText size="sm" className="font-medium text-neumorphic-text-secondary">Industry</NeumorphicText>
                    </div>
                    <NeumorphicText className="font-semibold">{supplier.industry}</NeumorphicText>
                  </div>
                </div>

                {/* Key Actions */}
                <div className="border-t border-neumorphic-border pt-6">
                  <NeumorphicText className="text-lg font-semibold mb-4">Key Actions</NeumorphicText>
                  <div className="flex flex-wrap gap-4">
                    <NeumorphicButton
                      onClick={() => {
                        router.push('/vetting/initiate');
                        toast.info('Redirecting to vetting initiation...');
                      }}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <ShieldCheckIcon className="w-4 h-4 mr-2" />
                      Initiate New Vetting
                    </NeumorphicButton>
                    <NeumorphicButton
                      onClick={() => {
                        toast.info('Scheduling recurring check...');
                      }}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Schedule Recurring Check
                    </NeumorphicButton>
                  </div>
                </div>
              </div>
            </NeumorphicTabs.Content>

            {/* Tab 2: Vetting History */}
            <NeumorphicTabs.Content value="vetting-history">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <NeumorphicText className="text-lg font-semibold">Vetting History</NeumorphicText>
                  <NeumorphicText size="sm" className="text-neumorphic-text-secondary">
                    Last vetted: {supplier.lastVettedDate}
                  </NeumorphicText>
                </div>
                
                <NeumorphicDataTable
                  data={tableVettingHistory}
                  columns={vettingColumns}
                  features={{
                    search: true,
                    sorting: true,
                    filtering: true,
                    pagination: true,
                  }}
                  pagination={{ pageSize: 5 }}
                />
              </div>
            </NeumorphicTabs.Content>

            {/* Tab 3: Documents */}
            <NeumorphicTabs.Content value="documents">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <NeumorphicText className="text-lg font-semibold">Documents</NeumorphicText>
                  <NeumorphicButton
                    onClick={() => {
                      toast.info('File upload dialog would open here');
                    }}
                  >
                    <UploadIcon className="w-4 h-4 mr-2" />
                    Upload Document
                  </NeumorphicButton>
                </div>
                
                <NeumorphicDataTable
                  data={tableDocuments}
                  columns={documentsColumns}
                  features={{
                    search: true,
                    sorting: true,
                    filtering: true,
                    pagination: true,
                  }}
                  pagination={{ pageSize: 5 }}
                />
              </div>
            </NeumorphicTabs.Content>

            {/* Tab 4: Risk Analysis */}
            <NeumorphicTabs.Content value="risk-analysis">
              <NeumorphicCard className="p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="space-y-1">
                    <NeumorphicText className="text-lg font-semibold">AI Intelligence Report</NeumorphicText>
                    <NeumorphicText className="text-neumorphic-text-secondary">
                      Generate VettPro Intelligence dossier with supplier-specific AI insights, evidence, and mitigations.
                    </NeumorphicText>
                  </div>
                  <NeumorphicBadge variant="info">{reportData.metadata.caseReference}</NeumorphicBadge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <NeumorphicCard className="p-4">
                    <NeumorphicText size="sm" className="text-neumorphic-text-secondary">Overall Risk</NeumorphicText>
                    <NeumorphicText className={`text-2xl font-bold ${getRiskScoreColor(reportData.scoring.overall)}`}>
                      {reportData.scoring.overall}/100
                    </NeumorphicText>
                    <NeumorphicText size="sm" className="text-neumorphic-text-secondary mt-1">
                      Confidence: {reportData.scoring.confidence}
                    </NeumorphicText>
                  </NeumorphicCard>
                  <NeumorphicCard className="p-4">
                    <NeumorphicText size="sm" className="text-neumorphic-text-secondary">Engagement Context</NeumorphicText>
                    <NeumorphicText className="font-semibold">{reportData.metadata.engagementContext}</NeumorphicText>
                    <NeumorphicText size="sm" className="text-neumorphic-text-secondary mt-1">
                      Contract: {reportData.metadata.contractValue}
                    </NeumorphicText>
                  </NeumorphicCard>
                  <NeumorphicCard className="p-4">
                    <NeumorphicText size="sm" className="text-neumorphic-text-secondary">Data Currency</NeumorphicText>
                    <NeumorphicText className="font-semibold">{reportData.metadata.dataCurrency}</NeumorphicText>
                    <NeumorphicText size="sm" className="text-neumorphic-text-secondary mt-1">
                      Report date: {reportData.metadata.reportDate}
                    </NeumorphicText>
                  </NeumorphicCard>
                </div>

                <div>
                  <NeumorphicText className="font-semibold mb-2">Key Alerts</NeumorphicText>
                  <div className="space-y-2">
                    {reportData.alerts.slice(0, 3).map((alert, idx) => (
                      <div key={`${alert.title}-${idx}`} className="flex items-start justify-between gap-3 rounded-[var(--neumorphic-radius-md)] bg-neumorphic-button/60 p-3 border border-neumorphic-border/20">
                        <div>
                          <NeumorphicText className="font-semibold">{alert.title}</NeumorphicText>
                          <NeumorphicText size="sm" className="text-neumorphic-text-secondary">{alert.description}</NeumorphicText>
                          <NeumorphicText size="xs" className="text-neumorphic-text-secondary">Evidence: {alert.evidence}</NeumorphicText>
                        </div>
                        <NeumorphicBadge variant={alert.severity === 'Critical' ? 'danger' : alert.severity === 'High' ? 'warning' : 'info'}>
                          {alert.severity}
                        </NeumorphicBadge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <NeumorphicBadge variant="success">Positives: {reportData.positives.length}</NeumorphicBadge>
                  <NeumorphicBadge variant="warning">Mitigations: {reportData.mitigations.length}</NeumorphicBadge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <NeumorphicText size="sm" className="text-neumorphic-text-secondary">
                    Click the button generate a supplier-specific intelligence dossier.
                  </NeumorphicText>
                  <NeumorphicButton
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => {
                      console.log('Generating intelligence report', { supplier, reportData });
                      toast.success(`Intelligence report prepared for ${supplier.name}`, {
                        description: `${reportData.alerts.length} alerts, score ${reportData.scoring.overall}/100.`,
                      });
                    }}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Generate Intelligence Report
                  </NeumorphicButton>
                </div>
              </NeumorphicCard>
            </NeumorphicTabs.Content>
          </NeumorphicTabs>
        </NeumorphicCard>
      </div>
    </NeumorphicBackground>
  );
};

export default SupplierProfilePage; 
