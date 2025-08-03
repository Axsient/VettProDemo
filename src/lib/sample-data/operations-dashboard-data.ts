import { 
  ActiveVettingCase, 
  VettingStatus, 
  VettingEntityType, 
  CheckCategory,
  IndividualCheckStatus,
  ActiveVettingCheck,
  VettingCheckDefinition
} from '@/types/vetting';

// Helper function to calculate days since a date
export const daysSince = (date: string): number => {
  const diffTime = Date.now() - new Date(date).getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

// Helper function to format ZAR currency
export const formatZAR = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0
  }).format(amount);
};

// Type definitions for missing types
export type OpsCase = ActiveVettingCase;
export { VettingEntityType };

export interface CaseDetails {
  id: string;
  caseNumber: string;
  entityName: string;
  entityType: VettingEntityType;
  status: VettingStatus;
  priority: string;
  assignedOfficer: string;
  createdDate: string;
  lastUpdated: string;
  progress: number;
  estimatedCompletion: string;
  notes: string[];
  riskScore: number;
  complianceStatus: string;
  totalCost: number;
}

export interface CaseTimelineEvent {
  id: string;
  timestamp: string;
  type: 'created' | 'assigned' | 'check_started' | 'check_completed' | 'consent_received' | 'flagged' | 'approved' | 'completed';
  title: string;
  description: string;
  user: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface EntityDetails {
  id: string;
  name: string;
  type: VettingEntityType;
  identifier: string;
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
  };
  riskProfile: {
    overall: number;
    financial: number;
    compliance: number;
    reputation: number;
  };
  complianceRecords: Array<{
    type: string;
    status: string;
    lastChecked: string;
    validUntil?: string;
  }>;
  relationshipHistory: Array<{
    projectName: string;
    period: string;
    value: number;
    status: string;
  }>;
  entityDetails: Record<string, string | number | boolean>;
}

export interface CaseDossier {
  caseId: string;
  caseReference: string;
  entityName: string;
  priorityLevel: string;
  initiatedDate: string;
  assignedOfficer: string;
  reportGenerated: string;
  daysActive: number;
  totalCost: number;
  overallProgress: number;
  riskAssessment: string;
  checksCompleted: number;
  currentStatus: string;
  overdueStatus: string;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    size: number;
    status: 'pending' | 'verified' | 'rejected';
    category: string;
  }>;
  consentRecords: Array<{
    type: string;
    status: string;
    obtainedDate?: string;
    method: string;
  }>;
  checkResults: Array<{
    checkType: string;
    result: string;
    completedDate: string;
    provider: string;
    cost: number;
    status: string;
  }>;
}

// Check definitions for Operations Dashboard
const checkDefinitions: VettingCheckDefinition[] = [
  {
    id: 'id_verification',
    name: 'SA ID Verification',
    description: 'Verify South African ID number authenticity',
    category: CheckCategory.IDENTITY,
    applicableTo: [VettingEntityType.INDIVIDUAL],
    estimatedCostZAR: 150,
    estimatedTurnaroundDays: 1,
    consentRequired: true,
    provider: 'MIE',
    isActive: true
  },
  {
    id: 'criminal_check',
    name: 'Criminal Record Check',
    description: 'Comprehensive criminal background verification',
    category: CheckCategory.CRIMINAL,
    applicableTo: [VettingEntityType.INDIVIDUAL],
    estimatedCostZAR: 300,
    estimatedTurnaroundDays: 3,
    consentRequired: true,
    provider: 'MIE',
    isActive: true
  },
  {
    id: 'credit_check',
    name: 'Credit Bureau Check',
    description: 'Financial credit history and status',
    category: CheckCategory.FINANCIAL,
    applicableTo: [VettingEntityType.INDIVIDUAL],
    estimatedCostZAR: 250,
    estimatedTurnaroundDays: 2,
    consentRequired: true,
    provider: 'Credit Bureau',
    isActive: true
  },
  {
    id: 'cipc_check',
    name: 'CIPC Company Check',
    description: 'Company registration and compliance verification',
    category: CheckCategory.COMPLIANCE,
    applicableTo: [VettingEntityType.COMPANY],
    estimatedCostZAR: 200,
    estimatedTurnaroundDays: 2,
    consentRequired: false,
    provider: 'MIE',
    isActive: true
  },
  {
    id: 'sars_check',
    name: 'SARS Tax Compliance',
    description: 'Tax compliance status verification',
    category: CheckCategory.COMPLIANCE,
    applicableTo: [VettingEntityType.COMPANY, VettingEntityType.INDIVIDUAL],
    estimatedCostZAR: 180,
    estimatedTurnaroundDays: 2,
    consentRequired: false,
    provider: 'Multi-Provider',
    isActive: true
  }
];

