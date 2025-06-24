import { AdminTaskItem, TaskPriority, TaskStatus, TaskType, TaskSummaryStats } from '@/types/tasks';

// Comprehensive sample data for Admin Tasks & Approvals
// Showcases various South African vetting scenarios and administrative tasks

export const sampleAdminTasks: AdminTaskItem[] = [
  {
    id: 'task_001',
    type: TaskType.RISK_ESCALATION,
    subjectName: 'QuantumLeap Solutions (Pty) Ltd',
    subjectId: 'supplier_QLS001',
    description: 'High financial risk detected post-vetting. Multiple red flags on credit report including irregular cash flow patterns and previous defaults. Requires immediate review and decision on supplier status.',
    assignedDate: '2024-06-20T10:00:00Z',
    dueDate: '2024-06-22T17:00:00Z',
    priority: TaskPriority.HIGH,
    status: TaskStatus.PENDING_ADMIN_REVIEW,
    assignedTo: 'Super Admin',
    relatedLink: '/suppliers/supplier_QLS001/risk-analysis',
    notes: 'CFO has been notified. Credit score dropped from B+ to D- in 6 months. Awaiting your go/no-go decision.',
    category: 'Financial Risk',
    riskLevel: 'Critical',
    estimatedTime: 45,
  },
  {
    id: 'task_002',
    type: TaskType.CONSENT_ISSUE,
    subjectName: 'Thabo Mbeki (Individual)',
    subjectId: 'ind_TM005',
    description: 'Digital consent for medical history check failed verification. Signature mismatch detected by AI validation system. Manual review of uploaded consent form required.',
    assignedDate: '2024-06-21T09:15:00Z',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.ACTION_REQUIRED,
    assignedTo: 'Super Admin',
    relatedLink: '/vetting/consent-management/ind_TM005',
    notes: 'Individual claims signature pad malfunction. Alternative consent method may be required.',
    category: 'Legal Compliance',
    estimatedTime: 20,
  },
  {
    id: 'task_003',
    type: TaskType.OVERDUE_VERIFICATION,
    subjectName: 'EcoBuild Construction CC',
    subjectId: 'supplier_EBC002',
    description: 'CIPC verification overdue by 3 days. API provider (MIE) reported intermittent connectivity issues affecting automated checks. Manual follow-up required.',
    assignedDate: '2024-06-18T14:00:00Z',
    dueDate: '2024-06-19T17:00:00Z',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.PENDING_ADMIN_REVIEW,
    assignedTo: 'Super Admin',
    relatedLink: '/vetting/active-cases/supplier_EBC002',
    notes: 'Vetting officer attempted manual CIPC lookup but system timeout. Alternative verification source needed.',
    category: 'System Integration',
    estimatedTime: 30,
  },
  {
    id: 'task_004',
    type: TaskType.REPORT_APPROVAL,
    subjectName: 'Quarterly Supplier Risk Summary Q2 2024',
    subjectId: 'report_QSR002',
    description: 'Generated quarterly risk report requires final approval before distribution to stakeholders. Report contains sensitive risk classifications for 847 suppliers.',
    assignedDate: '2024-06-22T11:00:00Z',
    priority: TaskPriority.HIGH,
    status: TaskStatus.ACTION_REQUIRED,
    assignedTo: 'Super Admin',
    relatedLink: '/reporting/standard-reports/report_QSR002',
    notes: 'Board meeting scheduled for Thursday. Report needed 24 hours in advance.',
    category: 'Reporting',
    estimatedTime: 60,
  },
  {
    id: 'task_005',
    type: TaskType.USER_ACCESS_REQUEST,
    subjectName: 'Jane Doe (Procurement Officer)',
    subjectId: 'user_JD010',
    description: 'Request for elevated permissions to access invoice analysis module for Sibanye Gold mining project. Temporary access required for 30-day audit period.',
    assignedDate: '2024-06-22T08:30:00Z',
    priority: TaskPriority.LOW,
    status: TaskStatus.PENDING_ADMIN_REVIEW,
    assignedTo: 'Super Admin',
    relatedLink: '/administration/user-management/user_JD010',
    notes: 'User has L3 clearance. Request approved by department head Sarah Johnson.',
    category: 'Access Control',
    estimatedTime: 15,
  },
  {
    id: 'task_006',
    type: TaskType.SYSTEM_ALERT_REVIEW,
    subjectName: 'MIE API Connectivity Issues',
    description: 'Multiple failed API calls to MIE (Managed Integrity Evaluation) over the last 2 hours. 78% of verification requests failing. Investigate potential service outage.',
    assignedDate: '2024-06-22T14:00:00Z',
    priority: TaskPriority.HIGH,
    status: TaskStatus.ACTION_REQUIRED,
    assignedTo: 'Super Admin',
    relatedLink: '/administration/platform-health',
    notes: 'Automated retry mechanism has failed 12 times. Backup verification provider may need activation.',
    category: 'System Health',
    riskLevel: 'High',
    estimatedTime: 40,
  },
  {
    id: 'task_007',
    type: TaskType.INVOICE_DISCREPANCY_APPROVAL,
    subjectName: 'Invoice INV00789 (Alpha Miners Ltd)',
    subjectId: 'invoice_AM00789',
    description: 'AI fraud detection flagged 25% invoice value discrepancy versus original RFP terms for mining equipment contract C0012. Manual review and approval/rejection required.',
    assignedDate: '2024-06-19T16:30:00Z',
    priority: TaskPriority.HIGH,
    status: TaskStatus.PENDING_ADMIN_REVIEW,
    assignedTo: 'Super Admin',
    relatedLink: '/rfp-invoice/invoice-analysis/invoice_AM00789',
    notes: 'Discrepancy in equipment specifications. Supplier claims market price increase of 18% since RFP.',
    category: 'Fraud Prevention',
    riskLevel: 'Medium',
    estimatedTime: 35,
  },
  {
    id: 'task_008',
    type: TaskType.RISK_ESCALATION,
    subjectName: 'Future Forward Technology',
    subjectId: 'supplier_FFT003',
    description: 'New supplier flagged for potential PEP (Politically Exposed Person) involvement during enhanced due diligence. Director links to government procurement decisions require review.',
    assignedDate: '2024-06-22T15:00:00Z',
    priority: TaskPriority.HIGH,
    status: TaskStatus.PENDING_ADMIN_REVIEW,
    assignedTo: 'Super Admin',
    relatedLink: '/suppliers/supplier_FFT003',
    notes: 'Possible conflict of interest identified. Legal team consulted. Enhanced screening recommended.',
    category: 'Regulatory Compliance',
    riskLevel: 'Critical',
    estimatedTime: 90,
  },
  {
    id: 'task_009',
    type: TaskType.COMPLIANCE_REVIEW,
    subjectName: 'BEE Certificate Validity (Matseng Construction)',
    subjectId: 'supplier_MC004',
    description: 'BEE (Black Economic Empowerment) certificate shows inconsistencies with SARS tax records. Certificate authenticity requires manual verification with SANAS.',
    assignedDate: '2024-06-21T13:20:00Z',
    dueDate: '2024-06-25T17:00:00Z',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.ACTION_REQUIRED,
    assignedTo: 'Super Admin',
    relatedLink: '/suppliers/supplier_MC004/compliance',
    notes: 'Certificate issued by non-accredited agency. Supplier claims SANAS accreditation pending.',
    category: 'BEE Compliance',
    riskLevel: 'Medium',
    estimatedTime: 45,
  },
  {
    id: 'task_010',
    type: TaskType.DATA_VALIDATION_REQUIRED,
    subjectName: 'Bulk Import Validation (150 New Suppliers)',
    subjectId: 'import_batch_2024Q2',
    description: 'Bulk supplier import from ERP system contains data quality issues. 23 suppliers have invalid SA ID numbers, 15 have malformed company registration numbers.',
    assignedDate: '2024-06-20T16:45:00Z',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.PENDING_ADMIN_REVIEW,
    assignedTo: 'Super Admin',
    relatedLink: '/administration/data-management/import_batch_2024Q2',
    notes: 'Data cleaning rules applied. Manual review required for edge cases before processing.',
    category: 'Data Quality',
    estimatedTime: 120,
  },
  {
    id: 'task_011',
    type: TaskType.MANUAL_INTERVENTION,
    subjectName: 'GPS Verification Anomaly (Johannesburg Location)',
    subjectId: 'location_JHB_089',
    description: 'Field agent reported GPS coordinates do not match registered business address. Potential address fraud detected. Site visit required for physical verification.',
    assignedDate: '2024-06-22T12:30:00Z',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.ACTION_REQUIRED,
    assignedTo: 'Super Admin',
    relatedLink: '/field-operations/submitted-verifications/location_JHB_089',
    notes: 'Address shows vacant lot on satellite imagery. Supplier claims recent relocation.',
    category: 'Physical Verification',
    riskLevel: 'Medium',
    estimatedTime: 60,
  },
  {
    id: 'task_012',
    type: TaskType.SYSTEM_ALERT_REVIEW,
    subjectName: 'Unusual API Usage Pattern Detected',
    description: 'Automated monitoring detected 340% increase in credit check API calls from 2:00-4:00 AM. Potential unauthorized access or system compromise investigation required.',
    assignedDate: '2024-06-22T07:15:00Z',
    priority: TaskPriority.HIGH,
    status: TaskStatus.PENDING_ADMIN_REVIEW,
    assignedTo: 'Super Admin',
    relatedLink: '/administration/audit-logs',
    notes: 'No scheduled batch processes during this time. Security incident protocol may be required.',
    category: 'Security',
    riskLevel: 'High',
    estimatedTime: 75,
  },
  {
    id: 'task_013',
    type: TaskType.CONSENT_ISSUE,
    subjectName: 'Maria Santos (Individual Contractor)',
    subjectId: 'ind_MS012',
    description: 'Individual withdrew consent for continued monitoring after 6 months. Legal review required for contract implications and data retention policies.',
    assignedDate: '2024-06-21T11:45:00Z',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.UNDER_REVIEW,
    assignedTo: 'Super Admin',
    relatedLink: '/vetting/consent-management/ind_MS012',
    notes: 'POPIA compliance officer consulted. 30-day grace period for data purging initiated.',
    category: 'Data Privacy',
    estimatedTime: 30,
  },
  {
    id: 'task_014',
    type: TaskType.REPORT_APPROVAL,
    subjectName: 'Monthly Fraud Detection Summary',
    subjectId: 'report_FDS_202406',
    description: 'Monthly fraud detection report ready for stakeholder distribution. 12 potential fraud cases identified, 4 confirmed, R2.3M in losses prevented.',
    assignedDate: '2024-06-23T09:00:00Z',
    priority: TaskPriority.HIGH,
    status: TaskStatus.ACTION_REQUIRED,
    assignedTo: 'Super Admin',
    relatedLink: '/reporting/standard-reports/report_FDS_202406',
    notes: 'Excellent fraud prevention metrics. Board presentation requested for next meeting.',
    category: 'Performance Reporting',
    estimatedTime: 25,
  },
  {
    id: 'task_015',
    type: TaskType.OVERDUE_VERIFICATION,
    subjectName: 'Batch Processing Failure (Medical Clearances)',
    subjectId: 'batch_medical_2024_22',
    description: 'Automated medical clearance processing failed for 45 individual contractors. Manual review and reprocessing required before Monday deadline.',
    assignedDate: '2024-06-21T18:30:00Z',
    dueDate: '2024-06-24T09:00:00Z',
    priority: TaskPriority.HIGH,
    status: TaskStatus.ACTION_REQUIRED,
    assignedTo: 'Super Admin',
    relatedLink: '/vetting/scheduled-checks/batch_medical_2024_22',
    notes: 'Medical API provider maintenance window caused failures. Weekend processing approved.',
    category: 'Batch Processing',
    riskLevel: 'Medium',
    estimatedTime: 180,
  },
];

