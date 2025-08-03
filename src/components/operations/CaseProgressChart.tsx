'use client';

import React from 'react';
import { LineChart } from '@/components/charts/apex/components/LineChart';
import { getCaseDetails, getCaseTimeline } from '@/lib/sample-data/operations-dashboard-data';

interface CaseProgressChartProps {
  caseId: string;
  height?: number;
}

export const CaseProgressChart: React.FC<CaseProgressChartProps> = ({ 
  caseId, 
  height = 300 
}) => {
  // Get case details and timeline
  const caseDetails = getCaseDetails(caseId);
  const timeline = getCaseTimeline(caseId);

  // Generate progress data from timeline
  const progressData = React.useMemo(() => {
    if (!timeline || timeline.length === 0) {
      return [];
    }

    // Create progress points based on timeline events
    const progressPoints = timeline
      .filter(event => event.event.includes('Check Completed') || event.event.includes('Consent Received'))
      .map((event, index) => {
        const progress = ((index + 1) / timeline.length) * 100;
        return {
          x: new Date(event.timestamp).toLocaleDateString(),
          y: Math.min(progress, 100)
        };
      });

    // Add initial point
    if (progressPoints.length > 0) {
      progressPoints.unshift({
        x: timeline[0] ? new Date(timeline[0].timestamp).toLocaleDateString() : new Date().toLocaleDateString(),
        y: 0
      });
    }

    return progressPoints;
  }, [timeline]);

  // Create check completion data
  const checkCompletionData = React.useMemo(() => {
    if (!caseDetails || !caseDetails.detailedCheckResults) {
      return [];
    }

    const completedChecks = caseDetails.detailedCheckResults.filter(check => check.status === 'Complete');
    const totalChecks = caseDetails.detailedCheckResults.length;

    return completedChecks.map((check, index) => ({
      x: check.completedDate ? new Date(check.completedDate).toLocaleDateString() : `Check ${index + 1}`,
      y: ((index + 1) / totalChecks) * 100
    }));
  }, [caseDetails]);

  // Combine both datasets
  const chartData = [
    {
      name: 'Overall Progress',
      data: progressData,
      color: 'var(--neumorphic-primary)'
    },
    {
      name: 'Check Completion',
      data: checkCompletionData,
      color: 'var(--neumorphic-accent)'
    }
  ];

  if (progressData.length === 0 && checkCompletionData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-neumorphic-text/70">
        No progress data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <LineChart
        data={chartData}
        title="Case Progress Over Time"
        height={height}
        smooth={true}
        showMarkers={true}
        strokeWidth={3}
        customOptions={{
          yaxis: {
            min: 0,
            max: 100,
            labels: {
              formatter: (value: number) => `${value}%`
            }
          },
          tooltip: {
            y: {
              formatter: (value: number) => `${value.toFixed(1)}%`
            }
          }
        }}
      />
    </div>
  );
};