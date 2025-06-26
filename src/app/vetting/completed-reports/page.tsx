"use client";

import React, { useState, useMemo } from 'react';
import { 
  NeumorphicBackground,
  NeumorphicCard, 
  NeumorphicHeading, 
  NeumorphicText,
  NeumorphicBadge,
  NeumorphicStatsCard,
  NeumorphicTable,
  NeumorphicTableHeader,
  NeumorphicTableBody,
  NeumorphicTableRow,
  NeumorphicTableHead,
  NeumorphicTableCell
} from '@/components/ui/neumorphic';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  RefreshCw, 
  Download, 
  Eye, 
  FileText,
  Shield,
  AlertTriangle,
  Building2,
  User,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { 
  CompletedVettingReport, 
  RiskLevel, 
  ReportStatus,
  CompletedReportsFilters,
  RISK_LEVEL_VARIANTS,
  REPORT_STATUS_VARIANTS,
  CHECK_RESULT_VARIANTS
} from '@/types/reports';
import { VettingEntityType } from '@/types/vetting';
import { sampleCompletedReports, getCompletedReports } from '@/lib/sample-data/completedReportsSample';
import { toast } from 'sonner';

// Extended table row type with computed properties
interface CompletedReportTableRow extends CompletedVettingReport, Record<string, unknown> {
  formattedCompletionDate: string;
  riskDescription: string;
}

