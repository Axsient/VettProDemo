import { 
  ActiveVettingCase,
  VettingEntityType,
  VettingStatus,
  ConsentStatus,
  IndividualDetails,
  CompanyDetails,
  StaffMedicalDetails
} from '@/types/vetting';
import { allVettingChecks } from './vettingChecksSample';

// Helper function to calculate days since a date
function daysSince(dateString: string): number {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = today.getTime() - date.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}


// Sample active vetting cases with realistic South African scenarios
export const activeVettingCases: ActiveVettingCase[] = [
  // Case 1: Individual - High priority mining contractor
  {
    id: 'case_001',
    caseNumber: 'VET-2024-001234',
    entityType: VettingEntityType.INDIVIDUAL,
    entityDetails: {
      firstName: 'Thabo',
      lastName: 'Mthembu',
      idNumber: '8503125432087',
      nationality: 'South African',
      mobileNumber: '+27 82 456 7890',
      emailAddress: 'thabo.mthembu@contractor.co.za',
      dateOfBirth: '1985-03-12',
      placeOfBirth: 'Johannesburg'
    } as IndividualDetails,
    selectedChecks: ['id_verify_sa', 'criminal_record_enhanced', 'credit_check_ind', 'pep_sanctions_ind', 'employment_verify'],
    status: VettingStatus.IN_PROGRESS,
    consentStatus: ConsentStatus.GRANTED,
    totalEstimatedCost: 1050,
    totalEstimatedTurnaround: 7,
    initiatedBy: 'Sarah Johnson',
    initiatedDate: '2025-01-15',
    targetCompletionDate: '2025-01-22',
    priority: 'High',
    
    // Extended properties
    overallProgress: 75,
    completedChecks: 3,
    totalChecks: 5,
    lastStatusUpdate: '2025-01-20',
    lastStatusUpdateBy: 'Mike Stevens',
    estimatedCompletionDate: '2025-01-22',
    isOverdue: false,
    daysSinceInitiated: daysSince('2025-01-15'),
    assignedVettingOfficer: 'Mike Stevens',
    assignedDate: '2025-01-15',
    flaggedForReview: false,
    hasBlockers: false,
    blockerCount: 0,
    projectId: 'proj_SB001',
    projectName: 'Marikana K4 Expansion',
    entityName: 'Thabo Mthembu',
    entityIdentifier: '8503125432087',
    
    individualChecks: [
      {
        checkId: 'id_verify_sa',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-16',
        cost: 50,
        provider: 'MIE (Managed Integrity Evaluation)',
        riskScore: 5,
        checkDefinition: allVettingChecks.find(c => c.id === 'id_verify_sa')!,
        actualStartDate: '2025-01-15',
        actualCompletionDate: '2025-01-16',
        statusUpdatedDate: '2025-01-16',
        statusUpdatedBy: 'System',
        providerReference: 'MIE-2024-001234'
      },
      {
        checkId: 'criminal_record_enhanced',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-18',
        cost: 300,
        provider: 'Advanced Criminal Intelligence',
        riskScore: 10,
        checkDefinition: allVettingChecks.find(c => c.id === 'criminal_record_enhanced')!,
        actualStartDate: '2025-01-15',
        actualCompletionDate: '2025-01-18',
        statusUpdatedDate: '2025-01-18',
        statusUpdatedBy: 'System',
        providerReference: 'ACI-2024-005678'
      },
      {
        checkId: 'credit_check_ind',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-17',
        cost: 120,
        provider: 'XDS (Experian)',
        riskScore: 25,
        checkDefinition: allVettingChecks.find(c => c.id === 'credit_check_ind')!,
        actualStartDate: '2025-01-15',
        actualCompletionDate: '2025-01-17',
        statusUpdatedDate: '2025-01-17',
        statusUpdatedBy: 'System',
        providerReference: 'XDS-2024-009876'
      },
      {
        checkId: 'pep_sanctions_ind',
        status: 'In Progress',
        completedDate: undefined,
        cost: 80,
        provider: 'LexisNexis WorldCompliance',
        checkDefinition: allVettingChecks.find(c => c.id === 'pep_sanctions_ind')!,
        actualStartDate: '2025-01-19',
        estimatedCompletionDate: '2025-01-21',
        statusUpdatedDate: '2025-01-19',
        statusUpdatedBy: 'System',
        providerReference: 'LN-2024-003456'
      },
      {
        checkId: 'employment_verify',
        status: 'In Progress',
        completedDate: undefined,
        cost: 300,
        provider: 'Reference Check Specialists',
        checkDefinition: allVettingChecks.find(c => c.id === 'employment_verify')!,
        actualStartDate: '2025-01-18',
        estimatedCompletionDate: '2025-01-23',
        statusUpdatedDate: '2025-01-18',
        statusUpdatedBy: 'System',
        providerReference: 'RCS-2024-007890'
      }
    ]
  },

  // Case 2: Company - Overdue supplier verification
  {
    id: 'case_002',
    caseNumber: 'VET-2024-001235',
    entityType: VettingEntityType.COMPANY,
    entityDetails: {
      companyName: 'Johannesburg Mining Supplies (Pty) Ltd',
      registrationNumber: '2019/123456/07',
      vatNumber: '4567890123',
      primaryContactName: 'Nomsa Dlamini',
      primaryContactMobile: '+27 11 234 5678',
      primaryContactEmail: 'nomsa@jmsmining.co.za',
      businessType: 'Mining Equipment Supplier',
      industry: 'Mining Support Services',
      yearEstablished: 2019,
      physicalAddress: '123 Mining Road, Johannesburg, 2001'
    } as CompanyDetails,
    selectedChecks: ['cipc_company_check', 'vat_verify_sars', 'business_credit_report', 'physical_loc_verify', 'media_search_company'],
    status: VettingStatus.PARTIALLY_COMPLETE,
    consentStatus: ConsentStatus.GRANTED,
    totalEstimatedCost: 1420,
    totalEstimatedTurnaround: 5,
    initiatedBy: 'John Smith',
    initiatedDate: '2025-01-05',
    targetCompletionDate: '2025-01-10',
    priority: 'Medium',
    
    // Extended properties
    overallProgress: 60,
    completedChecks: 3,
    totalChecks: 5,
    lastStatusUpdate: '2025-01-12',
    lastStatusUpdateBy: 'Lisa Chen',
    estimatedCompletionDate: '2025-01-25',
    isOverdue: true,
    daysSinceInitiated: daysSince('2025-01-05'),
    assignedVettingOfficer: 'Lisa Chen',
    assignedDate: '2025-01-05',
    flaggedForReview: true,
    flaggedReason: 'Overdue - Missing physical location verification',
    hasBlockers: true,
    blockerCount: 1,
    entityName: 'Johannesburg Mining Supplies (Pty) Ltd',
    entityIdentifier: '2019/123456/07',
    
    individualChecks: [
      {
        checkId: 'cipc_company_check',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-06',
        cost: 100,
        provider: 'MIE Business Services',
        riskScore: 5,
        checkDefinition: allVettingChecks.find(c => c.id === 'cipc_company_check')!,
        actualStartDate: '2025-01-05',
        actualCompletionDate: '2025-01-06',
        statusUpdatedDate: '2025-01-06',
        statusUpdatedBy: 'System',
        providerReference: 'MIE-BIZ-2024-001234'
      },
      {
        checkId: 'vat_verify_sars',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-07',
        cost: 70,
        provider: 'Internal/SARS Integration',
        riskScore: 0,
        checkDefinition: allVettingChecks.find(c => c.id === 'vat_verify_sars')!,
        actualStartDate: '2025-01-05',
        actualCompletionDate: '2025-01-07',
        statusUpdatedDate: '2025-01-07',
        statusUpdatedBy: 'System',
        providerReference: 'SARS-2024-567890'
      },
      {
        checkId: 'business_credit_report',
        status: 'Complete',
        result: 'Requires Review',
        completedDate: '2025-01-08',
        cost: 300,
        provider: 'CPB (Credit Provider Bureau)',
        riskScore: 45,
        notes: 'Some late payment history noted',
        checkDefinition: allVettingChecks.find(c => c.id === 'business_credit_report')!,
        actualStartDate: '2025-01-05',
        actualCompletionDate: '2025-01-08',
        statusUpdatedDate: '2025-01-08',
        statusUpdatedBy: 'System',
        providerReference: 'CPB-2024-234567'
      },
      {
        checkId: 'physical_loc_verify',
        status: 'Error',
        result: 'Failed',
        completedDate: undefined,
        cost: 800,
        provider: 'Field Verification Agents',
        notes: 'Unable to locate business at registered address',
        checkDefinition: allVettingChecks.find(c => c.id === 'physical_loc_verify')!,
        actualStartDate: '2025-01-08',
        statusUpdatedDate: '2025-01-12',
        statusUpdatedBy: 'Lisa Chen',
        blockerReason: 'Incorrect address provided - requires updated address information',
        providerReference: 'FVA-2024-345678'
      },
      {
        checkId: 'media_search_company',
        status: 'Pending',
        completedDate: undefined,
        cost: 300,
        provider: 'Digital Intelligence Specialists',
        checkDefinition: allVettingChecks.find(c => c.id === 'media_search_company')!,
        estimatedCompletionDate: '2025-01-26',
        statusUpdatedDate: '2025-01-05',
        statusUpdatedBy: 'System'
      }
    ]
  },

  // Case 3: Staff Medical - Urgent mining staff clearance
  {
    id: 'case_003',
    caseNumber: 'VET-2024-001236',
    entityType: VettingEntityType.STAFF_MEDICAL,
    entityDetails: {
      firstName: 'Sipho',
      lastName: 'Ndebele',
      idNumber: '9201156789012',
      nationality: 'South African',
      mobileNumber: '+27 83 123 4567',
      emailAddress: 'sipho.ndebele@email.com',
      dateOfBirth: '1992-01-15',
      placeOfBirth: 'Durban',
      projectId: 'proj_AA005',
      staffEmployeeId: 'EMP-2024-001',
      jobRole: 'Underground Miner',
      department: 'Mining Operations',
      supervisorName: 'James Mthembu',
      emergencyContactName: 'Nomsa Ndebele',
      emergencyContactNumber: '+27 84 987 6543'
    } as StaffMedicalDetails,
    selectedChecks: ['id_verify_sa', 'med_fitness_cert', 'drug_alcohol_screen', 'criminal_record_afis'],
    status: VettingStatus.IN_PROGRESS,
    consentStatus: ConsentStatus.GRANTED,
    totalEstimatedCost: 1150,
    totalEstimatedTurnaround: 2,
    initiatedBy: 'HR Department',
    initiatedDate: '2025-01-20',
    targetCompletionDate: '2025-01-22',
    priority: 'Urgent',
    
    // Extended properties
    overallProgress: 50,
    completedChecks: 2,
    totalChecks: 4,
    lastStatusUpdate: '2025-01-21',
    lastStatusUpdateBy: 'Medical Team',
    estimatedCompletionDate: '2025-01-22',
    isOverdue: false,
    daysSinceInitiated: daysSince('2025-01-20'),
    assignedVettingOfficer: 'Fatima Patel',
    assignedDate: '2025-01-20',
    flaggedForReview: false,
    hasBlockers: false,
    blockerCount: 0,
    projectId: 'proj_AA005',
    projectName: 'Mogalakwena North Pit Extension',
    entityName: 'Sipho Ndebele',
    entityIdentifier: '9201156789012',
    
    individualChecks: [
      {
        checkId: 'id_verify_sa',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-20',
        cost: 50,
        provider: 'MIE (Managed Integrity Evaluation)',
        riskScore: 0,
        checkDefinition: allVettingChecks.find(c => c.id === 'id_verify_sa')!,
        actualStartDate: '2025-01-20',
        actualCompletionDate: '2025-01-20',
        statusUpdatedDate: '2025-01-20',
        statusUpdatedBy: 'System',
        providerReference: 'MIE-2024-001236'
      },
      {
        checkId: 'med_fitness_cert',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-21',
        cost: 600,
        provider: 'Occupational Health Clinic',
        riskScore: 15,
        notes: 'Minor vision correction required but within acceptable limits',
        checkDefinition: allVettingChecks.find(c => c.id === 'med_fitness_cert')!,
        actualStartDate: '2025-01-20',
        actualCompletionDate: '2025-01-21',
        statusUpdatedDate: '2025-01-21',
        statusUpdatedBy: 'Dr. Fatima Patel',
        providerReference: 'OHC-2024-789012'
      },
      {
        checkId: 'drug_alcohol_screen',
        status: 'In Progress',
        completedDate: undefined,
        cost: 350,
        provider: 'Pathology Laboratory',
        checkDefinition: allVettingChecks.find(c => c.id === 'drug_alcohol_screen')!,
        actualStartDate: '2025-01-21',
        estimatedCompletionDate: '2025-01-22',
        statusUpdatedDate: '2025-01-21',
        statusUpdatedBy: 'Lab Tech',
        providerReference: 'PATH-2024-456789'
      },
      {
        checkId: 'criminal_record_afis',
        status: 'In Progress',
        completedDate: undefined,
        cost: 150,
        provider: 'MIE Criminal Services',
        checkDefinition: allVettingChecks.find(c => c.id === 'criminal_record_afis')!,
        actualStartDate: '2025-01-21',
        estimatedCompletionDate: '2025-01-22',
        statusUpdatedDate: '2025-01-21',
        statusUpdatedBy: 'System',
        providerReference: 'MIE-CRIM-2024-003456'
      }
    ]
  },

  // Case 4: Individual - Awaiting consent
  {
    id: 'case_004',
    caseNumber: 'VET-2024-001237',
    entityType: VettingEntityType.INDIVIDUAL,
    entityDetails: {
      firstName: 'Mandla',
      lastName: 'Khumalo',
      idNumber: '7809123456789',
      nationality: 'South African',
      mobileNumber: '+27 81 234 5678',
      emailAddress: 'mandla.khumalo@consultant.co.za',
      dateOfBirth: '1978-09-12',
      placeOfBirth: 'Cape Town'
    } as IndividualDetails,
    selectedChecks: ['id_verify_sa', 'criminal_record_afis', 'credit_check_ind', 'lifestyle_audit_ind'],
    status: VettingStatus.CONSENT_PENDING,
    consentStatus: ConsentStatus.PENDING,
    totalEstimatedCost: 900,
    totalEstimatedTurnaround: 7,
    initiatedBy: 'Procurement Team',
    initiatedDate: '2025-01-18',
    targetCompletionDate: '2025-01-25',
    priority: 'Medium',
    
    // Extended properties
    overallProgress: 0,
    completedChecks: 0,
    totalChecks: 4,
    lastStatusUpdate: '2025-01-19',
    lastStatusUpdateBy: 'System',
    estimatedCompletionDate: '2025-01-27',
    isOverdue: false,
    daysSinceInitiated: daysSince('2025-01-18'),
    assignedVettingOfficer: 'Janet Williams',
    assignedDate: '2025-01-18',
    flaggedForReview: false,
    hasBlockers: true,
    blockerCount: 1,
    entityName: 'Mandla Khumalo',
    entityIdentifier: '7809123456789',
    
    individualChecks: [
      {
        checkId: 'id_verify_sa',
        status: 'Pending',
        completedDate: undefined,
        cost: 50,
        provider: 'MIE (Managed Integrity Evaluation)',
        checkDefinition: allVettingChecks.find(c => c.id === 'id_verify_sa')!,
        statusUpdatedDate: '2025-01-18',
        statusUpdatedBy: 'System',
        blockerReason: 'Awaiting subject consent'
      },
      {
        checkId: 'criminal_record_afis',
        status: 'Pending',
        completedDate: undefined,
        cost: 150,
        provider: 'MIE Criminal Services',
        checkDefinition: allVettingChecks.find(c => c.id === 'criminal_record_afis')!,
        statusUpdatedDate: '2025-01-18',
        statusUpdatedBy: 'System',
        blockerReason: 'Awaiting subject consent'
      },
      {
        checkId: 'credit_check_ind',
        status: 'Pending',
        completedDate: undefined,
        cost: 120,
        provider: 'XDS (Experian)',
        checkDefinition: allVettingChecks.find(c => c.id === 'credit_check_ind')!,
        statusUpdatedDate: '2025-01-18',
        statusUpdatedBy: 'System',
        blockerReason: 'Awaiting subject consent'
      },
      {
        checkId: 'lifestyle_audit_ind',
        status: 'Pending',
        completedDate: undefined,
        cost: 500,
        provider: 'Lifestyle Audit Specialists',
        checkDefinition: allVettingChecks.find(c => c.id === 'lifestyle_audit_ind')!,
        statusUpdatedDate: '2025-01-18',
        statusUpdatedBy: 'System',
        blockerReason: 'Awaiting subject consent'
      }
    ]
  },

  // Case 5: Company - Recently completed
  {
    id: 'case_005',
    caseNumber: 'VET-2024-001238',
    entityType: VettingEntityType.COMPANY,
    entityDetails: {
      companyName: 'Durban Logistics Solutions CC',
      registrationNumber: '2020/456789/23',
      vatNumber: '7890123456',
      primaryContactName: 'Priya Patel',
      primaryContactMobile: '+27 31 789 0123',
      primaryContactEmail: 'priya@dls.co.za',
      businessType: 'Logistics & Transportation',
      industry: 'Transportation',
      yearEstablished: 2020,
      physicalAddress: '456 Logistics Ave, Durban, 4001'
    } as CompanyDetails,
    selectedChecks: ['cipc_company_check', 'vat_verify_sars', 'business_credit_report', 'bee_verification'],
    status: VettingStatus.COMPLETE,
    consentStatus: ConsentStatus.GRANTED,
    totalEstimatedCost: 620,
    totalEstimatedTurnaround: 3,
    initiatedBy: 'Supply Chain Team',
    initiatedDate: '2025-01-10',
    targetCompletionDate: '2025-01-13',
    actualCompletionDate: '2025-01-12',
    priority: 'Low',
    
    // Extended properties
    overallProgress: 100,
    completedChecks: 4,
    totalChecks: 4,
    lastStatusUpdate: '2025-01-12',
    lastStatusUpdateBy: 'System',
    estimatedCompletionDate: '2025-01-12',
    isOverdue: false,
    daysSinceInitiated: daysSince('2025-01-10'),
    assignedVettingOfficer: 'Robert Brown',
    assignedDate: '2025-01-10',
    flaggedForReview: false,
    hasBlockers: false,
    blockerCount: 0,
    entityName: 'Durban Logistics Solutions CC',
    entityIdentifier: '2020/456789/23',
    
    individualChecks: [
      {
        checkId: 'cipc_company_check',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-11',
        cost: 100,
        provider: 'MIE Business Services',
        riskScore: 5,
        checkDefinition: allVettingChecks.find(c => c.id === 'cipc_company_check')!,
        actualStartDate: '2025-01-10',
        actualCompletionDate: '2025-01-11',
        statusUpdatedDate: '2025-01-11',
        statusUpdatedBy: 'System',
        providerReference: 'MIE-BIZ-2024-001238'
      },
      {
        checkId: 'vat_verify_sars',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-11',
        cost: 70,
        provider: 'Internal/SARS Integration',
        riskScore: 0,
        checkDefinition: allVettingChecks.find(c => c.id === 'vat_verify_sars')!,
        actualStartDate: '2025-01-10',
        actualCompletionDate: '2025-01-11',
        statusUpdatedDate: '2025-01-11',
        statusUpdatedBy: 'System',
        providerReference: 'SARS-2024-567891'
      },
      {
        checkId: 'business_credit_report',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-11',
        cost: 300,
        provider: 'CPB (Credit Provider Bureau)',
        riskScore: 20,
        checkDefinition: allVettingChecks.find(c => c.id === 'business_credit_report')!,
        actualStartDate: '2025-01-10',
        actualCompletionDate: '2025-01-11',
        statusUpdatedDate: '2025-01-11',
        statusUpdatedBy: 'System',
        providerReference: 'CPB-2024-234568'
      },
      {
        checkId: 'bee_verification',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-12',
        cost: 150,
        provider: 'BEE Verification Agency',
        riskScore: 0,
        notes: 'Level 2 BEE certification verified',
        checkDefinition: allVettingChecks.find(c => c.id === 'bee_verification')!,
        actualStartDate: '2025-01-10',
        actualCompletionDate: '2025-01-12',
        statusUpdatedDate: '2025-01-12',
        statusUpdatedBy: 'System',
        providerReference: 'BEE-2024-345679'
      }
    ]
  },

  // Case 6: Individual - Flagged for review with adverse findings
  {
    id: 'case_006',
    caseNumber: 'VET-2024-001239',
    entityType: VettingEntityType.INDIVIDUAL,
    entityDetails: {
      firstName: 'Zanele',
      lastName: 'Mbeki',
      idNumber: '8706208765432',
      nationality: 'South African',
      mobileNumber: '+27 84 567 8901',
      emailAddress: 'zanele.mbeki@email.com',
      dateOfBirth: '1987-06-20',
      placeOfBirth: 'Pretoria'
    } as IndividualDetails,
    selectedChecks: ['id_verify_sa', 'criminal_record_enhanced', 'credit_check_ind', 'pep_sanctions_ind', 'litigation_search'],
    status: VettingStatus.PARTIALLY_COMPLETE,
    consentStatus: ConsentStatus.GRANTED,
    totalEstimatedCost: 850,
    totalEstimatedTurnaround: 5,
    initiatedBy: 'Risk Management',
    initiatedDate: '2025-01-12',
    targetCompletionDate: '2025-01-17',
    priority: 'High',
    
    // Extended properties
    overallProgress: 80,
    completedChecks: 4,
    totalChecks: 5,
    lastStatusUpdate: '2025-01-18',
    lastStatusUpdateBy: 'Emma Thompson',
    estimatedCompletionDate: '2025-01-19',
    isOverdue: true,
    daysSinceInitiated: daysSince('2025-01-12'),
    assignedVettingOfficer: 'Emma Thompson',
    assignedDate: '2025-01-12',
    flaggedForReview: true,
    flaggedReason: 'Adverse findings in credit and litigation checks',
    hasBlockers: false,
    blockerCount: 0,
    entityName: 'Zanele Mbeki',
    entityIdentifier: '8706208765432',
    
    individualChecks: [
      {
        checkId: 'id_verify_sa',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-13',
        cost: 50,
        provider: 'MIE (Managed Integrity Evaluation)',
        riskScore: 0,
        checkDefinition: allVettingChecks.find(c => c.id === 'id_verify_sa')!,
        actualStartDate: '2025-01-12',
        actualCompletionDate: '2025-01-13',
        statusUpdatedDate: '2025-01-13',
        statusUpdatedBy: 'System',
        providerReference: 'MIE-2024-001239'
      },
      {
        checkId: 'criminal_record_enhanced',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-16',
        cost: 300,
        provider: 'Advanced Criminal Intelligence',
        riskScore: 5,
        checkDefinition: allVettingChecks.find(c => c.id === 'criminal_record_enhanced')!,
        actualStartDate: '2025-01-12',
        actualCompletionDate: '2025-01-16',
        statusUpdatedDate: '2025-01-16',
        statusUpdatedBy: 'System',
        providerReference: 'ACI-2024-005679'
      },
      {
        checkId: 'credit_check_ind',
        status: 'Complete',
        result: 'Requires Review',
        completedDate: '2025-01-15',
        cost: 120,
        provider: 'XDS (Experian)',
        riskScore: 65,
        notes: 'Multiple defaults and judgments recorded',
        checkDefinition: allVettingChecks.find(c => c.id === 'credit_check_ind')!,
        actualStartDate: '2025-01-12',
        actualCompletionDate: '2025-01-15',
        statusUpdatedDate: '2025-01-15',
        statusUpdatedBy: 'System',
        providerReference: 'XDS-2024-009877'
      },
      {
        checkId: 'pep_sanctions_ind',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-14',
        cost: 80,
        provider: 'LexisNexis WorldCompliance',
        riskScore: 0,
        checkDefinition: allVettingChecks.find(c => c.id === 'pep_sanctions_ind')!,
        actualStartDate: '2025-01-12',
        actualCompletionDate: '2025-01-14',
        statusUpdatedDate: '2025-01-14',
        statusUpdatedBy: 'System',
        providerReference: 'LN-2024-003457'
      },
      {
        checkId: 'litigation_search',
        status: 'In Progress',
        completedDate: undefined,
        cost: 180,
        provider: 'Legal Research Services',
        notes: 'Initial search shows multiple civil cases',
        checkDefinition: allVettingChecks.find(c => c.id === 'litigation_search')!,
        actualStartDate: '2025-01-16',
        estimatedCompletionDate: '2025-01-19',
        statusUpdatedDate: '2025-01-18',
        statusUpdatedBy: 'Emma Thompson',
        providerReference: 'LRS-2024-456790',
        urgentFlag: true
      }
    ]
  },

  // Case 7: Company - New mining equipment supplier
  {
    id: 'case_007',
    caseNumber: 'VET-2024-001240',
    entityType: VettingEntityType.COMPANY,
    entityDetails: {
      companyName: 'Rustenburg Heavy Equipment (Pty) Ltd',
      registrationNumber: '2023/789012/07',
      vatNumber: '9876543210',
      primaryContactName: 'David van der Merwe',
      primaryContactMobile: '+27 14 567 8901',
      primaryContactEmail: 'david@rustequip.co.za',
      businessType: 'Heavy Equipment Sales',
      industry: 'Mining Equipment',
      yearEstablished: 2023,
      physicalAddress: '789 Equipment Road, Rustenburg, 0299'
    } as CompanyDetails,
    selectedChecks: ['cipc_company_check', 'vat_verify_sars', 'business_credit_report', 'physical_loc_verify', 'operational_capacity'],
    status: VettingStatus.IN_PROGRESS,
    consentStatus: ConsentStatus.GRANTED,
    totalEstimatedCost: 1590,
    totalEstimatedTurnaround: 5,
    initiatedBy: 'Procurement Manager',
    initiatedDate: '2025-01-19',
    targetCompletionDate: '2025-01-24',
    priority: 'Medium',
    
    // Extended properties
    overallProgress: 40,
    completedChecks: 2,
    totalChecks: 5,
    lastStatusUpdate: '2025-01-21',
    lastStatusUpdateBy: 'System',
    estimatedCompletionDate: '2025-01-24',
    isOverdue: false,
    daysSinceInitiated: daysSince('2025-01-19'),
    assignedVettingOfficer: 'Mark Johnson',
    assignedDate: '2025-01-19',
    flaggedForReview: false,
    hasBlockers: false,
    blockerCount: 0,
    entityName: 'Rustenburg Heavy Equipment (Pty) Ltd',
    entityIdentifier: '2023/789012/07',
    
    individualChecks: [
      {
        checkId: 'cipc_company_check',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-20',
        cost: 100,
        provider: 'MIE Business Services',
        riskScore: 5,
        checkDefinition: allVettingChecks.find(c => c.id === 'cipc_company_check')!,
        actualStartDate: '2025-01-19',
        actualCompletionDate: '2025-01-20',
        statusUpdatedDate: '2025-01-20',
        statusUpdatedBy: 'System',
        providerReference: 'MIE-BIZ-2024-001240'
      },
      {
        checkId: 'vat_verify_sars',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-20',
        cost: 70,
        provider: 'Internal/SARS Integration',
        riskScore: 0,
        checkDefinition: allVettingChecks.find(c => c.id === 'vat_verify_sars')!,
        actualStartDate: '2025-01-19',
        actualCompletionDate: '2025-01-20',
        statusUpdatedDate: '2025-01-20',
        statusUpdatedBy: 'System',
        providerReference: 'SARS-2024-567892'
      },
      {
        checkId: 'business_credit_report',
        status: 'In Progress',
        completedDate: undefined,
        cost: 300,
        provider: 'CPB (Credit Provider Bureau)',
        checkDefinition: allVettingChecks.find(c => c.id === 'business_credit_report')!,
        actualStartDate: '2025-01-20',
        estimatedCompletionDate: '2025-01-22',
        statusUpdatedDate: '2025-01-20',
        statusUpdatedBy: 'System',
        providerReference: 'CPB-2024-234569'
      },
      {
        checkId: 'physical_loc_verify',
        status: 'Pending',
        completedDate: undefined,
        cost: 800,
        provider: 'Field Verification Agents',
        checkDefinition: allVettingChecks.find(c => c.id === 'physical_loc_verify')!,
        estimatedCompletionDate: '2025-01-24',
        statusUpdatedDate: '2025-01-19',
        statusUpdatedBy: 'System'
      },
      {
        checkId: 'operational_capacity',
        status: 'Pending',
        completedDate: undefined,
        cost: 1200,
        provider: 'Operational Assessment Specialists',
        checkDefinition: allVettingChecks.find(c => c.id === 'operational_capacity')!,
        estimatedCompletionDate: '2025-01-24',
        statusUpdatedDate: '2025-01-19',
        statusUpdatedBy: 'System'
      }
    ]
  },

  // Case 8: Staff Medical - Comprehensive mining medical
  {
    id: 'case_008',
    caseNumber: 'VET-2024-001241',
    entityType: VettingEntityType.STAFF_MEDICAL,
    entityDetails: {
      firstName: 'Nkosana',
      lastName: 'Dube',
      idNumber: '8912076543210',
      nationality: 'South African',
      mobileNumber: '+27 82 789 0123',
      emailAddress: 'nkosana.dube@email.com',
      dateOfBirth: '1989-12-07',
      placeOfBirth: 'Klerksdorp',
      projectId: 'proj_KUM001',
      staffEmployeeId: 'EMP-2024-002',
      jobRole: 'Shift Supervisor',
      department: 'Mining Operations',
      supervisorName: 'Peter Moloi',
      emergencyContactName: 'Thandi Dube',
      emergencyContactNumber: '+27 83 456 7890'
    } as StaffMedicalDetails,
    selectedChecks: ['id_verify_sa', 'med_fitness_cert', 'chronic_med_history', 'drug_alcohol_screen', 'psychological_assessment'],
    status: VettingStatus.IN_PROGRESS,
    consentStatus: ConsentStatus.GRANTED,
    totalEstimatedCost: 2350,
    totalEstimatedTurnaround: 5,
    initiatedBy: 'HR Medical Team',
    initiatedDate: '2025-01-17',
    targetCompletionDate: '2025-01-22',
    priority: 'High',
    
    // Extended properties
    overallProgress: 60,
    completedChecks: 3,
    totalChecks: 5,
    lastStatusUpdate: '2025-01-21',
    lastStatusUpdateBy: 'Dr. Ahmed Hassan',
    estimatedCompletionDate: '2025-01-23',
    isOverdue: false,
    daysSinceInitiated: daysSince('2025-01-17'),
    assignedVettingOfficer: 'Dr. Ahmed Hassan',
    assignedDate: '2025-01-17',
    flaggedForReview: false,
    hasBlockers: false,
    blockerCount: 0,
    projectId: 'proj_KUM001',
    projectName: 'Sishen Iron Ore Mine Expansion',
    entityName: 'Nkosana Dube',
    entityIdentifier: '8912076543210',
    
    individualChecks: [
      {
        checkId: 'id_verify_sa',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-18',
        cost: 50,
        provider: 'MIE (Managed Integrity Evaluation)',
        riskScore: 0,
        checkDefinition: allVettingChecks.find(c => c.id === 'id_verify_sa')!,
        actualStartDate: '2025-01-17',
        actualCompletionDate: '2025-01-18',
        statusUpdatedDate: '2025-01-18',
        statusUpdatedBy: 'System',
        providerReference: 'MIE-2024-001241'
      },
      {
        checkId: 'med_fitness_cert',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-19',
        cost: 600,
        provider: 'Occupational Health Clinic',
        riskScore: 10,
        checkDefinition: allVettingChecks.find(c => c.id === 'med_fitness_cert')!,
        actualStartDate: '2025-01-18',
        actualCompletionDate: '2025-01-19',
        statusUpdatedDate: '2025-01-19',
        statusUpdatedBy: 'Dr. Ahmed Hassan',
        providerReference: 'OHC-2024-789013'
      },
      {
        checkId: 'chronic_med_history',
        status: 'Complete',
        result: 'Pass',
        completedDate: '2025-01-20',
        cost: 250,
        provider: 'Specialized Medical Reviewer',
        riskScore: 5,
        notes: 'Managed hypertension - cleared for work',
        checkDefinition: allVettingChecks.find(c => c.id === 'chronic_med_history')!,
        actualStartDate: '2025-01-18',
        actualCompletionDate: '2025-01-20',
        statusUpdatedDate: '2025-01-20',
        statusUpdatedBy: 'Dr. Ahmed Hassan',
        providerReference: 'SMR-2024-345680'
      },
      {
        checkId: 'drug_alcohol_screen',
        status: 'In Progress',
        completedDate: undefined,
        cost: 350,
        provider: 'Pathology Laboratory',
        checkDefinition: allVettingChecks.find(c => c.id === 'drug_alcohol_screen')!,
        actualStartDate: '2025-01-21',
        estimatedCompletionDate: '2025-01-22',
        statusUpdatedDate: '2025-01-21',
        statusUpdatedBy: 'Lab Tech',
        providerReference: 'PATH-2024-456791'
      },
      {
        checkId: 'psychological_assessment',
        status: 'In Progress',
        completedDate: undefined,
        cost: 1200,
        provider: 'Occupational Psychologist',
        checkDefinition: allVettingChecks.find(c => c.id === 'psychological_assessment')!,
        actualStartDate: '2025-01-21',
        estimatedCompletionDate: '2025-01-23',
        statusUpdatedDate: '2025-01-21',
        statusUpdatedBy: 'Dr. Sarah Mitchell',
        providerReference: 'PSY-2024-567892'
      }
    ]
  }
];

