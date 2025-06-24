import { ChartData, SeriesData } from '../types';

// Sample line chart data - Monthly revenue
export const monthlyRevenueData: ChartData[] = [
  { x: 'Jan', y: 45000 },
  { x: 'Feb', y: 52000 },
  { x: 'Mar', y: 48000 },
  { x: 'Apr', y: 61000 },
  { x: 'May', y: 55000 },
  { x: 'Jun', y: 67000 },
  { x: 'Jul', y: 70000 },
  { x: 'Aug', y: 65000 },
  { x: 'Sep', y: 72000 },
  { x: 'Oct', y: 68000 },
  { x: 'Nov', y: 74000 },
  { x: 'Dec', y: 78000 },
];

// Sample multi-series data - Revenue vs Expenses
export const revenueVsExpensesData: SeriesData[] = [
  {
    name: 'Revenue',
    data: [
      { x: 'Q1', y: 145000 },
      { x: 'Q2', y: 183000 },
      { x: 'Q3', y: 207000 },
      { x: 'Q4', y: 220000 },
    ],
  },
  {
    name: 'Expenses',
    data: [
      { x: 'Q1', y: 98000 },
      { x: 'Q2', y: 125000 },
      { x: 'Q3', y: 142000 },
      { x: 'Q4', y: 155000 },
    ],
  },
];

// Sample pie chart data - Vetting service breakdown
export const vettingServicesData: ChartData[] = [
  { x: 'ID Verification', y: 35 },
  { x: 'Criminal Background', y: 28 },
  { x: 'Employment History', y: 18 },
  { x: 'Reference Checks', y: 12 },
  { x: 'Credit Checks', y: 7 },
];

// Sample time series data - Daily applications
export const dailyApplicationsData: ChartData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  return {
    x: date.getTime(),
    y: Math.floor(Math.random() * 50) + 20, // Random between 20-70
  };
});

// Sample regional data - Applications by province
export const provincialData: ChartData[] = [
  { x: 'Gauteng', y: 2500 },
  { x: 'Western Cape', y: 1800 },
  { x: 'KwaZulu-Natal', y: 1200 },
  { x: 'Eastern Cape', y: 800 },
  { x: 'Limpopo', y: 600 },
  { x: 'Mpumalanga', y: 550 },
  { x: 'North West', y: 450 },
  { x: 'Free State', y: 400 },
  { x: 'Northern Cape', y: 200 },
];

// Sample status breakdown data
export const applicationStatusData: ChartData[] = [
  { x: 'Completed', y: 65 },
  { x: 'In Progress', y: 20 },
  { x: 'Pending', y: 10 },
  { x: 'Rejected', y: 5 },
];

// Sample trend data - Multiple metrics over time
export const performanceMetricsData: SeriesData[] = [
  {
    name: 'Applications',
    data: [
      { x: 'Week 1', y: 120 },
      { x: 'Week 2', y: 135 },
      { x: 'Week 3', y: 145 },
      { x: 'Week 4', y: 162 },
    ],
  },
  {
    name: 'Completions',
    data: [
      { x: 'Week 1', y: 95 },
      { x: 'Week 2', y: 108 },
      { x: 'Week 3', y: 125 },
      { x: 'Week 4', y: 140 },
    ],
  },
  {
    name: 'Success Rate %',
    data: [
      { x: 'Week 1', y: 79 },
      { x: 'Week 2', y: 80 },
      { x: 'Week 3', y: 86 },
      { x: 'Week 4', y: 86 },
    ],
  },
];

// =====================================
// VETTING-SPECIFIC LINE CHART DATA
// =====================================

// 1. SINGLE-AXIS LINE CHARTS

// Supplier Risk Score Trends (1-10 scale, lower is better)
export const supplierRiskTrendsData: ChartData[] = [
  { x: '2024-01', y: 6.8 },
  { x: '2024-02', y: 6.2 },
  { x: '2024-03', y: 5.9 },
  { x: '2024-04', y: 5.4 },
  { x: '2024-05', y: 5.1 },
  { x: '2024-06', y: 4.8 },
  { x: '2024-07', y: 4.5 },
  { x: '2024-08', y: 4.2 },
  { x: '2024-09', y: 4.0 },
  { x: '2024-10', y: 3.8 },
  { x: '2024-11', y: 3.6 },
  { x: '2024-12', y: 3.4 },
];

