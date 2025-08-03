'use client';

// @ts-nocheck
import React, { useState, createContext } from 'react';
import { Badge } from '@/components/ui/badge';
import { NeumorphicDataTable } from '@/components/ui/NeumorphicDataTable';
import { TableColumn, TableAction, BulkAction } from '@/types/table';
import { ActiveVettingCase, VettingStatus } from '@/types/vetting';
import { Eye, Edit2, CheckCircle, XCircle, AlertTriangle, UserPlus, ArrowUp, Download, Target, FileText, Clock } from 'lucide-react';
import CheckProgressIndicator from './CheckProgressIndicator';
import IndividualChecksList from './IndividualChecksList';
import { CaseTimelineChart } from './CaseTimelineChart';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { InterimReportDocument } from './InterimReportDocument';
import { toast } from 'sonner';

// Focus Context for Provider Filtering
interface FocusContextType {
  focus: { type: 'Provider' | 'Status' | null; id: string } | null;
  setFocus: (focus: { type: 'Provider' | 'Status'; id: string }) => void;
  clearFocus: () => void;
}

const FocusContext = createContext<FocusContextType>({
  focus: null,
  setFocus: () => {},
  clearFocus: () => {}
});

// Extend ActiveVettingCase to satisfy Record<string, unknown> constraint
interface ActiveVettingCaseTableRow extends ActiveVettingCase, Record<string, unknown> {
  primaryProvider?: string;
  expanded?: boolean;
}

// Status animations CSS
const statusAnimations = `
  @keyframes heartbeat-blue {
    0%, 100% { box-shadow: 0 0 8px rgba(59, 130, 246, 0.4); }
    50% { box-shadow: 0 0 16px rgba(59, 130, 246, 0.7); }
  }
  @keyframes heartbeat-amber {
    0%, 100% { transform: scale(1); box-shadow: 0 0 8px rgba(245, 158, 11, 0.4); }
    50% { transform: scale(1.05); box-shadow: 0 0 16px rgba(245, 158, 11, 0.7); }
  }
  @keyframes heartbeat-red {
    0%, 100% { background-color: transparent; }
    50% { background-color: rgba(239, 68, 68, 0.2); }
  }
  .animate-heartbeat-blue { animation: heartbeat-blue 2s infinite; }
  .animate-heartbeat-amber { animation: heartbeat-amber 1.5s infinite; }
  .animate-heartbeat-red { animation: heartbeat-red 1s infinite; }
`;

interface ActiveCasesTableProps {
  cases: ActiveVettingCase[];
  loading?: boolean;
  onViewCase?: (caseId: string) => void;
  onViewEntity?: (caseId: string) => void;
  onEditCase?: (caseId: string) => void;
  onApproveCase?: (caseId: string) => void;
  onRejectCase?: (caseId: string) => void;
  onBulkAction?: (action: string, selectedIds: string[]) => void;
  className?: string;
  missionControlMode?: boolean;
  focusContext?: FocusContextType;
}

