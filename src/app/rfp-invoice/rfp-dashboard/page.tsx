"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicHeading,
  NeumorphicStatsCard,
  NeumorphicText
} from '@/components/ui/neumorphic';
import { Button } from '@/components/ui/button';
import { NeumorphicDataTable } from '@/components/ui/NeumorphicDataTable';
import LazyLoad from '@/components/ui/LazyLoad';
import { getRFPs, getAllInvoices } from '@/lib/sample-data/rfpSample';
import { TableColumn, TableAction } from '@/types/table';
import { 
  FileText, 
  DollarSign, 
  AlertTriangle, 
  Eye,
  Calendar,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

// Dynamic import for ApexCharts to handle SSR
const Chart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => (
    <div className="h-64 flex items-center justify-center bg-neumorphic-card rounded-lg border border-neumorphic-border animate-pulse">
      <NeumorphicText variant="secondary">Loading Pipeline Chart...</NeumorphicText>
    </div>
  )
});

// Note: ApexCharts config types are not well-defined, using any for chart events

// Consistent date formatting to prevent hydration mismatches
function formatDateConsistent(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Create proper interface that extends Record<string, unknown> as required by NeumorphicDataTable
interface RFPTableData extends Record<string, unknown> {
  id: string;
  title: string;
  status: string;
  startDate: string;
  submissionDeadline: string;
  invoiceCount: number;
}

// RFP Pipeline Chart Component
interface RFPData {
  id: string;
  title: string;
  status: string;
  startDate: string;
  submissionDeadline: string;
  associatedInvoices: unknown[];
}

function RFPPipelineChart({ rfps, onDataPointSelection }: { 
  rfps: RFPData[], 
  onDataPointSelection?: (rfpId: string) => void 
}) {
  // Transform RFP data for ApexCharts Range Bar
  const chartData = rfps.map(rfp => ({
    x: rfp.title,
    y: [
      new Date(rfp.startDate).getTime(),
      new Date(rfp.submissionDeadline).getTime()
    ],
    id: rfp.id // Add RFP ID to the data for selection
  }));

  // Status-based color mapping
  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'Open for Submission': '#3B82F6', // Blue
      'Under Review': '#F59E0B',        // Amber
      'Awarded': '#10B981',             // Emerald
      'Completed': '#6B7280',           // Gray
      'Closed': '#EF4444'               // Red
    };
    return colorMap[status] || '#6B7280';
  };

  const chartOptions = {
    chart: {
      type: 'rangeBar' as const,
      height: 300,
      background: 'transparent',
      toolbar: { show: true },
      events: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dataPointSelection: (_event: unknown, _chartContext: unknown, config: any) => {
          // Use setTimeout to avoid DOM timing issues with getBoundingClientRect
          setTimeout(() => {
            if (onDataPointSelection && config && config.dataPointIndex >= 0 && config.dataPointIndex < rfps.length) {
              const clickedRfp = rfps[config.dataPointIndex];
              if (clickedRfp?.id) {
                onDataPointSelection(clickedRfp.id);
              }
            }
          }, 0);
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
        dataLabels: {
          hideOverflowingLabels: false
        }
      }
    },
    colors: rfps.map(rfp => getStatusColor(rfp.status)),
    dataLabels: {
      enabled: true,
      formatter: function(val: number[]) {
        const days = Math.ceil((val[1] - val[0]) / (1000 * 60 * 60 * 24));
        return `${days} days`;
      },
      style: {
        colors: ['var(--neumorphic-text-primary)']
      }
    },
    xaxis: {
      type: 'datetime' as const,
      labels: {
        style: {
          colors: 'var(--neumorphic-text-primary)'
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: 'var(--neumorphic-text-primary)'
        }
      }
    },
    grid: {
      borderColor: 'var(--neumorphic-border)',
      strokeDashArray: 3
    },
    legend: {
      show: false
    },
    tooltip: {
      theme: 'dark' as const,
      style: {
        fontSize: '12px'
      },
      custom: function({ dataPointIndex }: { dataPointIndex: number }) {
        const rfp = rfps[dataPointIndex];
        const start = formatDateConsistent(rfp.startDate);
        const end = formatDateConsistent(rfp.submissionDeadline);
        const days = Math.ceil((new Date(rfp.submissionDeadline).getTime() - new Date(rfp.startDate).getTime()) / (1000 * 60 * 60 * 24));
        
        return `
          <div style="
            padding: 12px; 
            background: var(--neumorphic-card); 
            border: 1px solid var(--neumorphic-border); 
            border-radius: var(--neumorphic-radius-md); 
            box-shadow: var(--neumorphic-shadow-convex);
            backdrop-filter: blur(var(--neumorphic-blur));
            max-width: 280px;
            font-family: inherit;
          ">
            <div style="color: var(--neumorphic-text-primary); font-weight: 600; margin-bottom: 8px; font-size: 14px;">${rfp.title}</div>
            <div style="color: var(--neumorphic-text-secondary); font-size: 12px; margin-bottom: 4px;">Status: <span style="color: var(--neumorphic-text-primary); font-weight: 500;">${rfp.status}</span></div>
            <div style="color: var(--neumorphic-text-secondary); font-size: 12px; margin-bottom: 4px;">Duration: <span style="color: var(--neumorphic-text-primary); font-weight: 500;">${days} days</span></div>
            <div style="color: var(--neumorphic-text-secondary); font-size: 12px; margin-bottom: 4px;">Timeline: <span style="color: var(--neumorphic-text-primary); font-weight: 500;">${start} → ${end}</span></div>
            <div style="color: var(--neumorphic-text-secondary); font-size: 12px; margin-bottom: 8px;">Invoices: <span style="color: var(--neumorphic-text-primary); font-weight: 500;">${rfp.associatedInvoices.length}</span></div>
            <div style="color: var(--neumorphic-accent); font-size: 11px; font-style: italic;">💡 Click to filter table by this RFP</div>
          </div>
        `;
      }
    }
  };

  const series = [{
    name: 'RFP Timeline',
    data: chartData
  }];

  return (
    <div className="w-full">
      <Chart
        options={chartOptions}
        series={series}
        type="rangeBar"
        height={300}
      />
    </div>
  );
}