// Daily Verification Processing Volume
export const verificationVolumeData: ChartData[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  // Simulate weekly patterns (lower on weekends)
  const dayOfWeek = date.getDay();
  const baseVolume = dayOfWeek === 0 || dayOfWeek === 6 ? 15 : 45; // Lower on weekends
  const variation = Math.floor(Math.random() * 20) - 10; // ±10 variation
  return {
    x: date.getTime(),
    y: Math.max(0, baseVolume + variation),
  };
});

// Monthly Vetting Costs (ZAR)
export const vettingCostsData: ChartData[] = [
  { x: 'Jan 2024', y: 125000 },
  { x: 'Feb 2024', y: 142000 },
  { x: 'Mar 2024', y: 138000 },
  { x: 'Apr 2024', y: 156000 },
  { x: 'May 2024', y: 168000 },
  { x: 'Jun 2024', y: 172000 },
  { x: 'Jul 2024', y: 165000 },
  { x: 'Aug 2024', y: 178000 },
  { x: 'Sep 2024', y: 185000 },
  { x: 'Oct 2024', y: 192000 },
  { x: 'Nov 2024', y: 188000 },
  { x: 'Dec 2024', y: 195000 },
];

// SLA Compliance Percentage Over Time
export const slaComplianceData: ChartData[] = [
  { x: 'Week 1', y: 87.5 },
  { x: 'Week 2', y: 89.2 },
  { x: 'Week 3', y: 91.0 },
  { x: 'Week 4', y: 88.7 },
  { x: 'Week 5', y: 92.3 },
  { x: 'Week 6', y: 94.1 },
  { x: 'Week 7', y: 93.8 },
  { x: 'Week 8', y: 95.2 },
  { x: 'Week 9', y: 94.7 },
  { x: 'Week 10', y: 96.1 },
  { x: 'Week 11', y: 95.8 },
  { x: 'Week 12', y: 97.2 },
];

// Supplier Sentiment Scores (1-10 scale, higher is better)
export const sentimentTrendsData: ChartData[] = [
  { x: '2024-01', y: 6.8 },
  { x: '2024-02', y: 7.1 },
  { x: '2024-03', y: 7.3 },
  { x: '2024-04', y: 7.6 },
  { x: '2024-05', y: 7.8 },
  { x: '2024-06', y: 8.0 },
  { x: '2024-07', y: 8.2 },
  { x: '2024-08', y: 8.1 },
  { x: '2024-09', y: 8.3 },
  { x: '2024-10', y: 8.5 },
  { x: '2024-11', y: 8.4 },
  { x: '2024-12', y: 8.7 },
];

// 2. MULTI-AXIS LINE CHARTS

// Suppliers Vetted vs Average Risk Score
export const suppliersVsRiskData: SeriesData[] = [
  {
    name: 'Suppliers Vetted',
    data: [
      { x: 'Jan', y: 145 },
      { x: 'Feb', y: 162 },
      { x: 'Mar', y: 158 },
      { x: 'Apr', y: 174 },
      { x: 'May', y: 189 },
      { x: 'Jun', y: 195 },
      { x: 'Jul', y: 187 },
      { x: 'Aug', y: 203 },
    ],
  },
  {
    name: 'Average Risk Score',
    data: [
      { x: 'Jan', y: 6.8 },
      { x: 'Feb', y: 6.2 },
      { x: 'Mar', y: 5.9 },
      { x: 'Apr', y: 5.4 },
      { x: 'May', y: 5.1 },
      { x: 'Jun', y: 4.8 },
      { x: 'Jul', y: 4.5 },
      { x: 'Aug', y: 4.2 },
    ],
  },
];

