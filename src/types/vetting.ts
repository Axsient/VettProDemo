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