// Generate realistic individual checks for a case
const generateIndividualChecks = (
  entityType: VettingEntityType, 
  status: VettingStatus,
  overallProgress: number,
  caseId: string
): ActiveVettingCheck[] => {
  const relevantChecks = checkDefinitions.filter(def => 
    def.applicableTo.includes(entityType)
  );
  
  const totalChecks = entityType === VettingEntityType.COMPANY ? 3 : 5;
  const completedChecks = Math.floor((overallProgress / 100) * totalChecks);
  
  return relevantChecks.slice(0, totalChecks).map((checkDef, index) => {
    let checkStatus: IndividualCheckStatus;
    
    if (index < completedChecks) {
      checkStatus = Math.random() > 0.15 ? 
        IndividualCheckStatus.COMPLETE_CLEAR : 
        IndividualCheckStatus.COMPLETE_ADVERSE;
    } else if (index === completedChecks && status === VettingStatus.IN_PROGRESS) {
      checkStatus = IndividualCheckStatus.IN_PROGRESS;
    } else if (status === VettingStatus.CONSENT_PENDING) {
      checkStatus = IndividualCheckStatus.PENDING;
    } else {
      checkStatus = IndividualCheckStatus.PENDING;
    }
    
    return {
      checkId: `${caseId}_check_${index + 1}`,
      checkDefinitionId: checkDef.id,
      status: checkStatus,
      result: checkStatus.includes('CLEAR') ? 'Clear' : 
              checkStatus.includes('ADVERSE') ? 'Adverse Finding' : 'Pending',
      completedDate: checkStatus.includes('COMPLETE') ? 
        new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : 
        undefined,
      provider: checkDef.provider,
      estimatedCost: checkDef.estimatedCostZAR || 0,
      cost: checkDef.estimatedCostZAR || 0,
      checkDefinition: checkDef,
      actualStartDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
    };
  });
};

