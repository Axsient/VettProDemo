// Sample data for completed vetting reports
// Based on realistic South African vetting scenarios

import { 
  CompletedVettingReport, 
  RiskLevel, 
  ReportStatus 
} from '@/types/reports';
import { VettingEntityType } from '@/types/vetting';

export const sampleCompletedReports: CompletedVettingReport[] = [
  {
    reportId: 'VR202505-001',
    vettingCaseId: 'VC20250601-001', // QuantumLeap Solutions
    subjectName: 'QuantumLeap Solutions (Pty) Ltd',
    subjectId: '2022/123456/07',
    entityType: VettingEntityType.COMPANY,
    completionDate: '2025-05-28T16:00:00Z',
    reportStatus: ReportStatus.COMPLETE,
    overallRiskLevel: RiskLevel.HIGH,
    overallRiskScore: 82,
    summary: 'High financial risk identified due to multiple credit defaults and adverse findings in director checks. CIPC status is active, but significant concerns regarding financial stability warrant caution. Recommend enhanced monitoring and reduced credit limits.',
    reportGeneratedBy: 'System (Automated)',
    pdfLink: '/sample-data/reports/VR202505-001.pdf',
    checkResults: [
      { checkName: 'CIPC Company Registration Check', status: 'Clear', summary: 'Company is active and in good standing.' },
      { checkName: 'Business Credit Report', status: 'Adverse Finding', summary: 'Report indicates 3 payment defaults in the last 6 months totaling R125,000.' },
      { checkName: 'VAT Registration Verification (SARS)', status: 'Clear', summary: 'VAT number is valid and compliant.' },
      { checkName: 'Director PEP & Sanctions Screening', status: 'Adverse Finding', summary: 'One director flagged on a PEP watchlist (low-tier, domestic political exposure).' },
      { checkName: 'UIF Registration Check', status: 'Clear', summary: 'UIF registration is current and compliant.' },
    ]
  },
  {
    reportId: 'VR202505-002',
    vettingCaseId: 'VC20250602-001', // Sarah Connor
    subjectName: 'Sarah Connor',
    subjectId: '9003036000085',
    entityType: VettingEntityType.STAFF_MEDICAL,
    completionDate: '2025-06-01T11:00:00Z',
    reportStatus: ReportStatus.COMPLETE,
    overallRiskLevel: RiskLevel.MEDIUM,
    overallRiskScore: 55,
    summary: 'Subject is medically fit for mining work per Certificate of Fitness. However, an adverse finding was noted in the drug & alcohol screening which requires follow-up per company policy. Declared chronic conditions are noted as managed and do not pose operational risk.',
    reportGeneratedBy: 'System (Automated)',
    pdfLink: '/sample-data/reports/VR202505-002.pdf',
    checkResults: [
      { checkName: 'Certificate of Fitness (Mining)', status: 'Clear', summary: 'Subject deemed medically fit for duty in underground mining operations.' },
      { checkName: 'Chronic Medication History Review', status: 'Neutral / Info', summary: 'Declared hypertension is managed with ACE inhibitors. No operational concerns.' },
      { checkName: 'Drug & Alcohol Screening', status: 'Adverse Finding', summary: 'Positive screening for cannabis metabolites. Requires HR intervention as per company policy.' },
      { checkName: 'Vision and Hearing Assessment', status: 'Clear', summary: 'Visual acuity and hearing within acceptable ranges for mining operations.' },
    ]
  },
  {
    reportId: 'VR202505-003',
    vettingCaseId: 'VC_INCOMPLETE_001', // A case where consent was declined
    subjectName: 'Declined Consent Individual',
    subjectId: '8808080000088',
    entityType: VettingEntityType.INDIVIDUAL,
    completionDate: '2025-05-25T10:00:00Z',
    reportStatus: ReportStatus.INCOMPLETE_CONSENT_DECLINED,
    overallRiskLevel: RiskLevel.CRITICAL, // Incomplete due to refusal is a critical risk
    overallRiskScore: 99,
    summary: 'Vetting process terminated. Subject actively declined to provide consent for mandatory checks after multiple attempts. This represents a critical risk and results in a "No Go" recommendation for any engagement.',
    reportGeneratedBy: 'System (Automated)',
    pdfLink: '/sample-data/reports/VR202505-003.pdf',
    checkResults: [
      { checkName: 'SA ID Verification', status: 'Not Performed', summary: 'Consent not provided despite multiple requests.' },
      { checkName: 'Criminal Record Check (AFIS)', status: 'Not Performed', summary: 'Consent declined by subject.' },
      { checkName: 'Credit Bureau Check', status: 'Not Performed', summary: 'Cannot proceed without subject consent.' },
    ]
  },
  {
    reportId: 'VR202504-005',
    vettingCaseId: 'VC_CLEAN_001',
    subjectName: 'Stellar Logistics SA',
    subjectId: '2018/112233/07',
    entityType: VettingEntityType.COMPANY,
    completionDate: '2025-04-15T12:00:00Z',
    reportStatus: ReportStatus.COMPLETE,
    overallRiskLevel: RiskLevel.LOW,
    overallRiskScore: 18,
    summary: 'All checks completed with clear findings. Supplier demonstrates low financial and compliance risk with strong operational history. Company has been operational for 6+ years with clean compliance record. Recommended for onboarding without restrictions.',
    reportGeneratedBy: 'System (Automated)',
    pdfLink: '/sample-data/reports/VR202504-005.pdf',
    checkResults: [
      { checkName: 'CIPC Company Registration Check', status: 'Clear', summary: 'Company registration current and directors in good standing.' },
      { checkName: 'Business Credit Report', status: 'Clear', summary: 'No adverse findings. Excellent payment history with suppliers.' },
      { checkName: 'VAT Registration Verification (SARS)', status: 'Clear', summary: 'VAT compliance verified. No outstanding amounts.' },
      { checkName: 'BEE Certificate Verification', status: 'Clear', summary: 'Valid Level 2 BEE certificate verified with SANAS.' },
      { checkName: 'Professional Indemnity Insurance', status: 'Clear', summary: 'R5M coverage in place, policy current until 2026.' },
    ]
  },
  {
    reportId: 'VR202505-004',
    vettingCaseId: 'VC20250603-001',
    subjectName: 'Thabo Mthembu',
    subjectId: '8712155678901',
    entityType: VettingEntityType.INDIVIDUAL,
    completionDate: '2025-05-30T14:30:00Z',
    reportStatus: ReportStatus.COMPLETE,
    overallRiskLevel: RiskLevel.LOW,
    overallRiskScore: 25,
    summary: 'Individual cleared for engagement with minimal risk indicators. All identity verification checks passed. Clean criminal record with no adverse financial history. Subject has previous mining experience and valid safety certifications.',
    reportGeneratedBy: 'System (Automated)',
    pdfLink: '/sample-data/reports/VR202505-004.pdf',
    checkResults: [
      { checkName: 'SA ID Verification', status: 'Clear', summary: 'ID verified as authentic. Demographic data matches provided information.' },
      { checkName: 'Criminal Record Check (AFIS)', status: 'Clear', summary: 'No criminal record found on SAPS database.' },
      { checkName: 'Credit Bureau Check', status: 'Clear', summary: 'Good credit standing with no defaults or judgments.' },
      { checkName: 'Qualification Verification', status: 'Clear', summary: 'Mining safety certificates verified with relevant institutions.' },
      { checkName: 'Previous Employment Verification', status: 'Clear', summary: 'Employment history confirmed with previous mining companies.' },
    ]
  },
  {
    reportId: 'VR202505-006',
    vettingCaseId: 'VC20250604-001',
    subjectName: 'ProTech Engineering (Pty) Ltd',
    subjectId: '2020/987654/07',
    entityType: VettingEntityType.COMPANY,
    completionDate: '2025-05-29T09:15:00Z',
    reportStatus: ReportStatus.INCOMPLETE_DATA_UNAVAILABLE,
    overallRiskLevel: RiskLevel.HIGH,
    overallRiskScore: 75,
    summary: 'Vetting incomplete due to unavailable data from third-party providers. CIPC systems were offline during verification period, and credit bureau data was not accessible. Insufficient information to make informed decision. Recommend re-vetting once data sources are available.',
    reportGeneratedBy: 'System (Automated)',
    pdfLink: '/sample-data/reports/VR202505-006.pdf',
    checkResults: [
      { checkName: 'CIPC Company Registration Check', status: 'Not Performed', summary: 'CIPC systems offline during verification period.' },
      { checkName: 'Business Credit Report', status: 'Not Performed', summary: 'Credit bureau data unavailable due to system maintenance.' },
      { checkName: 'VAT Registration Verification (SARS)', status: 'Clear', summary: 'VAT number verified through alternative SARS portal.' },
      { checkName: 'Director Background Checks', status: 'Not Performed', summary: 'Cannot verify without CIPC director information.' },
    ]
  },
  {
    reportId: 'VR202505-007',
    vettingCaseId: 'VC20250605-001',
    subjectName: 'Maria Santos',
    subjectId: '9105234567890',
    entityType: VettingEntityType.STAFF_MEDICAL,
    completionDate: '2025-05-31T16:45:00Z',
    reportStatus: ReportStatus.COMPLETE,
    overallRiskLevel: RiskLevel.MEDIUM,
    overallRiskScore: 45,
    summary: 'Medical vetting reveals controlled diabetes requiring ongoing monitoring. Subject is fit for limited mining duties with restrictions on underground work exceeding 8 hours. Regular glucose monitoring required. Overall low operational risk with proper management protocols in place.',
    reportGeneratedBy: 'Dr. J. Smith (Medical Officer)',
    pdfLink: '/sample-data/reports/VR202505-007.pdf',
    checkResults: [
      { checkName: 'Certificate of Fitness (Mining)', status: 'Neutral / Info', summary: 'Fit for duty with restrictions. Diabetes management required.' },
      { checkName: 'Blood Glucose Monitoring', status: 'Neutral / Info', summary: 'Type 2 diabetes controlled with metformin. HbA1c within acceptable range.' },
      { checkName: 'Cardiovascular Assessment', status: 'Clear', summary: 'No cardiovascular complications from diabetes detected.' },
      { checkName: 'Drug & Alcohol Screening', status: 'Clear', summary: 'No substances detected. Clean screening result.' },
    ]
  },
  {
    reportId: 'VR202504-008',
    vettingCaseId: 'VC_CRITICAL_001',
    subjectName: 'Suspicious Consulting CC',
    subjectId: '2023/555666/23',
    entityType: VettingEntityType.COMPANY,
    completionDate: '2025-04-20T11:30:00Z',
    reportStatus: ReportStatus.COMPLETE,
    overallRiskLevel: RiskLevel.CRITICAL,
    overallRiskScore: 95,
    summary: 'CRITICAL RISK: Multiple red flags identified. Company directors have adverse criminal history including fraud convictions. Significant financial irregularities detected. Company registration shows suspicious address changes and director appointments. Strong recommendation to AVOID any business engagement.',
    reportGeneratedBy: 'Senior Risk Analyst - Manual Review',
    pdfLink: '/sample-data/reports/VR202504-008.pdf',
    checkResults: [
      { checkName: 'CIPC Company Registration Check', status: 'Adverse Finding', summary: 'Multiple address changes in 6 months. Frequent director appointments and resignations.' },
      { checkName: 'Business Credit Report', status: 'Adverse Finding', summary: 'R2.3M in outstanding judgments. Multiple accounts in default.' },
      { checkName: 'Director Criminal Record Check', status: 'Adverse Finding', summary: 'Primary director has fraud conviction (2019) and theft conviction (2021).' },
      { checkName: 'Director PEP & Sanctions Screening', status: 'Adverse Finding', summary: 'Director appears on financial crimes watchlist.' },
      { checkName: 'SARS Tax Compliance', status: 'Adverse Finding', summary: 'Non-compliant tax status. Outstanding tax debt of R890,000.' },
    ]
  },
  {
    reportId: 'VR202505-009',
    vettingCaseId: 'VC20250606-001',
    subjectName: 'Green Energy Solutions',
    subjectId: '2019/246810/07',
    entityType: VettingEntityType.COMPANY,
    completionDate: '2025-06-02T13:20:00Z',
    reportStatus: ReportStatus.COMPLETE,
    overallRiskLevel: RiskLevel.INFO_ONLY,
    overallRiskScore: 5,
    summary: 'Information-only vetting completed for new supplier relationship. All checks returned clear with no adverse findings. Company demonstrates strong ESG credentials and excellent industry reputation. This was a compliance verification rather than risk assessment.',
    reportGeneratedBy: 'System (Automated)',
    pdfLink: '/sample-data/reports/VR202505-009.pdf',
    checkResults: [
      { checkName: 'CIPC Company Registration Check', status: 'Clear', summary: 'Company in excellent standing. Consistent management team.' },
      { checkName: 'Business Credit Report', status: 'Clear', summary: 'Excellent credit rating. Timely payments to all suppliers.' },
      { checkName: 'ESG Compliance Verification', status: 'Clear', summary: 'ISO 14001 certified. Strong environmental management practices.' },
      { checkName: 'Industry Reputation Check', status: 'Clear', summary: 'Positive references from 5 major industry clients.' },
    ]
  },
  {
    reportId: 'VR202505-010',
    vettingCaseId: 'VC20250607-001',
    subjectName: 'John Anderson',
    subjectId: '8309145678902',
    entityType: VettingEntityType.INDIVIDUAL,
    completionDate: '2025-06-03T10:00:00Z',
    reportStatus: ReportStatus.COMPLETE,
    overallRiskLevel: RiskLevel.HIGH,
    overallRiskScore: 78,
    summary: 'Individual presents elevated risk due to recent criminal charges (currently under investigation) and significant debt burden. While no convictions recorded, ongoing legal proceedings for assault charges represent reputational and operational risk. Financial stress indicators present.',
    reportGeneratedBy: 'System (Automated)',
    pdfLink: '/sample-data/reports/VR202505-010.pdf',
    checkResults: [
      { checkName: 'SA ID Verification', status: 'Clear', summary: 'ID verified as authentic and current.' },
      { checkName: 'Criminal Record Check (AFIS)', status: 'Adverse Finding', summary: 'No convictions, but current charges for assault (case pending in Johannesburg Magistrate Court).' },
      { checkName: 'Credit Bureau Check', status: 'Adverse Finding', summary: 'High debt-to-income ratio. R350,000 in unsecured debt. Payment history shows irregular patterns.' },
      { checkName: 'Reference Verification', status: 'Neutral / Info', summary: 'Mixed references. Some concerns about workplace disputes in previous employment.' },
    ]
  }
];

