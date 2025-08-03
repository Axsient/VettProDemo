'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  Play, 
  Pause, 
  Target, 
  Users,
  AlertTriangle,
  CheckCircle,
  Radio,
  Activity,
  Command,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicStatsCard,
} from '@/components/ui/neumorphic';
import ActiveCasesTable, { FocusContext, type FocusContextType } from '@/components/vetting/ActiveCasesTable';
import CountUp from 'react-countup';
import { 
  operationsVettingCases, 
  getOperationsKPIs
} from '@/lib/sample-data/operations-dashboard-data';
import { VettingStatus, ActiveVettingCase, VettingEntityType } from '@/types/vetting';
import { ApproveRejectDialog } from '@/components/operations/ApproveRejectDialog';
import { BulkActionDialog } from '@/components/operations/BulkActionDialog';
import { EditCaseDialog } from '@/components/operations/EditCaseDialog';
import TimelineDialog from '@/components/operations/TimelineDialog';
import { IntelligenceFeed } from '@/components/operations/IntelligenceFeed';
import { type IntelligenceFeedEvent } from '@/lib/sample-data/operations-dashboard-data';
import { OperationsControlBar } from '@/components/operations/OperationsControlBar';

// Import the custom FormData interface
interface BulkActionFormData {
  assignedOfficer?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Urgent';
  exportFormat?: 'csv' | 'json' | 'pdf';
  notes: string;
  supervisorEmail: string;
  requestReason: string;
}

// KPI Animation Component
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AnimatedKPI: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  focused?: boolean;
}> = ({ title, value, icon, focused = false }) => {
  const numericValue = typeof value === 'number' ? value : 0;
  
  return (
    <NeumorphicStatsCard
      title={title}
      value={typeof value === 'number' ? numericValue.toString() : value}
      icon={icon}
      className={focused ? 'ring-2 ring-purple-400 shadow-lg' : ''}
    />
  );
};

