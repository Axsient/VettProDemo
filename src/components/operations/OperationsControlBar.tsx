'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  NeumorphicText,
  NeumorphicCard
} from '@/components/ui/neumorphic';
import { 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Target,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  X
} from 'lucide-react';
import { VettingStatus, VettingEntityType } from '@/types/vetting';

interface OperationsControlBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: VettingStatus | 'all';
  onStatusFilterChange: (status: VettingStatus | 'all') => void;
  priorityFilter: 'all' | 'Low' | 'Medium' | 'High' | 'Urgent';
  onPriorityFilterChange: (priority: 'all' | 'Low' | 'Medium' | 'High' | 'Urgent') => void;
  entityTypeFilter: VettingEntityType | 'all';
  onEntityTypeFilterChange: (entityType: VettingEntityType | 'all') => void;
  officerFilter: string;
  onOfficerFilterChange: (officer: string) => void;
  overdueFilter: boolean;
  onOverdueFilterChange: (overdue: boolean) => void;
  flaggedFilter: boolean;
  onFlaggedFilterChange: (flagged: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (order: 'asc' | 'desc') => void;
  totalCases: number;
  filteredCases: number;
  selectedCount: number;
  onRefresh: () => void;
  onExport: () => void;
  onClearFilters: () => void;
  className?: string;
}

// Sample officers for filtering
const availableOfficers = [
  'All Officers',
  'Mike Stevens',
  'Lisa Chen', 
  'Fatima Patel',
  'Janet Williams',
  'Robert Brown',
  'Emma Thompson',
  'Mark Johnson',
  'Dr. Ahmed Hassan'
];

const sortOptions = [
  { value: 'caseNumber', label: 'Case Number' },
  { value: 'entityName', label: 'Entity Name' },
  { value: 'initiatedDate', label: 'Date Initiated' },
  { value: 'estimatedCompletionDate', label: 'Est. Completion' },
  { value: 'overallProgress', label: 'Progress' },
  { value: 'priority', label: 'Priority' },
  { value: 'status', label: 'Status' }
];