// Enhanced Operations Dashboard Data
export const operationsVettingCases: ActiveVettingCase[] = [
  {
    id: 'ops_case_001',
    caseNumber: 'VET-2024-001234',
    entityType: VettingEntityType.INDIVIDUAL,
    entityName: 'Thabo Mthembu',
    entityIdentifier: '8503025432087',
    status: VettingStatus.IN_PROGRESS,
    priority: 'High',
    overallProgress: 75,
    completedChecks: 3,
    totalChecks: 5,
    lastStatusUpdate: '2025-01-20T14:30:00Z',
    estimatedCompletionDate: '2025-01-22T17:00:00Z',
    isOverdue: false,
    daysSinceInitiated: daysSince('2025-01-15'),
    individualChecks: [],
    assignedVettingOfficer: 'Mike Stevens',
    assignedDate: '2025-01-15T09:00:00Z',
    flaggedForReview: false,
    hasBlockers: false,
    blockerCount: 0,
    projectName: 'Rustenburg Mine Expansion',
    initiatedDate: '2025-01-15T09:00:00Z',
    initiatedBy: 'Sarah Jones',
    totalEstimatedCost: 1050,
    entityDetails: {
      firstName: 'Thabo',
      lastName: 'Mthembu',
      idNumber: '8503025432087',
      nationality: 'South African',
      mobileNumber: '+27823456789'
    }
  },
  {
    id: 'ops_case_002',
    caseNumber: 'VET-2024-001235',
    entityType: VettingEntityType.COMPANY,
    entityName: 'Johannesburg Mining Supplies (Pty) Ltd',
    entityIdentifier: '2019/123456/07',
    status: VettingStatus.IN_PROGRESS,
    priority: 'Medium',
    overallProgress: 60,
    completedChecks: 2,
    totalChecks: 3,
    lastStatusUpdate: '2025-01-19T11:45:00Z',
    estimatedCompletionDate: '2025-01-25T17:00:00Z',
    isOverdue: false,
    daysSinceInitiated: daysSince('2025-01-05'),
    individualChecks: [],
    assignedVettingOfficer: 'Lisa Chen',
    assignedDate: '2025-01-05T10:30:00Z',
    flaggedForReview: true,
    flaggedReason: 'Partially Complete & Flagged - Adverse tax finding requires review',
    hasBlockers: false,
    blockerCount: 0,
    projectName: 'Sishen Iron Ore Project',
    initiatedDate: '2025-01-05T10:30:00Z',
    initiatedBy: 'David Wilson',
    totalEstimatedCost: 1420,
    entityDetails: {
      companyName: 'Johannesburg Mining Supplies (Pty) Ltd',
      registrationNumber: '2019/123456/07',
      vatNumber: 'VAT123456789',
      primaryContactName: 'John Peters',
      primaryContactMobile: '+27811234567',
      businessType: 'Mining Supplies',
      industry: 'Mining'
    }
  },
  {
    id: 'ops_case_003',
    caseNumber: 'VET-2024-001236',
    entityType: VettingEntityType.INDIVIDUAL,
    entityName: 'Sipho Ndlovu',
    entityIdentifier: '8201156789012',
    status: VettingStatus.IN_PROGRESS,
    priority: 'Urgent',
    overallProgress: 50,
    completedChecks: 2,
    totalChecks: 4,
    lastStatusUpdate: '2025-01-20T16:20:00Z',
    estimatedCompletionDate: '2025-01-22T17:00:00Z',
    isOverdue: true,
    daysSinceInitiated: daysSince('2025-01-18'),
    individualChecks: [],
    assignedVettingOfficer: 'Fatima Patel',
    assignedDate: '2025-01-18T08:00:00Z',
    flaggedForReview: false,
    hasBlockers: true,
    blockerCount: 1,
    projectName: 'Northern Cape Solar Farm',
    initiatedDate: '2025-01-18T08:00:00Z',
    initiatedBy: 'Mike Stevens',
    totalEstimatedCost: 1150,
    entityDetails: {
      firstName: 'Sipho',
      lastName: 'Ndlovu',
      idNumber: '8201156789012',
      nationality: 'South African',
      mobileNumber: '+27834567890'
    }
  },
  {
    id: 'ops_case_004',
    caseNumber: 'VET-2024-001237',
    entityType: VettingEntityType.COMPANY,
    entityName: 'Mandla Khumalo Engineering CC',
    entityIdentifier: '2020/234567/23',
    status: VettingStatus.CONSENT_PENDING,
    priority: 'Medium',
    overallProgress: 0,
    completedChecks: 0,
    totalChecks: 3,
    lastStatusUpdate: '2025-01-18T13:15:00Z',
    estimatedCompletionDate: '2025-01-27T17:00:00Z',
    isOverdue: false,
    daysSinceInitiated: daysSince('2025-01-18'),
    individualChecks: [],
    assignedVettingOfficer: 'Janet Williams',
    assignedDate: '2025-01-18T13:15:00Z',
    flaggedForReview: false,
    hasBlockers: false,
    blockerCount: 0,
    projectName: 'Durban Port Expansion',
    initiatedDate: '2025-01-18T13:15:00Z',
    initiatedBy: 'Lisa Chen',
    totalEstimatedCost: 900,
    entityDetails: {
      companyName: 'Mandla Khumalo Engineering CC',
      registrationNumber: '2020/234567/23',
      primaryContactName: 'Mandla Khumalo',
      primaryContactMobile: '+27845678901',
      businessType: 'Engineering Services',
      industry: 'Construction'
    }
  },
  {
    id: 'ops_case_005',
    caseNumber: 'VET-2024-001238',
    entityType: VettingEntityType.COMPANY,
    entityName: 'Durban Logistics Solutions CC',
    entityIdentifier: '2020/567890/23',
    status: VettingStatus.COMPLETE,
    priority: 'Low',
    overallProgress: 100,
    completedChecks: 3,
    totalChecks: 3,
    lastStatusUpdate: '2025-01-19T14:45:00Z',
    estimatedCompletionDate: '2025-01-19T17:00:00Z',
    isOverdue: false,
    daysSinceInitiated: daysSince('2025-01-10'),
    individualChecks: [],
    assignedVettingOfficer: 'Robert Brown',
    assignedDate: '2025-01-10T09:30:00Z',
    flaggedForReview: false,
    hasBlockers: false,
    blockerCount: 0,
    projectName: 'Cape Town Infrastructure',
    initiatedDate: '2025-01-10T09:30:00Z',
    initiatedBy: 'Sarah Jones',
    totalEstimatedCost: 620,
    entityDetails: {
      companyName: 'Durban Logistics Solutions CC',
      registrationNumber: '2020/567890/23',
      vatNumber: 'VAT987654321',
      primaryContactName: 'Peter Smith',
      primaryContactMobile: '+27856789012',
      businessType: 'Logistics',
      industry: 'Transportation'
    }
  },
  {
    id: 'ops_case_006',
    caseNumber: 'VET-2024-001239',
    entityType: VettingEntityType.INDIVIDUAL,
    entityName: 'Zanele Mbeki',
    entityIdentifier: '9003074567001',
    status: VettingStatus.IN_PROGRESS,
    priority: 'High',
    overallProgress: 80,
    completedChecks: 4,
    totalChecks: 5,
    lastStatusUpdate: '2025-01-20T09:30:00Z',
    estimatedCompletionDate: '2025-01-21T17:00:00Z',
    isOverdue: false,
    daysSinceInitiated: daysSince('2025-01-12'),
    individualChecks: [],
    assignedVettingOfficer: 'Emma Thompson',
    assignedDate: '2025-01-12T14:00:00Z',
    flaggedForReview: true,
    flaggedReason: 'Credit check returned adverse finding - requires management review',
    hasBlockers: false,
    blockerCount: 0,
    projectName: 'Gold Mine Security Upgrade',
    initiatedDate: '2025-01-12T14:00:00Z',
    initiatedBy: 'David Wilson',
    totalEstimatedCost: 850,
    entityDetails: {
      firstName: 'Zanele',
      lastName: 'Mbeki',
      idNumber: '9003074567001',
      nationality: 'South African',
      mobileNumber: '+27867890123'
    }
  },
  {
    id: 'ops_case_007',
    caseNumber: 'VET-2024-001240',
    entityType: VettingEntityType.COMPANY,
    entityName: 'Rustenburg Heavy Equipment (Pty) Ltd',
    entityIdentifier: '2018/901234/07',
    status: VettingStatus.IN_PROGRESS,
    priority: 'Medium',
    overallProgress: 40,
    completedChecks: 1,
    totalChecks: 3,
    lastStatusUpdate: '2025-01-20T11:15:00Z',
    estimatedCompletionDate: '2025-01-24T17:00:00Z',
    isOverdue: false,
    daysSinceInitiated: daysSince('2025-01-19'),
    individualChecks: [],
    assignedVettingOfficer: 'Mark Johnson',
    assignedDate: '2025-01-19T10:00:00Z',
    flaggedForReview: false,
    hasBlockers: false,
    blockerCount: 0,
    projectName: 'Platinum Mine Expansion',
    initiatedDate: '2025-01-19T10:00:00Z',
    initiatedBy: 'Fatima Patel',
    totalEstimatedCost: 1580,
    entityDetails: {
      companyName: 'Rustenburg Heavy Equipment (Pty) Ltd',
      registrationNumber: '2018/901234/07',
      vatNumber: 'VAT456789123',
      primaryContactName: 'James Wilson',
      primaryContactMobile: '+27878901234',
      businessType: 'Heavy Equipment',
      industry: 'Mining Equipment'
    }
  },
  {
    id: 'ops_case_008',
    caseNumber: 'VET-2024-001241',
    entityType: VettingEntityType.INDIVIDUAL,
    entityName: 'Nomsa Dube',
    entityIdentifier: '8912234567890',
    status: VettingStatus.IN_PROGRESS,
    priority: 'High',
    overallProgress: 60,
    completedChecks: 3,
    totalChecks: 5,
    lastStatusUpdate: '2025-01-20T15:45:00Z',
    estimatedCompletionDate: '2025-01-23T17:00:00Z',
    isOverdue: false,
    daysSinceInitiated: daysSince('2025-01-17'),
    individualChecks: [],
    assignedVettingOfficer: 'Dr. Ahmed Hassan',
    assignedDate: '2025-01-17T11:30:00Z',
    flaggedForReview: false,
    hasBlockers: false,
    blockerCount: 0,
    projectName: 'Medical Staff Verification',
    initiatedDate: '2025-01-17T11:30:00Z',
    initiatedBy: 'Robert Brown',
    totalEstimatedCost: 2360,
    entityDetails: {
      firstName: 'Nomsa',
      lastName: 'Dube',
      idNumber: '8912234567890',
      nationality: 'South African',
      mobileNumber: '+27889012345'
    }
  }
];

