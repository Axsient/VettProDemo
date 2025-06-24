import { 
  VettingCheckDefinition, 
  VettingPackage, 
  CheckCategory, 
  VettingEntityType 
} from '@/types/vetting';

// Comprehensive vetting checks based on South African requirements
export const allVettingChecks: VettingCheckDefinition[] = [
  // IDENTITY CHECKS
  {
    id: 'id_verify_sa',
    name: 'SA ID Verification',
    description: 'Verifies South African ID number validity, demographic details, and cross-references with Home Affairs database.',
    category: CheckCategory.IDENTITY,
    applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.STAFF_MEDICAL],
    estimatedCostZAR: 50,
    estimatedTurnaroundDays: 1,
    consentRequired: true,
    provider: 'MIE (Managed Integrity Evaluation)',
    isActive: true,
    requiresDocuments: ['ID Document Copy'],
    riskLevel: 'Low'
  },
  {
    id: 'passport_verify',
    name: 'Passport Verification',
    description: 'Verifies passport authenticity and immigration status for non-SA nationals.',
    category: CheckCategory.IDENTITY,
    applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.STAFF_MEDICAL],
    estimatedCostZAR: 120,
    estimatedTurnaroundDays: 2,
    consentRequired: true,
    provider: 'International Verification Services',
    isActive: true,
    requiresDocuments: ['Passport Copy', 'Visa/Permit Copy'],
    riskLevel: 'Medium'
  },
  {
    id: 'education_verify',
    name: 'Education Qualification Verification',
    description: 'Verifies claimed educational qualifications with issuing institutions.',
    category: CheckCategory.IDENTITY,
    applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.STAFF_MEDICAL],
    estimatedCostZAR: 200,
    estimatedTurnaroundDays: 3,
    consentRequired: true,
    provider: 'MIE Education Services',
    isActive: true,
    requiresDocuments: ['Qualification Certificates', 'Academic Transcripts'],
    riskLevel: 'Low'
  },
  {
    id: 'employment_verify',
    name: 'Employment History Verification',
    description: 'Verifies employment history, positions held, and reason for leaving previous employers.',
    category: CheckCategory.IDENTITY,
    applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.STAFF_MEDICAL],
    estimatedCostZAR: 300,
    estimatedTurnaroundDays: 5,
    consentRequired: true,
    provider: 'Reference Check Specialists',
    isActive: true,
    requiresDocuments: ['CV/Resume', 'Employment References'],
    riskLevel: 'Medium'
  },

  // CRIMINAL CHECKS
  {
    id: 'criminal_record_afis',
    name: 'Criminal Record Check (AFIS)',
    description: 'Comprehensive criminal background check through SAPS AFIS database.',
    category: CheckCategory.CRIMINAL,
    applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.STAFF_MEDICAL],
    estimatedCostZAR: 150,
    estimatedTurnaroundDays: 2,
    consentRequired: true,
    provider: 'MIE Criminal Services',
    isActive: true,
    requiresDocuments: ['Fingerprints', 'ID Document'],
    riskLevel: 'High'
  },
  {
    id: 'criminal_record_enhanced',
    name: 'Enhanced Criminal Record Check',
    description: 'Enhanced criminal check including magistrate court records and pending cases.',
    category: CheckCategory.CRIMINAL,
    applicableTo: [VettingEntityType.INDIVIDUAL],
    estimatedCostZAR: 300,
    estimatedTurnaroundDays: 5,
    consentRequired: true,
    provider: 'Advanced Criminal Intelligence',
    isActive: true,
    requiresDocuments: ['Fingerprints', 'ID Document', 'Address Proof'],
    riskLevel: 'High'
  },
  {
    id: 'watchlist_screening',
    name: 'Watchlist & Sanctions Screening',
    description: 'Screens against international watchlists, sanctions, and terrorist databases.',
    category: CheckCategory.CRIMINAL,
    applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.COMPANY],
    estimatedCostZAR: 100,
    estimatedTurnaroundDays: 1,
    consentRequired: true,
    provider: 'LexisNexis Risk Solutions',
    isActive: true,
    requiresDocuments: ['ID/Passport Copy'],
    riskLevel: 'High'
  },

  // FINANCIAL CHECKS
  {
    id: 'credit_check_ind',
    name: 'Individual Credit Report',
    description: 'Comprehensive credit history, score, and payment behavior analysis.',
    category: CheckCategory.FINANCIAL,
    applicableTo: [VettingEntityType.INDIVIDUAL],
    estimatedCostZAR: 120,
    estimatedTurnaroundDays: 1,
    consentRequired: true,
    provider: 'XDS (Experian)',
    isActive: true,
    requiresDocuments: ['ID Document', 'Proof of Income'],
    riskLevel: 'Medium'
  },
  {
    id: 'business_credit_report',
    name: 'Business Credit Report',
    description: 'Comprehensive business credit history, payment patterns, and financial stability assessment.',
    category: CheckCategory.FINANCIAL,
    applicableTo: [VettingEntityType.COMPANY],
    estimatedCostZAR: 300,
    estimatedTurnaroundDays: 1,
    consentRequired: false,
    provider: 'CPB (Credit Provider Bureau)',
    isActive: true,
    requiresDocuments: ['Company Registration', 'Financial Statements'],
    riskLevel: 'Medium'
  },
  {
    id: 'bank_acc_verify_ind',
    name: 'Individual Bank Account Verification',
    description: 'Verifies bank account ownership and standing.',
    category: CheckCategory.FINANCIAL,
    applicableTo: [VettingEntityType.INDIVIDUAL],
    estimatedCostZAR: 80,
    estimatedTurnaroundDays: 1,
    consentRequired: true,
    provider: 'MIE Banking Services',
    isActive: true,
    requiresDocuments: ['Bank Statement', 'ID Document'],
    riskLevel: 'Low'
  },
  {
    id: 'bank_acc_verify_biz',
    name: 'Business Bank Account Verification',
    description: 'Verifies business bank account legitimacy and standing.',
    category: CheckCategory.FINANCIAL,
    applicableTo: [VettingEntityType.COMPANY],
    estimatedCostZAR: 90,
    estimatedTurnaroundDays: 1,
    consentRequired: true,
    provider: 'MIE Banking Services',
    isActive: true,
    requiresDocuments: ['Bank Statement', 'Banking Resolution'],
    riskLevel: 'Low'
  },

  // COMPLIANCE CHECKS
  {
    id: 'pep_sanctions_ind',
    name: 'PEP & Sanctions Screening (Individual)',
    description: 'Checks against Politically Exposed Persons and global sanctions lists.',
    category: CheckCategory.COMPLIANCE,
    applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.STAFF_MEDICAL],
    estimatedCostZAR: 80,
    estimatedTurnaroundDays: 1,
    consentRequired: true,
    provider: 'LexisNexis WorldCompliance',
    isActive: true,
    requiresDocuments: ['ID/Passport Copy'],
    riskLevel: 'High'
  },
  {
    id: 'pep_sanctions_company',
    name: 'PEP & Sanctions Screening (Company)',
    description: 'Screens company and its directors against PEP and sanctions databases.',
    category: CheckCategory.COMPLIANCE,
    applicableTo: [VettingEntityType.COMPANY],
    estimatedCostZAR: 150,
    estimatedTurnaroundDays: 1,
    consentRequired: false,
    provider: 'LexisNexis WorldCompliance',
    isActive: true,
    requiresDocuments: ['Company Registration', 'Director Details'],
    riskLevel: 'High'
  },
  {
    id: 'vat_verify_sars',
    name: 'VAT Registration Verification (SARS)',
    description: 'Verifies VAT registration status and compliance with SARS.',
    category: CheckCategory.COMPLIANCE,
    applicableTo: [VettingEntityType.COMPANY],
    estimatedCostZAR: 70,
    estimatedTurnaroundDays: 1,
    consentRequired: false,
    provider: 'Internal/SARS Integration',
    isActive: true,
    requiresDocuments: ['VAT Certificate'],
    riskLevel: 'Low'
  },
  {
    id: 'tax_compliance_check',
    name: 'Tax Compliance Status Check',
    description: 'Verifies current tax compliance status with SARS for individuals and companies.',
    category: CheckCategory.COMPLIANCE,
    applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.COMPANY],
    estimatedCostZAR: 100,
    estimatedTurnaroundDays: 2,
    consentRequired: true,
    provider: 'SARS Compliance Services',
    isActive: true,
    requiresDocuments: ['Tax Number', 'Tax Clearance Certificate'],
    riskLevel: 'Medium'
  },

  // BUSINESS SPECIFIC CHECKS
  {
    id: 'cipc_company_check',
    name: 'CIPC Company Registration Check',
    description: 'Comprehensive CIPC verification including registration details, directors, and current status.',
    category: CheckCategory.BUSINESS_SPECIFIC,
    applicableTo: [VettingEntityType.COMPANY],
    estimatedCostZAR: 100,
    estimatedTurnaroundDays: 1,
    consentRequired: false,
    provider: 'MIE Business Services',
    isActive: true,
    requiresDocuments: ['Company Registration Certificate'],
    riskLevel: 'Low'
  },
  {
    id: 'bee_verification',
    name: 'BEE Certificate Verification',
    description: 'Verifies Broad-Based Black Economic Empowerment certificate authenticity and current status.',
    category: CheckCategory.BUSINESS_SPECIFIC,
    applicableTo: [VettingEntityType.COMPANY],
    estimatedCostZAR: 150,
    estimatedTurnaroundDays: 2,
    consentRequired: false,
    provider: 'BEE Verification Agency',
    isActive: true,
    requiresDocuments: ['BEE Certificate', 'BEE Scorecard'],
    riskLevel: 'Low'
  },
  {
    id: 'professional_licenses',
    name: 'Professional Licenses Verification',
    description: 'Verifies professional licenses and registrations with relevant professional bodies.',
    category: CheckCategory.BUSINESS_SPECIFIC,
    applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.COMPANY],
    estimatedCostZAR: 250,
    estimatedTurnaroundDays: 3,
    consentRequired: true,
    provider: 'Professional Bodies Verification',
    isActive: true,
    requiresDocuments: ['Professional License/Certificate'],
    riskLevel: 'Medium'
  },

  // OPERATIONAL CHECKS
  {
    id: 'physical_loc_verify',
    name: 'Physical Location Verification',
    description: 'On-site verification of business address and operational presence.',
    category: CheckCategory.OPERATIONAL,
    applicableTo: [VettingEntityType.COMPANY],
    estimatedCostZAR: 800,
    estimatedTurnaroundDays: 3,
    consentRequired: false,
    provider: 'Field Verification Agents',
    isActive: true,
    requiresDocuments: ['Address Proof', 'Lease Agreement'],
    riskLevel: 'Medium'
  },
  {
    id: 'operational_capacity',
    name: 'Operational Capacity Assessment',
    description: 'Assessment of company operational capacity, infrastructure, and capability.',
    category: CheckCategory.OPERATIONAL,
    applicableTo: [VettingEntityType.COMPANY],
    estimatedCostZAR: 1200,
    estimatedTurnaroundDays: 5,
    consentRequired: false,
    provider: 'Operational Assessment Specialists',
    isActive: true,
    requiresDocuments: ['Financial Statements', 'Operational Documents'],
    riskLevel: 'Medium'
  },

  // REPUTATIONAL CHECKS
  {
    id: 'media_search_ind',
    name: 'Media & Internet Search (Individual)',
    description: 'Comprehensive search of media mentions, social media, and internet presence.',
    category: CheckCategory.REPUTATIONAL,
    applicableTo: [VettingEntityType.INDIVIDUAL],
    estimatedCostZAR: 200,
    estimatedTurnaroundDays: 2,
    consentRequired: true,
    provider: 'Digital Intelligence Specialists',
    isActive: true,
    requiresDocuments: ['Social Media Profiles'],
    riskLevel: 'Low'
  },
  {
    id: 'media_search_company',
    name: 'Media & Internet Search (Company)',
    description: 'Comprehensive search of company media mentions, news articles, and online reputation.',
    category: CheckCategory.REPUTATIONAL,
    applicableTo: [VettingEntityType.COMPANY],
    estimatedCostZAR: 300,
    estimatedTurnaroundDays: 2,
    consentRequired: false,
    provider: 'Digital Intelligence Specialists',
    isActive: true,
    requiresDocuments: ['Company Website', 'Social Media Presence'],
    riskLevel: 'Low'
  },
  {
    id: 'lifestyle_audit_ind',
    name: 'Individual Lifestyle Audit (Basic)',
    description: 'Basic assessment of lifestyle indicators and spending patterns.',
    category: CheckCategory.REPUTATIONAL,
    applicableTo: [VettingEntityType.INDIVIDUAL],
    estimatedCostZAR: 500,
    estimatedTurnaroundDays: 5,
    consentRequired: true,
    provider: 'Lifestyle Audit Specialists',
    isActive: true,
    requiresDocuments: ['Asset Declaration', 'Income Proof'],
    riskLevel: 'Medium'
  },
  {
    id: 'litigation_search',
    name: 'Litigation & Legal History Search',
    description: 'Search for civil litigation history, judgments, and legal proceedings.',
    category: CheckCategory.REPUTATIONAL,
    applicableTo: [VettingEntityType.INDIVIDUAL, VettingEntityType.COMPANY],
    estimatedCostZAR: 180,
    estimatedTurnaroundDays: 3,
    consentRequired: true,
    provider: 'Legal Research Services',
    isActive: true,
    requiresDocuments: ['ID/Registration Details'],
    riskLevel: 'Medium'
  },

  // MEDICAL CHECKS (for Staff Medical)
  {
    id: 'med_fitness_cert',
    name: 'Certificate of Fitness (Mining)',
    description: 'Standard medical fitness assessment for mining work including vision, hearing, and physical capability.',
    category: CheckCategory.MEDICAL,
    applicableTo: [VettingEntityType.STAFF_MEDICAL],
    estimatedCostZAR: 600,
    estimatedTurnaroundDays: 2,
    consentRequired: true,
    provider: 'Occupational Health Clinic',
    isActive: true,
    requiresDocuments: ['Previous Medical Records'],
    riskLevel: 'Medium'
  },
  {
    id: 'chronic_med_history',
    name: 'Chronic Medication History Review',
    description: 'Review of declared and historical chronic medication usage relevant to job role.',
    category: CheckCategory.MEDICAL,
    applicableTo: [VettingEntityType.STAFF_MEDICAL],
    estimatedCostZAR: 250,
    estimatedTurnaroundDays: 3,
    consentRequired: true,
    provider: 'Specialized Medical Reviewer',
    isActive: true,
    requiresDocuments: ['Medical History', 'Prescription Records'],
    riskLevel: 'Low'
  },
  {
    id: 'drug_alcohol_screen',
    name: 'Drug & Alcohol Screening',
    description: 'Standard panel drug and alcohol test for workplace safety compliance.',
    category: CheckCategory.MEDICAL,
    applicableTo: [VettingEntityType.STAFF_MEDICAL],
    estimatedCostZAR: 350,
    estimatedTurnaroundDays: 1,
    consentRequired: true,
    provider: 'Pathology Laboratory',
    isActive: true,
    requiresDocuments: ['ID Document'],
    riskLevel: 'High'
  },
  {
    id: 'psychological_assessment',
    name: 'Psychological Fitness Assessment',
    description: 'Psychological evaluation for high-risk or leadership positions.',
    category: CheckCategory.MEDICAL,
    applicableTo: [VettingEntityType.STAFF_MEDICAL],
    estimatedCostZAR: 1200,
    estimatedTurnaroundDays: 5,
    consentRequired: true,
    provider: 'Occupational Psychologist',
    isActive: true,
    requiresDocuments: ['Medical History', 'Previous Assessments'],
    riskLevel: 'Medium'
  },
  {
    id: 'infectious_disease_screen',
    name: 'Infectious Disease Screening',
    description: 'Screening for tuberculosis, hepatitis, and other infectious diseases.',
    category: CheckCategory.MEDICAL,
    applicableTo: [VettingEntityType.STAFF_MEDICAL],
    estimatedCostZAR: 400,
    estimatedTurnaroundDays: 2,
    consentRequired: true,
    provider: 'Pathology Laboratory',
    isActive: true,
    requiresDocuments: ['Medical History'],
    riskLevel: 'Medium'
  }
];