// Vetting Costs vs Fraud Incidents Detected
export const costsVsFraudData: SeriesData[] = [
  {
    name: 'Vetting Costs (K ZAR)',
    data: [
      { x: 'Q1 2024', y: 405 }, // 405K ZAR
      { x: 'Q2 2024', y: 496 },
      { x: 'Q3 2024', y: 528 },
      { x: 'Q4 2024', y: 575 },
    ],
  },
  {
    name: 'Fraud Incidents Detected',
    data: [
      { x: 'Q1 2024', y: 23 },
      { x: 'Q2 2024', y: 31 },
      { x: 'Q3 2024', y: 28 },
      { x: 'Q4 2024', y: 35 },
    ],
  },
];

// Active RFPs vs Average Completion Time
export const rfpPerformanceData: SeriesData[] = [
  {
    name: 'Active RFPs',
    data: [
      { x: 'Week 1', y: 87 },
      { x: 'Week 2', y: 92 },
      { x: 'Week 3', y: 89 },
      { x: 'Week 4', y: 95 },
      { x: 'Week 5', y: 103 },
      { x: 'Week 6', y: 98 },
      { x: 'Week 7', y: 105 },
      { x: 'Week 8', y: 110 },
    ],
  },
  {
    name: 'Avg Completion Days',
    data: [
      { x: 'Week 1', y: 12.5 },
      { x: 'Week 2', y: 11.8 },
      { x: 'Week 3', y: 13.2 },
      { x: 'Week 4', y: 10.9 },
      { x: 'Week 5', y: 9.8 },
      { x: 'Week 6', y: 10.5 },
      { x: 'Week 7', y: 9.2 },
      { x: 'Week 8', y: 8.7 },
    ],
  },
];

// 3. ADDITIONAL VETTING-SPECIFIC DATA

// Weekly Verification Types Breakdown
export const verificationTypesData: SeriesData[] = [
  {
    name: 'ID Verification',
    data: [
      { x: 'Week 1', y: 245 },
      { x: 'Week 2', y: 268 },
      { x: 'Week 3', y: 289 },
      { x: 'Week 4', y: 312 },
    ],
  },
  {
    name: 'Criminal Background',
    data: [
      { x: 'Week 1', y: 187 },
      { x: 'Week 2', y: 203 },
      { x: 'Week 3', y: 198 },
      { x: 'Week 4', y: 225 },
    ],
  },
  {
    name: 'Employment History',
    data: [
      { x: 'Week 1', y: 145 },
      { x: 'Week 2', y: 158 },
      { x: 'Week 3', y: 167 },
      { x: 'Week 4', y: 173 },
    ],
  },
  {
    name: 'Credit Checks',
    data: [
      { x: 'Week 1', y: 89 },
      { x: 'Week 2', y: 95 },
      { x: 'Week 3', y: 102 },
      { x: 'Week 4', y: 108 },
    ],
  },
];

// Provincial Risk Distribution Over Time
export const provincialRiskData: SeriesData[] = [
  {
    name: 'Gauteng',
    data: [
      { x: 'Jan', y: 4.2 },
      { x: 'Feb', y: 3.9 },
      { x: 'Mar', y: 3.7 },
      { x: 'Apr', y: 3.5 },
    ],
  },
  {
    name: 'Western Cape',
    data: [
      { x: 'Jan', y: 3.8 },
      { x: 'Feb', y: 3.6 },
      { x: 'Mar', y: 3.4 },
      { x: 'Apr', y: 3.2 },
    ],
  },
  {
    name: 'KwaZulu-Natal',
    data: [
      { x: 'Jan', y: 5.1 },
      { x: 'Feb', y: 4.8 },
      { x: 'Mar', y: 4.6 },
      { x: 'Apr', y: 4.3 },
    ],
  },
];

// ========================================
// BAR CHART SAMPLE DATA FOR SA VETTING
// ========================================

// 1. Supplier Risk Categories Distribution (Vertical Bar)
export const supplierRiskCategoriesData = [
  { x: 'Low Risk (0-3)', y: 847 },
  { x: 'Medium Risk (4-6)', y: 623 },
  { x: 'High Risk (7-10)', y: 234 },
  { x: 'Critical Risk (9-10)', y: 86 },
];

