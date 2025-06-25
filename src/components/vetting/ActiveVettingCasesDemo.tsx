'use client';

import React from 'react';
import { NeumorphicDataTable } from '@/components/ui/NeumorphicDataTable';
import { TableColumn, TableAction, BulkAction } from '@/types/table';
import { Badge } from '@/components/ui/badge';
import { NeumorphicProgressRing } from '@/components/ui/neumorphic';
import { Edit2, Trash2, Eye, UserCheck, Download, CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react';
import { ActiveVettingCase, VettingStatus } from '@/types/vetting';
import { activeVettingCases } from '@/lib/sample-data/activeVettingCasesSample';

// Progress indicator component using neumorphic design
const VettingProgressIndicator: React.FC<{ 
  progress: number;
  completedChecks: number;
  totalChecks: number;
}> = ({ progress, completedChecks, totalChecks }) => {
  const getProgressColor = (prog: number) => {
    if (prog >= 100) return 'var(--neumorphic-accent-success)';
    if (prog >= 75) return 'var(--neumorphic-accent-primary)';
    if (prog >= 50) return 'var(--neumorphic-accent-warning)';
    if (prog >= 25) return 'var(--neumorphic-accent-secondary)';
    return 'var(--neumorphic-accent-muted)';
  };

  return (
    <div className="flex items-center space-x-3">
      <NeumorphicProgressRing
        progress={progress}
        size={32}
        strokeWidth={3}
        color={getProgressColor(progress)}
        icon={progress >= 100 ? CheckCircle : Clock}
      />
      <div className="text-sm">
        <div className="font-medium text-neumorphic-text-primary">
          {Math.round(progress)}%
        </div>
        <div className="text-neumorphic-text-secondary text-xs">
          {completedChecks}/{totalChecks} checks
        </div>
      </div>
    </div>
  );
};

// Individual check details component for row expansion
const VettingCaseDetailsComponent: React.FC<{ 
  row: ActiveVettingCase;
  onClose: () => void;
}> = ({ row }) => (
  <div className="space-y-4 p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Case Information */}
      <div>
        <h4 className="font-medium mb-3 text-neumorphic-text-primary">Case Information</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-neumorphic-text-secondary">Entity Type:</span>
            <span className="text-neumorphic-text-primary">{row.entityType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neumorphic-text-secondary">Priority:</span>
            <Badge variant={row.priority === 'Urgent' ? 'destructive' : 
                           row.priority === 'High' ? 'secondary' : 'outline'}>
              {row.priority}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-neumorphic-text-secondary">Assigned Officer:</span>
            <span className="text-neumorphic-text-primary">
              {row.assignedVettingOfficer || 'Not assigned'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neumorphic-text-secondary">Est. Cost:</span>
            <span className="text-neumorphic-text-primary">
              {new Intl.NumberFormat('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
                minimumFractionDigits: 0
              }).format(row.totalEstimatedCost)}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Information */}
      <div>
        <h4 className="font-medium mb-3 text-neumorphic-text-primary">Progress Summary</h4>
        <div className="space-y-3">
          <VettingProgressIndicator
            progress={row.overallProgress}
            completedChecks={row.completedChecks}
            totalChecks={row.totalChecks}
          />
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-neumorphic-text-secondary">Days Active:</span>
              <span className="text-neumorphic-text-primary">{row.daysSinceInitiated} days</span>
            </div>
            {row.isOverdue && (
              <div className="flex items-center space-x-1 text-red-500 text-xs">
                <AlertTriangle className="w-3 h-3" />
                <span>Overdue</span>
              </div>
            )}
            {row.flaggedForReview && (
              <div className="flex items-center space-x-1 text-yellow-500 text-xs">
                <AlertTriangle className="w-3 h-3" />
                <span>Flagged for Review</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Individual Checks List */}
    <div>
      <h4 className="font-medium mb-3 text-neumorphic-text-primary">Individual Checks</h4>
      <div className="grid gap-2">
        {row.individualChecks.map((check) => (
          <div
            key={check.checkId}
            className="flex items-center justify-between p-3 rounded-lg
              bg-neumorphic-card-gradient border border-neumorphic-border/10
              shadow-neumorphic-inset-sm"
          >
            <div className="flex-1">
              <div className="font-medium text-sm text-neumorphic-text-primary">
                {check.checkDefinition.name}
              </div>
              <div className="text-xs text-neumorphic-text-secondary">
                {check.provider} • {check.cost ? `R ${check.cost}` : 'Cost TBD'}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge 
                variant={
                  check.status === 'Complete' ? 'default' :
                  check.status === 'In Progress' ? 'secondary' :
                  check.status === 'Error' ? 'destructive' : 'outline'
                }
                className="text-xs"
              >
                {check.status}
              </Badge>
              {check.result && (
                <Badge
                  variant={
                    check.result === 'Pass' ? 'default' :
                    check.result === 'Fail' ? 'destructive' : 'secondary'
                  }
                  className="text-xs"
                >
                  {check.result}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Format currency helper
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Format date helper
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
      return 'default';
    case VettingStatus.IN_PROGRESS:
      return 'secondary';
    case VettingStatus.FAILED:
    case VettingStatus.CANCELLED:
      return 'destructive';
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

// Column definitions with proper typing
const columns: TableColumn<ActiveVettingCase>[] = [
  {
    id: 'caseNumber',
    header: 'Case Number',
    accessorKey: 'caseNumber',
    cell: (value: unknown, row: ActiveVettingCase) => (
      <div className="space-y-1">
        <div className="font-medium text-neumorphic-text-primary font-mono text-sm">
          {row.caseNumber}
        </div>
        <div className="text-xs text-neumorphic-text-secondary">
          {row.daysSinceInitiated} days ago
        </div>
      </div>
    ),
    sortable: true,
    filterable: true,
  },
  {
    id: 'entity',
    header: 'Entity',
    accessorKey: 'entityName',
    cell: (value: unknown, row: ActiveVettingCase) => (
      <div className="space-y-1">
        <div className="font-medium text-neumorphic-text-primary">
          {row.entityName}
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-xs">
            {row.entityType}
          </Badge>
          <span className="text-xs text-neumorphic-text-secondary">
            {row.entityIdentifier}
          </span>
        </div>
      </div>
    ),
    sortable: true,
    filterable: true,
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: (value: unknown, row: ActiveVettingCase) => (
      <div className="space-y-1">
        <Badge variant={getStatusVariant(row.status)}>
          {row.status}
        </Badge>
        {row.flaggedForReview && (
          <div className="flex items-center space-x-1 text-xs text-yellow-600">
            <AlertTriangle className="w-3 h-3" />
            <span>Flagged</span>
          </div>
        )}
      </div>
    ),
    sortable: true,
    filterable: true,
    meta: {
      filterType: 'select',
      filterOptions: Object.values(VettingStatus).map(status => ({
        label: status,
        value: status
      })),
    },
  },
  {
    id: 'priority',
    header: 'Priority',
    accessorKey: 'priority',
    cell: (value: unknown, row: ActiveVettingCase) => (
      <Badge variant={getPriorityVariant(row.priority)}>
        {row.priority}
      </Badge>
    ),
    sortable: true,
    filterable: true,
    meta: {
      filterType: 'select',
      filterOptions: [
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' },
        { label: 'Urgent', value: 'Urgent' },
      ],
    },
  },
  {
    id: 'progress',
    header: 'Progress',
    accessorKey: 'overallProgress',
    cell: (value: unknown, row: ActiveVettingCase) => (
      <VettingProgressIndicator
        progress={row.overallProgress}
        completedChecks={row.completedChecks}
        totalChecks={row.totalChecks}
      />
    ),
    sortable: true,
    align: 'center',
  },
  {
    id: 'assignedOfficer',
    header: 'Assigned Officer',
    accessorKey: 'assignedVettingOfficer',
    cell: (value: unknown, row: ActiveVettingCase) => (
      <div className="text-sm text-neumorphic-text-primary">
        {row.assignedVettingOfficer || (
          <span className="text-neumorphic-text-secondary">Not assigned</span>
        )}
      </div>
    ),
    sortable: true,
    filterable: true,
  },
  {
    id: 'initiated',
    header: 'Initiated',
    accessorKey: 'initiatedDate',
    cell: (value: unknown, row: ActiveVettingCase) => (
      <div className="text-sm space-y-1">
        <div className="text-neumorphic-text-primary">
          {formatDate(row.initiatedDate)}
        </div>
        {row.isOverdue && (
          <div className="text-xs text-red-600 font-medium">Overdue</div>
        )}
      </div>
    ),
    sortable: true,
  },
  {
    id: 'estimatedCompletion',
    header: 'Est. Completion',
    accessorKey: 'estimatedCompletionDate',
    cell: (value: unknown, row: ActiveVettingCase) => (
      <div className="text-sm">
        {row.estimatedCompletionDate ? (
          <div className={row.isOverdue ? 'text-red-600' : 'text-neumorphic-text-primary'}>
            {formatDate(row.estimatedCompletionDate)}
          </div>
        ) : (
          <span className="text-neumorphic-text-secondary">Not set</span>
        )}
      </div>
    ),
    sortable: true,
  },
  {
    id: 'cost',
    header: 'Est. Cost',
    accessorKey: 'totalEstimatedCost',
    cell: (value: unknown, row: ActiveVettingCase) => (
      <div className="text-sm font-medium text-neumorphic-text-primary">
        {formatCurrency(row.totalEstimatedCost)}
      </div>
    ),
    sortable: true,
    align: 'right',
  },
];

// Row actions with proper typing
const rowActions: TableAction<ActiveVettingCase>[] = [
  {
    id: 'view',
    label: 'View Details',
    icon: Eye,
    onClick: (row: ActiveVettingCase) => {
      console.log('View case:', row.caseNumber);
    },
  },
  {
    id: 'edit',
    label: 'Edit Case',
    icon: Edit2,
    onClick: (row: ActiveVettingCase) => {
      console.log('Edit case:', row.caseNumber);
    },
    disabled: (row: ActiveVettingCase) => row.status === VettingStatus.COMPLETE,
  },
  {
    id: 'approve',
    label: 'Approve',
    icon: CheckCircle,
    onClick: (row: ActiveVettingCase) => {
      console.log('Approve case:', row.caseNumber);
    },
    hidden: (row: ActiveVettingCase) => row.status !== VettingStatus.PARTIALLY_COMPLETE,
  },
  {
    id: 'reject',
    label: 'Reject',
    icon: XCircle,
    variant: 'destructive',
    onClick: (row: ActiveVettingCase) => {
      console.log('Reject case:', row.caseNumber);
    },
    hidden: (row: ActiveVettingCase) => row.status === VettingStatus.COMPLETE,
  },
];

// Bulk actions with proper typing
const bulkActions: BulkAction<ActiveVettingCase>[] = [
  {
    id: 'assign',
    label: 'Assign Officer',
    icon: UserCheck,
    onClick: (rows: ActiveVettingCase[]) => {
      console.log('Assign officer to cases:', rows.map(r => r.caseNumber));
    },
  },
  {
    id: 'export',
    label: 'Export Selected',
    icon: Download,
    onClick: (rows: ActiveVettingCase[]) => {
      console.log('Export cases:', rows.map(r => r.caseNumber));
    },
  },
  {
    id: 'approve',
    label: 'Bulk Approve',
    icon: CheckCircle,
    onClick: (rows: ActiveVettingCase[]) => {
      console.log('Approve cases:', rows.map(r => r.caseNumber));
    },
    disabled: (rows: ActiveVettingCase[]) => 
      rows.some(r => r.status === VettingStatus.COMPLETE),
  },
  {
    id: 'delete',
    label: 'Cancel Selected',
    icon: Trash2,
    variant: 'destructive',
    onClick: (rows: ActiveVettingCase[]) => {
      console.log('Cancel cases:', rows.map(r => r.caseNumber));
    },
  },
];

export function ActiveVettingCasesDemo() {
  return (
    <div className="space-y-4">
      <NeumorphicDataTable<ActiveVettingCase>
        data={activeVettingCases}
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
          component: VettingCaseDetailsComponent,
          title: (row: ActiveVettingCase) => `${row.caseNumber} - Case Details`,
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
        onRowClick={(row: ActiveVettingCase) => console.log('Row clicked:', row.caseNumber)}
        onRowDoubleClick={(row: ActiveVettingCase) => console.log('Row double-clicked:', row.caseNumber)}
      />
    </div>
  );
}