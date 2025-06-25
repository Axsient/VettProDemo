'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  NeumorphicProgressRing,
  NeumorphicTable,
  NeumorphicTableHeader,
  NeumorphicTableBody,
  NeumorphicTableRow,
  NeumorphicTableHead,
  NeumorphicTableCell,
  NeumorphicCard,
  NeumorphicText
} from '@/components/ui/neumorphic';
import { 
  Edit2, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Search,
  Filter,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
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
    <div className="flex items-center space-x-2">
      <NeumorphicProgressRing
        progress={progress}
        size={24}
        strokeWidth={2}
        color={getProgressColor(progress)}
        icon={progress >= 100 ? CheckCircle : Clock}
      />
      <div className="text-xs">
        <div className="font-medium text-neumorphic-text-primary">
          {Math.round(progress)}%
        </div>
        <div className="text-neumorphic-text-secondary text-xs">
          {completedChecks}/{totalChecks}
        </div>
      </div>
    </div>
  );
};

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
    case 'Low':
      return 'outline';
    default:
      return 'outline';
  }
};

export function ActiveVettingCasesDemo() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter data based on search
  const filteredData = activeVettingCases.filter(item => {
    const matchesSearch = searchTerm === '' || 
      item.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.entityIdentifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.assignedVettingOfficer && item.assignedVettingOfficer.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const toggleRowExpansion = (caseNumber: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(caseNumber)) {
      newExpanded.delete(caseNumber);
    } else {
      newExpanded.add(caseNumber);
    }
    setExpandedRows(newExpanded);
  };

  const renderExpandedRow = (vettingCase: ActiveVettingCase) => (
    <NeumorphicTableRow>
      <NeumorphicTableCell colSpan={10}>
        <NeumorphicCard className="m-2">
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Case Information */}
              <div>
                <h4 className="font-medium mb-3 text-neumorphic-text-primary text-sm">Case Information</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Entity Type:</span>
                    <span className="text-neumorphic-text-primary">{vettingCase.entityType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neumorphic-text-secondary">Est. Cost:</span>
                    <span className="text-neumorphic-text-primary">
                      {formatCurrency(vettingCase.totalEstimatedCost)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Individual Checks */}
              <div>
                <h4 className="font-medium mb-3 text-neumorphic-text-primary text-sm">Individual Checks</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {vettingCase.individualChecks.slice(0, 3).map((check) => (
                    <div
                      key={check.checkId}
                      className="flex items-center justify-between p-2 rounded-lg
                        bg-neumorphic-card-gradient border border-neumorphic-border/10
                        shadow-neumorphic-inset-sm"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-xs text-neumorphic-text-primary">
                          {check.checkDefinition.name}
                        </div>
                        <div className="text-xs text-neumorphic-text-secondary">
                          {check.provider}
                        </div>
                      </div>
                      <Badge 
                        variant={
                          check.status === 'Complete' ? 'default' :
                          check.status === 'In Progress' ? 'secondary' :
                          check.status === 'Failed' ? 'destructive' : 'outline'
                        }
                        className="text-xs"
                      >
                        {check.status}
                      </Badge>
                    </div>
                  ))}
                  {vettingCase.individualChecks.length > 3 && (
                    <div className="text-xs text-neumorphic-text-secondary text-center">
                      +{vettingCase.individualChecks.length - 3} more checks
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </NeumorphicCard>
      </NeumorphicTableCell>
    </NeumorphicTableRow>
  );

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neumorphic-text-secondary" />
          <input
            type="text"
            placeholder="Search all columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm
              bg-neumorphic-card-gradient border border-neumorphic-border/20
              rounded-lg shadow-neumorphic-inset-sm
              text-neumorphic-text-primary placeholder-neumorphic-text-secondary
              focus:outline-none focus:ring-2 focus:ring-neumorphic-accent-primary/50
              transition-all duration-200"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="neumorphic-outline"
            size="sm"
            className="gap-2 text-xs"
          >
            <Filter className="w-3 h-3" />
            Columns
          </Button>
          <Button
            variant="neumorphic-outline"
            size="sm"
            className="gap-2 text-xs"
          >
            Density
          </Button>
          <Button
            variant="neumorphic-outline"
            size="sm"
            className="gap-2 text-xs"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <NeumorphicTable>
        <NeumorphicTableHeader>
          <NeumorphicTableRow>
            <NeumorphicTableHead className="text-xs font-medium w-8"></NeumorphicTableHead>
            <NeumorphicTableHead className="text-xs font-medium">Case Number</NeumorphicTableHead>
            <NeumorphicTableHead className="text-xs font-medium">Entity</NeumorphicTableHead>
            <NeumorphicTableHead className="text-xs font-medium">Status</NeumorphicTableHead>
            <NeumorphicTableHead className="text-xs font-medium">Priority</NeumorphicTableHead>
            <NeumorphicTableHead className="text-xs font-medium">Progress</NeumorphicTableHead>
            <NeumorphicTableHead className="text-xs font-medium">Assigned Officer</NeumorphicTableHead>
            <NeumorphicTableHead className="text-xs font-medium">Initiated</NeumorphicTableHead>
            <NeumorphicTableHead className="text-xs font-medium">Est. Completion</NeumorphicTableHead>
            <NeumorphicTableHead className="text-xs font-medium">Actions</NeumorphicTableHead>
          </NeumorphicTableRow>
        </NeumorphicTableHeader>
        <NeumorphicTableBody>
          {paginatedData.map((vettingCase) => (
            <React.Fragment key={vettingCase.caseNumber}>
              <NeumorphicTableRow>
                <NeumorphicTableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRowExpansion(vettingCase.caseNumber)}
                    className="h-6 w-6 p-0"
                  >
                    {expandedRows.has(vettingCase.caseNumber) ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronRight className="w-3 h-3" />
                    )}
                  </Button>
                </NeumorphicTableCell>

                <NeumorphicTableCell className="font-medium">
                  <div className="space-y-1">
                    <div className="text-sm font-mono text-neumorphic-text-primary">
                      {vettingCase.caseNumber}
                    </div>
                    <div className="text-xs text-neumorphic-text-secondary">
                      {vettingCase.daysSinceInitiated} days ago
                    </div>
                  </div>
                </NeumorphicTableCell>

                <NeumorphicTableCell>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-neumorphic-text-primary">
                      {vettingCase.entityName}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {vettingCase.entityType}
                      </Badge>
                      <span className="text-xs font-mono text-neumorphic-text-secondary">
                        {vettingCase.entityIdentifier}
                      </span>
                    </div>
                    {vettingCase.flaggedForReview && (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-yellow-600">Flagged</span>
                      </div>
                    )}
                  </div>
                </NeumorphicTableCell>

                <NeumorphicTableCell>
                  <Badge variant={getStatusVariant(vettingCase.status)} className="text-xs">
                    {vettingCase.status === VettingStatus.PARTIALLY_COMPLETE ? 'Partially Complete' : vettingCase.status}
                  </Badge>
                  {vettingCase.status === VettingStatus.PARTIALLY_COMPLETE && (
                    <div className="text-xs text-neumorphic-text-secondary mt-1">
                      Consent Pending
                    </div>
                  )}
                </NeumorphicTableCell>

                <NeumorphicTableCell>
                  <Badge variant={getPriorityVariant(vettingCase.priority)} className="text-xs">
                    {vettingCase.priority}
                  </Badge>
                </NeumorphicTableCell>

                <NeumorphicTableCell>
                  <VettingProgressIndicator
                    progress={vettingCase.overallProgress}
                    completedChecks={vettingCase.completedChecks}
                    totalChecks={vettingCase.totalChecks}
                  />
                </NeumorphicTableCell>

                <NeumorphicTableCell className="text-sm">
                  {vettingCase.assignedVettingOfficer || (
                    <span className="text-neumorphic-text-secondary">Not assigned</span>
                  )}
                </NeumorphicTableCell>

                <NeumorphicTableCell className="text-xs">
                  <div className="space-y-1">
                    <div className="text-neumorphic-text-primary">
                      {formatDate(vettingCase.initiatedDate)}
                    </div>
                    {vettingCase.isOverdue && (
                      <div className="text-red-600 font-medium">Overdue</div>
                    )}
                  </div>
                </NeumorphicTableCell>

                <NeumorphicTableCell className="text-xs">
                  {vettingCase.estimatedCompletionDate ? (
                    <div className={vettingCase.isOverdue ? 'text-red-600' : 'text-neumorphic-text-primary'}>
                      {formatDate(vettingCase.estimatedCompletionDate)}
                    </div>
                  ) : (
                    <span className="text-neumorphic-text-secondary">Not set</span>
                  )}
                </NeumorphicTableCell>

                <NeumorphicTableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      title="View Details"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      title="Edit Case"
                      disabled={vettingCase.status === VettingStatus.COMPLETE}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    {vettingCase.status === VettingStatus.PARTIALLY_COMPLETE && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-green-600"
                        title="Approve"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    )}
                    {vettingCase.status !== VettingStatus.COMPLETE && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-red-600"
                        title="Reject"
                      >
                        <XCircle className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      title="More actions"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </NeumorphicTableCell>
              </NeumorphicTableRow>
              {expandedRows.has(vettingCase.caseNumber) && renderExpandedRow(vettingCase)}
            </React.Fragment>
          ))}
        </NeumorphicTableBody>
      </NeumorphicTable>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <NeumorphicText variant="secondary" size="sm">
            Show
          </NeumorphicText>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 text-sm rounded border
              bg-neumorphic-card-gradient border-neumorphic-border/20
              text-neumorphic-text-primary
              focus:outline-none focus:ring-2 focus:ring-neumorphic-accent-primary/50"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <NeumorphicText variant="secondary" size="sm">
            of {filteredData.length} entries
          </NeumorphicText>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="neumorphic-outline"
            size="sm"
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="neumorphic-outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (pageNumber > totalPages) return null;
              
              return (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? "neumorphic" : "neumorphic-outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNumber)}
                  className="h-8 w-8 p-0 text-xs"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>

          <Button
            variant="neumorphic-outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="neumorphic-outline"
            size="sm"
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}