import { Supplier, VettingHistoryItem, SupplierDocument } from '@/types/supplier';

// --- Suppliers ---
export const getSuppliers = (): Supplier[] => [
  { id: 'sup-001', name: 'Westonaria Mining Supplies', registrationNumber: '2010/012345/07', contactPerson: 'John Smith', contactEmail: 'john@wms.co.za', status: 'Active', overallRiskScore: 2.5, lastVettedDate: '2024-03-15', source: 'Coupa', beeStatus: 'Level 2', industry: 'Mining Equipment' },
  { id: 'sup-002', name: 'Carletonville Catering', registrationNumber: '2015/056789/07', contactPerson: 'Jane Doe', contactEmail: 'jane@ccatering.co.za', status: 'Active', overallRiskScore: 4.0, lastVettedDate: '2024-01-20', source: 'Coupa', beeStatus: 'Level 1', industry: 'Catering & Hospitality' },
  { id: 'sup-003', name: 'Randfontein Logistics', registrationNumber: '2018/098765/07', contactPerson: 'Peter Jones', contactEmail: 'peter@rlogistics.co.za', status: 'High-Risk', overallRiskScore: 8.7, lastVettedDate: '2024-05-01', source: 'SAP', beeStatus: 'Non-Compliant', industry: 'Logistics' },
  { id: 'sup-004', name: 'Libanon Engineering', registrationNumber: '2022/112233/07', contactPerson: 'Susan Williams', contactEmail: 'susan@le.co.za', status: 'Onboarding', overallRiskScore: 0, lastVettedDate: 'N/A', source: 'VETTPRO Internal', beeStatus: 'Pending', industry: 'Engineering' },
  { id: 'sup-005', name: 'Fochville IT Solutions', registrationNumber: '2019/445566/07', contactPerson: 'Mike Brown', contactEmail: 'mike@fit.co.za', status: 'Archived', overallRiskScore: 1.5, lastVettedDate: '2022-11-30', source: 'Coupa', beeStatus: 'Level 4', industry: 'IT Services' },
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
  series: [{ name: 'Overall Risk Score', data: [8.5, 8.8, 8.7, 8.6, 8.9, 8.7] }],
  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
});
export const getRiskBreakdownData = () => ({
  series: [{ name: 'Risk Breakdown', data: [9, 5, 8, 4, 7] }],
  categories: ['Financial', 'Compliance', 'Reputational', 'Operational', 'Location'],
}); 