// 2. Verification Types Distribution (Horizontal Bar)
export const verificationTypesBarData = [
  { x: 'CIPC Company Registration', y: 1245 },
  { x: 'South African ID Verification', y: 1890 },
  { x: 'BEE Certificate Validation', y: 743 },
  { x: 'Tax Clearance Certificate', y: 892 },
  { x: 'VAT Registration Check', y: 567 },
  { x: 'SARS Compliance Check', y: 445 },
  { x: 'Criminal Background Check', y: 334 },
  { x: 'Qualification Verification', y: 289 },
  { x: 'Reference Check', y: 678 },
  { x: 'Bank Account Verification', y: 789 },
];

// 3. Compliance Status by Province (Grouped Bar)
export const complianceStatusByProvinceData = [
  {
    name: 'Compliant',
    data: [
      { x: 'Gauteng', y: 456 },
      { x: 'Western Cape', y: 387 },
      { x: 'KwaZulu-Natal', y: 298 },
      { x: 'Eastern Cape', y: 167 },
      { x: 'Limpopo', y: 134 },
      { x: 'Mpumalanga', y: 123 },
      { x: 'North West', y: 98 },
      { x: 'Free State', y: 87 },
      { x: 'Northern Cape', y: 45 },
    ],
  },
  {
    name: 'Non-Compliant',
    data: [
      { x: 'Gauteng', y: 89 },
      { x: 'Western Cape', y: 67 },
      { x: 'KwaZulu-Natal', y: 78 },
      { x: 'Eastern Cape', y: 45 },
      { x: 'Limpopo', y: 56 },
      { x: 'Mpumalanga', y: 34 },
      { x: 'North West', y: 29 },
      { x: 'Free State', y: 23 },
      { x: 'Northern Cape', y: 12 },
    ],
  },
  {
    name: 'Under Review',
    data: [
      { x: 'Gauteng', y: 34 },
      { x: 'Western Cape', y: 28 },
      { x: 'KwaZulu-Natal', y: 23 },
      { x: 'Eastern Cape', y: 19 },
      { x: 'Limpopo', y: 17 },
      { x: 'Mpumalanga', y: 15 },
      { x: 'North West', y: 12 },
      { x: 'Free State', y: 9 },
      { x: 'Northern Cape', y: 6 },
    ],
  },
];

// 4. RFP Stage Distribution (Vertical Bar)
export const rfpStageDistributionData = [
  { x: 'Requirements Gathering', y: 23 },
  { x: 'Vendor Research', y: 34 },
  { x: 'RFP Preparation', y: 18 },
  { x: 'Published', y: 45 },
  { x: 'Proposal Submission', y: 67 },
  { x: 'Technical Evaluation', y: 32 },
  { x: 'Commercial Evaluation', y: 28 },
  { x: 'Vendor Presentations', y: 15 },
  { x: 'Final Negotiations', y: 12 },
  { x: 'Contract Award', y: 8 },
  { x: 'Implementation', y: 5 },
];

// 5. Stacked Risk Score Breakdown by Category (Stacked Bar)
export const stackedRiskBreakdownData = [
  {
    name: 'Financial Risk',
    data: [
      { x: 'Construction Corp', y: 2.3 },
      { x: 'Tech Solutions SA', y: 1.8 },
      { x: 'Mining Services Ltd', y: 3.1 },
      { x: 'Logistics Partners', y: 1.5 },
      { x: 'Consulting Group', y: 2.7 },
      { x: 'Manufacturing Co', y: 2.2 },
    ],
  },
  {
    name: 'Compliance Risk',
    data: [
      { x: 'Construction Corp', y: 1.8 },
      { x: 'Tech Solutions SA', y: 1.2 },
      { x: 'Mining Services Ltd', y: 2.8 },
      { x: 'Logistics Partners', y: 0.9 },
      { x: 'Consulting Group', y: 1.4 },
      { x: 'Manufacturing Co', y: 1.7 },
    ],
  },
  {
    name: 'Operational Risk',
    data: [
      { x: 'Construction Corp', y: 2.1 },
      { x: 'Tech Solutions SA', y: 1.9 },
      { x: 'Mining Services Ltd', y: 1.6 },
      { x: 'Logistics Partners', y: 2.4 },
      { x: 'Consulting Group', y: 1.8 },
      { x: 'Manufacturing Co', y: 2.3 },
    ],
  },
  {
    name: 'Reputational Risk',
    data: [
      { x: 'Construction Corp', y: 1.3 },
      { x: 'Tech Solutions SA', y: 0.8 },
      { x: 'Mining Services Ltd', y: 1.9 },
      { x: 'Logistics Partners', y: 0.7 },
      { x: 'Consulting Group', y: 1.1 },
      { x: 'Manufacturing Co', y: 1.2 },
    ],
  },
];