export default function CompletedVettingReportsPage() {
  const [data, setData] = useState<CompletedVettingReport[]>(sampleCompletedReports);
  const [filters, setFilters] = useState<CompletedReportsFilters>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<CompletedVettingReport | null>(null);

  // Calculate statistics for dashboard cards
  const stats = useMemo(() => {
    const totalReports = data.length;
    const completeReports = data.filter(r => r.reportStatus === ReportStatus.COMPLETE).length;
    const criticalRisk = data.filter(r => r.overallRiskLevel === RiskLevel.CRITICAL).length;
    const highRisk = data.filter(r => r.overallRiskLevel === RiskLevel.HIGH).length;
    
    // Average risk score
    const avgRiskScore = Math.round(
      data.reduce((sum, r) => sum + r.overallRiskScore, 0) / totalReports
    );

    // Risk level distribution
    const riskDistribution = data.reduce((acc, report) => {
      acc[report.overallRiskLevel] = (acc[report.overallRiskLevel] || 0) + 1;
      return acc;
    }, {} as Record<RiskLevel, number>);

    return {
      totalReports,
      completeReports,
      criticalRisk,
      highRisk,
      avgRiskScore,
      riskDistribution
    };
  }, [data]);

  // Convert data to table rows with enhanced properties
  const tableRows: CompletedReportTableRow[] = useMemo(() => {
    return data.map(report => {
      const completionDate = new Date(report.completionDate);

      return {
        ...report,
        formattedCompletionDate: completionDate.toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        riskDescription: `${report.overallRiskLevel} (${report.overallRiskScore}/100)`
      };
    });
  }, [data]);

  // Filter the data based on current filters
  const filteredRows = useMemo(() => {
    return tableRows.filter(row => {
      if (filters.searchQuery) {
        const searchLower = filters.searchQuery.toLowerCase();
        if (!row.reportId.toLowerCase().includes(searchLower) &&
            !row.vettingCaseId.toLowerCase().includes(searchLower) &&
            !row.subjectName.toLowerCase().includes(searchLower) &&
            !row.subjectId.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (filters.riskLevel && row.overallRiskLevel !== filters.riskLevel) {
        return false;
      }

      if (filters.entityType && row.entityType !== filters.entityType) {
        return false;
      }

      if (filters.reportStatus && row.reportStatus !== filters.reportStatus) {
        return false;
      }

      return true;
    });
  }, [tableRows, filters]);



  // Handle functions
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const refreshedData = await getCompletedReports();
      setData(refreshedData);
      toast.success('Reports refreshed successfully');
         } catch {
       toast.error('Failed to refresh reports');
     } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = (report: CompletedReportTableRow) => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = report.pdfLink;
    link.download = `${report.reportId}_vetting_report.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading report ${report.reportId}.pdf`);
  };

  // const handleViewCase = (report: CompletedReportTableRow) => {
  //   // Navigate to vetting case view
  //   toast.info(`Navigating to vetting case ${report.vettingCaseId}`);
  // };

  const handleArchiveReport = (report: CompletedReportTableRow) => {
    setData(prev => prev.filter(r => r.reportId !== report.reportId));
    toast.success(`Report ${report.reportId} archived successfully`);
  };

  const handleFilterChange = (key: keyof CompletedReportsFilters, value: string | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <NeumorphicBackground className="min-h-screen">
      <div className="w-full space-y-1">
        {/* Header Section */}
        <NeumorphicCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <NeumorphicHeading>Completed Vetting Reports</NeumorphicHeading>
              <NeumorphicText variant="secondary" className="leading-tight">
                Secure archive of finalized vetting reports ({stats.totalReports} of {stats.totalReports} reports)
              </NeumorphicText>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="neumorphic-outline"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </NeumorphicCard>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <NeumorphicStatsCard
            title="Total Reports"
            value={stats.totalReports.toString()}
            icon={<FileText className="w-6 h-6 text-blue-400" />}
          />
          <NeumorphicStatsCard
            title="Complete Reports"
            value={stats.completeReports.toString()}
            icon={<Shield className="w-6 h-6 text-green-400" />}
          />
          <NeumorphicStatsCard
            title="High Risk +"
            value={(stats.criticalRisk + stats.highRisk).toString()}
            icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
          />
          <NeumorphicCard className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-neumorphic-text-secondary">Risk Distribution</h3>
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div className="space-y-1">
              {Object.entries(stats.riskDistribution).map(([level, count]) => (
                <div key={level} className="flex justify-between text-sm">
                  <span className="text-neumorphic-text-secondary">{level}:</span>
                  <span className="font-medium text-neumorphic-text-primary">{count}</span>
                </div>
              ))}
            </div>
          </NeumorphicCard>
        </div>

        {/* Main Content Card */}
        <NeumorphicCard className="space-y-6">
          {/* Toolbar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neumorphic-text-secondary w-4 h-4" />
                <Input
                  placeholder="Search by Report ID, Case ID, Subject Name, or Subject ID..."
                  className="pl-10 w-80"
                  value={filters.searchQuery || ''}
                  onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <select
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={filters.riskLevel || ''}
                  onChange={(e) => handleFilterChange('riskLevel', e.target.value || undefined)}
                >
                  <option value="">All Risk Levels</option>
                  {Object.values(RiskLevel).map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>

                <select
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={filters.entityType || ''}
                  onChange={(e) => handleFilterChange('entityType', e.target.value || undefined)}
                >
                  <option value="">All Entity Types</option>
                  {Object.values(VettingEntityType).map(type => (
                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                  ))}
                </select>

                <select
                  className="px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  value={filters.reportStatus || ''}
                  onChange={(e) => handleFilterChange('reportStatus', e.target.value || undefined)}
                >
                  <option value="">All Statuses</option>
                  {Object.values(ReportStatus).map(status => (
                    <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear filters */}
            <Button
              variant="neumorphic-outline"
              onClick={() => setFilters({})}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Clear
            </Button>
          </div>

          {/* Neumorphic Table */}
          <div className="overflow-x-auto">
            <NeumorphicTable>
              <NeumorphicTableHeader>
                <NeumorphicTableRow>
                  <NeumorphicTableHead>Report ID</NeumorphicTableHead>
                  <NeumorphicTableHead>Subject</NeumorphicTableHead>
                  <NeumorphicTableHead>Subject ID</NeumorphicTableHead>
                  <NeumorphicTableHead>Type</NeumorphicTableHead>
                  <NeumorphicTableHead>Risk Level</NeumorphicTableHead>
                  <NeumorphicTableHead>Status</NeumorphicTableHead>
                  <NeumorphicTableHead>Date</NeumorphicTableHead>
                  <NeumorphicTableHead>Actions</NeumorphicTableHead>
                </NeumorphicTableRow>
              </NeumorphicTableHeader>
              <NeumorphicTableBody>
                {filteredRows.map((report) => (
                  <NeumorphicTableRow key={report.reportId}>
                    <NeumorphicTableCell className="font-medium">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-blue-600 hover:text-blue-800 font-mono text-xs underline">
                            {report.reportId}
                          </button>
                        </DialogTrigger>
                        <DialogContent variant="neumorphic" className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <ReportSummaryModal report={report} />
                        </DialogContent>
                      </Dialog>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <div className="flex items-center gap-1.5">
                        {report.entityType === VettingEntityType.COMPANY ? (
                          <Building2 className="w-3 h-3 text-blue-500" />
                        ) : (
                          <User className="w-3 h-3 text-purple-500" />
                        )}
                        <span className="font-medium text-sm truncate">{report.subjectName}</span>
                      </div>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <span className="font-mono text-xs text-neumorphic-text-secondary">
                        {report.subjectId}
                      </span>
                    </NeumorphicTableCell>
                                         <NeumorphicTableCell>
                       <NeumorphicBadge variant="info" className="text-xs">
                         {report.entityType.replace('_', ' ')}
                       </NeumorphicBadge>
                     </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <NeumorphicBadge variant={RISK_LEVEL_VARIANTS[report.overallRiskLevel]}>
                        {report.overallRiskLevel}
                      </NeumorphicBadge>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <div className="flex items-center gap-1.5">
                        {report.reportStatus === ReportStatus.COMPLETE ? (
                          <Shield className="w-3 h-3 text-green-500" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                        )}
                        <NeumorphicBadge variant={REPORT_STATUS_VARIANTS[report.reportStatus]}>
                          {report.reportStatus.replace(/_/g, ' ')}
                        </NeumorphicBadge>
                      </div>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-neumorphic-text-secondary" />
                        <span className="text-xs">{report.formattedCompletionDate}</span>
                      </div>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-neumorphic-hover"
                          onClick={() => setSelectedReport(report)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-neumorphic-hover"
                          onClick={() => handleDownloadPDF(report)}
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-neumorphic-hover"
                          onClick={() => handleArchiveReport(report)}
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </NeumorphicTableCell>
                  </NeumorphicTableRow>
                ))}
              </NeumorphicTableBody>
            </NeumorphicTable>
          </div>

          {/* Simple Pagination */}
          <div className="flex items-center justify-between pt-4">
            <NeumorphicText variant="secondary" size="sm">
              Showing {Math.min(filteredRows.length, 10)} of {filteredRows.length} entries
            </NeumorphicText>
            <div className="flex items-center gap-2">
              <Button variant="neumorphic-outline" size="sm" disabled>
                Previous
              </Button>
              <NeumorphicText size="sm">Page 1 of 1</NeumorphicText>
              <Button variant="neumorphic-outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </NeumorphicCard>

        {/* Report Summary Modal */}
        {selectedReport && (
          <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
            <DialogContent variant="neumorphic" className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <ReportSummaryModal report={selectedReport} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </NeumorphicBackground>
  );
}

// Report Summary Modal Component
function ReportSummaryModal({ report }: { report: CompletedVettingReport }) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Vetting Report Summary: {report.subjectName}
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Header Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <NeumorphicText variant="secondary" size="sm">Report ID</NeumorphicText>
            <NeumorphicText className="font-semibold">{report.reportId}</NeumorphicText>
          </div>
          <div>
            <NeumorphicText variant="secondary" size="sm">Completion Date</NeumorphicText>
            <NeumorphicText className="font-semibold">
              {new Date(report.completionDate).toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </NeumorphicText>
          </div>
          <div>
            <NeumorphicText variant="secondary" size="sm">Generated By</NeumorphicText>
            <NeumorphicText className="font-semibold">{report.reportGeneratedBy}</NeumorphicText>
          </div>
        </div>

        {/* Risk Assessment */}
        <NeumorphicCard className="p-4">
          <div className="flex items-center justify-between mb-4">
            <NeumorphicText size="lg" className="font-semibold">Risk Assessment</NeumorphicText>
            <div className="flex items-center gap-2">
              <NeumorphicText variant="secondary" size="sm">Risk Score</NeumorphicText>
              <NeumorphicBadge variant={RISK_LEVEL_VARIANTS[report.overallRiskLevel]}>
                {report.overallRiskLevel}
              </NeumorphicBadge>
              <NeumorphicText className="font-bold text-lg">
                {report.overallRiskScore}/100
              </NeumorphicText>
            </div>
          </div>
          
          <NeumorphicText variant="secondary" size="sm" className="mb-2">
            AI-Generated Summary
          </NeumorphicText>
          <NeumorphicText>{report.summary}</NeumorphicText>
        </NeumorphicCard>

        {/* Check Results */}
        <NeumorphicCard className="p-4">
          <NeumorphicText size="lg" className="font-semibold mb-4">Check Results</NeumorphicText>
          <div className="space-y-3">
            {report.checkResults.map((check, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-neumorphic-card">
                <NeumorphicBadge 
                  variant={CHECK_RESULT_VARIANTS[check.status]}
                  className="text-xs px-2 py-1 mt-1 flex-shrink-0"
                >
                  {check.status}
                </NeumorphicBadge>
                <div className="flex-1">
                  <NeumorphicText className="font-medium">{check.checkName}</NeumorphicText>
                  <NeumorphicText variant="secondary" size="sm">{check.summary}</NeumorphicText>
                </div>
              </div>
            ))}
          </div>
        </NeumorphicCard>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="neumorphic"
            onClick={() => {
              const link = document.createElement('a');
              link.href = report.pdfLink;
              link.download = `${report.reportId}_vetting_report.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              toast.success(`Downloading report ${report.reportId}.pdf`);
            }}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Full PDF Report
          </Button>
        </div>
      </div>
    </>
  );
} 