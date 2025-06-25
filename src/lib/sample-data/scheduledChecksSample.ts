// Sample data for Scheduled & Recurring Checks
// Based on "early June 2025" context with realistic dates using date-fns

import { ScheduledCheckItem, ScheduleFrequency, ScheduleStatus, ScheduledChecksStats } from '@/types/scheduling';
import { VettingEntityType } from '@/types/vetting';
import { RiskLevel } from '@/types/reports';
import { formatISO, addMonths, addQuarters, addYears, isAfter, isBefore, addDays } from 'date-fns';

// Current date context: Early June 2025
const now = new Date('2025-06-05T10:00:00Z');

export const sampleScheduledChecks: ScheduledCheckItem[] = [
  {
    scheduleId: 'SCH-001',
    subjectName: 'QuantumLeap Solutions (Pty) Ltd',
    subjectId: '2022/123456/07',
    entityType: VettingEntityType.COMPANY,
    checkDefinitionId: 'cipc_company_check',
    checkName: 'CIPC Company Check',
    frequency: ScheduleFrequency.ANNUALLY,
    status: ScheduleStatus.ACTIVE,
    startDate: '2024-07-01T00:00:00Z',
    lastRunDate: '2024-07-01T00:00:00Z',
    lastRunOutcome: RiskLevel.LOW,
    nextRunDate: formatISO(addYears(new Date('2024-07-01T00:00:00Z'), 1)), // July 1, 2025
    runHistory: [
      { runDate: '2024-07-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202407-010' }
    ],
  },
  {
    scheduleId: 'SCH-002',
    subjectName: 'Stellar Logistics SA',
    subjectId: '2018/112233/07',
    entityType: VettingEntityType.COMPANY,
    checkDefinitionId: 'business_credit_report',
    checkName: 'Business Credit Report',
    frequency: ScheduleFrequency.QUARTERLY,
    status: ScheduleStatus.OVERDUE,
    startDate: '2024-09-01T00:00:00Z',
    lastRunDate: '2025-03-01T00:00:00Z',
    lastRunOutcome: RiskLevel.LOW,
    nextRunDate: formatISO(addQuarters(new Date('2025-03-01T00:00:00Z'), 1)), // June 1, 2025 (Overdue)
    runHistory: [
      { runDate: '2024-12-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202412-050' },
      { runDate: '2025-03-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202503-025' },
    ],
    notes: 'Provider API was down on due date. Manual trigger required.'
  },
  {
    scheduleId: 'SCH-003',
    subjectName: 'Johnathan Doe (Director)',
    subjectId: '8501015000080',
    entityType: VettingEntityType.INDIVIDUAL,
    checkDefinitionId: 'pep_sanctions_ind',
    checkName: 'PEP & Sanctions Screening',
    frequency: ScheduleFrequency.MONTHLY,
    status: ScheduleStatus.PAUSED,
    startDate: '2025-01-15T00:00:00Z',
    lastRunDate: '2025-05-15T00:00:00Z',
    lastRunOutcome: RiskLevel.INFO_ONLY,
    nextRunDate: formatISO(addMonths(new Date('2025-05-15T00:00:00Z'), 1)), // June 15, 2025
    runHistory: [
      { runDate: '2025-01-15T00:00:00Z', outcome: RiskLevel.INFO_ONLY, reportId: 'VR202501-088' },
      { runDate: '2025-02-15T00:00:00Z', outcome: RiskLevel.INFO_ONLY, reportId: 'VR202502-045' },
      { runDate: '2025-03-15T00:00:00Z', outcome: RiskLevel.INFO_ONLY, reportId: 'VR202503-067' },
      { runDate: '2025-04-15T00:00:00Z', outcome: RiskLevel.INFO_ONLY, reportId: 'VR202504-032' },
      { runDate: '2025-05-15T00:00:00Z', outcome: RiskLevel.INFO_ONLY, reportId: 'VR202505-021' },
    ],
    notes: 'Paused pending outcome of related high-risk investigation.'
  },
  {
    scheduleId: 'SCH-004',
    subjectName: 'EcoBuild Construction CC',
    subjectId: 'supplier_EBC002',
    entityType: VettingEntityType.COMPANY,
    checkDefinitionId: 'aml_cft_monitoring',
    checkName: 'AML/CFT Monitoring',
    frequency: ScheduleFrequency.QUARTERLY,
    status: ScheduleStatus.IN_PROGRESS,
    startDate: '2024-09-02T00:00:00Z',
    lastRunDate: '2025-03-02T00:00:00Z',
    lastRunOutcome: RiskLevel.LOW,
    nextRunDate: formatISO(addQuarters(new Date('2025-03-02T00:00:00Z'), 1)), // June 2, 2025
    runHistory: [
      { runDate: '2024-09-02T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202409-078' },
      { runDate: '2024-12-02T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202412-134' },
      { runDate: '2025-03-02T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202503-089' },
    ],
  },
  {
    scheduleId: 'SCH-005',
    subjectName: 'Priya Naidoo (CFO)',
    subjectId: '9203124567890',
    entityType: VettingEntityType.INDIVIDUAL,
    checkDefinitionId: 'credit_bureau_check',
    checkName: 'Credit Bureau Check',
    frequency: ScheduleFrequency.BI_ANNUALLY,
    status: ScheduleStatus.ACTIVE,
    startDate: '2024-12-01T00:00:00Z',
    lastRunDate: '2024-12-01T00:00:00Z',
    lastRunOutcome: RiskLevel.LOW,
    nextRunDate: formatISO(addMonths(new Date('2024-12-01T00:00:00Z'), 6)), // June 1, 2025 (Overdue)
    runHistory: [
      { runDate: '2024-12-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202412-156' }
    ],
  },
  {
    scheduleId: 'SCH-006',
    subjectName: 'MegaCorp Industries (Pty) Ltd',
    subjectId: '1998/045678/07',
    entityType: VettingEntityType.COMPANY,
    checkDefinitionId: 'sanctions_screening',
    checkName: 'International Sanctions Screening',
    frequency: ScheduleFrequency.MONTHLY,
    status: ScheduleStatus.ACTIVE,
    startDate: '2025-03-01T00:00:00Z',
    lastRunDate: '2025-05-01T00:00:00Z',
    lastRunOutcome: RiskLevel.LOW,
    nextRunDate: formatISO(addMonths(new Date('2025-05-01T00:00:00Z'), 1)), // June 1, 2025 (Overdue)
    runHistory: [
      { runDate: '2025-03-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202503-012' },
      { runDate: '2025-04-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202504-067' },
      { runDate: '2025-05-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202505-034' },
    ],
  },
  {
    scheduleId: 'SCH-007',
    subjectName: 'Thabo Mthembu (Mine Supervisor)',
    subjectId: '7809123456789',
    entityType: VettingEntityType.STAFF_MEDICAL,
    checkDefinitionId: 'medical_fitness_annual',
    checkName: 'Annual Medical Fitness Assessment',
    frequency: ScheduleFrequency.ANNUALLY,
    status: ScheduleStatus.ACTIVE,
    startDate: '2024-08-15T00:00:00Z',
    lastRunDate: '2024-08-15T00:00:00Z',
    lastRunOutcome: RiskLevel.LOW,
    nextRunDate: formatISO(addYears(new Date('2024-08-15T00:00:00Z'), 1)), // August 15, 2025
    runHistory: [
      { runDate: '2024-08-15T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202408-234' }
    ],
  },
  {
    scheduleId: 'SCH-008',
    subjectName: 'TechFlow Solutions CC',
    subjectId: '2021/987654/23',
    entityType: VettingEntityType.COMPANY,
    checkDefinitionId: 'tax_compliance_check',
    checkName: 'SARS Tax Compliance Check',
    frequency: ScheduleFrequency.QUARTERLY,
    status: ScheduleStatus.ACTIVE,
    startDate: '2024-10-01T00:00:00Z',
    lastRunDate: '2025-04-01T00:00:00Z',
    lastRunOutcome: RiskLevel.MEDIUM,
    nextRunDate: formatISO(addQuarters(new Date('2025-04-01T00:00:00Z'), 1)), // July 1, 2025
    runHistory: [
      { runDate: '2024-10-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202410-098' },
      { runDate: '2025-01-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202501-034' },
      { runDate: '2025-04-01T00:00:00Z', outcome: RiskLevel.MEDIUM, reportId: 'VR202504-156' },
    ],
    notes: 'Recent outstanding VAT return noted. Follow-up required.'
  },
  {
    scheduleId: 'SCH-009',
    subjectName: 'Sarah Williams (Procurement Manager)',
    subjectId: '8712095678901',
    entityType: VettingEntityType.INDIVIDUAL,
    checkDefinitionId: 'criminal_background_check',
    checkName: 'Criminal Background Verification',
    frequency: ScheduleFrequency.BI_ANNUALLY,
    status: ScheduleStatus.ACTIVE,
    startDate: '2024-11-01T00:00:00Z',
    lastRunDate: '2024-11-01T00:00:00Z',
    lastRunOutcome: RiskLevel.LOW,
    nextRunDate: formatISO(addMonths(new Date('2024-11-01T00:00:00Z'), 6)), // May 1, 2025 (Overdue)
    runHistory: [
      { runDate: '2024-11-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202411-067' }
    ],
  },
  {
    scheduleId: 'SCH-010',
    subjectName: 'GlobalTech Enterprises (Pty) Ltd',
    subjectId: '2019/567890/07',
    entityType: VettingEntityType.COMPANY,
    checkDefinitionId: 'director_verification',
    checkName: 'Director Change Monitoring',
    frequency: ScheduleFrequency.MONTHLY,
    status: ScheduleStatus.ACTIVE,
    startDate: '2025-04-01T00:00:00Z',
    lastRunDate: '2025-05-01T00:00:00Z',
    lastRunOutcome: RiskLevel.INFO_ONLY,
    nextRunDate: formatISO(addMonths(new Date('2025-05-01T00:00:00Z'), 1)), // June 1, 2025 (Overdue)
    runHistory: [
      { runDate: '2025-04-01T00:00:00Z', outcome: RiskLevel.INFO_ONLY, reportId: 'VR202504-089' },
      { runDate: '2025-05-01T00:00:00Z', outcome: RiskLevel.INFO_ONLY, reportId: 'VR202505-123' },
    ],
  },
  {
    scheduleId: 'SCH-011',
    subjectName: 'Ahmed Hassan (Security Officer)',
    subjectId: '8405087654321',
    entityType: VettingEntityType.STAFF_MEDICAL,
    checkDefinitionId: 'psych_evaluation',
    checkName: 'Psychological Evaluation',
    frequency: ScheduleFrequency.ANNUALLY,
    status: ScheduleStatus.PAUSED,
    startDate: '2024-06-01T00:00:00Z',
    lastRunDate: '2024-06-01T00:00:00Z',
    lastRunOutcome: RiskLevel.LOW,
    nextRunDate: formatISO(addYears(new Date('2024-06-01T00:00:00Z'), 1)), // June 1, 2025 (Overdue)
    runHistory: [
      { runDate: '2024-06-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202406-234' }
    ],
    notes: 'Paused due to employee medical leave. Resume after return to work.'
  },
  {
    scheduleId: 'SCH-012',
    subjectName: 'InnovateCorp (Pty) Ltd',
    subjectId: '2020/111222/07',
    entityType: VettingEntityType.COMPANY,
    checkDefinitionId: 'regulatory_compliance',
    checkName: 'Industry Regulatory Compliance',
    frequency: ScheduleFrequency.QUARTERLY,
    status: ScheduleStatus.ACTIVE,
    startDate: '2025-01-15T00:00:00Z',
    lastRunDate: '2025-04-15T00:00:00Z',
    lastRunOutcome: RiskLevel.LOW,
    nextRunDate: formatISO(addQuarters(new Date('2025-04-15T00:00:00Z'), 1)), // July 15, 2025
    runHistory: [
      { runDate: '2025-01-15T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202501-156' },
      { runDate: '2025-04-15T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202504-234' },
    ],
  },
  {
    scheduleId: 'SCH-013',
    subjectName: 'Maria Santos (Finance Director)',
    subjectId: '9001234567890',
    entityType: VettingEntityType.INDIVIDUAL,
    checkDefinitionId: 'professional_qualifications',
    checkName: 'Professional Qualifications Verification',
    frequency: ScheduleFrequency.BI_ANNUALLY,
    status: ScheduleStatus.ACTIVE,
    startDate: '2024-09-01T00:00:00Z',
    lastRunDate: '2025-03-01T00:00:00Z',
    lastRunOutcome: RiskLevel.LOW,
    nextRunDate: formatISO(addMonths(new Date('2025-03-01T00:00:00Z'), 6)), // September 1, 2025
    runHistory: [
      { runDate: '2024-09-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202409-123' },
      { runDate: '2025-03-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202503-156' },
    ],
  },
  {
    scheduleId: 'SCH-014',
    subjectName: 'SecureLogistics (Pty) Ltd',
    subjectId: '2017/333444/07',
    entityType: VettingEntityType.COMPANY,
    checkDefinitionId: 'insurance_verification',
    checkName: 'Insurance Coverage Verification',
    frequency: ScheduleFrequency.ANNUALLY,
    status: ScheduleStatus.ACTIVE,
    startDate: '2024-03-01T00:00:00Z',
    lastRunDate: '2024-03-01T00:00:00Z',
    lastRunOutcome: RiskLevel.LOW,
    nextRunDate: formatISO(addYears(new Date('2024-03-01T00:00:00Z'), 1)), // March 1, 2025 (Overdue)
    runHistory: [
      { runDate: '2024-03-01T00:00:00Z', outcome: RiskLevel.LOW, reportId: 'VR202403-089' }
    ],
  },
  {
    scheduleId: 'SCH-015',
    subjectName: 'David Chen (IT Manager)',
    subjectId: '8910123456789',
    entityType: VettingEntityType.INDIVIDUAL,
    checkDefinitionId: 'social_media_screening',
    checkName: 'Social Media Background Screening',
    frequency: ScheduleFrequency.MONTHLY,
    status: ScheduleStatus.ACTIVE,
    startDate: '2025-05-01T00:00:00Z',
    lastRunDate: '2025-05-01T00:00:00Z',
    lastRunOutcome: RiskLevel.INFO_ONLY,
    nextRunDate: formatISO(addMonths(new Date('2025-05-01T00:00:00Z'), 1)), // June 1, 2025 (Overdue)
    runHistory: [
      { runDate: '2025-05-01T00:00:00Z', outcome: RiskLevel.INFO_ONLY, reportId: 'VR202505-178' }
    ],
  },
];