// Export alias for operationsVettingCases as opsCases
export const opsCases = operationsVettingCases;

// Add individual checks to each case
operationsVettingCases.forEach(caseItem => {
  caseItem.individualChecks = generateIndividualChecks(
    caseItem.entityType,
    caseItem.status,
    caseItem.overallProgress,
    caseItem.id
  );
});

// Missing export functions
export const getCaseDetails = (caseId: string): CaseDetails | null => {
  const caseData = operationsVettingCases.find(c => c.id === caseId);
  if (!caseData) return null;
  
  return {
    id: caseData.id,
    caseNumber: caseData.caseNumber,
    entityName: caseData.entityName,
    entityType: caseData.entityType,
    status: caseData.status,
    priority: caseData.priority,
    assignedOfficer: caseData.assignedVettingOfficer,
    createdDate: caseData.initiatedDate,
    lastUpdated: caseData.lastStatusUpdate,
    progress: caseData.overallProgress,
    estimatedCompletion: caseData.estimatedCompletionDate,
    notes: [
      `Case initiated on ${new Date(caseData.initiatedDate).toLocaleDateString()}`,
      `Assigned to ${caseData.assignedVettingOfficer}`,
      ...(caseData.flaggedReason ? [`Flagged: ${caseData.flaggedReason}`] : [])
    ],
    riskScore: Math.floor(Math.random() * 100),
    complianceStatus: caseData.status === VettingStatus.COMPLETE ? 'Compliant' : 'Under Review',
    totalCost: caseData.totalEstimatedCost
  };
};

