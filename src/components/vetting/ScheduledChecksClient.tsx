'use client';

import React, { useState, useMemo } from 'react';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { EventInput, EventApi } from '@fullcalendar/core';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  NeumorphicCard,
  NeumorphicText,
  NeumorphicStatsCard,
  NeumorphicTable,
  NeumorphicTableHeader,
  NeumorphicTableBody,
  NeumorphicTableRow,
  NeumorphicTableHead,
  NeumorphicTableCell,
  NeumorphicCalendar,
  NeumorphicBadge
} from '@/components/ui/neumorphic';
import {
  Calendar,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  History,
  Trash2,
  FileText,
  Plus
} from 'lucide-react';
import {
  ScheduledCheckItem,
  ScheduleFrequency,
  ScheduleStatus,
  ScheduledChecksStats
} from '@/types/scheduling';
import { VettingEntityType } from '@/types/vetting';
import { RiskLevel } from '@/types/reports';

interface ScheduledChecksClientProps {
  initialScheduledChecks: ScheduledCheckItem[];
  initialStats: ScheduledChecksStats;
}

export function ScheduledChecksClient({
  initialScheduledChecks,
  initialStats
}: ScheduledChecksClientProps) {
  const [scheduledChecks, setScheduledChecks] = useState<ScheduledCheckItem[]>(initialScheduledChecks);
  const [stats] = useState<ScheduledChecksStats>(initialStats);
  const [view, setView] = useState<'calendar' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [frequencyFilter, setFrequencyFilter] = useState<string>('all');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Modal states
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduledCheckItem | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return scheduledChecks.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subjectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.checkName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesFrequency = frequencyFilter === 'all' || item.frequency === frequencyFilter;
      const matchesEntityType = entityTypeFilter === 'all' || item.entityType === entityTypeFilter;
      
      return matchesSearch && matchesStatus && matchesFrequency && matchesEntityType;
    });
  }, [scheduledChecks, searchTerm, statusFilter, frequencyFilter, entityTypeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Calendar events
  const calendarEvents: EventInput[] = useMemo(() => {
    return filteredData.map(schedule => ({
      id: schedule.scheduleId,
      title: `${schedule.checkName} - ${schedule.subjectName}`,
      date: schedule.nextRunDate,
      backgroundColor: getStatusColor(schedule.status),
      borderColor: getStatusColor(schedule.status),
      textColor: '#ffffff',
      extendedProps: {
        schedule
      }
    }));
  }, [filteredData]);

  // Helper functions
  function getStatusColor(status: ScheduleStatus): string {
    switch (status) {
      case ScheduleStatus.ACTIVE:
        return '#10b981'; // green
      case ScheduleStatus.OVERDUE:
        return '#ef4444'; // red
      case ScheduleStatus.PAUSED:
        return '#f59e0b'; // amber
      case ScheduleStatus.IN_PROGRESS:
        return '#3b82f6'; // blue
      default:
        return '#6b7280'; // gray
    }
  }

  function getStatusBadgeVariant(status: ScheduleStatus) {
    switch (status) {
      case ScheduleStatus.ACTIVE:
        return 'success';
      case ScheduleStatus.OVERDUE:
        return 'danger';
      case ScheduleStatus.PAUSED:
        return 'warning';
      case ScheduleStatus.IN_PROGRESS:
        return 'info';
      default:
        return 'default';
    }
  }

  function getRiskLevelColor(risk: RiskLevel): string {
    switch (risk) {
      case RiskLevel.HIGH:
        return 'text-red-500';
      case RiskLevel.MEDIUM:
        return 'text-orange-500';
      case RiskLevel.LOW:
        return 'text-green-500';
      case RiskLevel.INFO_ONLY:
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  }

  function getEntityIcon(entityType: VettingEntityType) {
    switch (entityType) {
      case VettingEntityType.INDIVIDUAL:
        return '👤';
      case VettingEntityType.COMPANY:
        return '🏢';
      case VettingEntityType.STAFF_MEDICAL:
        return '⚕️';
      default:
        return '📋';
    }
  }

  function isOverdue(nextRunDate: string): boolean {
    return isBefore(parseISO(nextRunDate), new Date());
  }

  function isUpcoming(nextRunDate: string): boolean {
    const runDate = parseISO(nextRunDate);
    const now = new Date();
    const weekFromNow = addDays(now, 7);
    return isAfter(runDate, now) && isBefore(runDate, weekFromNow);
  }

  // Event handlers
  const handleRunNow = (scheduleId: string) => {
    const schedule = scheduledChecks.find(s => s.scheduleId === scheduleId);
    if (schedule) {
      // Update status to IN_PROGRESS
      setScheduledChecks(prev => prev.map(s => 
        s.scheduleId === scheduleId 
          ? { ...s, status: ScheduleStatus.IN_PROGRESS }
          : s
      ));
      toast.success(`Manual run initiated for ${schedule.checkName} on ${schedule.subjectName}`);
      
      // Simulate completion after 3 seconds
      setTimeout(() => {
        setScheduledChecks(prev => prev.map(s => 
          s.scheduleId === scheduleId 
            ? { 
                ...s, 
                status: ScheduleStatus.ACTIVE,
                lastRunDate: new Date().toISOString(),
                lastRunOutcome: RiskLevel.LOW
              }
            : s
        ));
        toast.success(`Check completed for ${schedule.subjectName}`);
      }, 3000);
    }
  };

  const handlePauseResume = (scheduleId: string, currentStatus: ScheduleStatus) => {
    const newStatus = currentStatus === ScheduleStatus.PAUSED ? ScheduleStatus.ACTIVE : ScheduleStatus.PAUSED;
    const action = currentStatus === ScheduleStatus.PAUSED ? 'Resumed' : 'Paused';
    
    setScheduledChecks(prev => prev.map(s => 
      s.scheduleId === scheduleId 
        ? { ...s, status: newStatus }
        : s
    ));
    toast.success(`Schedule ${action.toLowerCase()}`);
  };

  const handleViewDetails = (scheduleId: string) => {
    const schedule = scheduledChecks.find(s => s.scheduleId === scheduleId);
    if (schedule) {
      setSelectedSchedule(schedule);
      setShowDetailsModal(true);
    }
  };

  const handleViewHistory = (scheduleId: string) => {
    const schedule = scheduledChecks.find(s => s.scheduleId === scheduleId);
    if (schedule) {
      setSelectedSchedule(schedule);
      setShowHistoryModal(true);
    }
  };

  const handleDownloadReport = (reportId: string) => {
    toast.info(`Downloading report: ${reportId}`);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    const schedule = scheduledChecks.find(s => s.scheduleId === scheduleId);
    if (schedule && confirm(`Are you sure you want to delete the schedule for ${schedule.subjectName}?`)) {
      setScheduledChecks(prev => prev.filter(s => s.scheduleId !== scheduleId));
      toast.success('Schedule deleted successfully');
    }
  };

  const handleExportSchedule = () => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Scheduled & Recurring Checks Report', 20, 20);
      
      // Add generation date
      doc.setFontSize(12);
      doc.text(`Generated on: ${format(new Date(), 'MMMM d, yyyy HH:mm')}`, 20, 35);
      doc.text(`Total schedules: ${filteredData.length}`, 20, 45);
      
      // Prepare table data
      const tableData = filteredData.map(schedule => [
        schedule.subjectName,
        schedule.subjectId,
        schedule.checkName,
        schedule.frequency,
        schedule.status,
        format(parseISO(schedule.nextRunDate), 'MMM d, yyyy'),
        schedule.lastRunOutcome || 'N/A'
      ]);
      
      // Add table
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc as any).autoTable({
        head: [['Subject', 'ID', 'Check Type', 'Frequency', 'Status', 'Next Run', 'Last Outcome']],
        body: tableData,
        startY: 55,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [66, 139, 202],
          textColor: 255,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });
      
      // Save the PDF
      doc.save(`scheduled-checks-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success('PDF report generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF report');
    }
  };

  const handleCalendarEventClick = (eventApi: EventApi) => {
    const schedule = eventApi.extendedProps.schedule as ScheduledCheckItem;
    handleViewDetails(schedule.scheduleId);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neumorphic-text-primary">
            Scheduled & Recurring Checks
          </h1>
          <NeumorphicText variant="secondary" className="mt-1">
            Manage and monitor automated recurring vetting checks and schedules
          </NeumorphicText>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === 'calendar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('calendar')}
            className="h-8"
          >
            <Calendar className="w-4 h-4 mr-1" />
            Calendar
          </Button>
          <Button
            variant={view === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setView('table')}
            className="h-8"
          >
            <Search className="w-4 h-4 mr-1" />
            Table
          </Button>
          <Button size="sm" onClick={handleExportSchedule} className="h-8">
            <Download className="w-4 h-4 mr-1" />
            Export PDF
          </Button>
          <Button size="sm" onClick={() => setShowCreateModal(true)} className="h-8">
            <Plus className="w-4 h-4 mr-1" />
            New Schedule
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NeumorphicStatsCard
          title="Total Schedules"
          value={stats.totalSchedules}
          icon={<Calendar className="w-4 h-4 text-neumorphic-accent" />}
        />
        <NeumorphicStatsCard
          title="Active"
          value={stats.activeSchedules}
          icon={<Play className="w-4 h-4 text-green-500" />}
        />
        <NeumorphicStatsCard
          title="Overdue"
          value={stats.overdueSchedules}
          icon={<AlertTriangle className="w-4 h-4 text-red-500" />}
        />
        <NeumorphicStatsCard
          title="Upcoming (7 days)"
          value={stats.upcomingSchedules}
          icon={<Clock className="w-4 h-4 text-blue-500" />}
        />
      </div>

      {/* Filters */}
      <NeumorphicCard className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neumorphic-text-secondary" />
              <input
                type="text"
                placeholder="Search by subject, ID, or check name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm
                  bg-neumorphic-card-gradient
                  border border-neumorphic-border/20
                  rounded-neumorphic-md
                  shadow-neumorphic-inset-sm
                  text-neumorphic-text-primary
                  placeholder-neumorphic-text-secondary
                  focus:outline-none focus:ring-2 focus:ring-neumorphic-accent/50
                  transition-all duration-200"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-neumorphic-card border border-neumorphic-border/20 rounded-neumorphic-sm text-neumorphic-text-primary"
            >
              <option value="all">All Status</option>
              {Object.values(ScheduleStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={frequencyFilter}
              onChange={(e) => setFrequencyFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-neumorphic-card border border-neumorphic-border/20 rounded-neumorphic-sm text-neumorphic-text-primary"
            >
              <option value="all">All Frequencies</option>
              {Object.values(ScheduleFrequency).map(freq => (
                <option key={freq} value={freq}>{freq}</option>
              ))}
            </select>

            <select
              value={entityTypeFilter}
              onChange={(e) => setEntityTypeFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-neumorphic-card border border-neumorphic-border/20 rounded-neumorphic-sm text-neumorphic-text-primary"
            >
              <option value="all">All Types</option>
              {Object.values(VettingEntityType).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </NeumorphicCard>

      {/* Content */}
      {view === 'calendar' ? (
        <NeumorphicCard className="p-4">
          <NeumorphicCalendar
            events={calendarEvents}
            onEventClick={handleCalendarEventClick}
            height="600px"
            initialDate={new Date('2025-06-05')}
          />
        </NeumorphicCard>
      ) : (
        <NeumorphicCard className="p-4">
          <div className="space-y-4">
            {/* Table */}
            <NeumorphicTable>
              <NeumorphicTableHeader>
                <NeumorphicTableRow>
                  <NeumorphicTableHead className="text-xs font-semibold">Subject</NeumorphicTableHead>
                  <NeumorphicTableHead className="text-xs font-semibold">Check Type</NeumorphicTableHead>
                  <NeumorphicTableHead className="text-xs font-semibold">Frequency</NeumorphicTableHead>
                  <NeumorphicTableHead className="text-xs font-semibold">Status</NeumorphicTableHead>
                  <NeumorphicTableHead className="text-xs font-semibold">Next Run</NeumorphicTableHead>
                  <NeumorphicTableHead className="text-xs font-semibold">Last Outcome</NeumorphicTableHead>
                  <NeumorphicTableHead className="text-xs font-semibold">Actions</NeumorphicTableHead>
                </NeumorphicTableRow>
              </NeumorphicTableHeader>
              <NeumorphicTableBody>
                {paginatedData.map((schedule) => (
                  <NeumorphicTableRow key={schedule.scheduleId}>
                    <NeumorphicTableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEntityIcon(schedule.entityType)}</span>
                        <div>
                          <div className="text-sm font-medium text-neumorphic-text-primary">
                            {schedule.subjectName}
                          </div>
                          <div className="text-xs text-neumorphic-text-secondary font-mono">
                            {schedule.subjectId}
                          </div>
                        </div>
                      </div>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <div className="text-sm text-neumorphic-text-primary">
                        {schedule.checkName}
                      </div>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <NeumorphicBadge variant="default" className="text-xs">
                        {schedule.frequency}
                      </NeumorphicBadge>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <div className="flex items-center gap-2">
                        <NeumorphicBadge 
                          variant={getStatusBadgeVariant(schedule.status)}
                          className="text-xs"
                        >
                          {schedule.status}
                        </NeumorphicBadge>
                        {isOverdue(schedule.nextRunDate) && schedule.status === ScheduleStatus.ACTIVE && (
                          <AlertTriangle className="w-3 h-3 text-red-500" />
                        )}
                        {isUpcoming(schedule.nextRunDate) && (
                          <Clock className="w-3 h-3 text-blue-500" />
                        )}
                      </div>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <div className="text-sm text-neumorphic-text-primary">
                        {format(parseISO(schedule.nextRunDate), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-neumorphic-text-secondary">
                        {format(parseISO(schedule.nextRunDate), 'HH:mm')}
                      </div>
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      {schedule.lastRunOutcome && (
                        <div className={`text-sm font-medium ${getRiskLevelColor(schedule.lastRunOutcome)}`}>
                          {schedule.lastRunOutcome}
                        </div>
                      )}
                    </NeumorphicTableCell>
                    <NeumorphicTableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetails(schedule.scheduleId)}
                          className="h-7 w-7 p-0"
                          title="View Details"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRunNow(schedule.scheduleId)}
                          className="h-7 w-7 p-0"
                          disabled={schedule.status === ScheduleStatus.IN_PROGRESS}
                          title="Run Now"
                        >
                          <Play className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handlePauseResume(schedule.scheduleId, schedule.status)}
                          className="h-7 w-7 p-0"
                          title={schedule.status === ScheduleStatus.PAUSED ? "Resume" : "Pause"}
                        >
                          {schedule.status === ScheduleStatus.PAUSED ? (
                            <Play className="w-3 h-3" />
                          ) : (
                            <Pause className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewHistory(schedule.scheduleId)}
                          className="h-7 w-7 p-0"
                          title="View History"
                        >
                          <History className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteSchedule(schedule.scheduleId)}
                          className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                          title="Delete Schedule"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </NeumorphicTableCell>
                  </NeumorphicTableRow>
                ))}
              </NeumorphicTableBody>
            </NeumorphicTable>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-2 text-sm text-neumorphic-text-secondary">
                <span>Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-neumorphic-card border border-neumorphic-border/20 rounded text-neumorphic-text-primary"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span>of {filteredData.length} entries</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
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
        </NeumorphicCard>
      )}

      {/* Modals */}
      {/* View Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent variant="neumorphic" className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader variant="neumorphic">
            <DialogTitle variant="neumorphic">Schedule Details</DialogTitle>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-6">
              <NeumorphicCard className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neumorphic-text-secondary">Schedule ID</label>
                    <p className="text-sm text-neumorphic-text-primary font-mono">{selectedSchedule.scheduleId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neumorphic-text-secondary">Status</label>
                    <div className="mt-1">
                      <NeumorphicBadge variant={getStatusBadgeVariant(selectedSchedule.status)}>
                        {selectedSchedule.status}
                      </NeumorphicBadge>
                    </div>
                  </div>
                </div>
              </NeumorphicCard>

              <NeumorphicCard className="p-4">
                <h4 className="text-neumorphic-text-primary font-semibold mb-3">Subject Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neumorphic-text-secondary">Subject</label>
                    <p className="text-sm text-neumorphic-text-primary">{selectedSchedule.subjectName}</p>
                    <p className="text-xs text-neumorphic-text-secondary font-mono">{selectedSchedule.subjectId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neumorphic-text-secondary">Entity Type</label>
                    <p className="text-sm text-neumorphic-text-primary">
                      {getEntityIcon(selectedSchedule.entityType)} {selectedSchedule.entityType}
                    </p>
                  </div>
                </div>
              </NeumorphicCard>

              <NeumorphicCard className="p-4">
                <h4 className="text-neumorphic-text-primary font-semibold mb-3">Check Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neumorphic-text-secondary">Check Type</label>
                    <p className="text-sm text-neumorphic-text-primary">{selectedSchedule.checkName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neumorphic-text-secondary">Frequency</label>
                    <p className="text-sm text-neumorphic-text-primary">{selectedSchedule.frequency}</p>
                  </div>
                </div>
              </NeumorphicCard>

              <NeumorphicCard className="p-4">
                <h4 className="text-neumorphic-text-primary font-semibold mb-3">Schedule Timing</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-neumorphic-text-secondary">Start Date</label>
                    <p className="text-sm text-neumorphic-text-primary">
                      {format(parseISO(selectedSchedule.startDate), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neumorphic-text-secondary">Next Run</label>
                    <p className="text-sm text-neumorphic-text-primary">
                      {format(parseISO(selectedSchedule.nextRunDate), 'MMMM d, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              </NeumorphicCard>

              {selectedSchedule.lastRunDate && (
                <NeumorphicCard className="p-4">
                  <h4 className="text-neumorphic-text-primary font-semibold mb-3">Last Run Results</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-neumorphic-text-secondary">Last Run</label>
                      <p className="text-sm text-neumorphic-text-primary">
                        {format(parseISO(selectedSchedule.lastRunDate), 'MMMM d, yyyy HH:mm')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neumorphic-text-secondary">Last Outcome</label>
                      {selectedSchedule.lastRunOutcome && (
                        <NeumorphicBadge variant={selectedSchedule.lastRunOutcome === 'Low' ? 'success' : selectedSchedule.lastRunOutcome === 'Medium' ? 'warning' : 'danger'}>
                          {selectedSchedule.lastRunOutcome}
                        </NeumorphicBadge>
                      )}
                    </div>
                  </div>
                </NeumorphicCard>
              )}

              {selectedSchedule.notes && (
                <NeumorphicCard className="p-4">
                  <h4 className="text-neumorphic-text-primary font-semibold mb-3">Notes</h4>
                  <p className="text-sm text-neumorphic-text-primary">{selectedSchedule.notes}</p>
                </NeumorphicCard>
              )}

              <NeumorphicCard className="p-4">
                <h4 className="text-neumorphic-text-primary font-semibold mb-3">Run History Summary</h4>
                <p className="text-sm text-neumorphic-text-secondary mb-3">
                  {selectedSchedule.runHistory.length} previous runs
                </p>
                {selectedSchedule.runHistory.length > 0 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowHistoryModal(true);
                    }}
                    className="mt-2"
                  >
                    <History className="w-4 h-4 mr-2" />
                    View Full History
                  </Button>
                )}
              </NeumorphicCard>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View History Modal */}
      <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
        <DialogContent variant="neumorphic" className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader variant="neumorphic">
            <DialogTitle variant="neumorphic">Run History - {selectedSchedule?.subjectName}</DialogTitle>
          </DialogHeader>
          {selectedSchedule && (
            <div className="space-y-4">
              <NeumorphicCard className="p-4">
                <p className="text-sm text-neumorphic-text-secondary">
                  {selectedSchedule.checkName} • {selectedSchedule.runHistory.length} total runs
                </p>
              </NeumorphicCard>
              
              {selectedSchedule.runHistory.length > 0 ? (
                <NeumorphicTable>
                  <NeumorphicTableHeader>
                    <NeumorphicTableRow>
                      <NeumorphicTableHead>Run Date</NeumorphicTableHead>
                      <NeumorphicTableHead>Outcome</NeumorphicTableHead>
                      <NeumorphicTableHead>Report ID</NeumorphicTableHead>
                      <NeumorphicTableHead>Actions</NeumorphicTableHead>
                    </NeumorphicTableRow>
                  </NeumorphicTableHeader>
                  <NeumorphicTableBody>
                    {selectedSchedule.runHistory.map((run, index) => (
                      <NeumorphicTableRow key={index}>
                        <NeumorphicTableCell>
                          {format(parseISO(run.runDate), 'MMMM d, yyyy HH:mm')}
                        </NeumorphicTableCell>
                        <NeumorphicTableCell>
                          <span className={`font-medium ${getRiskLevelColor(run.outcome)}`}>
                            {run.outcome}
                          </span>
                        </NeumorphicTableCell>
                        <NeumorphicTableCell>
                          <span className="font-mono text-sm">{run.reportId}</span>
                        </NeumorphicTableCell>
                        <NeumorphicTableCell>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDownloadReport(run.reportId)}
                            className="h-7 px-2"
                          >
                            <FileText className="w-3 h-3 mr-1" />
                            View Report
                          </Button>
                        </NeumorphicTableCell>
                      </NeumorphicTableRow>
                    ))}
                  </NeumorphicTableBody>
                </NeumorphicTable>
              ) : (
                <div className="text-center py-8 text-neumorphic-text-secondary">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No run history available for this schedule.</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create/Edit Schedule Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent variant="neumorphic" className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader variant="neumorphic">
            <DialogTitle variant="neumorphic">Create New Schedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <NeumorphicCard className="p-6">
              <div className="text-center py-8 text-neumorphic-text-secondary">
                <Plus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-neumorphic-text-primary font-medium mb-2">Schedule creation form would be implemented here.</p>
                <p className="text-sm">This would include subject selection, check type, frequency, and start date configuration.</p>
                <Button
                  onClick={() => setShowCreateModal(false)}
                  className="mt-4"
                  variant="outline"
                >
                  Close
                </Button>
              </div>
            </NeumorphicCard>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 