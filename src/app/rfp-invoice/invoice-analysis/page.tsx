"use client";

import React, { useState, useMemo } from 'react';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicHeading,
  NeumorphicText
} from '@/components/ui/neumorphic';
import { Button } from '@/components/ui/button';
import { NeumorphicDataTable } from '@/components/ui/NeumorphicDataTable';
import CircularProgressRing from '@/components/ui/CircularProgressRing';
import FlagBadge from '@/components/ui/FlagBadge';
import { getAllInvoices, getInvoiceDNAData, getInvoiceDetails } from '@/lib/sample-data/rfpSample';
import { TableColumn } from '@/types/table';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InvoiceAnalysisView } from '@/components/features/InvoiceAnalysisView';
import { toast } from 'sonner';
import { X, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';

// Helper function to format dates consistently between server and client
function formatDateConsistent(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
}

// Interface that extends Record<string, unknown> as required by NeumorphicDataTable
interface InvoiceTableData extends Record<string, unknown> {
  id: string;
  supplierName: string;
  amount: number;
  status: string;
  submissionDate: string;
  overallConfidenceScore: number;
  flagCount: number;
  highestSeverity: 'Critical' | 'High' | 'Medium' | 'Low' | 'None';
}

// Helper function to get status badge variant
function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variantMap: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'Pending Analysis': 'outline',
    'Approved': 'secondary',
    'Rejected': 'destructive',
    'Queried': 'default'
  };
  return variantMap[status] || 'default';
}

// Enhanced filter types for triage buttons
type FilterType = 'all' | 'critical' | 'high' | 'medium' | 'low' | 'pending';

// Risk tier helper for consistent thresholds and colors (higher score = higher risk)
function getRiskTier(score: number) {
  if (score >= 75) return { label: 'Critical', textClass: 'text-red-500' };
  if (score >= 50) return { label: 'High Risk', textClass: 'text-orange-500' };
  if (score >= 25) return { label: 'Medium Risk', textClass: 'text-yellow-500' };
  return { label: 'Low Risk', textClass: 'text-green-500' };
}

// Helper function to get row styling based on AI risk score
function getRowClassName(row: InvoiceTableData): string {
  const score = row.overallConfidenceScore;
  
  if (score >= 75) {
    // Critical: Red background with enhanced hover and neumorphic lift effect
    return 'bg-red-500/10 hover:bg-red-500/20 border-l-4 border-red-500/30 hover:shadow-[0_4px_12px_rgba(239,68,68,0.15)] hover:-translate-y-0.5 transition-all duration-200';
  } else if (score >= 50) {
    // High: Orange background with enhanced hover
    return 'bg-orange-500/10 hover:bg-orange-500/20 border-l-4 border-orange-500/30 hover:shadow-[0_4px_12px_rgba(249,115,22,0.15)] hover:-translate-y-0.5 transition-all duration-200';
  } else if (score >= 25) {
    // Medium: Yellow background with enhanced hover
    return 'bg-yellow-500/10 hover:bg-yellow-500/20 border-l-4 border-yellow-500/30 hover:shadow-[0_4px_12px_rgba(234,179,8,0.15)] hover:-translate-y-0.5 transition-all duration-200';
  } else {
    // Low: Green background with subtle hover
    return 'bg-green-500/5 hover:bg-green-500/10 border-l-4 border-green-500/20 hover:shadow-[0_2px_8px_rgba(34,197,94,0.1)] hover:-translate-y-0.5 transition-all duration-200';
  }
}