export const OperationsControlBar: React.FC<OperationsControlBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  entityTypeFilter,
  onEntityTypeFilterChange,
  officerFilter,
  onOfficerFilterChange,
  overdueFilter,
  onOverdueFilterChange,
  flaggedFilter,
  onFlaggedFilterChange,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  totalCases,
  filteredCases,
  selectedCount,
  onRefresh,
  onExport,
  onClearFilters,
  className = ''
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const hasActiveFilters = 
    statusFilter !== 'all' || 
    priorityFilter !== 'all' || 
    entityTypeFilter !== 'all' ||
    officerFilter !== 'All Officers' || 
    overdueFilter || 
    flaggedFilter || 
    searchTerm.length > 0;

  const getStatusBadgeVariant = (status: VettingStatus) => {
    switch (status) {
      case VettingStatus.COMPLETE:
        return 'default';
      case VettingStatus.IN_PROGRESS:
        return 'secondary';
      case VettingStatus.CONSENT_PENDING:
        return 'outline';
      case VettingStatus.FAILED:
      case VettingStatus.CANCELLED:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Urgent': return <Zap className="w-3 h-3 text-red-500" />;
      case 'High': return <AlertTriangle className="w-3 h-3 text-orange-500" />;
      case 'Medium': return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'Low': return <CheckCircle className="w-3 h-3 text-green-500" />;
      default: return null;
    }
  };

  return (
    <NeumorphicCard className={`p-4 space-y-4 ${className}`}>
      {/* Main Controls Row */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search and Quick Filters */}
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[var(--neumorphic-text-secondary)]" />
            <Input
              placeholder="Search cases, entities, or IDs..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Quick Status Filters */}
          <div className="flex gap-2">
            <Button
              variant={statusFilter === VettingStatus.IN_PROGRESS ? 'default' : 'outline'}
              size="sm"
              onClick={() => onStatusFilterChange(
                statusFilter === VettingStatus.IN_PROGRESS ? 'all' : VettingStatus.IN_PROGRESS
              )}
              className="flex items-center gap-1"
            >
              <Clock className="w-3 h-3" />
              In Progress
            </Button>
            <Button
              variant={overdueFilter ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => onOverdueFilterChange(!overdueFilter)}
              className="flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3" />
              Overdue
            </Button>
            <Button
              variant={flaggedFilter ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => onFlaggedFilterChange(!flaggedFilter)}
              className="flex items-center gap-1"
            >
              <Target className="w-3 h-3" />
              Flagged
            </Button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="flex items-center gap-1"
          >
            <Filter className="w-3 h-3" />
            {showAdvancedFilters ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={selectedCount === 0}
            className="flex items-center gap-1"
          >
            <Download className="w-3 h-3" />
            Export ({selectedCount})
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 pt-4 border-t border-[var(--neumorphic-border)]">
          {/* Status Filter */}
          <div className="space-y-2">
            <NeumorphicText size="sm" className="font-medium">Status</NeumorphicText>
            <select 
              value={statusFilter} 
              onChange={(e) => onStatusFilterChange(e.target.value as VettingStatus | 'all')}
              className="flex h-9 w-full items-center justify-between rounded-md border border-neumorphic-border/20 bg-neumorphic-button px-3 py-2 text-sm text-neumorphic-text-primary placeholder:text-neumorphic-text-secondary focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Statuses</option>
              <option value={VettingStatus.INITIATED}>Initiated</option>
              <option value={VettingStatus.CONSENT_PENDING}>Consent Pending</option>
              <option value={VettingStatus.IN_PROGRESS}>In Progress</option>
              <option value={VettingStatus.PARTIALLY_COMPLETE}>Partially Complete</option>
              <option value={VettingStatus.COMPLETE}>Complete</option>
              <option value={VettingStatus.FAILED}>Failed</option>
              <option value={VettingStatus.CANCELLED}>Cancelled</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <NeumorphicText size="sm" className="font-medium">Priority</NeumorphicText>
            <select 
              value={priorityFilter} 
              onChange={(e) => onPriorityFilterChange(e.target.value as 'Urgent' | 'High' | 'Medium' | 'Low')}
              className="flex h-9 w-full items-center justify-between rounded-md border border-neumorphic-border/20 bg-neumorphic-button px-3 py-2 text-sm text-neumorphic-text-primary placeholder:text-neumorphic-text-secondary focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Entity Type Filter */}
          <div className="space-y-2">
            <NeumorphicText size="sm" className="font-medium">Entity Type</NeumorphicText>
            <select 
              value={entityTypeFilter} 
              onChange={(e) => onEntityTypeFilterChange(e.target.value as VettingEntityType | 'all')}
              className="flex h-9 w-full items-center justify-between rounded-md border border-neumorphic-border/20 bg-neumorphic-button px-3 py-2 text-sm text-neumorphic-text-primary placeholder:text-neumorphic-text-secondary focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Types</option>
              <option value={VettingEntityType.INDIVIDUAL}>Individual</option>
              <option value={VettingEntityType.COMPANY}>Company</option>
              <option value={VettingEntityType.STAFF_MEDICAL}>Staff Medical</option>
            </select>
          </div>

          {/* Officer Filter */}
          <div className="space-y-2">
            <NeumorphicText size="sm" className="font-medium">Assigned Officer</NeumorphicText>
            <select 
              value={officerFilter} 
              onChange={(e) => onOfficerFilterChange(e.target.value)}
              className="flex h-9 w-full items-center justify-between rounded-md border border-neumorphic-border/20 bg-neumorphic-button px-3 py-2 text-sm text-neumorphic-text-primary placeholder:text-neumorphic-text-secondary focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {availableOfficers.map((officer) => (
                <option key={officer} value={officer}>
                  {officer}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Options */}
          <div className="space-y-2">
            <NeumorphicText size="sm" className="font-medium">Sort By</NeumorphicText>
            <div className="flex gap-1">
              <select 
                value={sortBy} 
                onChange={(e) => onSortChange(e.target.value)}
                className="flex-1 h-9 rounded-md border border-neumorphic-border/20 bg-neumorphic-button px-3 py-2 text-sm text-neumorphic-text-primary placeholder:text-neumorphic-text-secondary focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-2"
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="w-3 h-3" />
                ) : (
                  <SortDesc className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-[var(--neumorphic-border)]">
        <div className="flex items-center gap-4">
          <NeumorphicText size="sm" variant="secondary">
            Showing {filteredCases.toLocaleString()} of {totalCases.toLocaleString()} cases
          </NeumorphicText>
          
          {selectedCount > 0 && (
            <Badge variant="secondary">
              {selectedCount} selected
            </Badge>
          )}

          {hasActiveFilters && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Filter className="w-3 h-3" />
              Filters active
            </Badge>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="flex items-center gap-1 text-[var(--neumorphic-text-secondary)] hover:text-[var(--neumorphic-text-primary)]"
          >
            <X className="w-3 h-3" />
            Clear all filters
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: &quot;{searchTerm}&quot;
              <button onClick={() => onSearchChange('')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {statusFilter !== 'all' && (
            <Badge variant={getStatusBadgeVariant(statusFilter as VettingStatus)} className="flex items-center gap-1">
              Status: {statusFilter}
              <button onClick={() => onStatusFilterChange('all')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {priorityFilter !== 'all' && (
            <Badge variant="outline" className="flex items-center gap-1">
              {getPriorityIcon(priorityFilter)}
              Priority: {priorityFilter}
              <button onClick={() => onPriorityFilterChange('all')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {officerFilter !== 'All Officers' && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Officer: {officerFilter}
              <button onClick={() => onOfficerFilterChange('All Officers')}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {overdueFilter && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Overdue only
              <button onClick={() => onOverdueFilterChange(false)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          
          {flaggedFilter && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              Flagged only
              <button onClick={() => onFlaggedFilterChange(false)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </NeumorphicCard>
  );
};