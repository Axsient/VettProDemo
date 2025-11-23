import { Supplier, VettingHistoryItem, SupplierDocument } from '@/types/supplier';

export type SupplierReportData = {
  metadata: {
    caseReference: string;
    jurisdiction: string;
    sector: string;
    engagementContext: string;
    contractValue: string;
    reportDate: string;
    decisionOwner: string;
    dataCurrency: string;
  };
  scoring: {
    overall: number;
    labels: {
      overall: string;
      financial: number;
      compliance: number;
      operational: number;
      reputational: number;
    };
    confidence: 'Low' | 'Medium' | 'High';
    notes: string;
  };
  alerts: Array<{
    title: string;
    severity: 'Critical' | 'High' | 'Medium' | 'Low';
    description: string;
    evidence: string;
    mitigation: string;
  }>;
  positives: string[];
  mitigations: string[];
  recommendation: string;
};

// --- Suppliers ---
export const getSuppliers = (): Supplier[] => [
  { id: 'sup-001', name: 'Westonaria Mining Supplies', registrationNumber: '2010/012345/07', contactPerson: 'John Smith', contactEmail: 'john@wms.co.za', status: 'Active', overallRiskScore: 25, lastVettedDate: '2024-03-15', source: 'Coupa', beeStatus: 'Level 2', industry: 'Mining Equipment' },
  { id: 'sup-002', name: 'Carletonville Catering', registrationNumber: '2015/056789/07', contactPerson: 'Jane Doe', contactEmail: 'jane@ccatering.co.za', status: 'Active', overallRiskScore: 40, lastVettedDate: '2024-01-20', source: 'Coupa', beeStatus: 'Level 1', industry: 'Catering & Hospitality' },
  { id: 'sup-003', name: 'Randfontein Logistics', registrationNumber: '2018/098765/07', contactPerson: 'Peter Jones', contactEmail: 'peter@rlogistics.co.za', status: 'High-Risk', overallRiskScore: 87, lastVettedDate: '2024-05-01', source: 'SAP', beeStatus: 'Non-Compliant', industry: 'Logistics' },
  { id: 'sup-004', name: 'Libanon Engineering', registrationNumber: '2022/112233/07', contactPerson: 'Susan Williams', contactEmail: 'susan@le.co.za', status: 'Onboarding', overallRiskScore: 0, lastVettedDate: 'N/A', source: 'VETTPRO Internal', beeStatus: 'Pending', industry: 'Engineering' },
  { id: 'sup-005', name: 'Fochville IT Solutions', registrationNumber: '2019/445566/07', contactPerson: 'Mike Brown', contactEmail: 'mike@fit.co.za', status: 'Archived', overallRiskScore: 15, lastVettedDate: '2022-11-30', source: 'Coupa', beeStatus: 'Level 4', industry: 'IT Services' },
];

// --- Vetting History (Example for one supplier) ---
export const getVettingHistoryForSupplier = (supplierId: string): VettingHistoryItem[] => {
  if (supplierId === 'sup-003') { // High-Risk Supplier
    return [
      { id: 'vh-1', checkName: 'CIPC Commercial Report', status: 'Completed', dateCompleted: '2024-05-01', riskLevel: 'High', reportUrl: '/reports/report-001.pdf' },
      { id: 'vh-2', checkName: 'Director Credit Check', status: 'Completed', dateCompleted: '2024-05-01', riskLevel: 'High', reportUrl: '/reports/report-002.pdf' },
      { id: 'vh-3', checkName: 'Location Verification', status: 'Failed', dateCompleted: '2024-04-28', riskLevel: 'High', reportUrl: '/reports/report-003.pdf' },
      { id: 'vh-4', checkName: 'Annual COID Check', status: 'Pending', dateCompleted: 'N/A', riskLevel: 'None', reportUrl: '#' },
    ];
  }
  return [
      { id: 'vh-5', checkName: 'CIPC Commercial Report', status: 'Completed', dateCompleted: '2024-03-15', riskLevel: 'Low', reportUrl: '/reports/report-004.pdf' },
      { id: 'vh-6', checkName: 'Director Sanctions Screening', status: 'Completed', dateCompleted: '2024-03-15', riskLevel: 'Low', reportUrl: '/reports/report-005.pdf' },
  ];
};

// --- Documents (Example for one supplier) ---
export const getDocumentsForSupplier = (supplierId: string): SupplierDocument[] => {
  // Return documents specific to the supplier ID
  const baseDocuments = [
    { id: 'doc-1', name: 'Master Service Agreement 2024', category: 'Contract' as const, uploadDate: '2024-01-10', fileUrl: '/docs/msa.pdf' },
    { id: 'doc-2', name: 'BEE Certificate 2024', category: 'Certificate' as const, uploadDate: '2024-02-05', fileUrl: '/docs/bee.pdf' },
    { id: 'doc-3', name: 'Tax Clearance Certificate', category: 'Compliance' as const, uploadDate: '2024-02-05', fileUrl: '/docs/tax.pdf' },
  ];
  
  // Add supplier-specific documents for high-risk suppliers
  if (supplierId === 'sup-003') {
    baseDocuments.push(
      { id: 'doc-4', name: 'Risk Mitigation Plan', category: 'Compliance' as const, uploadDate: '2024-05-02', fileUrl: '/docs/risk-plan.pdf' }
    );
  }
  
  return baseDocuments;
};