// 6. Pre-Vetting vs Post-Vetting Risk Scores (Grouped Bar)
export const prePostVettingComparisonData = [
  {
    name: 'Pre-Vetting Risk Score',
    data: [
      { x: 'ABC Construction', y: 7.8 },
      { x: 'Tech Innovators', y: 6.2 },
      { x: 'Green Energy SA', y: 8.1 },
      { x: 'Logistics Pro', y: 5.9 },
      { x: 'Consulting Plus', y: 7.3 },
      { x: 'Digital Solutions', y: 6.7 },
      { x: 'Mining Experts', y: 8.5 },
      { x: 'Service Masters', y: 6.4 },
    ],
  },
  {
    name: 'Post-Vetting Risk Score',
    data: [
      { x: 'ABC Construction', y: 4.2 },
      { x: 'Tech Innovators', y: 3.1 },
      { x: 'Green Energy SA', y: 4.8 },
      { x: 'Logistics Pro', y: 2.7 },
      { x: 'Consulting Plus', y: 3.9 },
      { x: 'Digital Solutions', y: 3.3 },
      { x: 'Mining Experts', y: 5.1 },
      { x: 'Service Masters', y: 2.9 },
    ],
  },
];

// 7. Monthly Vetting Costs by Type (Stacked Bar in ZAR)
export const monthlyVettingCostsData = [
  {
    name: 'Basic Verification',
    data: [
      { x: 'Jan', y: 45600 },
      { x: 'Feb', y: 52300 },
      { x: 'Mar', y: 48900 },
      { x: 'Apr', y: 56700 },
      { x: 'May', y: 51200 },
      { x: 'Jun', y: 49800 },
    ],
  },
  {
    name: 'Enhanced Due Diligence',
    data: [
      { x: 'Jan', y: 87400 },
      { x: 'Feb', y: 93200 },
      { x: 'Mar', y: 78600 },
      { x: 'Apr', y: 95800 },
      { x: 'May', y: 89300 },
      { x: 'Jun', y: 91700 },
    ],
  },
  {
    name: 'Specialized Audits',
    data: [
      { x: 'Jan', y: 123400 },
      { x: 'Feb', y: 156700 },
      { x: 'Mar', y: 134500 },
      { x: 'Apr', y: 167800 },
      { x: 'May', y: 145600 },
      { x: 'Jun', y: 152300 },
    ],
  },
];

// 8. Sector-wise Supplier Distribution (Vertical Bar)
export const sectorSupplierDistributionData = [
  { x: 'Construction & Infrastructure', y: 789 },
  { x: 'Information Technology', y: 654 },
  { x: 'Professional Services', y: 567 },
  { x: 'Manufacturing', y: 432 },
  { x: 'Transportation & Logistics', y: 398 },
  { x: 'Mining & Resources', y: 345 },
  { x: 'Healthcare & Pharmaceuticals', y: 289 },
  { x: 'Financial Services', y: 234 },
  { x: 'Agriculture & Food', y: 198 },
  { x: 'Energy & Utilities', y: 167 },
];

// 9. Verification Processing Time by Type (Horizontal Bar in hours)
export const verificationProcessingTimeData = [
  { x: 'ID Document Verification', y: 2.3 },
  { x: 'Bank Account Verification', y: 4.7 },
  { x: 'CIPC Registration Check', y: 6.2 },
  { x: 'Tax Clearance Verification', y: 24.5 },
  { x: 'BEE Certificate Validation', y: 48.7 },
  { x: 'Criminal Background Check', y: 72.4 },
  { x: 'Reference Verification', y: 96.3 },
  { x: 'Qualification Verification', y: 120.8 },
  { x: 'Full Due Diligence Report', y: 168.5 },
];

