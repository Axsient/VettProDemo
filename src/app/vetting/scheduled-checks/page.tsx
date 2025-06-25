import { Metadata } from 'next';
import { ScheduledChecksClient } from '@/components/vetting/ScheduledChecksClient';
import { getScheduledChecks, getScheduledChecksStats } from '@/lib/sample-data/scheduledChecksSample';

export const metadata: Metadata = {
  title: 'Scheduled & Recurring Checks | VETTPRO Dashboard',
  description: 'Manage and monitor automated recurring vetting checks and schedules.',
};

export default async function ScheduledChecksPage() {
  // Load initial data on the server
  const [scheduledChecks, stats] = await Promise.all([
    getScheduledChecks(),
    getScheduledChecksStats(),
  ]);

  return (
    <ScheduledChecksClient
      initialScheduledChecks={scheduledChecks}
      initialStats={stats}
    />
  );
} 