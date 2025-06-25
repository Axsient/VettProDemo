import { 
  ConsentRequestItem, 
  ConsentRequestStatus, 
  ConsentChannel 
} from '@/types/consent';
import { VettingEntityType } from '@/types/vetting';
import { allVettingChecks } from './vettingChecksSample';

// Helper function to get check info by ID
const getCheckInfo = (id: string) => ({
  checkId: id,
  checkName: allVettingChecks.find(c => c.id === id)?.name || 'Unknown Check'
});

export const sampleConsentRequests: ConsentRequestItem[] = [
  {
    consentId: 'CR20250601-001',
    vettingCaseId: 'VC20250601-002',
    subjectName: 'Johnathan Doe',
    subjectId: '850101',
    entityType: VettingEntityType.INDIVIDUAL,
    checksRequiringConsent: [
      getCheckInfo('id_verify_sa'),
      getCheckInfo('criminal_record_afis')
    ],
    status: ConsentRequestStatus.PENDING_SENT,
    channel: ConsentChannel.SMS_LINK,
    requestSentDate: '2025-06-01T09:05:00Z',
    recipientMobile: '+27820000001',
    expiryDate: '2025-06-08T09:05:00Z',
    lastUpdated: '2025-06-01T09:05:00Z',
  },
  {
    consentId: 'CR20250602-001',
    vettingCaseId: 'VC20250602-001',
    subjectName: 'Sarah Connor',
    subjectId: '900303',
    entityType: VettingEntityType.STAFF_MEDICAL,
    projectId: 'proj_SB001',
    projectName: 'Marikana K4 Expansion',
    checksRequiringConsent: [
      getCheckInfo('med_fitness_cert'),
      getCheckInfo('chronic_med_history'),
      getCheckInfo('drug_alcohol_screen')
    ],
    status: ConsentRequestStatus.VERIFIED_APPROVED,
    channel: ConsentChannel.EMAIL_LINK,
    requestSentDate: '2025-05-20T11:05:00Z',
    linkOpenedDate: '2025-05-20T14:00:00Z',
    formViewedDate: '2025-05-20T14:02:00Z',
    submittedDate: '2025-05-20T14:05:00Z',
    verifiedDate: '2025-05-20T16:00:00Z',
    recipientEmail: 'sarah.connor@example.com',
    digitalSignatureImageLink: '/sample-data/signatures/sig_sarah_connor.png',
    lastUpdated: '2025-05-20T16:00:00Z',
  },
  {
    consentId: 'CR20250528-001',
    vettingCaseId: 'VC20250601-001',
    subjectName: 'Alice Smith (Director at QuantumLeap)',
    subjectId: '750101',
    entityType: VettingEntityType.INDIVIDUAL,
    checksRequiringConsent: [
      getCheckInfo('credit_check_ind'),
      getCheckInfo('pep_sanctions_ind')
    ],
    status: ConsentRequestStatus.SUBMITTED_AWAITING_VERIFICATION,
    channel: ConsentChannel.SMS_LINK,
    requestSentDate: '2025-05-28T10:00:00Z',
    linkOpenedDate: '2025-05-29T11:00:00Z',
    formViewedDate: '2025-05-29T11:01:00Z',
    submittedDate: '2025-05-29T11:05:00Z',
    recipientMobile: '+27830000002',
    digitalSignatureImageLink: '/sample-data/signatures/sig_alice_smith_blurry.png',
    lastUpdated: '2025-05-29T11:05:00Z',
  },
  {
    consentId: 'CR20250603-001',
    vettingCaseId: 'VC_MANUAL_001',
    subjectName: 'Manual Upload Example Co.',
    subjectId: '990213',
    entityType: VettingEntityType.COMPANY,
    checksRequiringConsent: [getCheckInfo('bank_acc_verify_biz')],
    status: ConsentRequestStatus.MANUALLY_RECORDED_APPROVED,
    channel: ConsentChannel.MANUAL_UPLOAD,
    requestSentDate: '2025-06-03T10:00:00Z',
    verifiedDate: '2025-06-03T10:05:00Z',
    uploadedConsentFormLink: '/sample-data/consents/manual_consent_001.pdf',
    verificationNotes: 'Physical consent form received and verified by AdminUser on 2025-06-03.',
    lastUpdated: '2025-06-03T10:05:00Z',
  },
  {
    consentId: 'CR20250520-001',
    vettingCaseId: 'VC_EXPIRED_001',
    subjectName: 'Expired Link User',
    subjectId: '920202',
    entityType: VettingEntityType.INDIVIDUAL,
    checksRequiringConsent: [getCheckInfo('id_verify_sa')],
    status: ConsentRequestStatus.EXPIRED,
    channel: ConsentChannel.SMS_LINK,
    requestSentDate: '2025-05-20T10:00:00Z',
    recipientMobile: '+27840000003',
    expiryDate: '2025-05-27T10:00:00Z',
    lastUpdated: '2025-05-27T10:01:00Z',
  },
  {
    consentId: 'CR20250525-001',
    vettingCaseId: 'VC20250525-001',
    subjectName: 'Michael Brown',
    subjectId: '880315',
    entityType: VettingEntityType.INDIVIDUAL,
    checksRequiringConsent: [
      getCheckInfo('criminal_record_afis'),
      getCheckInfo('employment_verify')
    ],
    status: ConsentRequestStatus.DECLINED_BY_SUBJECT,
    channel: ConsentChannel.EMAIL_LINK,
    requestSentDate: '2025-05-25T08:30:00Z',
    linkOpenedDate: '2025-05-25T14:15:00Z',
    formViewedDate: '2025-05-25T14:17:00Z',
    recipientEmail: 'michael.brown@example.com',
    expiryDate: '2025-06-01T08:30:00Z',
    lastUpdated: '2025-05-25T14:20:00Z',
  },
  {
    consentId: 'CR20250530-001',
    vettingCaseId: 'VC20250530-001',
    subjectName: 'TechCorp Pty Ltd',
    subjectId: '201012/07',
    entityType: VettingEntityType.COMPANY,
    checksRequiringConsent: [
      getCheckInfo('business_credit_report'),
      getCheckInfo('pep_sanctions_company')
    ],
    status: ConsentRequestStatus.LINK_OPENED,
    channel: ConsentChannel.EMAIL_LINK,
    requestSentDate: '2025-05-30T13:00:00Z',
    linkOpenedDate: '2025-05-30T16:45:00Z',
    recipientEmail: 'admin@techcorp.co.za',
    expiryDate: '2025-06-06T13:00:00Z',
    lastUpdated: '2025-05-30T16:45:00Z',
  },
  {
    consentId: 'CR20250529-001',
    vettingCaseId: 'VC20250529-001',
    subjectName: 'Lisa Williams',
    subjectId: '910512',
    entityType: VettingEntityType.STAFF_MEDICAL,
    projectId: 'proj_KM002',
    projectName: 'Kimberley Diamond Mine Expansion',
    checksRequiringConsent: [
      getCheckInfo('med_fitness_cert'),
      getCheckInfo('drug_alcohol_screen')
    ],
    status: ConsentRequestStatus.FORM_VIEWED,
    channel: ConsentChannel.SMS_LINK,
    requestSentDate: '2025-05-29T07:15:00Z',
    linkOpenedDate: '2025-05-29T12:30:00Z',
    formViewedDate: '2025-05-29T12:32:00Z',
    recipientMobile: '+27710000004',
    expiryDate: '2025-06-05T07:15:00Z',
    lastUpdated: '2025-05-29T12:32:00Z',
  },
  {
    consentId: 'CR20250526-001',
    vettingCaseId: 'VC20250526-001',
    subjectName: 'Robert Davis',
    subjectId: '780823',
    entityType: VettingEntityType.INDIVIDUAL,
    checksRequiringConsent: [
      getCheckInfo('credit_check_ind'),
      getCheckInfo('criminal_record_enhanced')
    ],
    status: ConsentRequestStatus.VERIFIED_REJECTED_SIGNATURE_MISMATCH,
    channel: ConsentChannel.EMAIL_LINK,
    requestSentDate: '2025-05-26T14:20:00Z',
    linkOpenedDate: '2025-05-26T18:00:00Z',
    formViewedDate: '2025-05-26T18:02:00Z',
    submittedDate: '2025-05-26T18:10:00Z',
    verifiedDate: '2025-05-27T09:30:00Z',
    recipientEmail: 'robert.davis@example.com',
    digitalSignatureImageLink: '/sample-data/signatures/sig_robert_davis_invalid.png',
    verificationNotes: 'Signature does not match reference. Subject contacted for re-submission.',
    lastUpdated: '2025-05-27T09:30:00Z',
  },
  {
    consentId: 'CR20250531-001',
    vettingCaseId: 'VC20250531-001',
    subjectName: 'Innovation Labs Ltd',
    subjectId: '201598',
    entityType: VettingEntityType.COMPANY,
    checksRequiringConsent: [
      getCheckInfo('bank_acc_verify_biz'),
      getCheckInfo('vat_verify_sars')
    ],
    status: ConsentRequestStatus.ERROR_SENDING,
    channel: ConsentChannel.SMS_LINK,
    requestSentDate: '2025-05-31T11:45:00Z',
    recipientMobile: '+27825555555', // Invalid number for demo
    expiryDate: '2025-06-07T11:45:00Z',
    lastUpdated: '2025-05-31T11:46:00Z',
  },
  {
    consentId: 'CR20250527-001',
    vettingCaseId: 'VC20250527-001',
    subjectName: 'Jennifer Taylor',
    subjectId: '890427',
    entityType: VettingEntityType.INDIVIDUAL,
    checksRequiringConsent: [
      getCheckInfo('education_verify'),
      getCheckInfo('employment_verify')
    ],
    status: ConsentRequestStatus.VERIFIED_REJECTED_OTHER,
    channel: ConsentChannel.EMAIL_LINK,
    requestSentDate: '2025-05-27T09:30:00Z',
    linkOpenedDate: '2025-05-27T15:20:00Z',
    formViewedDate: '2025-05-27T15:22:00Z',
    submittedDate: '2025-05-27T15:30:00Z',
    verifiedDate: '2025-05-28T10:15:00Z',
    recipientEmail: 'jennifer.taylor@example.com',
    digitalSignatureImageLink: '/sample-data/signatures/sig_jennifer_taylor.png',
    verificationNotes: 'Form was submitted with incorrect ID number. Subject needs to resubmit.',
    lastUpdated: '2025-05-28T10:15:00Z',
  },
  {
    consentId: 'CR20250604-001',
    vettingCaseId: 'VC20250604-001',
    subjectName: 'David Wilson',
    subjectId: '771212',
    entityType: VettingEntityType.STAFF_MEDICAL,
    projectId: 'proj_PT003',
    projectName: 'Platinum Valley Medical Checks',
    checksRequiringConsent: [
      getCheckInfo('med_fitness_cert'),
      getCheckInfo('chronic_med_history')
    ],
    status: ConsentRequestStatus.PENDING_SENT,
    channel: ConsentChannel.SMS_LINK,
    requestSentDate: '2025-06-04T08:00:00Z',
    recipientMobile: '+27760000005',
    expiryDate: '2025-06-11T08:00:00Z',
    lastUpdated: '2025-06-04T08:00:00Z',
  }
];

