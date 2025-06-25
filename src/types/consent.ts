import { VettingEntityType } from './vetting';

export enum ConsentRequestStatus {
  PENDING_SENT = 'Pending - Sent',
  LINK_OPENED = 'Link Opened',
  FORM_VIEWED = 'Form Viewed',
  SUBMITTED_AWAITING_VERIFICATION = 'Submitted - Awaiting Signature Verification',
  VERIFIED_APPROVED = 'Verified - Approved',
  VERIFIED_REJECTED_SIGNATURE_MISMATCH = 'Verified - Rejected (Signature Mismatch)',
  VERIFIED_REJECTED_OTHER = 'Verified - Rejected (Other Issue)',
  DECLINED_BY_SUBJECT = 'Declined by Subject',
  EXPIRED = 'Expired',
  MANUALLY_RECORDED_APPROVED = 'Manually Recorded - Approved',
  ERROR_SENDING = 'Error Sending',
}

export enum ConsentChannel {
  SMS_LINK = 'SMS Link',
  EMAIL_LINK = 'Email Link',
  MANUAL_UPLOAD = 'Manual Upload',
}

export interface ConsentRequestItem {
  consentId: string;
  vettingCaseId: string;
  subjectName: string;
  subjectId: string;
  entityType: VettingEntityType;
  projectId?: string;
  projectName?: string;
  checksRequiringConsent: { checkId: string; checkName: string }[];
  status: ConsentRequestStatus;
  channel: ConsentChannel;
  requestSentDate: string;
  linkOpenedDate?: string;
  formViewedDate?: string;
  submittedDate?: string;
  verifiedDate?: string;
  expiryDate?: string;
  recipientMobile?: string;
  recipientEmail?: string;
  digitalSignatureImageLink?: string;
  uploadedConsentFormLink?: string;
  verificationNotes?: string;
  lastUpdated: string;
}

// Table row interface for display
export interface ConsentRequestTableRow extends Record<string, unknown> {
  consentId: string;
  subjectName: string;
  subjectId: string;
  entityType: VettingEntityType;
  checksCount: number;
  checksTooltip: string;
  status: ConsentRequestStatus;
  channel: ConsentChannel;
  requestSentDate: string;
  expiryDate?: string;
  lastUpdated: string;
  isExpired: boolean;
  isNearExpiry: boolean;
  vettingCaseId: string;
  originalData: ConsentRequestItem;
}

// Form interfaces for modals
export interface ConsentVerificationForm {
  outcome: 'approve' | 'reject_signature' | 'reject_other';
  verificationNotes: string;
}

export interface ManualConsentForm {
  vettingCaseId: string;
  subjectName: string;
  subjectId: string;
  entityType: VettingEntityType;
  checksRequiringConsent: string[];
  outcome: 'approved' | 'declined';
  adminNotes: string;
  uploadedFormFile?: File;
}

// Filter interfaces
export interface ConsentFilters {
  status?: ConsentRequestStatus;
  channel?: ConsentChannel;
  entityType?: VettingEntityType;
  searchQuery?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  showExpiredOnly?: boolean;
} 