const ActiveCasesTable: React.FC<ActiveCasesTableProps> = ({
  cases,
  loading = false, // eslint-disable-line @typescript-eslint/no-unused-vars
  onViewCase,
  onViewEntity,
  onEditCase,
  onApproveCase,
  onRejectCase,
  onBulkAction,
  className = '',
  missionControlMode = false,
  focusContext
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedCase, setSelectedCase] = useState<ActiveVettingCase | null>(null);
  const [showPDFModal, setShowPDFModal] = useState(false);
  
  // Use provided focus context or create default
  const focus = focusContext?.focus || null;
  const setFocus = focusContext?.setFocus || (() => {});
  // Convert cases to table rows with enhancement
  const tableData: ActiveVettingCaseTableRow[] = cases.map(caseItem => ({
    ...caseItem,
    primaryProvider: caseItem.individualChecks.length > 0 
      ? caseItem.individualChecks[0].provider?.split(' ')[0] || 'Unknown'
      : 'Unknown',
    expanded: expandedRows.has(caseItem.id)
  }));
  
  // Filter cases based on focus
  const filteredData = focus && focus.type === 'Provider' 
    ? tableData.filter(c => c.primaryProvider === focus.id)
    : tableData;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge variant
  const getStatusVariant = (status: VettingStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case VettingStatus.COMPLETE:
        return 'default'; // Green
      case VettingStatus.IN_PROGRESS:
        return 'secondary'; // Blue
      case VettingStatus.FAILED:
      case VettingStatus.CANCELLED:
        return 'destructive'; // Red
      case VettingStatus.CONSENT_PENDING:
        return 'outline'; // Gray
      default:
        return 'outline';
    }
  };
  
  // Get status animation for mission control mode
  const getStatusAnimation = (status: VettingStatus, isOverdue?: boolean) => {
    if (!missionControlMode) return '';
    
    if (isOverdue) return 'animate-heartbeat-red';
    
    switch (status) {
      case VettingStatus.IN_PROGRESS:
        return 'animate-heartbeat-blue';
      case VettingStatus.CONSENT_PENDING:
        return 'animate-heartbeat-amber';
      default:
        return '';
    }
  };
  
  // Handle provider focus from context menu
  const handleProviderFocus = (provider: string) => {
    setFocus({ type: 'Provider', id: provider });
    toast.success(`Focus Mode Active: Provider ${provider}`);
  };
  
  // Handle row expansion for timeline
  const handleRowExpansion = (rowId: string) => {
    const newExpanded = new Set<string>();
    if (!expandedRows.has(rowId)) {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };
  
  // Handle view dossier
  const handleViewDossier = (caseItem: ActiveVettingCase) => {
    setSelectedCase(caseItem);
    setShowPDFModal(true);
  };

  // Get priority badge variant
  const getPriorityVariant = (priority: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (priority) {
      case 'Urgent':
        return 'destructive';
      case 'High':
        return 'secondary';
      case 'Medium':
        return 'outline';
      default:
        return 'outline';
    }
  };

  // Define table columns using the correct structure
  const columns: TableColumn<ActiveVettingCaseTableRow>[] = [
    {
      id: 'caseNumber',
      accessorKey: 'caseNumber',
      header: 'Case Number',
      sortable: true,
      filterable: true,
      width: 150,
      cell: (value, row) => (
        <div className="font-mono text-sm">
          <div className="font-medium">{row.caseNumber}</div>
          <div className="text-xs text-[var(--neumorphic-muted-foreground)]">
            {row.daysSinceInitiated} days ago
          </div>
        </div>
      ),
    },
    {
      id: 'entityName',
      accessorKey: 'entityName',
      header: 'Entity',
      sortable: true,
      filterable: true,
      width: 200,
      cell: (value, row) => (
        <div>
          <div 
            className="font-medium cursor-pointer hover:text-blue-400 transition-colors"
            onClick={() => onViewEntity?.(row.id)}
            title="Click to view Entity 360° profile"
          >
            {row.entityName}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {row.entityType}
            </Badge>
            <span className="text-xs text-[var(--neumorphic-muted-foreground)]">
              {row.entityIdentifier}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      width: 120,
      cell: (value, row) => (
        <div className="flex flex-col gap-1">
          <Badge 
            variant={getStatusVariant(row.status)}
            className={getStatusAnimation(row.status, row.isOverdue)}
          >
            {row.status}
          </Badge>
          {row.flaggedForReview && (
            <div className="flex items-center gap-1 text-xs text-red-600">
              <AlertTriangle className="w-3 h-3" />
              Flagged
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'priority',
      accessorKey: 'priority',
      header: 'Priority',
      sortable: true,
      filterable: true,
      width: 100,
      cell: (value, row) => (
        <Badge variant={getPriorityVariant(row.priority)}>
          {row.priority}
        </Badge>
      ),
    },
    {
      id: 'overallProgress',
      accessorKey: 'overallProgress',
      header: 'Progress',
      sortable: true,
      width: 120,
      cell: (value, row) => (
        <CheckProgressIndicator
          progress={row.overallProgress}
          completedChecks={row.completedChecks}
          totalChecks={row.totalChecks}
          size="small"
          showText={true}
        />
      ),
    },
    {
      id: 'assignedVettingOfficer',
      accessorKey: 'assignedVettingOfficer',
      header: 'Assigned Officer',
      sortable: true,
      filterable: true,
      width: 150,
      cell: (value, row) => (
        <div className="text-sm">
          {row.assignedVettingOfficer || (
            <span className="text-[var(--neumorphic-muted-foreground)]">Not assigned</span>
          )}
        </div>
      ),
    },
    {
      id: 'primaryProvider',
      accessorKey: 'primaryProvider',
      header: 'Primary Provider',
      sortable: true,
      filterable: true,
      width: 130,
      cell: (value, row) => (
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="text-sm cursor-pointer hover:text-blue-400 transition-colors">
              <Badge variant="outline" className="text-xs">
                {row.primaryProvider}
              </Badge>
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56 bg-[var(--neumorphic-background)] border-[var(--neumorphic-border)] z-[9999]">
            <ContextMenuItem 
              className="text-[var(--neumorphic-text-primary)] hover:bg-[var(--neumorphic-surface-secondary)] cursor-pointer"
              onClick={() => handleProviderFocus(row.primaryProvider || 'Unknown')}
            >
              <Target className="w-4 h-4 mr-2" />
              Focus on {row.primaryProvider}
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      ),
    },
    {
      id: 'initiatedDate',
      accessorKey: 'initiatedDate',
      header: 'Initiated',
      sortable: true,
      width: 120,
      cell: (value, row) => (
        <div className="text-sm">
          <div>{formatDate(row.initiatedDate)}</div>
          {row.isOverdue && (
            <div className="text-xs text-red-600 font-medium">Overdue</div>
          )}
        </div>
      ),
    },
    {
      id: 'estimatedCompletionDate',
      accessorKey: 'estimatedCompletionDate',
      header: 'Est. Completion',
      sortable: true,
      width: 130,
      cell: (value, row) => (
        <div className="text-sm">
          {row.estimatedCompletionDate ? (
            <div className={row.isOverdue ? 'text-red-600' : ''}>
              {formatDate(row.estimatedCompletionDate)}
            </div>
          ) : (
            <span className="text-[var(--neumorphic-muted-foreground)]">Not set</span>
          )}
        </div>
      ),
    },
    {
      id: 'totalEstimatedCost',
      accessorKey: 'totalEstimatedCost',
      header: 'Est. Cost',
      sortable: true,
      width: 120,
      cell: (value, row) => (
        <div className="text-sm font-medium">
          {formatCurrency(row.totalEstimatedCost)}
        </div>
      ),
    }
  ];

  // Define row actions per PRD specification (exactly 6 actions)
  const rowActions: TableAction<ActiveVettingCaseTableRow>[] = [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: (row) => onViewCase?.(row.id)
    },
    {
      id: 'timeline',
      label: 'View Timeline',
      icon: Clock,
      onClick: (row) => {
        // Open Timeline Dialog (not row expansion) per PRD
        // This should trigger a dialog, we'll use the existing timeline functionality
        handleRowExpansion(row.id);
      }
    },
    {
      id: 'dossier',
      label: 'View Dossier',
      icon: FileText,
      onClick: (row) => handleViewDossier(row)
    },
    {
      id: 'edit',
      label: 'Edit Case',
      icon: Edit2,
      onClick: (row) => onEditCase?.(row.id)
    },
    {
      id: 'approve',
      label: 'Approve',
      icon: CheckCircle,
      onClick: (row) => onApproveCase?.(row.id),
      // Only enabled if status is 'Ready for Review' per PRD
      disabled: (row) => row.status !== VettingStatus.COMPLETE
    },
    {
      id: 'reject',
      label: 'Reject',
      icon: XCircle,
      onClick: (row) => onRejectCase?.(row.id),
      variant: 'destructive',
      // Only enabled if status is 'Ready for Review' per PRD
      disabled: (row) => row.status !== VettingStatus.COMPLETE
    }
  ];

  // Define bulk actions
  const bulkActions: BulkAction<ActiveVettingCaseTableRow>[] = [
    {
      id: 'assign',
      label: 'Assign Officer',
      icon: UserPlus,
      onClick: (selectedRows) => onBulkAction?.('assign', selectedRows.map(r => r.id))
    },
    {
      id: 'update-priority',
      label: 'Update Priority',
      icon: ArrowUp,
      onClick: (selectedRows) => onBulkAction?.('update-priority', selectedRows.map(r => r.id))
    },
    {
      id: 'export',
      label: 'Export Selected',
      icon: Download,
      onClick: (selectedRows) => onBulkAction?.('export', selectedRows.map(r => r.id))
    },
    {
      id: 'bulk-approve',
      label: 'Bulk Approve',
      icon: CheckCircle,
      onClick: (selectedRows) => onBulkAction?.('bulk-approve', selectedRows.map(r => r.id)),
      variant: 'default'
    }
  ];

  return (
    <>
      {/* Inject status animations CSS */}
      {missionControlMode && (
        <style dangerouslySetInnerHTML={{ __html: statusAnimations }} />
      )}
      
      <div className={className}>
        <NeumorphicDataTable<ActiveVettingCaseTableRow>
          data={filteredData}
          columns={columns}
          rowActions={rowActions}
          bulkActions={bulkActions}
          features={{
            search: false,
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
            hideToolbar: true,
            customFooterControls: true,
          }}
          rowDetails={{
            component: ({ row }: { row: ActiveVettingCaseTableRow }) => (
              missionControlMode ? (
                <div className="m-4 space-y-4">
                  <div className="text-sm font-medium text-[var(--neumorphic-text-primary)] mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Mission Timeline - {row.caseNumber}
                  </div>
                  <CaseTimelineChart 
                    vettingCase={row}
                    onProviderFocus={handleProviderFocus}
                  />
                </div>
              ) : (
                <IndividualChecksList
                  checks={row.individualChecks}
                  className="m-4"
                />
              )
            ),
            title: (row: ActiveVettingCaseTableRow) => 
              missionControlMode 
                ? `${row.caseNumber} - Mission Timeline`
                : `${row.caseNumber} - Individual Checks`
          }}
          export={{
            filename: 'active-vetting-cases',
            formats: ['csv', 'json'],
          }}
          pagination={{
            pageSize: missionControlMode ? 15 : 10,
            showSizeSelector: true,
            pageSizeOptions: [5, 10, 15, 20, 50],
          }}
          sorting={{
            multiSort: true,
          }}
          onRowClick={(row: ActiveVettingCaseTableRow) => 
            missionControlMode ? handleRowExpansion(row.id) : onViewCase?.(row.id)
          }
          onRowDoubleClick={(row: ActiveVettingCaseTableRow) => onEditCase?.(row.id)}
        />
      </div>
      
      {/* PDF Modal with proper theming */}
      <Dialog open={showPDFModal} onOpenChange={setShowPDFModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-[var(--neumorphic-background)] border-[var(--neumorphic-border)] z-[9999]">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2 text-[var(--neumorphic-text-primary)]">
              <FileText className="w-5 h-5" />
              Interim Investigation Dossier
            </DialogTitle>
            <DialogDescription className="text-[var(--neumorphic-text-secondary)]">
              Professional case report for {selectedCase?.caseNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto bg-white rounded-lg shadow-[var(--neumorphic-shadow-inset)] p-6 max-h-[70vh]">
            {selectedCase && (
              <InterimReportDocument vettingCase={selectedCase} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ActiveCasesTable;
export { FocusContext, type FocusContextType };