// 10. SLA Compliance Rate by Service Type (Stacked 100% Bar)
export const slaComplianceBarData = [
  {
    name: 'Within SLA',
    data: [
      { x: 'Basic ID Check', y: 94.5 },
      { x: 'Company Verification', y: 87.3 },
      { x: 'Tax Compliance', y: 76.8 },
      { x: 'BEE Validation', y: 82.1 },
      { x: 'Background Check', y: 69.4 },
      { x: 'Full Due Diligence', y: 58.7 },
    ],
  },
  {
    name: 'SLA Breach (Minor)',
    data: [
      { x: 'Basic ID Check', y: 4.2 },
      { x: 'Company Verification', y: 9.7 },
      { x: 'Tax Compliance', y: 16.8 },
      { x: 'BEE Validation', y: 13.4 },
      { x: 'Background Check', y: 22.1 },
      { x: 'Full Due Diligence', y: 28.9 },
    ],
  },
  {
    name: 'SLA Breach (Major)',
    data: [
      { x: 'Basic ID Check', y: 1.3 },
      { x: 'Company Verification', y: 3.0 },
      { x: 'Tax Compliance', y: 6.4 },
      { x: 'BEE Validation', y: 4.5 },
      { x: 'Background Check', y: 8.5 },
      { x: 'Full Due Diligence', y: 12.4 },
    ],
  },
];

// =====================================
// VETTING-SPECIFIC PIE/DONUT CHART DATA
// =====================================

// 1. Supplier Risk Level Distribution (Pie Chart)
export const supplierRiskLevelDistributionData: ChartData[] = [
  { x: 'Low Risk (1-3)', y: 42 },
  { x: 'Medium Risk (4-6)', y: 35 },
  { x: 'High Risk (7-8)', y: 18 },
  { x: 'Critical Risk (9-10)', y: 5 },
];

// 2. Verification Status Completion (Donut Chart)
export const verificationCompletionStatusData: ChartData[] = [
  { x: 'Completed', y: 68 },
  { x: 'In Progress', y: 22 },
  { x: 'Pending', y: 7 },
  { x: 'Failed', y: 3 },
];

// 3. Verification Outcome Distribution (Pie Chart)
export const verificationOutcomeDistributionData: ChartData[] = [
  { x: 'Pass', y: 73 },
  { x: 'Pass with Conditions', y: 15 },
  { x: 'Flagged for Review', y: 8 },
  { x: 'Fail', y: 4 },
];

// 4. Primary Risk Source Breakdown (Donut Chart)
export const primaryRiskSourceData: ChartData[] = [
  { x: 'Financial Instability', y: 28 },
  { x: 'Compliance Issues', y: 24 },
  { x: 'Operational Concerns', y: 19 },
  { x: 'Reputational Risks', y: 15 },
  { x: 'Legal/Regulatory', y: 10 },
  { x: 'Other Factors', y: 4 },
];

// 5. Vetting Service Type Distribution (Pie Chart)
export const vettingServiceTypeDistributionData: ChartData[] = [
  { x: 'CIPC Registration Check', y: 22 },
  { x: 'Tax Compliance Verification', y: 18 },
  { x: 'BEE Certificate Validation', y: 16 },
  { x: 'Criminal Background Check', y: 14 },
  { x: 'Bank Account Verification', y: 12 },
  { x: 'Reference Verification', y: 10 },
  { x: 'Qualification Verification', y: 8 },
];

// 6. Provincial Supplier Distribution (Donut Chart)
export const provincialSupplierDistributionData: ChartData[] = [
  { x: 'Gauteng', y: 32 },
  { x: 'Western Cape', y: 24 },
  { x: 'KwaZulu-Natal', y: 16 },
  { x: 'Eastern Cape', y: 8 },
  { x: 'Limpopo', y: 6 },
  { x: 'Mpumalanga', y: 5 },
  { x: 'North West', y: 4 },
  { x: 'Free State', y: 3 },
  { x: 'Northern Cape', y: 2 },
];