export const getCaseTimeline = (caseId: string): CaseTimelineEvent[] => {
  const caseData = operationsVettingCases.find(c => c.id === caseId);
  if (!caseData) return [];
  
  const events: CaseTimelineEvent[] = [
    {
      id: `${caseId}_event_1`,
      timestamp: caseData.initiatedDate,
      type: 'created',
      title: 'Case Created',
      description: `Vetting case created for ${caseData.entityName}`,
      user: caseData.initiatedBy
    },
    {
      id: `${caseId}_event_2`, 
      timestamp: caseData.assignedDate,
      type: 'assigned',
      title: 'Case Assigned',
      description: `Case assigned to ${caseData.assignedVettingOfficer}`,
      user: 'System'
    }
  ];
  
  // Add check completion events
  caseData.individualChecks?.forEach((check, index) => {
    if (check.completedDate) {
      events.push({
        id: `${caseId}_check_${index}`,
        timestamp: check.completedDate,
        type: 'check_completed',
        title: `${check.checkDefinition?.name} Completed`,
        description: `Result: ${check.result}`,
        user: check.provider || 'System'
      });
    }
  });
  
  return events.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const getEntityDetails = (entityId: string): EntityDetails | null => {
  const caseData = operationsVettingCases.find(c => 
    c.id === entityId || c.entityIdentifier === entityId
  );
  if (!caseData) return null;
  
  return {
    id: caseData.id,
    name: caseData.entityName,
    type: caseData.entityType,
    identifier: caseData.entityIdentifier,
    contactInfo: {
      phone: caseData.entityDetails?.mobileNumber || caseData.entityDetails?.primaryContactMobile,
      email: `contact@${caseData.entityName.toLowerCase().replace(/\s+/g, '')}.co.za`,
      address: 'Cape Town, South Africa'
    },
    riskProfile: {
      overall: Math.floor(Math.random() * 100),
      financial: Math.floor(Math.random() * 100),
      compliance: Math.floor(Math.random() * 100),
      reputation: Math.floor(Math.random() * 100)
    },
    complianceRecords: [
      {
        type: 'Tax Compliance',
        status: 'Up to Date',
        lastChecked: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        type: 'Company Registration',
        status: caseData.entityType === VettingEntityType.COMPANY ? 'Registered' : 'Not Applicable',
        lastChecked: caseData.initiatedDate
      }
    ],
    relationshipHistory: [
      {
        projectName: caseData.projectName,
        period: '2024',
        value: caseData.totalEstimatedCost,
        status: 'Active'
      }
    ],
    entityDetails: caseData.entityDetails || {}
  };
};

export const getCaseDossier = (caseId: string): CaseDossier | null => {
  const caseData = operationsVettingCases.find(c => c.id === caseId);
  if (!caseData) return null;
  
  return {
    caseId: caseData.id,
    caseReference: caseData.caseNumber,
    entityName: caseData.entityName,
    priorityLevel: caseData.priority,
    initiatedDate: caseData.initiatedDate,
    assignedOfficer: caseData.assignedVettingOfficer,
    reportGenerated: new Date(Date.now()).toISOString(),
    daysActive: daysSince(caseData.initiatedDate),
    totalCost: caseData.totalEstimatedCost,
    overallProgress: caseData.overallProgress,
    riskAssessment: 'High Risk - Adverse findings in financial and compliance checks',
    checksCompleted: caseData.completedChecks,
    currentStatus: caseData.status,
    overdueStatus: caseData.isOverdue ? 'Yes' : 'No',
    documents: [
      {
        id: `${caseId}_doc_1`,
        name: 'Identity Document',
        type: 'PDF',
        uploadDate: caseData.initiatedDate,
        size: 2048000,
        status: 'verified',
        category: 'Identity'
      },
      {
        id: `${caseId}_doc_2`,
        name: 'Company Registration Certificate',
        type: 'PDF', 
        uploadDate: caseData.initiatedDate,
        size: 1024000,
        status: caseData.entityType === VettingEntityType.COMPANY ? 'verified' : 'pending',
        category: 'Registration'
      }
    ],
    consentRecords: [
      {
        type: 'Digital Consent',
        status: caseData.status === VettingStatus.CONSENT_PENDING ? 'pending' : 'received',
        obtainedDate: caseData.status !== VettingStatus.CONSENT_PENDING ? caseData.initiatedDate : undefined,
        method: 'SMS'
      }
    ],
    checkResults: caseData.individualChecks?.map(check => ({
      checkType: check.checkDefinition?.name || 'Unknown Check',
      result: check.result,
      completedDate: check.completedDate || '',
      provider: check.provider || 'Unknown',
      cost: check.cost,
      status: check.status
    })) || []
  };
};

// Intelligence Feed Event Types
export interface IntelligenceFeedEvent {
  id: string;
  timestamp: string;
  type: 'consent' | 'check_completed' | 'adverse_finding' | 'case_created' | 'approval' | 'assignment';
  message: string;
  caseId: string;
  caseNumber: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  metadata?: Record<string, string | number | boolean>;
}

// Intelligence Feed Events
export const intelligenceFeedEvents: IntelligenceFeedEvent[] = [
  {
    id: 'intel_001',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    type: 'check_completed',
    message: 'MIE Criminal Check completed for Thabo Mthembu. Result: Clear',
    caseId: 'ops_case_001',
    caseNumber: 'VET-2024-001234',
    severity: 'success'
  },
  {
    id: 'intel_002',
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    type: 'adverse_finding',
    message: 'Credit Bureau Check for Zanele Mbeki returned adverse finding - 1 Judgment',
    caseId: 'ops_case_006',
    caseNumber: 'VET-2024-001239',
    severity: 'warning'
  },
  {
    id: 'intel_003',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    type: 'consent',
    message: 'Digital consent received for Sipho Ndlovu via SMS verification',
    caseId: 'ops_case_003',
    caseNumber: 'VET-2024-001236',
    severity: 'info'
  },
  {
    id: 'intel_004',
    timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    type: 'approval',
    message: 'Case VET-2024-001238 (Durban Logistics Solutions CC) approved by Robert Brown',
    caseId: 'ops_case_005',
    caseNumber: 'VET-2024-001238',
    severity: 'success'
  },
  {
    id: 'intel_005',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    type: 'case_created',
    message: 'New vetting case initiated for Rustenburg Heavy Equipment (Pty) Ltd',
    caseId: 'ops_case_007',
    caseNumber: 'VET-2024-001240',
    severity: 'info'
  },
  {
    id: 'intel_006',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    type: 'assignment',
    message: 'Case VET-2024-001241 assigned to Dr. Ahmed Hassan for medical verification',
    caseId: 'ops_case_008',
    caseNumber: 'VET-2024-001241',
    severity: 'info'
  },
  {
    id: 'intel_007',
    timestamp: new Date(Date.now() - 62 * 60 * 1000).toISOString(),
    type: 'check_completed',
    message: 'CIPC Company Check completed for Johannesburg Mining Supplies. Result: Clear',
    caseId: 'ops_case_002',
    caseNumber: 'VET-2024-001235',
    severity: 'success'
  },
  {
    id: 'intel_008',
    timestamp: new Date(Date.now() - 78 * 60 * 1000).toISOString(),
    type: 'adverse_finding',
    message: 'SARS Tax Compliance check flagged issues for Johannesburg Mining Supplies',
    caseId: 'ops_case_002',
    caseNumber: 'VET-2024-001235',
    severity: 'error'
  },
  {
    id: 'intel_009',
    timestamp: new Date(Date.now() - 95 * 60 * 1000).toISOString(),
    type: 'consent',
    message: 'Consent request sent to Mandla Khumalo Engineering CC via email',
    caseId: 'ops_case_004',
    caseNumber: 'VET-2024-001237',
    severity: 'info'
  },
  {
    id: 'intel_010',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    type: 'check_completed',
    message: 'ID Verification completed for Nomsa Dube. Result: Clear',
    caseId: 'ops_case_008',
    caseNumber: 'VET-2024-001241',
    severity: 'success'
  }
];

// Helper Functions
export const getOperationsKPIs = () => {
  const activeCases = operationsVettingCases.filter(c => 
    c.status === VettingStatus.IN_PROGRESS || 
    c.status === VettingStatus.PARTIALLY_COMPLETE ||
    c.status === VettingStatus.CONSENT_PENDING
  ).length;
  
  const pendingConsent = operationsVettingCases.filter(c => 
    c.status === VettingStatus.CONSENT_PENDING
  ).length;
  
  const overdueTasks = operationsVettingCases.filter(c => c.isOverdue).length;
  
  const readyForReview = operationsVettingCases.filter(c => 
    c.status === VettingStatus.COMPLETE
  ).length;
  
  return {
    totalActiveCases: activeCases,
    pendingConsent,
    overdueTasks,
    readyForReview
  };
};

export const filterCasesByStatus = (status: VettingStatus | 'overdue' | 'all') => {
  if (status === 'overdue') {
    return operationsVettingCases.filter(c => c.isOverdue);
  }
  if (status === 'all') {
    return operationsVettingCases;
  }
  return operationsVettingCases.filter(c => c.status === status);
};

export const enhanceCasesWithProvider = (cases: ActiveVettingCase[]) => {
  return cases.map(caseItem => ({
    ...caseItem,
    primaryProvider: caseItem.individualChecks.length > 0 
      ? caseItem.individualChecks[0].provider?.split(' ')[0] || 'Unknown'
      : 'Unknown'
  }));
};

export const searchCases = (cases: ActiveVettingCase[], query: string) => {
  if (!query) return cases;
  
  const searchLower = query.toLowerCase();
  return cases.filter(caseItem => 
    caseItem.caseNumber.toLowerCase().includes(searchLower) ||
    caseItem.entityName.toLowerCase().includes(searchLower) ||
    caseItem.assignedVettingOfficer?.toLowerCase().includes(searchLower) ||
    ''
  );
};