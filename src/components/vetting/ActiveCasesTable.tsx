'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { NeumorphicDataTable } from '@/components/ui/NeumorphicDataTable';
import { TableColumn, TableAction, BulkAction } from '@/types/table';
import { ActiveVettingCase, VettingStatus } from '@/types/vetting';
import { Eye, Edit2, CheckCircle, XCircle, AlertTriangle, Clock, UserPlus, ArrowUp, Download } from 'lucide-react';
import CheckProgressIndicator from './CheckProgressIndicator';
import IndividualChecksList from './IndividualChecksList';

interface ActiveCasesTableProps {
  cases: ActiveVettingCase[];
  loading?: boolean;
  onViewCase?: (caseId: string) => void;
  onEditCase?: (caseId: string) => void;
  onApproveCase?: (caseId: string) => void;
  onRejectCase?: (caseId: string) => void;
  onBulkAction?: (action: string, selectedIds: string[]) => void;
  className?: string;
}

const ActiveCasesTable: React.FC<ActiveCasesTableProps> = ({
  cases,
  loading = false,
  onViewCase,
  onEditCase,
  onApproveCase,
  onRejectCase,
  onBulkAction,
  className = ''
}) => {

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

  // Define table columns
  const columns: TableColumn<ActiveVettingCase>[] = [
    {
      accessorKey: 'caseNumber',
      header: 'Case Number',
      cell: (value, row) => (
        <div className="font-mono text-sm">
          <div className="font-medium">{row.caseNumber}</div>
          <div className="text-xs text-[var(--neumorphic-muted-foreground)]">
            {row.daysSinceInitiated} days ago
          </div>
        </div>
      ),
      meta: {
        filterType: 'text',
        sortable: true
      }
    },
    {
      accessorKey: 'entityName',
      header: 'Entity',
      cell: (value, row) => (
        <div>
          <div className="font-medium">{row.entityName}</div>
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
      meta: {
        filterType: 'text',
        sortable: true
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (value, row) => (
        <div className="flex flex-col gap-1">
          <Badge variant={getStatusVariant(row.status)}>
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
      meta: {
        filterType: 'select',
        filterOptions: Object.values(VettingStatus).map(status => ({
          label: status,
          value: status
        })),
        sortable: true
      }
    },
    {
      accessorKey: 'priority',
      header: 'Priority',
      cell: (value, row) => (
        <Badge variant={getPriorityVariant(row.priority)}>
          {row.priority}
        </Badge>
      ),
      meta: {
        filterType: 'select',
        filterOptions: [
          { label: 'Low', value: 'Low' },
          { label: 'Medium', value: 'Medium' },
          { label: 'High', value: 'High' },
          { label: 'Urgent', value: 'Urgent' }
        ],
        sortable: true
      }
    },
    {
      accessorKey: 'progress',
      header: 'Progress',
      cell: (value, row) => (
        <CheckProgressIndicator
          progress={row.overallProgress}
          completedChecks={row.completedChecks}
          totalChecks={row.totalChecks}
          size="small"
          showText={true}
        />
      ),
      meta: {
        sortable: true
      }
    },
    {
      accessorKey: 'assignedVettingOfficer',
      header: 'Assigned Officer',
      cell: (value, row) => (
        <div className="text-sm">
          {row.assignedVettingOfficer || (
            <span className="text-[var(--neumorphic-muted-foreground)]">Not assigned</span>
          )}
        </div>
      ),
      meta: {
        filterType: 'text',
        sortable: true
      }
    },
    {
      accessorKey: 'initiatedDate',
      header: 'Initiated',
      cell: (value, row) => (
        <div className="text-sm">
          <div>{formatDate(row.initiatedDate)}</div>
          {row.isOverdue && (
            <div className="text-xs text-red-600 font-medium">Overdue</div>
          )}
        </div>
      ),
      meta: {
        sortable: true
      }
    },
    {
      accessorKey: 'estimatedCompletionDate',
      header: 'Est. Completion',
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
      meta: {
        sortable: true
      }
    },
    {
      accessorKey: 'totalEstimatedCost',
      header: 'Est. Cost',
      cell: (value, row) => (
        <div className="text-sm font-medium">
          {formatCurrency(row.totalEstimatedCost)}
        </div>
      ),
      meta: {
        sortable: true
      }
    }
  ];

  // Define row actions
  const rowActions: TableAction<ActiveVettingCase>[] = [
    {
      id: 'view',
      label: 'View Details',
      icon: Eye,
      onClick: (row) => onViewCase?.(row.id)
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
      show: (row) => row.status === VettingStatus.PARTIALLY_COMPLETE
    },
    {
      id: 'reject',
      label: 'Reject',
      icon: XCircle,
      onClick: (row) => onRejectCase?.(row.id),
      variant: 'destructive'
    }
  ];

  // Define bulk actions
  const bulkActions: BulkAction<ActiveVettingCase>[] = [
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
    <div className={className}>
      <NeumorphicDataTable<ActiveVettingCase>
        data={cases}
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
          component: ({ row }: { row: ActiveVettingCase }) => (
            <IndividualChecksList
              checks={row.individualChecks}
              className="m-4"
            />
          ),
          title: (row: ActiveVettingCase) => `${row.caseNumber} - Individual Checks`
        }}
        export={{
          filename: 'active-vetting-cases',
          formats: ['csv', 'json'],
        }}
        pagination={{
          pageSize: 10,
          showSizeSelector: true,
          pageSizeOptions: [5, 10, 20, 50],
        }}
        sorting={{
          multiSort: true,
        }}
        onRowClick={(row: ActiveVettingCase) => onViewCase?.(row.id)}
        onRowDoubleClick={(row: ActiveVettingCase) => onEditCase?.(row.id)}
      />
    </div>
  );
};

export default ActiveCasesTable;