// Pre-defined vetting packages for common scenarios
export const vettingPackages: VettingPackage[] = [
  {
    id: 'pkg_basic_supplier',
    name: 'Basic Supplier Onboarding',
    description: 'Essential verification checks for new suppliers and service providers.',
    applicableTo: [VettingEntityType.COMPANY],
    checkIds: ['cipc_company_check', 'vat_verify_sars', 'bank_acc_verify_biz', 'business_credit_report'],
    totalEstimatedCostZAR: 520,
    totalEstimatedTurnaroundDays: 2,
    isPopular: true,
    discountPercentage: 10
  },
  {
    id: 'pkg_comprehensive_supplier',
    name: 'Comprehensive Supplier Due Diligence',
    description: 'Thorough due diligence for high-value suppliers including operational and reputational checks.',
    applicableTo: [VettingEntityType.COMPANY],
    checkIds: [
      'cipc_company_check', 
      'vat_verify_sars', 
      'bank_acc_verify_biz', 
      'business_credit_report',
      'physical_loc_verify',
      'bee_verification',
      'media_search_company',
      'pep_sanctions_company'
    ],
    totalEstimatedCostZAR: 1350,
    totalEstimatedTurnaroundDays: 5,
    isPopular: false,
    discountPercentage: 15
  },
  {
    id: 'pkg_basic_individual',
    name: 'Basic Individual Verification',
    description: 'Standard verification package for individual contractors and consultants.',
    applicableTo: [VettingEntityType.INDIVIDUAL],
    checkIds: ['id_verify_sa', 'criminal_record_afis', 'credit_check_ind'],
    totalEstimatedCostZAR: 285,
    totalEstimatedTurnaroundDays: 2,
    isPopular: true,
    discountPercentage: 5
  },
  {
    id: 'pkg_high_risk_ind',
    name: 'High-Risk Individual Due Diligence',
    description: 'Comprehensive checks for individuals in sensitive or high-risk roles.',
    applicableTo: [VettingEntityType.INDIVIDUAL],
    checkIds: [
      'id_verify_sa', 
      'criminal_record_enhanced', 
      'credit_check_ind', 
      'pep_sanctions_ind', 
      'lifestyle_audit_ind',
      'education_verify',
      'employment_verify'
    ],
    totalEstimatedCostZAR: 1050,
    totalEstimatedTurnaroundDays: 7,
    isPopular: false,
    discountPercentage: 20
  },
  {
    id: 'pkg_director_verification',
    name: 'Director & Key Personnel Verification',
    description: 'Specialized package for company directors and key management personnel.',
    applicableTo: [VettingEntityType.INDIVIDUAL],
    checkIds: [
      'id_verify_sa',
      'criminal_record_enhanced',
      'credit_check_ind',
      'pep_sanctions_ind',
      'professional_licenses',
      'litigation_search',
      'media_search_ind'
    ],
    totalEstimatedCostZAR: 1080,
    totalEstimatedTurnaroundDays: 5,
    isPopular: true,
    discountPercentage: 12
  },
  {
    id: 'pkg_mining_medical_std',
    name: 'Standard Mining Staff Medical',
    description: 'Standard medical clearance package for mining industry workers.',
    applicableTo: [VettingEntityType.STAFF_MEDICAL],
    checkIds: ['id_verify_sa', 'med_fitness_cert', 'chronic_med_history', 'drug_alcohol_screen'],
    totalEstimatedCostZAR: 1080,
    totalEstimatedTurnaroundDays: 3,
    isPopular: true,
    discountPercentage: 8
  },
  {
    id: 'pkg_mining_medical_comprehensive',
    name: 'Comprehensive Mining Staff Medical',
    description: 'Extended medical package for high-risk mining positions including psychological assessment.',
    applicableTo: [VettingEntityType.STAFF_MEDICAL],
    checkIds: [
      'id_verify_sa', 
      'med_fitness_cert', 
      'chronic_med_history', 
      'drug_alcohol_screen',
      'psychological_assessment',
      'infectious_disease_screen',
      'criminal_record_afis'
    ],
    totalEstimatedCostZAR: 2730,
    totalEstimatedTurnaroundDays: 7,
    isPopular: false,
    discountPercentage: 15
  },
  {
    id: 'pkg_security_clearance',
    name: 'Security Clearance Package',
    description: 'Enhanced security clearance verification for sensitive positions.',
    applicableTo: [VettingEntityType.INDIVIDUAL],
    checkIds: [
      'id_verify_sa',
      'criminal_record_enhanced',
      'pep_sanctions_ind',
      'watchlist_screening',
      'lifestyle_audit_ind',
      'education_verify',
      'employment_verify',
      'media_search_ind'
    ],
    totalEstimatedCostZAR: 1430,
    totalEstimatedTurnaroundDays: 10,
    isPopular: false,
    discountPercentage: 18
  }
];

