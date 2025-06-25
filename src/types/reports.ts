// Report types and interfaces for VETTPRO Completed Vetting Reports
// Based on the comprehensive completed vetting reports requirements

import { VettingEntityType } from './vetting';

export enum RiskLevel {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  INFO_ONLY = 'Info Only', // For cases with no scorable risk
}

export enum ReportStatus {
  COMPLETE = 'Complete',
  INCOMPLETE_CONSENT_DECLINED = 'Incomplete - Consent Declined',
  INCOMPLETE_DATA_UNAVAILABLE = 'Incomplete - Data Unavailable',
}

// A simplified result for the final report summary
export interface ReportCheckResult {
  checkName: string;
  status: 'Clear' | 'Adverse Finding' | 'Neutral / Info' | 'Not Performed';
  summary: string; // e.g., "Verified.", "Adverse: 3 defaults noted.", "Director link to PEP found."
}

export interface CompletedVettingReport {
  reportId: string; // Unique ID for the report, e.g., "VR202505-001"
  vettingCaseId: string; // Links back to the original ActiveVettingCase.caseId
  subjectName: string; // Individual or Company Name
  subjectId: string; // SA ID, Company Reg No., etc.
  entityType: VettingEntityType;
  completionDate: string; // ISO Date string
  reportStatus: ReportStatus;
  overallRiskLevel: RiskLevel;
  overallRiskScore: number; // A score from 0-100
  summary: string; // A concise, AI-generated (simulated) summary of the overall findings.
  reportGeneratedBy: string; // e.g., "System (Automated)" or "SuperAdminUser"
  pdfLink: string; // A placeholder link to a sample PDF for the demo
  checkResults: ReportCheckResult[]; // A final summary of each check performed
}

// Filter interface for the completed reports table
export interface CompletedReportsFilters {
  searchQuery?: string;
  riskLevel?: RiskLevel | undefined;
  entityType?: VettingEntityType | undefined;
  reportStatus?: ReportStatus | undefined;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
}

// Table row interface for displaying completed reports
export interface CompletedReportTableRow {
  reportId: string;
  subjectName: string;
  subjectId: string;
  entityType: VettingEntityType;
  overallRiskLevel: RiskLevel;
  overallRiskScore: number;
  reportStatus: ReportStatus;
  completionDate: string;
  reportGeneratedBy: string;
  pdfLink: string;
  vettingCaseId: string;
  checkResultsCount: number;
}

// Risk level colors and variants for badges
export const RISK_LEVEL_VARIANTS = {
  [RiskLevel.CRITICAL]: 'danger' as const,
  [RiskLevel.HIGH]: 'danger' as const,
  [RiskLevel.MEDIUM]: 'warning' as const,
  [RiskLevel.LOW]: 'success' as const,
  [RiskLevel.INFO_ONLY]: 'info' as const,
} as const;

// Status variants for badges
export const REPORT_STATUS_VARIANTS = {
  [ReportStatus.COMPLETE]: 'success' as const,
  [ReportStatus.INCOMPLETE_CONSENT_DECLINED]: 'danger' as const,
  [ReportStatus.INCOMPLETE_DATA_UNAVAILABLE]: 'warning' as const,
} as const;

// Check result status variants
export const CHECK_RESULT_VARIANTS = {
  'Clear': 'success' as const,
  'Adverse Finding': 'danger' as const,
  'Neutral / Info': 'info' as const,
  'Not Performed': 'default' as const,
} as const; 