export default function RFPDashboard() {
  // State Management for Filtering
  const [selectedRfpId, setSelectedRfpId] = useState<string | null>(null);
  
  const rfps = getRFPs();
  const allInvoices = getAllInvoices();

  // Filter the data based on selectedRfpId
  const allRFPs = rfps;
  const displayedRFPs = selectedRfpId 
    ? allRFPs.filter(rfp => rfp.id === selectedRfpId) 
    : allRFPs;

  // Calculate KPIs based on displayed data
  const totalRFPs = displayedRFPs.length;
  const activeRFPs = displayedRFPs.filter(rfp => ['Open for Submission', 'Under Review', 'Awarded'].includes(rfp.status)).length;
  const totalInvoices = selectedRfpId 
    ? displayedRFPs.reduce((count, rfp) => count + rfp.associatedInvoices.length, 0)
    : allInvoices.length;
  const riskFlags = selectedRfpId
    ? displayedRFPs.reduce((count, rfp) => 
        count + rfp.associatedInvoices.reduce((rfpCount, inv) => 
          rfpCount + ((inv as { analysis?: { flags: unknown[] } }).analysis?.flags.length || 0), 0), 0)
    : allInvoices.reduce((count, invoice) => 
        count + (invoice.analysis?.flags.length || 0), 0);

  // Handler for chart data point selection
  const handleChartSelection = (rfpId: string) => {
    const selectedRfp = allRFPs.find(rfp => rfp.id === rfpId);
    setSelectedRfpId(rfpId);
    
    if (selectedRfp) {
      toast(`Filtered by RFP: ${selectedRfp.title}`, {
        description: "Click 'Clear Filter' to show all RFPs again"
      });
    }
  };

  // Clear filter handler
  const clearFilter = () => {
    setSelectedRfpId(null);
    toast("Filter cleared", {
      description: "Showing all RFPs"
    });
  };

  // Clickable Invoice Badge Component
  const InvoiceBadge: React.FC<{ count: number; onClick: () => void }> = ({ count, onClick }) => (
    <Badge 
      variant="outline" 
      className="cursor-pointer hover:bg-neumorphic-accent/10 transition-colors bg-blue-500/10 text-blue-600 border-blue-500/20 hover:border-blue-500/40"
      onClick={(e) => {
        e.stopPropagation(); // Prevent row click
        onClick();
      }}
    >
      {count} Invoice{count !== 1 ? 's' : ''}
      <ChevronRight className="ml-1 h-3 w-3" />
    </Badge>
  );

  // Expanded Row Component for Invoice Details
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const RFPInvoiceDetails: React.FC<{ row: RFPTableData & { associatedInvoices: any[] }; onClose: () => void }> = ({ row }) => (
    <div className="space-y-4 p-4 bg-neumorphic-card/50 rounded-lg border border-neumorphic-border">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-neumorphic-text-primary">
          Associated Invoices for {row.title}
        </h4>
        <Badge variant="outline" className="text-xs">
          {row.associatedInvoices.length} Invoice{row.associatedInvoices.length !== 1 ? 's' : ''}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {row.associatedInvoices.map((invoice: any) => (
          <div 
            key={invoice.id} 
            className="flex items-center justify-between p-3 bg-neumorphic-background rounded-lg border border-neumorphic-border/50 hover:border-neumorphic-border transition-colors"
          >
            <div className="flex items-center space-x-4">
              <button
                className="text-blue-600 hover:text-blue-800 font-medium underline-offset-4 hover:underline transition-colors"
                onClick={() => {
                  // Navigate to Invoice DNA view
                  toast(`Navigating to Invoice ${invoice.id}`, {
                    description: "Opening Invoice DNA view..."
                  });
                }}
              >
                {invoice.id}
              </button>
              <span className="text-neumorphic-text-secondary">
                Amount: <span className="font-medium text-neumorphic-text-primary">R{invoice.amount.toLocaleString()}</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge 
                variant={
                  invoice.status === 'Approved' ? 'default' : 
                  invoice.status === 'Queried' ? 'secondary' : 
                  'outline'
                }
                className={
                  invoice.status === 'Approved' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                  invoice.status === 'Queried' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                  invoice.status === 'Pending' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                  'bg-red-500/10 text-red-600 border-red-500/20'
                }
              >
                {invoice.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-2 border-t border-neumorphic-border/50">
        <div className="flex justify-between text-sm text-neumorphic-text-secondary">
          <span>Total Invoice Value:</span>
          <span className="font-medium text-neumorphic-text-primary">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            R{row.associatedInvoices.reduce((sum: number, inv: any) => sum + inv.amount, 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );

  // Transform RFP data to match table interface requirements
  const tableData: (RFPTableData & { associatedInvoices: unknown[] })[] = displayedRFPs.map(rfp => ({
    id: rfp.id,
    title: rfp.title,
    status: rfp.status,
    startDate: rfp.startDate,
    submissionDeadline: rfp.submissionDeadline,
    invoiceCount: rfp.associatedInvoices.length,
    associatedInvoices: rfp.associatedInvoices // Include for expansion
  }));

  // Find the selected RFP for display
  const selectedRfp = selectedRfpId ? allRFPs.find(rfp => rfp.id === selectedRfpId) : null;

  // RFP Table columns following SimpleDataTableDemo pattern exactly
  const rfpColumns: TableColumn<RFPTableData>[] = [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'RFP ID',
      sortable: true,
      filterable: true
    },
    {
      id: 'title',
      accessorKey: 'title',
      header: 'Title',
      sortable: true,
      filterable: true
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      cell: (value) => (
        <Badge 
          variant="outline" 
          className={getStatusBadgeClass(value as string)}
        >
          {value as string}
        </Badge>
      )
    },
    {
      id: 'startDate',
      accessorKey: 'startDate',
      header: 'Start Date',
      sortable: true,
      cell: (value) => formatDateConsistent(value as string)
    },
    {
      id: 'submissionDeadline',
      accessorKey: 'submissionDeadline',
      header: 'Deadline',
      sortable: true,
      cell: (value) => formatDateConsistent(value as string)
    },
    {
      id: 'invoiceCount',
      accessorKey: 'invoiceCount',
      header: 'Invoices',
      cell: (value) => (
        <div className="text-center">
          <InvoiceBadge 
            count={value as number}
            onClick={() => {
              toast("Click the row to expand and view invoice details", {
                description: "Row expansion will show associated invoices"
              });
            }}
          />
        </div>
      ),
      align: 'center' as const
    }
  ];

  // RFP Table actions following the correct pattern with id property
  const rfpActions: TableAction<RFPTableData>[] = [
    {
      id: 'view-details',
      label: 'View Details',
      icon: Eye,
      onClick: (row) => {
        toast(`Viewing RFP: ${row.title}`, {
          description: `Status: ${row.status}`,
        });
      }
    },
    {
      id: 'view-timeline',
      label: 'View Timeline',
      icon: Calendar,
      onClick: (row) => {
        toast(`Timeline for: ${row.title}`, {
          description: `From ${formatDateConsistent(row.startDate)} to ${formatDateConsistent(row.submissionDeadline)}`,
        });
      }
    }
  ];

  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="w-full space-y-4">
        {/* Header */}
        <NeumorphicCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <NeumorphicHeading>RFP Mission Control</NeumorphicHeading>
              <NeumorphicText variant="secondary" className="leading-tight mt-1">
                Strategic command center for the entire procurement pipeline with real-time oversight and intelligent insights.
              </NeumorphicText>
              {selectedRfp && (
                <NeumorphicText className="text-sm mt-2 text-neumorphic-accent">
                  📍 Filtered by: {selectedRfp.title}
                </NeumorphicText>
              )}
            </div>
          </div>
        </NeumorphicCard>

        {/* Top Row: KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NeumorphicStatsCard
            title={selectedRfpId ? "Filtered RFPs" : "Total RFPs"}
            value={totalRFPs.toString()}
            icon={<FileText className="w-6 h-6 text-blue-400" />}
            trend="up"
            trendValue={selectedRfpId ? `1 of ${allRFPs.length}` : "+2 this month"}
          />
          <NeumorphicStatsCard
            title="Active RFPs"
            value={activeRFPs.toString()}
            icon={<Calendar className="w-6 h-6 text-green-400" />}
            trend="up"
            trendValue={totalRFPs > 0 ? `${Math.round((activeRFPs/totalRFPs)*100)}% of ${selectedRfpId ? 'filtered' : 'total'}` : "0%"}
          />
          <NeumorphicStatsCard
            title={selectedRfpId ? "RFP Invoices" : "Total Invoices"}
            value={totalInvoices.toString()}
            icon={<DollarSign className="w-6 h-6 text-purple-400" />}
            trend="up"
            trendValue={selectedRfpId ? `${selectedRfp?.title || 'Selected RFP'}` : "+5 this week"}
          />
          <NeumorphicStatsCard
            title="Risk Flags"
            value={riskFlags.toString()}
            icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
            trend={riskFlags > 0 ? "down" : "up"}
            trendValue={riskFlags > 0 ? "Requires attention" : "All clear"}
          />
        </div>

        {/* RFP Pipeline Chart - ApexCharts Range Bar */}
        <NeumorphicCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <NeumorphicHeading>RFP Pipeline</NeumorphicHeading>
              <NeumorphicText variant="secondary" className="text-sm mt-1">
                Visual timeline overview of all RFPs from start date to submission deadline. Click any bar to filter the table below.
              </NeumorphicText>
            </div>
            {selectedRfpId && (
              <Button 
                variant="neumorphic-outline" 
                onClick={clearFilter}
                className="ml-4 flex items-center gap-2"
                size="sm"
              >
                <X className="w-4 h-4" />
                Clear Filter
              </Button>
            )}
          </div>
          <LazyLoad fallback={
            <div className="h-64 flex items-center justify-center bg-neumorphic-card rounded-lg border border-neumorphic-border animate-pulse">
              <NeumorphicText variant="secondary">Loading Pipeline Chart...</NeumorphicText>
            </div>
          }>
            <RFPPipelineChart 
              rfps={allRFPs} 
              onDataPointSelection={handleChartSelection}
              key={selectedRfpId || 'all'} // Force re-render when filter changes
            />
          </LazyLoad>
        </NeumorphicCard>

        {/* Main Content: RFP Table */}
        <NeumorphicCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <NeumorphicHeading>
                RFP Management
                {selectedRfpId && (
                  <span className="text-neumorphic-accent text-base font-normal ml-2">
                    - {selectedRfp?.title}
                  </span>
                )}
              </NeumorphicHeading>
              <NeumorphicText variant="secondary" className="text-sm mt-1">
                {selectedRfpId 
                  ? `Showing details for the selected RFP with ${totalInvoices} associated invoice${totalInvoices !== 1 ? 's' : ''}.`
                  : "Comprehensive overview of all Request for Proposals with status tracking and actionable insights."
                }
              </NeumorphicText>
            </div>
            {selectedRfpId && (
              <Button 
                variant="neumorphic-outline" 
                onClick={clearFilter}
                className="flex items-center gap-2"
                size="sm"
              >
                <X className="w-4 h-4" />
                Show All RFPs
              </Button>
            )}
          </div>
          <NeumorphicDataTable
            data={tableData}
            columns={rfpColumns}
            rowActions={rfpActions}
            features={{
              search: true,
              sorting: true,
              filtering: true,
              pagination: true,
              selection: 'none',
              columnVisibility: true,
              export: true,
              rowExpansion: true
            }}
            rowDetails={{
              component: RFPInvoiceDetails,
              title: (row) => `${row.title} - Invoice Details`
            }}
            pagination={{
              pageSize: 10
            }}
            key={`table-${selectedRfpId || 'all'}-${tableData.length}`} // Force re-render when data changes
          />
        </NeumorphicCard>
      </div>
    </NeumorphicBackground>
  );
}

// Helper function to get status badge styling that matches chart colors
function getStatusBadgeClass(status: string): string {
  const classMap: Record<string, string> = {
    'Open for Submission': 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-600',
    'Under Review': 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-600',
    'Awarded': 'border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-600',
    'Completed': 'border-gray-500 text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-600',
    'Closed': 'border-red-500 text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400 dark:border-red-600'
  };
  return classMap[status] || 'border-gray-500 text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-600';
} 