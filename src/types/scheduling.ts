// Scheduling types and interfaces for VETTPRO Scheduled & Recurring Checks
// Based on the comprehensive scheduled checks requirements

import { VettingEntityType } from './vetting';
import { RiskLevel } from './reports';

export enum ScheduleFrequency {
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  BI_ANNUALLY = 'Bi-Annually',
  ANNUALLY = 'Annually',
}

export enum ScheduleStatus {
  ACTIVE = 'Active',
  PAUSED = 'Paused',
  OVERDUE = 'Overdue',
  IN_PROGRESS = 'In Progress', // A check is currently running
  COMPLETED = 'Completed', // A one-time schedule that has run
}

export interface ScheduledCheckRunHistory {
  runDate: string; // ISO Date string
  outcome: RiskLevel;
  reportId: string; // Link to the generated CompletedVettingReport
}

export interface ScheduledCheckItem {
  scheduleId: string; // e.g., "SCH-001"
  subjectName: string; // Individual or Company Name
  subjectId: string; // SA ID, Company Reg No., etc.
  entityType: VettingEntityType;
  checkDefinitionId: string; // e.g., 'cipc_company_check'
  checkName: string; // Denormalized for display
  frequency: ScheduleFrequency;
  status: ScheduleStatus;
  startDate: string; // When the schedule was created/started
  lastRunDate?: string; // ISO Date string
  lastRunOutcome?: RiskLevel;
  nextRunDate: string; // ISO Date string
  notes?: string;
  runHistory: ScheduledCheckRunHistory[];
}

// Filter interface for the scheduled checks table
export interface ScheduledChecksFilters {
  searchQuery?: string;
  status?: ScheduleStatus | undefined;
  frequency?: ScheduleFrequency | undefined;
  entityType?: VettingEntityType | undefined;
  overdueOnly?: boolean;
  upcomingDays?: number; // Show items due in next X days
}

// Table row interface for displaying scheduled checks
export interface ScheduledCheckTableRow {
  scheduleId: string;
  subjectName: string;
  subjectId: string;
  entityType: VettingEntityType;
  checkName: string;
  frequency: ScheduleFrequency;
  status: ScheduleStatus;
  lastRunDate?: string;
  lastRunOutcome?: RiskLevel;
  nextRunDate: string;
  notes?: string;
  runHistoryCount: number;
  isOverdue: boolean;
  isUpcoming: boolean; // Due within next 7 days
}

// Calendar event interface for FullCalendar
export interface ScheduleCalendarEvent {
  id: string; // scheduleId
  title: string; // subjectName + checkName
  start: string; // nextRunDate
  backgroundColor: string; // Based on status
  borderColor: string;
  textColor: string;
  extendedProps: {
    scheduleItem: ScheduledCheckItem;
  };
}

// Status variants for badges
export const SCHEDULE_STATUS_VARIANTS = {
  [ScheduleStatus.ACTIVE]: 'success' as const,
  [ScheduleStatus.PAUSED]: 'secondary' as const,
  [ScheduleStatus.OVERDUE]: 'danger' as const,
  [ScheduleStatus.IN_PROGRESS]: 'info' as const,
  [ScheduleStatus.COMPLETED]: 'default' as const,
} as const;

// Frequency variants for badges
export const FREQUENCY_VARIANTS = {
  [ScheduleFrequency.MONTHLY]: 'info' as const,
  [ScheduleFrequency.QUARTERLY]: 'warning' as const,
  [ScheduleFrequency.BI_ANNUALLY]: 'secondary' as const,
  [ScheduleFrequency.ANNUALLY]: 'default' as const,
} as const;

// Calendar event colors based on status
export const CALENDAR_STATUS_COLORS = {
  [ScheduleStatus.ACTIVE]: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
    textColor: '#ffffff',
  },
  [ScheduleStatus.PAUSED]: {
    backgroundColor: '#6b7280',
    borderColor: '#4b5563',
    textColor: '#ffffff',
  },
  [ScheduleStatus.OVERDUE]: {
    backgroundColor: '#ef4444',
    borderColor: '#dc2626',
    textColor: '#ffffff',
  },
  [ScheduleStatus.IN_PROGRESS]: {
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
    textColor: '#ffffff',
  },
  [ScheduleStatus.COMPLETED]: {
    backgroundColor: '#8b5cf6',
    borderColor: '#7c3aed',
    textColor: '#ffffff',
  },
} as const;

// Form interfaces for create/edit modals
export interface CreateScheduleFormData {
  subjectName: string;
  subjectId: string;
  entityType: VettingEntityType;
  checkDefinitionId: string;
  frequency: ScheduleFrequency;
  startDate: string;
  notes?: string;
}

export interface EditScheduleFormData extends CreateScheduleFormData {
  scheduleId: string;
  status: ScheduleStatus;
}

// Statistics for dashboard
export interface ScheduledChecksStats {
  totalSchedules: number;
  activeSchedules: number;
  overdueSchedules: number;
  upcomingSchedules: number; // Due in next 7 days
  pausedSchedules: number;
  inProgressSchedules: number;
  frequencyDistribution: {
    [key in ScheduleFrequency]: number;
  };
  entityTypeDistribution: {
    [key in VettingEntityType]: number;
  };
} 