export default function OperationsDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [realTimeMode, setRealTimeMode] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [focus, setFocusState] = useState<{ type: 'Provider' | 'Status'; id: string } | null>(null);
  
  // Focus mode state
  const [focusMode, setFocusMode] = useState<{
    enabled: boolean;
    context: { type: 'Provider' | 'Status'; id: string } | null;
  }>({
    enabled: false,
    context: null
  });
  
  // KPI Filter States
  const [activeFilter, setActiveFilter] = useState<'all' | 'consent-pending' | 'overdue' | 'ready-review'>('all');
  
  // Control Bar States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VettingStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'Low' | 'Medium' | 'High' | 'Urgent'>('all');
  const [entityTypeFilter, setEntityTypeFilter] = useState<VettingEntityType | 'all'>('all');
  const [officerFilter, setOfficerFilter] = useState('All Officers');
  const [overdueFilter, setOverdueFilter] = useState(false);
  const [flaggedFilter, setFlaggedFilter] = useState(false);
  const [sortBy, setSortBy] = useState('caseNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  
  // Dialog states
  const [approveRejectDialog, setApproveRejectDialog] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject';
    vettingCase: ActiveVettingCase | null;
  }>({
    isOpen: false,
    action: 'approve',
    vettingCase: null
  });
  
  const [bulkActionDialog, setBulkActionDialog] = useState<{
    isOpen: boolean;
    action: 'assign' | 'update-priority' | 'export' | 'bulk-approve';
    selectedCases: ActiveVettingCase[];
  }>({
    isOpen: false,
    action: 'assign',
    selectedCases: []
  });
  
  const [editCaseDialog, setEditCaseDialog] = useState<{
    isOpen: boolean;
    vettingCase: ActiveVettingCase | null;
  }>({
    isOpen: false,
    vettingCase: null
  });
  
  const [timelineDialog, setTimelineDialog] = useState<{
    isOpen: boolean;
    vettingCase: ActiveVettingCase | null;
  }>({
    isOpen: false,
    vettingCase: null
  });
  
  // Get KPIs from helper function
  const kpis = getOperationsKPIs();
  
  // Enhanced cases for stats calculation
  const enhancedCases = operationsVettingCases.map(c => ({
    ...c,
    primaryProvider: c.individualChecks.length > 0 
      ? c.individualChecks[0].provider?.split(' ')[0] || 'Unknown'
      : 'Unknown'
  }));
  
  // Filtered cases based on all filters
  let filteredCases = enhancedCases;
  
  // Apply focus filter
  if (focusMode.context && focusMode.context.type === 'Provider') {
    const context = focusMode.context;
    filteredCases = filteredCases.filter(c => c.primaryProvider === context.id);
  }
  
  // Apply KPI filter
  switch (activeFilter) {
    case 'consent-pending':
      filteredCases = filteredCases.filter(c => c.status === VettingStatus.CONSENT_PENDING);
      break;
    case 'overdue':
      filteredCases = filteredCases.filter(c => c.isOverdue);
      break;
    case 'ready-review':
      filteredCases = filteredCases.filter(c => c.status === VettingStatus.COMPLETE);
      break;
    case 'all':
    default:
      // No additional filtering
      break;
  }
  
  // Apply search filter
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredCases = filteredCases.filter(c => 
      c.caseNumber.toLowerCase().includes(searchLower) ||
      c.entityName.toLowerCase().includes(searchLower) ||
      c.entityIdentifier.toLowerCase().includes(searchLower) ||
      (c.assignedVettingOfficer && c.assignedVettingOfficer.toLowerCase().includes(searchLower))
    );
  }
  
  // Apply status filter
  if (statusFilter !== 'all') {
    filteredCases = filteredCases.filter(c => c.status === statusFilter);
  }
  
  // Apply priority filter
  if (priorityFilter !== 'all') {
    filteredCases = filteredCases.filter(c => c.priority === priorityFilter);
  }
  
  // Apply entity type filter
  if (entityTypeFilter !== 'all') {
    filteredCases = filteredCases.filter(c => c.entityType === entityTypeFilter);
  }
  
  // Apply officer filter
  if (officerFilter !== 'All Officers') {
    filteredCases = filteredCases.filter(c => c.assignedVettingOfficer === officerFilter);
  }
  
  // Apply overdue filter
  if (overdueFilter) {
    filteredCases = filteredCases.filter(c => c.isOverdue);
  }
  
  // Apply flagged filter
  if (flaggedFilter) {
    filteredCases = filteredCases.filter(c => c.flaggedForReview);
  }
  
  // Apply sorting
  const sortedCases = [...filteredCases].sort((a, b) => {
    let aValue: string | number | Date = a[sortBy as keyof typeof a] as string | number | Date;
    let bValue: string | number | Date = b[sortBy as keyof typeof b] as string | number | Date;
    
    // Handle null/undefined values
    if (aValue === null || aValue === undefined) aValue = '';
    if (bValue === null || bValue === undefined) bValue = '';
    
    // Handle date sorting
    if (sortBy === 'initiatedDate' || sortBy === 'estimatedCompletionDate') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    // Handle priority sorting (custom order)
    if (sortBy === 'priority') {
      const priorityOrder = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
      aValue = priorityOrder[aValue as keyof typeof priorityOrder] || 0;
      bValue = priorityOrder[bValue as keyof typeof priorityOrder] || 0;
    }
    
    // Handle status sorting with proper order
    if (sortBy === 'status') {
      const statusOrder: Record<VettingStatus, number> = {
        [VettingStatus.INITIATED]: 0,
        [VettingStatus.CONSENT_PENDING]: 1,
        [VettingStatus.IN_PROGRESS]: 2,
        [VettingStatus.PARTIALLY_COMPLETE]: 3,
        [VettingStatus.COMPLETE]: 4,
        [VettingStatus.FAILED]: 5,
        [VettingStatus.CANCELLED]: 6
      };
      aValue = statusOrder[aValue as VettingStatus] || 0;
      bValue = statusOrder[bValue as VettingStatus] || 0;
    }
    
    // Compare values
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Calculate dynamic stats
  const baseStats = {
    activeCases: kpis.totalActiveCases,
    completedToday: kpis.readyForReview,
    pendingConsent: kpis.pendingConsent,
    avgTurnaround: '4.2 days',
    successRate: 96.3,
    criticalAlerts: kpis.overdueTasks
  };
  
  // Focus-adjusted stats
  const stats = focusMode.context && focusMode.context.type === 'Provider' ? {
    activeCases: sortedCases.filter(c => c.status === VettingStatus.IN_PROGRESS).length,
    completedToday: sortedCases.filter(c => c.status === VettingStatus.COMPLETE).length,
    pendingConsent: sortedCases.filter(c => c.status === VettingStatus.CONSENT_PENDING).length,
    avgTurnaround: '3.8 days',
    successRate: 97.1,
    criticalAlerts: sortedCases.filter(c => c.flaggedForReview || c.isOverdue).length
  } : baseStats;
  
  // Focus Context Provider Value
  const focusContextValue: FocusContextType = {
    focus: focusMode.context,
    setFocus: (newFocus) => {
      setFocusMode({ enabled: true, context: newFocus });
      toast.success(`Focus Mode Active: ${newFocus.type} ${newFocus.id}`);
    },
    clearFocus: () => {
      setFocusMode({ enabled: false, context: null });
      toast.info('Focus mode cleared');
    }
  };
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        toast.success('Operations dashboard initialized');
      } catch {
        toast.error('Failed to load operations dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Note: Intelligence feed updates are now handled by the IntelligenceFeed component itself
  }, [realTimeMode]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      toast.success('Operations dashboard data refreshed');
    } catch {
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const toggleRealTimeMode = () => {
    setRealTimeMode(!realTimeMode);
    toast.info(realTimeMode ? 'Real-time mode disabled' : 'Real-time mode enabled');
  };

  const handleViewCase = (caseId: string) => {
    // Navigate to the case details page
    router.push(`/dashboard/operations/case/${caseId}`);
  };

  const handleViewEntity = (caseId: string) => {
    // Navigate to the entity 360 view page
    router.push(`/dashboard/operations/entity/${caseId}`);
  };

  const handleEditCase = (caseId: string) => {
    const vettingCase = sortedCases.find(c => c.id === caseId);
    if (vettingCase) {
      setEditCaseDialog({
        isOpen: true,
        vettingCase
      });
    }
  };

  const handleApproveCase = (caseId: string) => {
    const vettingCase = sortedCases.find(c => c.id === caseId);
    if (vettingCase) {
      setApproveRejectDialog({
        isOpen: true,
        action: 'approve',
        vettingCase
      });
    }
  };

  const handleRejectCase = (caseId: string) => {
    const vettingCase = sortedCases.find(c => c.id === caseId);
    if (vettingCase) {
      setApproveRejectDialog({
        isOpen: true,
        action: 'reject',
        vettingCase
      });
    }
  };

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    const selectedCases = sortedCases.filter(c => selectedIds.includes(c.id));
    setBulkActionDialog({
      isOpen: true,
      action: action as 'assign' | 'update-priority' | 'export' | 'bulk-approve',
      selectedCases
    });
  };

  // Dialog handlers
  const handleApproveRejectSubmit = (caseId: string, comment: string) => {
    // In real app, this would call an API
    console.log('Approve/Reject submission:', { caseId, comment });
  };

  const handleEditCaseSave = (updatedCase: Partial<ActiveVettingCase>) => {
    // In real app, this would call an API
    console.log('Edit case save:', updatedCase);
  };

  const handleBulkActionSubmit = (action: string, data: BulkActionFormData) => {
    // Handle bulk action submission
    console.log('Bulk action submitted:', action, data);
    toast.success(`Bulk action "${action}" completed successfully`);
    setBulkActionDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Control Bar Handlers
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setEntityTypeFilter('all');
    setOfficerFilter('All Officers');
    setOverdueFilter(false);
    setFlaggedFilter(false);
    setActiveFilter('all');
    toast.info('All filters cleared');
  };

  const handleExport = () => {
    toast.info('Exporting filtered cases');
  };

  return (
    <FocusContext.Provider value={focusContextValue}>
      <NeumorphicBackground className="min-h-screen">
        <div className="space-y-6">
          {/* Focus Mode Banner */}
          {focusMode.context && (
            <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 
                          border border-purple-400/30 rounded-lg p-4 mb-6
                          shadow-[var(--neumorphic-shadow-inset)] backdrop-blur-sm
                          animate-in slide-in-from-top-2 duration-300 z-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <NeumorphicText className="font-medium text-purple-200">
                    Focus Mode Active: {focusMode.context.type} {focusMode.context.id}
                  </NeumorphicText>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={focusContextValue.clearFocus}
                  className="text-purple-200 hover:text-purple-100 hover:bg-purple-500/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Header Section */}
          <NeumorphicCard>
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <NeumorphicHeading className="flex items-center gap-3">
                  <Command className="w-8 h-8 text-green-400" />
                  Operations Dashboard
                  {realTimeMode && <Radio className="w-5 h-5 text-green-400 animate-pulse" />}
                </NeumorphicHeading>
                <NeumorphicText variant="secondary" className="leading-tight">
                  Real-time operations control center with live mission tracking and intelligence feed
                </NeumorphicText>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="neumorphic-outline"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  variant="neumorphic-outline"
                  onClick={toggleRealTimeMode}
                  className="gap-2"
                >
                  {realTimeMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {realTimeMode ? 'Pause' : 'Resume'}
                </Button>
                <Button
                  variant="neumorphic"
                  onClick={() => toast.info('Export operations data')}
                  className="gap-2"
                >
                  <Target className="w-4 h-4" />
                  Export Data
                </Button>
              </div>
            </div>
          </NeumorphicCard>

          {/* ROW 1: The "Situation Room" KPI Cards per PRD */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Active Cases */}
            <NeumorphicCard 
              className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-200 ${
                activeFilter === 'all' ? 'ring-2 ring-blue-400' : ''
              }`}
              onClick={() => {
                setActiveFilter('all');
                toast.info('Showing all active cases');
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <NeumorphicText size="sm" variant="secondary">Total Active Cases</NeumorphicText>
                  <div className="text-3xl font-bold mt-1">
                    <CountUp end={stats.activeCases} duration={1} />
                  </div>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </NeumorphicCard>

            {/* Card 2: Pending Consent */}
            <NeumorphicCard 
              className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-200 ${
                activeFilter === 'consent-pending' ? 'ring-2 ring-yellow-400' : ''
              }`}
              onClick={() => {
                setActiveFilter('consent-pending');
                toast.info('Filtering to consent pending cases');
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <NeumorphicText size="sm" variant="secondary">Pending Consent</NeumorphicText>
                  <div className="text-3xl font-bold mt-1 text-[var(--neumorphic-severity-medium)]">
                    <CountUp end={stats.pendingConsent} duration={1} />
                  </div>
                </div>
                <Users className="w-8 h-8 text-yellow-400" />
              </div>
            </NeumorphicCard>

            {/* Card 3: Overdue Tasks */}
            <NeumorphicCard 
              className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-200 animate-pulse ${
                activeFilter === 'overdue' ? 'ring-2 ring-red-400' : ''
              }`}
              onClick={() => {
                setActiveFilter('overdue');
                toast.error('Filtering to overdue cases');
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <NeumorphicText size="sm" variant="secondary">Overdue</NeumorphicText>
                  <div className="text-3xl font-bold mt-1 text-[var(--neumorphic-severity-critical)]">
                    <CountUp end={stats.criticalAlerts} duration={1} />
                  </div>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </NeumorphicCard>

            {/* Card 4: Reports Ready for Review */}
            <NeumorphicCard 
              className={`p-6 cursor-pointer hover:shadow-lg transition-all duration-200 ${
                activeFilter === 'ready-review' ? 'ring-2 ring-green-400' : ''
              }`}
              onClick={() => {
                setActiveFilter('ready-review');
                toast.success('Filtering to cases ready for review');
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <NeumorphicText size="sm" variant="secondary">Ready for Review</NeumorphicText>
                  <div className="text-3xl font-bold mt-1 text-[var(--neumorphic-severity-low)]">
                    <CountUp end={stats.completedToday} duration={1} />
                  </div>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </NeumorphicCard>
          </div>

          {/* ROW 2: The "Mission Control" Hub */}
          <NeumorphicCard>
            <div className="flex items-center justify-between mb-6">
              <div>
                <NeumorphicText size="lg" className="font-bold">Operations Mission Control</NeumorphicText>
                <div className="flex items-center gap-2">
                  <NeumorphicText size="sm" variant="secondary" className="flex items-center gap-2">
                    Live mission tracking and case management
                    {realTimeMode && <Radio className="w-4 h-4 text-green-400 animate-pulse" />}
                  </NeumorphicText>
                  {activeFilter !== 'all' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-400">•</span>
                      <NeumorphicText size="sm" className="text-blue-400">
                        Filter: {activeFilter === 'consent-pending' ? 'Consent Pending' : 
                                activeFilter === 'overdue' ? 'Overdue Cases' :
                                activeFilter === 'ready-review' ? 'Ready for Review' : ''}
                      </NeumorphicText>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setActiveFilter('all')}
                        className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Controls Bar per PRD */}
            <OperationsControlBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              entityTypeFilter={entityTypeFilter}
              onEntityTypeFilterChange={setEntityTypeFilter}
              officerFilter={officerFilter}
              onOfficerFilterChange={setOfficerFilter}
              overdueFilter={overdueFilter}
              onOverdueFilterChange={setOverdueFilter}
              flaggedFilter={flaggedFilter}
              onFlaggedFilterChange={setFlaggedFilter}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              totalCases={operationsVettingCases.length}
              filteredCases={sortedCases.length}
              selectedCount={selectedCases.length}
              onRefresh={handleRefresh}
              onExport={handleExport}
              onClearFilters={handleClearFilters}
            />
            
            <ActiveCasesTable
              cases={sortedCases}
              loading={loading}
              onViewCase={handleViewCase}
              onViewEntity={handleViewEntity}
              onEditCase={handleEditCase}
              onApproveCase={handleApproveCase}
              onRejectCase={handleRejectCase}
              onBulkAction={handleBulkAction}
              missionControlMode={true}
              focusContext={focusContextValue}
              className="w-full"
            />
          </NeumorphicCard>
          
          {/* ROW 3: The "Intelligence Feed" */}
          <NeumorphicCard>
            <div className="flex items-center justify-between mb-6">
              <div>
                <NeumorphicText size="lg" className="font-semibold flex items-center gap-2">
                  <Activity className="w-6 h-6 text-green-400" />
                  Intelligence Feed
                  {realTimeMode && <Radio className="w-4 h-4 text-green-400 animate-pulse" />}
                </NeumorphicText>
                <NeumorphicText size="sm" variant="secondary">
                  Real-time operational events - click any item to view case details
                </NeumorphicText>
              </div>
            </div>
            
            <IntelligenceFeed
              realTimeMode={realTimeMode}
              onRealTimeModeChange={setRealTimeMode}
              showControls={false}
              compact={true}
              onEventClick={(event: IntelligenceFeedEvent) => {
                // Navigate to case details when intelligence feed item is clicked
                router.push(`/dashboard/operations/case/${event.caseId}`);
              }}
            />
          </NeumorphicCard>
        </div>
        
        {/* Dialog Components */}
        {approveRejectDialog.vettingCase && (
          <ApproveRejectDialog
            isOpen={approveRejectDialog.isOpen}
            onClose={() => setApproveRejectDialog(prev => ({ ...prev, isOpen: false }))}
            vettingCase={approveRejectDialog.vettingCase}
            action={approveRejectDialog.action}
            onApprove={handleApproveRejectSubmit}
            onReject={handleApproveRejectSubmit}
          />
        )}
        
        <BulkActionDialog
          isOpen={bulkActionDialog.isOpen}
          onClose={() => setBulkActionDialog(prev => ({ ...prev, isOpen: false }))}
          action={bulkActionDialog.action}
          selectedCases={bulkActionDialog.selectedCases}
          onSubmit={handleBulkActionSubmit}
        />
        
        {editCaseDialog.vettingCase && (
          <EditCaseDialog
            isOpen={editCaseDialog.isOpen}
            onClose={() => setEditCaseDialog(prev => ({ ...prev, isOpen: false }))}
            vettingCase={editCaseDialog.vettingCase}
            onSave={handleEditCaseSave}
          />
        )}
        
        {timelineDialog.vettingCase && (
          <TimelineDialog
            isOpen={timelineDialog.isOpen}
            onClose={() => setTimelineDialog(prev => ({ ...prev, isOpen: false }))}
            vettingCase={timelineDialog.vettingCase}
          />
        )}
      </NeumorphicBackground>
    </FocusContext.Provider>
  );
}