// --- Risk Data for Charts ---
export const getRiskTrendData = () => ({
  series: [{ name: 'Overall Risk Score', data: [85, 88, 87, 86, 89, 87] }],
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
});
export const getRiskBreakdownData = () => ({
  series: [{ name: 'Risk Breakdown', data: [90, 50, 80, 40, 70] }],
  categories: ['Financial', 'Compliance', 'Reputational', 'Operational', 'Location'],
}); 

// --- Intelligence report data (sample AI insights per supplier) ---
export const getSupplierReportData = (supplierId: string): SupplierReportData => {
  const baseDate = '15 July 2025';
  const common = {
    recommendation: 'Conditional proceed with mitigations; escalate to Supply Risk Committee for approval.',
  };

  if (supplierId === 'sup-003') {
    return {
      metadata: {
        caseReference: 'VET-2024-009003',
        jurisdiction: 'ZA',
        sector: 'Logistics',
        engagementContext: 'Critical route contractor renewal',
        contractValue: 'R120m / 12 months',
        reportDate: baseDate,
        decisionOwner: 'Supply Risk Committee',
        dataCurrency: 'Checks completed 10–15 July 2025',
      },
      scoring: {
        overall: 87,
        labels: {
          overall: 87,
          financial: 92,
          compliance: 84,
          operational: 35,
          reputational: 90,
        },
        confidence: 'Medium',
        notes: 'Limited private financials; one recent third-party judgment.',
      },
      alerts: [
        {
          title: 'Director conflict across strategic suppliers',
          severity: 'Critical',
          description: 'Shared directorship with Limpopo Logistix (flagged High risk) creates concentration and conflict risk.',
          evidence: 'CIPC directorships (13 Jul 2025), Ref: CIPC-13213A.',
          mitigation: 'Director recusal + activate contingency supplier.',
        },
        {
          title: 'Adverse financial judgment (undisclosed)',
          severity: 'Critical',
          description: 'Judgment of R1,250,000 filed 02 Jun 2025; not self-disclosed.',
          evidence: 'Docket 14589/2025, Gauteng High Court (14 Jul 2025).',
          mitigation: 'Escrow first 3 months; require audited FS and settlement letter.',
        },
        {
          title: 'BEE certificate near expiry',
          severity: 'High',
          description: 'Certificate expires 01 Sep 2025; no renewal in flight.',
          evidence: 'Certificate BEE-22888 (MIE check 13 Jul 2025).',
          mitigation: 'Renewal proof before PO release.',
        },
      ],
      positives: [
        'Bank account verified (12 Jul)',
        'COID compliant (11 Jul)',
        'CIPC active/good standing (13 Jul)',
      ],
      mitigations: [
        'Escrow first 3 months of spend',
        'Director recusal letter',
        'BEE renewal proof',
        'Audited FY2024 FS + YTD management accounts',
        'Secondary supplier stand-up within 30 days',
      ],
      recommendation: common.recommendation,
    };
  }

  if (supplierId === 'sup-002') {
    return {
      metadata: {
        caseReference: 'VET-2024-002002',
        jurisdiction: 'ZA',
        sector: 'Catering & Hospitality',
        engagementContext: 'Catering for shafts 5–8',
        contractValue: 'R18m / 12 months',
        reportDate: baseDate,
        decisionOwner: 'Supply Risk Committee',
        dataCurrency: 'Checks completed 10–15 July 2025',
      },
      scoring: {
        overall: 40,
        labels: { overall: 40, financial: 42, compliance: 38, operational: 30, reputational: 35 },
        confidence: 'High',
        notes: 'Recent financials and certifications available; no adverse findings.',
      },
      alerts: [
        {
          title: 'Expiring food safety audit',
          severity: 'Medium',
          description: 'External food safety audit expires in 30 days; renewal not booked.',
          evidence: 'Audit FS-9921 (valid to 15 Aug 2025).',
          mitigation: 'Schedule and provide renewal booking confirmation within 7 days.',
        },
      ],
      positives: [
        'BEE Level 1; certificates current',
        'No adverse director findings',
        'On-time delivery metrics > 95% last 6 months',
      ],
      mitigations: ['Confirm audit renewal', 'Maintain temperature-control logs weekly'],
      recommendation: 'Proceed with standard monitoring; ensure audit renewal proof is provided.',
    };
  }

  // Default / low-risk template (sup-001, sup-004, sup-005)
  return {
    metadata: {
      caseReference: `VET-2024-${supplierId.toUpperCase()}`,
      jurisdiction: 'ZA',
      sector: 'Mining Supply',
      engagementContext: 'Standard annual renewal',
      contractValue: 'R10m / 12 months',
      reportDate: baseDate,
      decisionOwner: 'Supply Risk Committee',
      dataCurrency: 'Checks completed 10–15 July 2025',
    },
    scoring: {
      overall: 25,
      labels: { overall: 25, financial: 20, compliance: 22, operational: 18, reputational: 16 },
      confidence: 'High',
      notes: 'Recent financials and compliance checks available; no adverse findings.',
    },
    alerts: [
      {
        title: 'Insurance renewal pending',
        severity: 'Low',
        description: 'COID renewal due in 45 days.',
        evidence: 'COID status check (11 Jul 2025).',
        mitigation: 'Provide renewal confirmation before expiry.',
      },
    ],
    positives: [
      'Bank account verified',
      'COID compliant',
      'No adverse director findings',
    ],
    mitigations: ['Confirm COID renewal', 'Maintain quarterly compliance attestations'],
    recommendation: 'Proceed; routine monitoring only.',
  };
};
