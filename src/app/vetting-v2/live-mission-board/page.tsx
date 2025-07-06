'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  Play, 
  Pause, 
  Target, 
  Clock,
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
import { activeVettingCases } from '@/lib/sample-data/activeVettingCasesSample';
import ActiveCasesTable, { FocusContext, type FocusContextType } from '@/components/vetting/ActiveCasesTable';
import CountUp from 'react-countup';

// KPI Animation Component
const AnimatedKPI: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  focused?: boolean;
}> = ({ title, value, icon, focused = false }) => {
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
  
  return (
    <NeumorphicStatsCard
      title={title}
      value={
        typeof value === 'number' ? (
          <CountUp
            end={numericValue}
            duration={focused ? 1.5 : 0.5}
            preserveValue
          />
        ) : (
          value
        )
      }
      icon={icon}
      className={focused ? 'ring-2 ring-purple-400 shadow-lg' : ''}
    />
  );
};

export default function LiveMissionBoard() {
  const [loading, setLoading] = useState(true);
  const [realTimeMode, setRealTimeMode] = useState(true);
  const [focus, setFocusState] = useState<{ type: 'Provider' | 'Status'; id: string } | null>(null);
  
  // Enhanced cases for stats calculation
  const enhancedCases = activeVettingCases.map(c => ({
    ...c,
    primaryProvider: c.individualChecks.length > 0 
      ? c.individualChecks[0].provider?.split(' ')[0] || 'Unknown'
      : 'Unknown'
  }));
  
  // Filtered cases based on focus
  const filteredCases = focus && focus.type === 'Provider' 
    ? enhancedCases.filter(c => c.primaryProvider === focus.id)
    : enhancedCases;
  
  // Calculate dynamic stats
  const baseStats = {
    activeCases: activeVettingCases.filter(c => c.status === 'In Progress').length || 8,
    completedToday: activeVettingCases.filter(c => c.status === 'Complete').length || 3,
    pendingConsent: activeVettingCases.filter(c => c.status === 'Consent Pending').length || 2,
    avgTurnaround: '5.2 days',
    successRate: 94.7,
    criticalAlerts: activeVettingCases.filter(c => c.flaggedForReview || c.isOverdue).length || 4
  };
  
  // Focus-adjusted stats
  const stats = focus && focus.type === 'Provider' ? {
    activeCases: filteredCases.filter(c => c.status === 'In Progress').length,
    completedToday: filteredCases.filter(c => c.status === 'Complete').length,
    pendingConsent: filteredCases.filter(c => c.status === 'Consent Pending').length,
    avgTurnaround: '4.8 days',
    successRate: 96.2,
    criticalAlerts: filteredCases.filter(c => c.flaggedForReview || c.isOverdue).length
  } : baseStats;

  // Focus Context Provider Value
  const focusContextValue: FocusContextType = {
    focus,
    setFocus: (newFocus) => {
      setFocusState(newFocus);
      toast.success(`Focus Mode Active: ${newFocus.type} ${newFocus.id}`);
    },
    clearFocus: () => {
      setFocusState(null);
      toast.info('Focus mode cleared');
    }
  };
  
  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 300));
        toast.success('Mission board initialized');
      } catch {
        toast.error('Failed to load mission board data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      toast.success('Mission board data refreshed');
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
    toast.info(`Viewing case ${caseId}`);
  };

  const handleEditCase = (caseId: string) => {
    toast.info(`Editing case ${caseId}`);
  };

  const handleApproveCase = (caseId: string) => {
    toast.success(`Case ${caseId} approved`);
  };

  const handleRejectCase = (caseId: string) => {
    toast.error(`Case ${caseId} rejected`);
  };

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    toast.info(`Bulk action ${action} on ${selectedIds.length} cases`);
  };

  return (
    <FocusContext.Provider value={focusContextValue}>
      <NeumorphicBackground className="min-h-screen">
        <div className="space-y-6">
          {/* Focus Mode Banner */}
          {focus && (
            <div className="bg-gradient-to-r from-purple-500/20 to-purple-600/20 
                          border border-purple-400/30 rounded-lg p-4 mb-6
                          shadow-[var(--neumorphic-shadow-inset)] backdrop-blur-sm
                          animate-in slide-in-from-top-2 duration-300 z-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  <NeumorphicText className="font-medium text-purple-200">
                    Focus Mode Active: {focus.type} {focus.id}
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
                  Live Mission Board
                  {realTimeMode && <Radio className="w-5 h-5 text-green-400 animate-pulse" />}
                </NeumorphicHeading>
                <NeumorphicText variant="secondary" className="leading-tight">
                  Real-time mission control center with interactive timelines and focus modes
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
                  onClick={() => toast.info('Mission dispatch interface')}
                  className="gap-2"
                >
                  <Target className="w-4 h-4" />
                  Dispatch Mission
                </Button>
              </div>
            </div>
          </NeumorphicCard>

          {/* Mission Control Stats - Animated KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <AnimatedKPI
              title="Active Cases"
              value={stats.activeCases}
              icon={<Target className="w-6 h-6 text-blue-400" />}
              focused={!!focus}
            />

            <AnimatedKPI
              title="Completed Today"
              value={stats.completedToday}
              icon={<CheckCircle className="w-6 h-6 text-green-400" />}
              focused={!!focus}
            />

            <AnimatedKPI
              title="Pending Consent"
              value={stats.pendingConsent}
              icon={<Users className="w-6 h-6 text-purple-400" />}
              focused={!!focus}
            />

            <AnimatedKPI
              title="Avg Turnaround"
              value={stats.avgTurnaround}
              icon={<Clock className="w-6 h-6 text-yellow-400" />}
              focused={!!focus}
            />

            <AnimatedKPI
              title="Success Rate"
              value={`${stats.successRate}%`}
              icon={<Activity className="w-6 h-6 text-green-400" />}
              focused={!!focus}
            />

            <AnimatedKPI
              title="Critical Alerts"
              value={stats.criticalAlerts}
              icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
              focused={!!focus}
            />
          </div>

          {/* Enhanced Active Cases Table */}
          <NeumorphicCard>
            <div className="flex items-center justify-between mb-6">
              <NeumorphicText size="lg" className="font-semibold flex items-center gap-2">
                <Command className="w-6 h-6 text-blue-400" />
                Live Mission Control
                {realTimeMode && <Radio className="w-4 h-4 text-green-400 animate-pulse" />}
              </NeumorphicText>
            </div>
            
            <ActiveCasesTable
              cases={activeVettingCases}
              loading={loading}
              onViewCase={handleViewCase}
              onEditCase={handleEditCase}
              onApproveCase={handleApproveCase}
              onRejectCase={handleRejectCase}
              onBulkAction={handleBulkAction}
              missionControlMode={true}
              focusContext={focusContextValue}
              className="w-full"
            />
          </NeumorphicCard>
          
          {/* Implementation Notice */}
          <NeumorphicCard>
            <div className="flex items-start gap-3">
              <Command className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <NeumorphicText size="sm" className="font-medium mb-1">
                  Live Mission Board - Enhanced v2
                </NeumorphicText>
                <NeumorphicText variant="secondary" size="sm">
                  Sophisticated mission control table with heartbeat status animations, interactive timeline expansion,
                  right-click provider focus modes, and integrated PDF dossier viewing. Click rows to expand timelines,
                  right-click providers to focus, and use table actions for mission operations.
                </NeumorphicText>
              </div>
            </div>
          </NeumorphicCard>
        </div>
      </NeumorphicBackground>
    </FocusContext.Provider>
  );
}