// Generate summary statistics for dashboard display
export const generateTaskSummaryStats = (tasks: AdminTaskItem[]): TaskSummaryStats => {
  const now = new Date();
  const overdueCount = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate) < now && 
    !['completed', 'approved', 'rejected'].includes(task.status.toLowerCase())
  ).length;

  const byType = tasks.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1;
    return acc;
  }, {} as Record<TaskType, number>);

  const byStatus = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<TaskStatus, number>);

  const byPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1;
    return acc;
  }, {} as Record<TaskPriority, number>);

  return {
    total: tasks.length,
    pending: tasks.filter(t => t.status === TaskStatus.PENDING_ADMIN_REVIEW).length,
    actionRequired: tasks.filter(t => t.status === TaskStatus.ACTION_REQUIRED).length,
    approved: tasks.filter(t => t.status === TaskStatus.APPROVED).length,
    rejected: tasks.filter(t => t.status === TaskStatus.REJECTED).length,
    overdue: overdueCount,
    highPriority: tasks.filter(t => t.priority === TaskPriority.HIGH).length,
    byType,
    byStatus,
    byPriority,
  };
};

// Sample bulk actions configuration
export const sampleBulkActions = [
  {
    type: 'approve' as const,
    label: 'Approve Selected',
    icon: 'CheckCircle',
    variant: 'success' as const,
    requiresConfirmation: true,
  },
  {
    type: 'reject' as const,
    label: 'Reject Selected',
    icon: 'XCircle',
    variant: 'destructive' as const,
    requiresConfirmation: true,
  },
  {
    type: 'mark-reviewed' as const,
    label: 'Mark as Reviewed',
    icon: 'Eye',
    variant: 'default' as const,
    requiresConfirmation: false,
  },
  {
    type: 'assign' as const,
    label: 'Reassign Tasks',
    icon: 'UserPlus',
    variant: 'default' as const,
    requiresConfirmation: false,
  },
];

// Utility function to simulate API delay
export const getAdminTasks = async (): Promise<AdminTaskItem[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return sampleAdminTasks;
};

// Utility function to get tasks summary
export const getTasksSummary = async (): Promise<TaskSummaryStats> => {
  const tasks = await getAdminTasks();
  return generateTaskSummaryStats(tasks);
};