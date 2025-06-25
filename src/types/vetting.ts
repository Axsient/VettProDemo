// Vetting types and interfaces for VETTPRO Dashboard
// Based on the comprehensive vetting system requirements

export enum VettingEntityType {
  INDIVIDUAL = 'Individual',
  COMPANY = 'Company',
  STAFF_MEDICAL = 'Staff Medical',
}

export enum CheckCategory {
  IDENTITY = 'Identity',
  FINANCIAL = 'Financial',
  CRIMINAL = 'Criminal',
  COMPLIANCE = 'Compliance',
  OPERATIONAL = 'Operational',
  REPUTATIONAL = 'Reputational',
  MEDICAL = 'Medical',
  BUSINESS_SPECIFIC = 'Business Specific',
}

export enum VettingStatus {
  INITIATED = 'Initiated',
  CONSENT_PENDING = 'Consent Pending',
  IN_PROGRESS = 'In Progress',
  PARTIALLY_COMPLETE = 'Partially Complete',
  COMPLETE = 'Complete',
  FAILED = 'Failed',
  CANCELLED = 'Cancelled',
}

export enum ConsentStatus {
  PENDING = 'Pending',
  GRANTED = 'Granted',
  DENIED = 'Denied',
  EXPIRED = 'Expired',
}

export interface VettingCheckDefinition {
  id: string; // e.g., 'id_verification', 'cipc_check', 'chronic_med_history'
  name: string; // User-friendly name, e.g., "SA ID Verification", "CIPC Company Check"
  description: string;
  category: CheckCategory;
  applicableTo: VettingEntityType[]; // Which entity types this check can be run on
  estimatedCostZAR?: number; // For demo, can be indicative
  estimatedTurnaroundDays?: number; // For demo
  consentRequired: boolean; // Does this specific check require explicit consent?
  provider?: string; // e.g., "MIE", "XDS", "Internal", "Specialized Medical Lab"
  isActive: boolean; // Whether this check is currently available
  requiresDocuments?: string[]; // List of required documents
  riskLevel?: 'Low' | 'Medium' | 'High'; // Risk assessment level
}

export interface VettingPackage {
  id: string; // e.g., 'basic_supplier_vet', 'comprehensive_director_check'
  name: string; // e.g., "Basic Supplier Vetting", "Comprehensive Director Check"
  description: string;
  applicableTo: VettingEntityType[];
  checkIds: string[]; // Array of VettingCheckDefinition ids included in this package
  totalEstimatedCostZAR?: number;
  totalEstimatedTurnaroundDays?: number;
  isPopular?: boolean; // For highlighting recommended packages
  discountPercentage?: number; // Package discount compared to individual checks
}

export interface MiningProject {
  id: string;
  name: string;
  location: string; // e.g., "Rustenburg Platinum Mine", "Sishen Iron Ore Mine"
  clientCompany: string; // e.g., "Sibanye Stillwater", "Anglo American"
  status: 'Active' | 'Planned' | 'Completed';
  startDate?: string;
  endDate?: string;
}

// Individual entity details
export interface IndividualDetails {
  firstName: string;
  lastName: string;
  idNumber?: string; // SA ID number
  passportNumber?: string; // For non-SA nationals
  nationality: string;
  mobileNumber: string; // Required for consent
  emailAddress?: string; // Optional for consent
  dateOfBirth?: string;
  placeOfBirth?: string;
}

// Company entity details
export interface CompanyDetails {
  companyName: string;
  registrationNumber: string; // CIPC registration number
  vatNumber?: string; // SARS VAT number
  primaryContactName?: string;
  primaryContactMobile?: string;
  primaryContactEmail?: string;
  businessType?: string;
  industry?: string;
  yearEstablished?: number;
  physicalAddress?: string;
}

// Staff medical specific details
export interface StaffMedicalDetails extends IndividualDetails {
  projectId: string; // Reference to MiningProject
  staffEmployeeId?: string;
  jobRole: string;
  department?: string;
  supervisorName?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
}

// Union type for all entity details
export type VettingEntityDetails = IndividualDetails | CompanyDetails | StaffMedicalDetails;

