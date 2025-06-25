'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, RefreshCw, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { ActiveVettingCase } from '@/types/vetting';
import { activeVettingCases, getActiveVettingCasesStats } from '@/lib/sample-data/activeVettingCasesSample';
import { 
  NeumorphicBackground,
  NeumorphicCard,
  NeumorphicText,
  NeumorphicHeading,
  NeumorphicStatsCard,
} from '@/components/ui/neumorphic';
import { ActiveVettingCasesDemo } from '@/components/vetting/ActiveVettingCasesDemo';

export default function ActiveVettingCases() {
  const [cases, setCases] = useState<ActiveVettingCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReturnType<typeof getActiveVettingCasesStats> | null>(null);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setCases(activeVettingCases);
        setStats(getActiveVettingCasesStats());
      } catch {
        toast.error('Failed to load active vetting cases');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Event handlers
  const handleViewCase = (caseId: string) => {
    toast.info(`Viewing case: ${caseId}`);
    // TODO: Navigate to case details page or open modal
  };

  const handleEditCase = (caseId: string) => {
    toast.info(`Editing case: ${caseId}`);
    // TODO: Navigate to edit page or open edit modal
  };

  const handleApproveCase = (caseId: string) => {
    toast.success(`Case ${caseId} approved`);
    // TODO: Update case status
  };

  const handleRejectCase = (caseId: string) => {
    toast.error(`Case ${caseId} rejected`);
    // TODO: Update case status
  };

  const handleBulkAction = (action: string, selectedIds: string[]) => {
    toast.info(`Bulk action '${action}' on ${selectedIds.length} cases`);
    // TODO: Implement bulk actions
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setCases([...activeVettingCases]);
      setStats(getActiveVettingCasesStats());
      toast.success('Data refreshed');
    } catch {
      toast.error('Failed to refresh data');
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateNewVetting = () => {
    toast.info('Navigating to initiate new vetting');
    // TODO: Navigate to initiate vetting page
  };

  const handleExportAll = () => {
    toast.info('Exporting all active cases');
    // TODO: Implement export functionality
  };

  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="space-y-6">
        {/* Header Section */}
        <NeumorphicCard>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <NeumorphicHeading>Active Vetting Cases</NeumorphicHeading>
              <NeumorphicText variant="secondary" className="leading-tight">
                Manage and track ongoing vetting cases across all entity types
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
                onClick={handleExportAll}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export All
              </Button>
              <Button
                variant="neumorphic"
                onClick={handleInitiateNewVetting}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Initiate New Vetting
              </Button>
            </div>
          </div>
        </NeumorphicCard>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <NeumorphicStatsCard
              title="Total Cases"
              value={stats.totalCases}
              icon={<Clock className="w-6 h-6 text-blue-400" />}
            />

            <NeumorphicStatsCard
              title="In Progress"
              value={stats.inProgressCases}
              icon={<Clock className="w-6 h-6 text-yellow-400" />}
            />

            <NeumorphicStatsCard
              title="Completed"
              value={stats.completedCases}
              icon={<CheckCircle className="w-6 h-6 text-green-400" />}
            />

            <NeumorphicStatsCard
              title="Overdue"
              value={stats.overdueCases}
              icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
            />

            <NeumorphicStatsCard
              title="Flagged"
              value={stats.flaggedCases}
              icon={<AlertTriangle className="w-6 h-6 text-orange-400" />}
            />
          </div>
        )}

        {/* Priority Distribution */}
        {stats && (
          <NeumorphicCard>
            <NeumorphicText size="lg" className="font-semibold mb-3">
              Priority Distribution
            </NeumorphicText>
            <div className="flex flex-wrap gap-3">
              <Badge variant="destructive" className="gap-1">
                Urgent: {stats.priorityDistribution.Urgent}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                High: {stats.priorityDistribution.High}
              </Badge>
              <Badge variant="outline" className="gap-1">
                Medium: {stats.priorityDistribution.Medium}
              </Badge>
              <Badge variant="outline" className="gap-1">
                Low: {stats.priorityDistribution.Low}
              </Badge>
            </div>
          </NeumorphicCard>
        )}

        {/* Main Table */}
        <NeumorphicCard>
          <ActiveVettingCasesDemo />
        </NeumorphicCard>
      </div>
    </NeumorphicBackground>
  );
} 