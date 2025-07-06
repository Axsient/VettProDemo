'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NeumorphicSelect } from '@/components/forms/selection/NeumorphicSelect';
import { NeumorphicCard, NeumorphicText } from '@/components/ui/neumorphic';
import CircularProgressRing from '@/components/ui/CircularProgressRing';
import { ReportDossierModal } from './ReportDossierModal';
import { CompletedVettingReport, RiskLevel } from '@/types/reports';
import { VettingEntityType } from '@/types/vetting';
import {
  Search,
  Filter,
  Eye,
  Download,
  FileText,
  Calendar,
  TrendingUp,
  BarChart3,
  Brain,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';

// Dynamic import to prevent SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CompletedReportsTableProps {
  reports: CompletedVettingReport[];
  className?: string;
}

interface RiskStats {
  [RiskLevel.CRITICAL]: number;
  [RiskLevel.HIGH]: number;
  [RiskLevel.MEDIUM]: number;
  [RiskLevel.LOW]: number;
}

export const CompletedReportsTable: React.FC<CompletedReportsTableProps> = ({
  reports,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeepSearch, setIsDeepSearch] = useState(false);
  const [riskFilter, setRiskFilter] = useState<'All' | RiskLevel>('All');
  const [entityFilter, setEntityFilter] = useState<'All' | VettingEntityType>('All');
  const [selectedReport, setSelectedReport] = useState<CompletedVettingReport | null>(null);
  const [showDossierModal, setShowDossierModal] = useState(false);

  // Calculate risk distribution stats
  const riskStats: RiskStats = useMemo(() => {
    const stats = {
      [RiskLevel.CRITICAL]: 0,
      [RiskLevel.HIGH]: 0,
      [RiskLevel.MEDIUM]: 0,
      [RiskLevel.LOW]: 0
    };

    reports.forEach(report => {
      stats[report.overallRiskLevel]++;
    });

    return stats;
  }, [reports]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const riskLevels = [RiskLevel.CRITICAL, RiskLevel.HIGH, RiskLevel.MEDIUM, RiskLevel.LOW];
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
    
    return {
      series: riskLevels.map(level => riskStats[level]),
      options: {
        chart: {
          type: 'donut' as const,
          height: 200,
          background: 'transparent',
          fontFamily: 'var(--font-family)',
          events: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            dataPointSelection: (event: any, chartContext: any, config: any) => {
              try {
                const selectedRiskLevel = riskLevels[config.dataPointIndex];
                setRiskFilter(selectedRiskLevel);
                toast.success(`Filtered by: ${selectedRiskLevel} Risk`);
              } catch (error) {
                console.warn('Chart selection error:', error);
              }
            }
          }
        },
        labels: ['Critical', 'High', 'Medium', 'Low'],
        colors: colors,
        plotOptions: {
          pie: {
            donut: {
              size: '65%',
              labels: {
                show: true,
                total: {
                  show: true,
                  label: 'Total Reports',
                  formatter: () => reports.length.toString(),
                  color: 'var(--neumorphic-text-primary)'
                }
              }
            }
          }
        },
        legend: {
          show: false
        },
        tooltip: {
          enabled: true,
          theme: 'dark',
          style: {
            fontSize: '12px',
            backgroundColor: 'var(--neumorphic-card)',
            color: 'var(--neumorphic-text-primary)'
          }
        },
        responsive: [{
          breakpoint: 768,
          options: {
            chart: {
              height: 150
            }
          }
        }]
      }
    };
  }, [riskStats, reports.length]);

  // Filter reports based on search and filters
  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        
        if (isDeepSearch) {
          // Deep Search - search in content
          const contentToSearch = [
            report.summary,
            ...report.checkResults.map(cr => cr.summary)
          ].join(' ').toLowerCase();
          
          if (!contentToSearch.includes(searchLower)) {
            return false;
          }
        } else {
          // Standard metadata search
          const metadataMatch = (
            report.subjectName.toLowerCase().includes(searchLower) ||
            report.reportId.toLowerCase().includes(searchLower) ||
            report.subjectId.toLowerCase().includes(searchLower)
          );
          
          if (!metadataMatch) {
            return false;
          }
        }
      }

      // Risk filter
      if (riskFilter !== 'All' && report.overallRiskLevel !== riskFilter) {
        return false;
      }

      // Entity filter
      if (entityFilter !== 'All' && report.entityType !== entityFilter) {
        return false;
      }

      return true;
    });
  }, [reports, searchTerm, isDeepSearch, riskFilter, entityFilter]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRiskBadge = (riskLevel: RiskLevel) => {
    switch (riskLevel) {
      case RiskLevel.CRITICAL:
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/40">Critical</Badge>;
      case RiskLevel.HIGH:
        return <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/40">High</Badge>;
      case RiskLevel.MEDIUM:
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/40">Medium</Badge>;
      case RiskLevel.LOW:
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/40">Low</Badge>;
    }
  };

  const getEntityTypeIcon = (entityType: VettingEntityType) => {
    switch (entityType) {
      case VettingEntityType.INDIVIDUAL:
        return '👤';
      case VettingEntityType.COMPANY:
        return '🏢';
      case VettingEntityType.STAFF_MEDICAL:
        return '⚕️';
      default:
        return '📄';
    }
  };

  const handleViewDossier = (report: CompletedVettingReport) => {
    setSelectedReport(report);
    setShowDossierModal(true);
  };

  const clearRiskFilter = () => {
    setRiskFilter('All');
    toast.info('Filter cleared');
  };

  // Calculate aggregate stats
  const totalReports = reports.length;
  const averageRiskScore = Math.round(
    reports.reduce((sum, report) => sum + report.overallRiskScore, 0) / totalReports
  );
  const recentReports = reports.filter(report => {
    const completionDate = new Date(report.completionDate);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return completionDate >= thirtyDaysAgo;
  }).length;

  return (
    <>
      <div className={`space-y-6 ${className}`}>
        {/* Interactive Risk Dashboard Header */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* KPI Cards */}
          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-neumorphic-text-secondary mb-1">Total Reports</div>
                <div className="text-2xl font-bold text-neumorphic-text-primary">{totalReports}</div>
              </div>
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-neumorphic-text-secondary mb-1">Avg Risk Score</div>
                <div className="text-2xl font-bold text-neumorphic-text-primary">{averageRiskScore}</div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </NeumorphicCard>

          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-neumorphic-text-secondary mb-1">Recent (30d)</div>
                <div className="text-2xl font-bold text-neumorphic-text-primary">{recentReports}</div>
              </div>
              <Calendar className="w-8 h-8 text-purple-400" />
            </div>
          </NeumorphicCard>

          {/* Interactive Risk Distribution Donut Chart */}
          <NeumorphicCard className="p-4">
            <div className="text-center">
              <div className="text-xs text-neumorphic-text-secondary mb-2">Risk Distribution</div>
              <div className="relative">
                {typeof window !== 'undefined' && (
                  <Chart
                    options={chartData.options}
                    series={chartData.series}
                    type="donut"
                    height={120}
                  />
                )}
                {riskFilter !== 'All' && (
                  <div className="absolute top-0 right-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearRiskFilter}
                      className="text-xs p-1 h-6 w-6"
                    >
                      ×
                    </Button>
                  </div>
                )}
              </div>
              {riskFilter !== 'All' && (
                <div className="text-xs text-blue-400 mt-1">
                  Filtered: {riskFilter}
                </div>
              )}
            </div>
          </NeumorphicCard>
        </div>

        {/* Search and Filters */}
        <NeumorphicCard className="p-4">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search with Deep Search Toggle */}
              <div className="flex-1">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neumorphic-text-secondary" />
                    <Input
                      placeholder={isDeepSearch ? "Deep search: 'payment defaults', 'director link to PEP'..." : "Search by name, report ID, or subject ID..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {/* Deep Search Toggle */}
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={isDeepSearch}
                        onChange={(e) => setIsDeepSearch(e.target.checked)}
                        className="rounded border-neumorphic-border"
                      />
                      <Brain className="w-4 h-4 text-purple-400" />
                      <span className="text-neumorphic-text-secondary">Deep Search</span>
                    </label>
                  </div>
                </div>
                
                {isDeepSearch && (
                  <div className="mt-2 p-2 bg-purple-500/10 border border-purple-500/20 rounded text-xs">
                    <div className="flex items-center gap-1 text-purple-400">
                      <Zap className="w-3 h-3" />
                      <span className="font-medium">AI-Powered Content Search</span>
                    </div>
                    <div className="text-neumorphic-text-secondary mt-1">
                      Searches within report summaries and check results content
                    </div>
                  </div>
                )}
              </div>
              
              {/* Filters */}
              <div className="flex gap-2">
                <NeumorphicSelect
                  options={[
                    { value: 'All', label: 'All Risk Levels' },
                    { value: RiskLevel.CRITICAL, label: 'Critical' },
                    { value: RiskLevel.HIGH, label: 'High' },
                    { value: RiskLevel.MEDIUM, label: 'Medium' },
                    { value: RiskLevel.LOW, label: 'Low' }
                  ]}
                  value={riskFilter}
                  onChange={(value) => setRiskFilter(value as 'All' | RiskLevel)}
                  placeholder="Filter by risk"
                  className="w-40"
                  size="sm"
                />

                <NeumorphicSelect
                  options={[
                    { value: 'All', label: 'All Types' },
                    { value: VettingEntityType.INDIVIDUAL, label: 'Individual' },
                    { value: VettingEntityType.COMPANY, label: 'Company' },
                    { value: VettingEntityType.STAFF_MEDICAL, label: 'Medical' }
                  ]}
                  value={entityFilter}
                  onChange={(value) => setEntityFilter(value as 'All' | VettingEntityType)}
                  placeholder="Filter by type"
                  className="w-36"
                  size="sm"
                />

                <Button variant="outline" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between text-sm">
              <NeumorphicText variant="secondary">
                Showing {filteredReports.length} of {totalReports} reports
                {(riskFilter !== 'All' || entityFilter !== 'All' || searchTerm) && (
                  <span className="text-blue-400 ml-2">
                    ({riskFilter !== 'All' && `${riskFilter} risk`}
                    {riskFilter !== 'All' && entityFilter !== 'All' && ', '}
                    {entityFilter !== 'All' && `${entityFilter.toLowerCase()}`}
                    {searchTerm && `, search: "${searchTerm}"`})
                  </span>
                )}
              </NeumorphicText>
            </div>
          </div>
        </NeumorphicCard>

        {/* Reports Grid */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <NeumorphicCard key={report.reportId} className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Report Details */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getEntityTypeIcon(report.entityType)}</span>
                        <NeumorphicText className="font-medium">
                          {report.subjectName}
                        </NeumorphicText>
                      </div>
                      <div className="text-xs text-neumorphic-text-secondary space-y-1">
                        <div>Report ID: {report.reportId}</div>
                        <div>Subject ID: {report.subjectId}</div>
                        <div>Completed: {formatDate(report.completionDate)}</div>
                      </div>
                    </div>
                    {getRiskBadge(report.overallRiskLevel)}
                  </div>

                  <div className="text-sm">
                    <NeumorphicText variant="secondary" className="line-clamp-3">
                      {report.summary}
                    </NeumorphicText>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDossier(report)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Dossier
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Download className="w-3 h-3 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>

                {/* Risk Score Visualization */}
                <div className="flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <div className="text-xs text-neumorphic-text-secondary">Risk Score</div>
                    <CircularProgressRing
                      percentage={100 - report.overallRiskScore}
                      size={80}
                      strokeWidth={6}
                    />
                    <div className="text-xs text-neumorphic-text-secondary">
                      {report.overallRiskScore}/100
                    </div>
                  </div>
                </div>

                {/* Check Results Summary */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-neumorphic-text-primary">
                    Check Results Summary
                  </div>
                  <div className="space-y-1">
                    {report.checkResults.slice(0, 3).map((check, index) => (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="text-neumorphic-text-secondary truncate flex-1">
                          {check.checkName}
                        </span>
                        <Badge 
                          variant={
                            check.status === 'Clear' ? 'default' :
                            check.status === 'Adverse Finding' ? 'destructive' :
                            'outline'
                          }
                          className="text-xs ml-2"
                        >
                          {check.status}
                        </Badge>
                      </div>
                    ))}
                    {report.checkResults.length > 3 && (
                      <div className="text-xs text-blue-400">
                        +{report.checkResults.length - 3} more checks
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </NeumorphicCard>
          ))}
        </div>

        {/* No Results */}
        {filteredReports.length === 0 && (
          <NeumorphicCard className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <BarChart3 className="w-12 h-12 text-neumorphic-text-secondary opacity-50" />
              <NeumorphicText variant="secondary">
                No reports found matching your criteria
              </NeumorphicText>
              {(riskFilter !== 'All' || entityFilter !== 'All' || searchTerm) && (
                <Button variant="outline" onClick={() => {
                  setRiskFilter('All');
                  setEntityFilter('All');
                  setSearchTerm('');
                  setIsDeepSearch(false);
                }}>
                  Clear all filters
                </Button>
              )}
            </div>
          </NeumorphicCard>
        )}
      </div>

      {/* Report Dossier Modal */}
      {selectedReport && (
        <ReportDossierModal
          open={showDossierModal}
          onOpenChange={setShowDossierModal}
          report={selectedReport}
        />
      )}
    </>
  );
};