// Utility functions for data manipulation
export function getChecksByCategory(category: CheckCategory): VettingCheckDefinition[] {
  return allVettingChecks.filter(check => check.category === category);
}

export function getChecksByEntityType(entityType: VettingEntityType): VettingCheckDefinition[] {
  return allVettingChecks.filter(check => check.applicableTo.includes(entityType));
}

export function getPackagesByEntityType(entityType: VettingEntityType): VettingPackage[] {
  return vettingPackages.filter(pkg => pkg.applicableTo.includes(entityType));
}

export function getChecksInPackage(packageId: string): VettingCheckDefinition[] {
  const pkg = vettingPackages.find(p => p.id === packageId);
  if (!pkg) return [];
  
  return allVettingChecks.filter(check => pkg.checkIds.includes(check.id));
}

export function calculateTotalCost(checkIds: string[]): number {
  return allVettingChecks
    .filter(check => checkIds.includes(check.id))
    .reduce((total, check) => total + (check.estimatedCostZAR || 0), 0);
}

export function calculateMaxTurnaround(checkIds: string[]): number {
  const turnarounds = allVettingChecks
    .filter(check => checkIds.includes(check.id))
    .map(check => check.estimatedTurnaroundDays || 0);
  
  return Math.max(...turnarounds, 0);
}

// Simulated API function
export async function getVettingSetupData() {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    checks: allVettingChecks,
    packages: vettingPackages,
    categories: Object.values(CheckCategory),
    entityTypes: Object.values(VettingEntityType)
  };
}