// Helper function to simulate data fetching
export async function getConsentRequests(): Promise<ConsentRequestItem[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 350));
  return sampleConsentRequests;
}

// Helper function to get consent request by ID
export function getConsentRequestById(consentId: string): ConsentRequestItem | undefined {
  return sampleConsentRequests.find(request => request.consentId === consentId);
}

// Helper function to filter consent requests
export function filterConsentRequests(
  requests: ConsentRequestItem[],
  filters: {
    status?: ConsentRequestStatus;
    channel?: ConsentChannel;
    entityType?: VettingEntityType;
    searchQuery?: string;
    showExpiredOnly?: boolean;
  }
): ConsentRequestItem[] {
  return requests.filter(request => {
    // Status filter
    if (filters.status && request.status !== filters.status) {
      return false;
    }

    // Channel filter
    if (filters.channel && request.channel !== filters.channel) {
      return false;
    }

    // Entity type filter
    if (filters.entityType && request.entityType !== filters.entityType) {
      return false;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        request.consentId,
        request.vettingCaseId,
        request.subjectName,
        request.subjectId
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Expired only filter
    if (filters.showExpiredOnly) {
      const now = new Date();
      const expiryDate = request.expiryDate ? new Date(request.expiryDate) : null;
      if (!expiryDate || expiryDate > now) {
        return false;
      }
    }

    return true;
  });
} 