// Function to simulate API delay for fetching completed reports
export async function getCompletedReports(): Promise<CompletedVettingReport[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return sampleCompletedReports;
}

// Function to get a specific report by ID
export async function getCompletedReportById(reportId: string): Promise<CompletedVettingReport | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return sampleCompletedReports.find(report => report.reportId === reportId) || null;
}

// Function to filter reports based on criteria
export function filterCompletedReports(
  reports: CompletedVettingReport[],
  filters: {
    search?: string;
    riskLevel?: RiskLevel | undefined;
    entityType?: VettingEntityType | undefined;
    reportStatus?: ReportStatus | undefined;
    dateRange?: { start?: Date; end?: Date };
  }
): CompletedVettingReport[] {
  return reports.filter(report => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchMatch = 
        report.reportId.toLowerCase().includes(searchTerm) ||
        report.subjectName.toLowerCase().includes(searchTerm) ||
        report.subjectId.toLowerCase().includes(searchTerm) ||
        report.vettingCaseId.toLowerCase().includes(searchTerm);
      
      if (!searchMatch) return false;
    }

    // Risk level filter
    if (filters.riskLevel) {
      if (report.overallRiskLevel !== filters.riskLevel) return false;
    }

    // Entity type filter
    if (filters.entityType) {
      if (report.entityType !== filters.entityType) return false;
    }

    // Report status filter
    if (filters.reportStatus) {
      if (report.reportStatus !== filters.reportStatus) return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const reportDate = new Date(report.completionDate);
      if (filters.dateRange.start && reportDate < filters.dateRange.start) return false;
      if (filters.dateRange.end && reportDate > filters.dateRange.end) return false;
    }

    return true;
  });
} 