// Vetting case/request interface
export interface VettingCase {
  id: string;
  caseNumber: string; // Formatted case reference (e.g., "VET-2024-001234")
  entityType: VettingEntityType;
  entityDetails: VettingEntityDetails;
  selectedChecks: string[]; // Array of check IDs
  selectedPackage?: string; // Package ID if using a package
  status: VettingStatus;
  consentStatus: ConsentStatus;
  totalEstimatedCost: number;
  totalEstimatedTurnaround: number;
  initiatedBy: string; // User who initiated the vetting
  initiatedDate: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  notes?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

// Individual check result
export interface CheckResult {
  checkId: string;
  status: 'Pending' | 'In Progress' | 'Complete' | 'Failed' | 'Cancelled';
  result?: 'Pass' | 'Fail' | 'Inconclusive' | 'Requires Review';
  completedDate?: string;
  cost?: number;
  provider?: string;
  documents?: string[]; // Uploaded document references
  notes?: string;
  riskScore?: number; // 0-100 risk assessment
}

// Complete vetting report
export interface VettingReport {
  caseId: string;
  overallStatus: VettingStatus;
  overallRisk: 'Low' | 'Medium' | 'High' | 'Critical';
  overallScore?: number; // Composite score
  checkResults: CheckResult[];
  summary: string;
  recommendations?: string[];
  generatedDate: string;
  generatedBy: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

// Form submission interface
export interface VettingSubmission {
  entityType: VettingEntityType;
  entityDetails: VettingEntityDetails;
  selectionType: 'package' | 'individual';
  selectedPackage?: string;
  selectedChecks?: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  notes?: string;
  preAuthorizationConfirmed: boolean;
}

// Statistics and dashboard data
export interface VettingStats {
  totalCases: number;
  activeCases: number;
  completedCases: number;
  pendingConsent: number;
  averageTurnaroundDays: number;
  totalRevenue: number;
  monthlyGrowth: number;
  topProviders: Array<{
    name: string;
    cases: number;
    successRate: number;
  }>;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
}

// Filter and search interfaces
export interface VettingFilters {
  entityType?: VettingEntityType;
  status?: VettingStatus;
  consentStatus?: ConsentStatus;
  priority?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  provider?: string;
  riskLevel?: string;
}

export interface VettingSearchParams {
  query?: string;
  filters?: VettingFilters;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Notification and consent interfaces
export interface ConsentRequest {
  id: string;
  caseId: string;
  recipientName: string;
  recipientMobile: string;
  recipientEmail?: string;
  checksRequiringConsent: string[];
  sentDate: string;
  expiryDate: string;
  status: ConsentStatus;
  consentGrantedDate?: string;
  consentMethod?: 'SMS' | 'Email' | 'Digital Signature' | 'Physical';
  ipAddress?: string;
  deviceInfo?: string;
}

// Extended interfaces for Active Vetting Cases
export enum IndividualCheckStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  AWAITING_SUBJECT_INFO = 'Awaiting Subject Info',
  SUBMITTED_TO_PROVIDER = 'Submitted to Provider',
  RESULTS_RECEIVED = 'Results Received',
  COMPLETE_CLEAR = 'Complete - Clear',
  COMPLETE_ADVERSE = 'Complete - Adverse Finding',
  COMPLETE_NEUTRAL = 'Complete - Neutral/Info Only',
  CANCELLED = 'Cancelled',
  ERROR = 'Error',
}

export interface ActiveVettingCheck extends CheckResult {
  checkDefinition: VettingCheckDefinition;
  estimatedCompletionDate?: string;
  actualStartDate?: string;
  actualCompletionDate?: string;
  statusUpdatedDate?: string;
  statusUpdatedBy?: string;
  blockerReason?: string;
  providerReference?: string;
  urgentFlag?: boolean;
  internalNotes?: string;
}

export interface ActiveVettingCase extends VettingCase {
  // Progress tracking
  overallProgress: number; // 0-100 percentage
  completedChecks: number;
  totalChecks: number;
  