export default function InvoiceAnalysisPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceTableData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Get all invoices with analysis data
  const allInvoices = getAllInvoices();
  
  // Transform data to match table interface requirements
  const tableData: InvoiceTableData[] = useMemo(() => {
    return allInvoices.map(invoice => {
      const analysis = invoice.analysis;
      const flags = analysis?.flags || [];
      
      // Determine highest severity
      let highestSeverity: 'Critical' | 'High' | 'Medium' | 'Low' | 'None' = 'None';
      if (flags.some(f => f.severity === 'Critical')) highestSeverity = 'Critical';
      else if (flags.some(f => f.severity === 'High')) highestSeverity = 'High';
      else if (flags.some(f => f.severity === 'Medium')) highestSeverity = 'Medium';
      else if (flags.some(f => f.severity === 'Low')) highestSeverity = 'Low';
      
      return {
        id: invoice.id,
        supplierName: invoice.supplierName,
        amount: invoice.amount,
        status: invoice.status,
        submissionDate: invoice.submissionDate,
        overallConfidenceScore: analysis?.overallConfidenceScore || 0,
        flagCount: flags.length,
        highestSeverity
      };
    });
  }, [allInvoices]);

  // Filter data based on active filter
  const filteredData = useMemo(() => {
    switch (activeFilter) {
      case 'critical':
        return tableData.filter(row => row.overallConfidenceScore >= 75);
      case 'high':
        return tableData.filter(row => row.overallConfidenceScore >= 50 && row.overallConfidenceScore < 75);
      case 'medium':
        return tableData.filter(row => row.overallConfidenceScore >= 25 && row.overallConfidenceScore < 50);
      case 'low':
        return tableData.filter(row => row.overallConfidenceScore < 25);
      case 'pending':
        return tableData.filter(row => row.status === 'Pending Analysis');
      default:
        return tableData;
    }
  }, [tableData, activeFilter]);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    return {
      all: tableData.length,
      critical: tableData.filter(row => row.overallConfidenceScore >= 75).length,
      high: tableData.filter(row => row.overallConfidenceScore >= 50 && row.overallConfidenceScore < 75).length,
      medium: tableData.filter(row => row.overallConfidenceScore >= 25 && row.overallConfidenceScore < 50).length,
      low: tableData.filter(row => row.overallConfidenceScore < 25).length,
      pending: tableData.filter(row => row.status === 'Pending Analysis').length
    };
  }, [tableData]);

  // Handle row click to open invoice analysis modal
  const handleRowClick = (row: InvoiceTableData) => {
    setSelectedInvoice(row);
    setIsDialogOpen(true);
    
    // Provide user feedback
    toast.success(`Opening Invoice DNA Analysis`, {
      description: `${row.id} • Risk Score: ${row.overallConfidenceScore}% • ${row.supplierName}`,
      duration: 2000,
    });
  };

  // Define columns following SimpleDataTableDemo pattern exactly
  const columns: TableColumn<InvoiceTableData>[] = [
    {
      id: 'aiRiskScore',
      header: 'AI Risk Score',
      accessorKey: 'overallConfidenceScore',
      sortable: true,
      cell: (value) => (
        <CircularProgressRing 
          percentage={value as number} 
          size={50} 
          strokeWidth={4}
          colorMode="risk"
        />
      ),
      width: 120
    },
    {
      id: 'id',
      header: 'Invoice ID',
      accessorKey: 'id',
      sortable: true,
      filterable: true,
      width: 120
    },
    {
      id: 'supplierName',
      header: 'Supplier',
      accessorKey: 'supplierName',
      sortable: true,
      filterable: true,
      width: 200
    },
    {
      id: 'amount',
      header: 'Amount',
      accessorKey: 'amount',
      sortable: true,
      cell: (value) => `R${(value as number).toLocaleString()}`,
      width: 120
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      filterable: true,
      cell: (value) => (
        <Badge variant={getStatusBadgeVariant(value as string)}>
          {value as string}
        </Badge>
      ),
      width: 140
    },
    {
      id: 'flags',
      header: 'Flags',
      accessorKey: 'flagCount',
      sortable: true,
      cell: (value, row) => {
        const flagCount = value as number;
        const severity = row.highestSeverity as 'Critical' | 'High' | 'Medium' | 'Low' | 'None';
        
        if (flagCount === 0) {
          return <span className="text-neumorphic-text-secondary text-sm">No flags</span>;
        }
        
        return (
          <div className="flex items-center gap-2">
            <FlagBadge severity={severity === 'None' ? 'Low' : severity}>
              {flagCount} {flagCount === 1 ? 'flag' : 'flags'}
            </FlagBadge>
          </div>
        );
      },
      width: 140
    },
    {
      id: 'submissionDate',
      header: 'Submission Date',
      accessorKey: 'submissionDate',
      sortable: true,
      cell: (value) => formatDateConsistent(value as string),
      width: 140
    }
  ];

  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="w-full space-y-4">
        {/* Header */}
        <NeumorphicCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <NeumorphicHeading>Invoice DNA</NeumorphicHeading>
              <NeumorphicText variant="secondary" className="leading-tight mt-1">
                Your AI-powered command center for risk analysis. Click any row to open the full Invoice DNA investigation.
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>

        {/* Enhanced Triage Filter Buttons - The User's "To-Do List" */}
        <NeumorphicCard>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-neumorphic-text-primary" />
                             <NeumorphicHeading className="text-base">Priority Triage Filters</NeumorphicHeading>
              {activeFilter !== 'all' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                  className="ml-auto flex items-center gap-1 text-xs"
                >
                  <X className="w-3 h-3" />
                  Clear Filter
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3">
                             <Button
                 variant={activeFilter === 'all' ? 'neumorphic' : 'neumorphic-outline'}
                 onClick={() => setActiveFilter('all')}
                 className="text-sm flex items-center gap-2"
               >
                 <CheckCircle className="w-4 h-4" />
                 All ({filterCounts.all})
               </Button>
               <Button
                 variant={activeFilter === 'critical' ? 'neumorphic' : 'neumorphic-outline'}
                 onClick={() => setActiveFilter('critical')}
                 className="text-sm text-red-600 hover:text-red-700 flex items-center gap-2 border-red-500/30"
               >
                 <AlertTriangle className="w-4 h-4" />
                 Critical ({filterCounts.critical})
               </Button>
               <Button
                 variant={activeFilter === 'high' ? 'neumorphic' : 'neumorphic-outline'}
                 onClick={() => setActiveFilter('high')}
                 className="text-sm text-orange-600 hover:text-orange-700 flex items-center gap-2 border-orange-500/30"
               >
                 <AlertTriangle className="w-4 h-4" />
                 High ({filterCounts.high})
               </Button>
               <Button
                 variant={activeFilter === 'medium' ? 'neumorphic' : 'neumorphic-outline'}
                 onClick={() => setActiveFilter('medium')}
                 className="text-sm text-yellow-600 hover:text-yellow-700 flex items-center gap-2 border-yellow-500/30"
               >
                 <Clock className="w-4 h-4" />
                 Medium ({filterCounts.medium})
               </Button>
               <Button
                 variant={activeFilter === 'low' ? 'neumorphic' : 'neumorphic-outline'}
                 onClick={() => setActiveFilter('low')}
                 className="text-sm text-green-600 hover:text-green-700 flex items-center gap-2 border-green-500/30"
               >
                 <CheckCircle className="w-4 h-4" />
                 Low ({filterCounts.low})
               </Button>
               <Button
                 variant={activeFilter === 'pending' ? 'neumorphic' : 'neumorphic-outline'}
                 onClick={() => setActiveFilter('pending')}
                 className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-2 border-blue-500/30"
               >
                 <XCircle className="w-4 h-4" />
                 Pending Analysis ({filterCounts.pending})
               </Button>
            </div>
          </div>
        </NeumorphicCard>

        {/* Enhanced Invoice Table with Visual Priority Rows */}
        <NeumorphicCard>
          <div className="mb-4">
            <NeumorphicHeading>
              {activeFilter === 'all' 
                ? 'All Invoices' 
                : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Priority Invoices`
              }
            </NeumorphicHeading>
            <NeumorphicText variant="secondary" className="text-sm mt-1">
              {activeFilter === 'all' 
                ? 'Click any row to open the full Invoice DNA analysis. Rows are color-coded by AI risk assessment.'
                : `Showing ${filteredData.length} ${activeFilter} priority invoices. Click any row to investigate.`
              }
            </NeumorphicText>
          </div>
          
          <div className="space-y-4">
            {/* Enhanced Color Legend with Risk Descriptions */}
            <div className="flex flex-wrap items-center gap-6 text-sm p-3 bg-neumorphic-card/50 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500/20 border-l-4 border-red-500/60 rounded"></div>
                <span className="text-neumorphic-text-secondary">Critical Risk (≤30%) - Immediate Action Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500/20 border-l-4 border-orange-500/60 rounded"></div>
                <span className="text-neumorphic-text-secondary">High Risk (31-50%) - Priority Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500/20 border-l-4 border-yellow-500/60 rounded"></div>
                <span className="text-neumorphic-text-secondary">Medium Risk (51-70%) - Standard Review</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500/10 border-l-4 border-green-500/40 rounded"></div>
                <span className="text-neumorphic-text-secondary">Low Risk (&gt;70%) - Routine Processing</span>
              </div>
            </div>

            {/* Enhanced Data Table with Row Click-to-Open */}
            <NeumorphicDataTable
              data={filteredData}
              columns={columns}
              rowClassName={getRowClassName}
              features={{
                search: true,
                sorting: true,
                filtering: true,
                pagination: true,
                selection: 'none',
                columnVisibility: true,
                export: true,
                rowActions: false // Remove row actions since entire row is clickable
              }}
              pagination={{
                pageSize: 10
              }}
              onRowClick={handleRowClick}
              className="w-full"
            />
          </div>
        </NeumorphicCard>

        {/* Full-Screen Invoice Analysis Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent variant="neumorphic" className="sm:max-w-[95vw] max-h-[95vh] overflow-y-auto">
            <DialogHeader variant="neumorphic">
              <div className="relative w-full">
                {/* Left Column - Title and Subtitle */}
                <div className="pr-24">
                  <DialogTitle variant="neumorphic" className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-neumorphic-text-primary" />
                    Invoice DNA Analysis: {selectedInvoice?.id}
                  </DialogTitle>
                  <div className="text-sm text-muted-foreground neumorphic-dialog-description text-base">
                    <span>{selectedInvoice?.supplierName} • Amount: R{selectedInvoice?.amount.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Center - Large Circular Progress Ring (Absolutely Positioned) */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center h-full text-center">
                  <CircularProgressRing 
                    percentage={selectedInvoice?.overallConfidenceScore || 0} 
                    size={60} 
                    strokeWidth={4}
                    colorMode="risk"
                  />
                  <div className="mt-2">
                    {(() => {
                      const score = selectedInvoice?.overallConfidenceScore || 0;
                      const { label, textClass } = getRiskTier(score);
                      return (
                        <div className={`text-sm font-semibold ${textClass}`}>
                          {label}
                        </div>
                      );
                    })()}
                    <div className="text-xs text-neumorphic-text-secondary">
                      {selectedInvoice?.overallConfidenceScore || 0}% Score
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Status Badge */}
                <div className="absolute top-0 right-0 flex items-center justify-end h-full">
                  <Badge variant={getStatusBadgeVariant(selectedInvoice?.status || '')}>
                    {selectedInvoice?.status}
                  </Badge>
                </div>
              </div>
            </DialogHeader>
            
            {/* Full Invoice DNA Analysis Component */}
            <div className="py-4">
              {selectedInvoice && (() => {
                const dnaData = getInvoiceDNAData(selectedInvoice.id);
                const invoiceDetails = getInvoiceDetails(selectedInvoice.id);
                
                if (dnaData && invoiceDetails) {
                  return (
                    <InvoiceAnalysisView 
                      rfpTitle={dnaData.rfpTitle}
                      dnaItems={dnaData.dnaItems}
                      analysis={invoiceDetails.analysis}
                    />
                  );
                }
                return (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <AlertTriangle className="w-12 h-12 text-neumorphic-text-secondary mx-auto mb-3" />
                      <NeumorphicText>Loading analysis...</NeumorphicText>
                    </div>
                  </div>
                );
              })()}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </NeumorphicBackground>
  );
} 