// 7. Compliance Type Breakdown (Pie Chart)
export const complianceTypeBreakdownData: ChartData[] = [
  { x: 'Tax Compliance', y: 26 },
  { x: 'BEE Compliance', y: 22 },
  { x: 'Labour Compliance', y: 18 },
  { x: 'Environmental Compliance', y: 14 },
  { x: 'Health & Safety', y: 12 },
  { x: 'Industry-Specific', y: 8 },
];

// 8. Vetting Cost Distribution by Service (Donut Chart - ZAR values)
export const vettingCostDistributionData: ChartData[] = [
  { x: 'Enhanced Due Diligence', y: 45 },
  { x: 'Specialized Audits', y: 32 },
  { x: 'Background Checks', y: 15 },
  { x: 'Basic Verification', y: 8 },
];

// 9. Supplier Sector Distribution (Pie Chart)
export const supplierSectorDistributionData: ChartData[] = [
  { x: 'Construction & Infrastructure', y: 23 },
  { x: 'Information Technology', y: 19 },
  { x: 'Professional Services', y: 16 },
  { x: 'Manufacturing', y: 12 },
  { x: 'Transportation & Logistics', y: 11 },
  { x: 'Mining & Resources', y: 9 },
  { x: 'Healthcare', y: 6 },
  { x: 'Other', y: 4 },
];

// 10. Fraud Detection Outcome (Donut Chart)
export const fraudDetectionOutcomeData: ChartData[] = [
  { x: 'Clean - No Issues', y: 78 },
  { x: 'Minor Discrepancies', y: 12 },
  { x: 'Significant Concerns', y: 7 },
  { x: 'Fraud Detected', y: 3 },
];

// Export all sample data
export const sampleData = {
  // Original data
  monthlyRevenue: monthlyRevenueData,
  revenueVsExpenses: revenueVsExpensesData,
  vettingServices: vettingServicesData,
  dailyApplications: dailyApplicationsData,
  provincial: provincialData,
  applicationStatus: applicationStatusData,
  performanceMetrics: performanceMetricsData,
  
  // New vetting-specific line chart data
  supplierRiskTrends: supplierRiskTrendsData,
  verificationVolume: verificationVolumeData,
  vettingCosts: vettingCostsData,
  slaCompliance: slaComplianceData,
  sentimentTrends: sentimentTrendsData,
  suppliersVsRisk: suppliersVsRiskData,
  costsVsFraud: costsVsFraudData,
  rfpPerformance: rfpPerformanceData,
  verificationTypes: verificationTypesData,
  provincialRisk: provincialRiskData,
  
     // New bar chart data
   supplierRiskCategories: supplierRiskCategoriesData,
   verificationTypesBar: verificationTypesBarData,
   complianceStatusByProvince: complianceStatusByProvinceData,
   rfpStageDistribution: rfpStageDistributionData,
   stackedRiskBreakdown: stackedRiskBreakdownData,
   prePostVettingComparison: prePostVettingComparisonData,
   monthlyVettingCosts: monthlyVettingCostsData,
   sectorSupplierDistribution: sectorSupplierDistributionData,
   verificationProcessingTime: verificationProcessingTimeData,
   slaComplianceBar: slaComplianceBarData,
   
   // New pie/donut chart data
   supplierRiskLevelDistribution: supplierRiskLevelDistributionData,
   verificationCompletionStatus: verificationCompletionStatusData,
   verificationOutcomeDistribution: verificationOutcomeDistributionData,
   primaryRiskSource: primaryRiskSourceData,
   vettingServiceTypeDistribution: vettingServiceTypeDistributionData,
   provincialSupplierDistribution: provincialSupplierDistributionData,
   complianceTypeBreakdown: complianceTypeBreakdownData,
   vettingCostDistribution: vettingCostDistributionData,
   supplierSectorDistribution: supplierSectorDistributionData,
   fraudDetectionOutcome: fraudDetectionOutcomeData,
}; 