  // Enhanced status tracking
  lastStatusUpdate: string;
  lastStatusUpdateBy?: string;
  estimatedCompletionDate?: string;
  isOverdue: boolean;
  daysSinceInitiated: number;
  
  // Individual check details
  individualChecks: ActiveVettingCheck[];
  
  // Assignment and responsibility
  assignedVettingOfficer?: string;
  assignedDate?: string;
  
  // Flags and alerts
  flaggedForReview?: boolean;
  flaggedReason?: string;
  hasBlockers?: boolean;
  blockerCount?: number;
  
  // Related entities
  relatedAdminTaskId?: string;
  projectId?: string;
  projectName?: string;
  
  // Audit trail
  auditTrail?: VettingAuditEntry[];
  
  // Additional metadata for table display
  entityName: string; // Computed display name
  entityIdentifier: string; // ID/Registration number for display
}

export interface VettingAuditEntry {
  id: string;
  caseId: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  previousValue?: string;
  newValue?: string;
  checkId?: string;
  notes?: string;
  ipAddress?: string;
}

// Table-specific interfaces
export interface ActiveVettingCaseTableRow {
  id: string;
  caseNumber: string;
  entityName: string;
  entityType: VettingEntityType;
  entityIdentifier: string;
  status: VettingStatus;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  progress: number;
  initiatedDate: string;
  estimatedCompletionDate?: string;
  assignedVettingOfficer?: string;
  isOverdue: boolean;
  flaggedForReview?: boolean;
  completedChecks: number;
  totalChecks: number;
  daysSinceInitiated: number;
  lastStatusUpdate: string;
  consentStatus: ConsentStatus;
  projectName?: string;
}

// Bulk actions for Active Vetting Cases
export interface VettingBulkAction {
  id: string;
  label: string;
  description: string;
  icon?: string;
  requiresConfirmation: boolean;
  confirmationMessage?: string;
  allowedStatuses?: VettingStatus[];
  minimumSelection?: number;
  maximumSelection?: number;
}

// Enhanced filtering for Active Cases
export interface ActiveVettingFilters extends VettingFilters {
  assignedOfficer?: string;
  progressRange?: {
    min: number;
    max: number;
  };
  overdueOnly?: boolean;
  flaggedOnly?: boolean;
  hasBlockers?: boolean;
  checkStatus?: IndividualCheckStatus;
  projectId?: string;
  daysSinceInitiated?: {
    min?: number;
    max?: number;
  };
}

// Case details modal data
export interface VettingCaseDetails extends ActiveVettingCase {
  // Additional data loaded for detailed view
  fullAuditTrail: VettingAuditEntry[];
  relatedDocuments?: VettingDocument[];
  communicationHistory?: VettingCommunication[];
  costBreakdown?: VettingCostBreakdown;
}

export interface VettingDocument {
  id: string;
  caseId: string;
  checkId?: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedDate: string;
  uploadedBy: string;
  category: 'Consent' | 'Supporting Document' | 'Result' | 'Internal Note';
  isRequired: boolean;
  isReceived: boolean;
  expiryDate?: string;
}

export interface VettingCommunication {
  id: string;
  caseId: string;
  type: 'SMS' | 'Email' | 'Phone Call' | 'System Notification';
  direction: 'Outbound' | 'Inbound';
  recipient?: string;
  sender?: string;
  subject?: string;
  content: string;
  timestamp: string;
  status: 'Sent' | 'Delivered' | 'Read' | 'Failed' | 'Bounce';
  relatedCheckId?: string;
}

export interface VettingCostBreakdown {
  caseId: string;
  estimatedTotal: number;
  actualTotal?: number;
  checkCosts: Array<{
    checkId: string;
    checkName: string;
    estimatedCost: number;
    actualCost?: number;
    provider: string;
    invoiceReference?: string;
  }>;
  additionalCosts?: Array<{
    description: string;
    amount: number;
    category: string;
  }>;
  discountsApplied?: Array<{
    description: string;
    amount: number;
    type: 'Percentage' | 'Fixed';
  }>;
}