// Helper functions for data manipulation
export function getActiveVettingCaseById(id: string): ActiveVettingCase | undefined {
  return activeVettingCases.find(case_ => case_.id === id);
}

export function getActiveVettingCasesByStatus(status: VettingStatus): ActiveVettingCase[] {
  return activeVettingCases.filter(case_ => case_.status === status);
}

export function getActiveVettingCasesByPriority(priority: string): ActiveVettingCase[] {
  return activeVettingCases.filter(case_ => case_.priority === priority);
}

export function getOverdueActiveVettingCases(): ActiveVettingCase[] {
  return activeVettingCases.filter(case_ => case_.isOverdue);
}

export function getFlaggedActiveVettingCases(): ActiveVettingCase[] {
  return activeVettingCases.filter(case_ => case_.flaggedForReview);
}

export function getActiveVettingCasesWithBlockers(): ActiveVettingCase[] {
  return activeVettingCases.filter(case_ => case_.hasBlockers);
}

export function getActiveVettingCasesByOfficer(officer: string): ActiveVettingCase[] {
  return activeVettingCases.filter(case_ => case_.assignedVettingOfficer === officer);
}

export function getActiveVettingCasesByProject(projectId: string): ActiveVettingCase[] {
  return activeVettingCases.filter(case_ => case_.projectId === projectId);
}