// Function to get scheduled checks data (simulated API call)
export async function getScheduledChecks(): Promise<ScheduledCheckItem[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return sampleScheduledChecks;
}

// Function to calculate statistics
export function getScheduledChecksStats(): ScheduledChecksStats {
  const stats: ScheduledChecksStats = {
    totalSchedules: sampleScheduledChecks.length,
    activeSchedules: 0,
    overdueSchedules: 0,
    upcomingSchedules: 0,
    pausedSchedules: 0,
    inProgressSchedules: 0,
    frequencyDistribution: {
      [ScheduleFrequency.MONTHLY]: 0,
      [ScheduleFrequency.QUARTERLY]: 0,
      [ScheduleFrequency.BI_ANNUALLY]: 0,
      [ScheduleFrequency.ANNUALLY]: 0,
    },
    entityTypeDistribution: {
      [VettingEntityType.INDIVIDUAL]: 0,
      [VettingEntityType.COMPANY]: 0,
      [VettingEntityType.STAFF_MEDICAL]: 0,
    },
  };

  const upcomingThreshold = addDays(now, 7);

  sampleScheduledChecks.forEach(schedule => {
    // Status distribution
    switch (schedule.status) {
      case ScheduleStatus.ACTIVE:
        stats.activeSchedules++;
        break;
      case ScheduleStatus.PAUSED:
        stats.pausedSchedules++;
        break;
      case ScheduleStatus.OVERDUE:
        stats.overdueSchedules++;
        break;
      case ScheduleStatus.IN_PROGRESS:
        stats.inProgressSchedules++;
        break;
    }

    // Check if overdue
    const nextRunDate = new Date(schedule.nextRunDate);
    if (isBefore(nextRunDate, now) && schedule.status === ScheduleStatus.ACTIVE) {
      stats.overdueSchedules++;
    }

    // Check if upcoming (within 7 days)
    if (isAfter(nextRunDate, now) && isBefore(nextRunDate, upcomingThreshold)) {
      stats.upcomingSchedules++;
    }

    // Frequency distribution
    stats.frequencyDistribution[schedule.frequency]++;

    // Entity type distribution
    stats.entityTypeDistribution[schedule.entityType]++;
  });

  return stats;
} 