// Summary statistics
export function getActiveVettingCasesStats() {
  const totalCases = activeVettingCases.length;
  const inProgressCases = activeVettingCases.filter(c => c.status === VettingStatus.IN_PROGRESS).length;
  const completedCases = activeVettingCases.filter(c => c.status === VettingStatus.COMPLETE).length;
  const overdueCases = activeVettingCases.filter(c => c.isOverdue).length;
  const flaggedCases = activeVettingCases.filter(c => c.flaggedForReview).length;
  const averageProgress = Math.round(activeVettingCases.reduce((sum, c) => sum + c.overallProgress, 0) / totalCases);

  return {
    totalCases,
    inProgressCases,
    completedCases,
    overdueCases,
    flaggedCases,
    averageProgress,
    statusDistribution: {
      [VettingStatus.INITIATED]: activeVettingCases.filter(c => c.status === VettingStatus.INITIATED).length,
      [VettingStatus.CONSENT_PENDING]: activeVettingCases.filter(c => c.status === VettingStatus.CONSENT_PENDING).length,
      [VettingStatus.IN_PROGRESS]: inProgressCases,
      [VettingStatus.PARTIALLY_COMPLETE]: activeVettingCases.filter(c => c.status === VettingStatus.PARTIALLY_COMPLETE).length,
      [VettingStatus.COMPLETE]: completedCases,
      [VettingStatus.FAILED]: activeVettingCases.filter(c => c.status === VettingStatus.FAILED).length,
      [VettingStatus.CANCELLED]: activeVettingCases.filter(c => c.status === VettingStatus.CANCELLED).length,
    },
    priorityDistribution: {
      'Low': activeVettingCases.filter(c => c.priority === 'Low').length,
      'Medium': activeVettingCases.filter(c => c.priority === 'Medium').length,
      'High': activeVettingCases.filter(c => c.priority === 'High').length,
      'Urgent': activeVettingCases.filter(c => c.priority === 'Urgent').length,
    }
  };
}

// Simulated API function
export async function getActiveVettingCasesData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 150));
  
  return {
    cases: activeVettingCases,
    stats: getActiveVettingCasesStats()
  };
}