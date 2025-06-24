'use client';

import React from 'react';
import { DonutChart } from './DonutChart';
import { BaseChartProps } from '../types';
import { verificationCompletionStatusData } from '../examples/sample-data';

/**
 * VerificationStatusDonutChart - Specialized Donut Chart
 * 
 * Shows verification completion status with center completion percentage:
 * - Completed: Green - Verifications successfully finished
 * - In Progress: Blue - Verifications currently being processed  
 * - Pending: Yellow - Verifications awaiting processing
 * - Failed: Red - Verifications that encountered errors
 * 
 * Use Cases:
 * - Operations dashboard
 * - SLA monitoring
 * - Process efficiency tracking
 * - Resource allocation
 */

interface VerificationStatusDonutChartProps extends Omit<BaseChartProps, 'data'> {
  /** Use sample data for development/demo purposes */
  useSampleData?: boolean;
  /** Custom verification status data */
  statusData?: Array<{
    status: string;
    count: number;
    percentage?: number;
  }>;
  /** Show center completion rate */
  showCompletionRate?: boolean;
}

export const VerificationStatusDonutChart: React.FC<VerificationStatusDonutChartProps> = ({
  useSampleData = true,
  statusData,
  showCompletionRate = true,
  title = "Verification Status Overview",
  subtitle = "Current status of all verification processes",
  height = 400,
  ...props
}) => {
  // Transform status data to chart format
  const chartData = React.useMemo(() => {
    if (useSampleData) {
      return verificationCompletionStatusData;
    }
    
    if (!statusData || !Array.isArray(statusData)) {
      return [];
    }
    
    return statusData.map(item => ({
      x: item.status,
      y: item.percentage || item.count,
      label: `${item.status}: ${item.count} verifications`,
    }));
  }, [useSampleData, statusData]);

  // Calculate completion rate for center display
  const completionStats = React.useMemo(() => {
    if (!chartData.length) return { rate: 0, total: 0 };
    
    const completedItem = chartData.find(item => 
      item.x.toString().toLowerCase().includes('completed')
    );
    
    const total = chartData.reduce((sum, item) => sum + item.y, 0);
    const completed = completedItem ? completedItem.y : 0;
    const rate = total > 0 ? (completed / total) * 100 : 0;
    
    return { rate, total, completed };
  }, [chartData]);

  // Status-appropriate color scheme
  const statusColors = [
    '#10B981', // Green - Completed
    '#3B82F6', // Blue - In Progress
    '#F59E0B', // Amber - Pending
    '#EF4444', // Red - Failed
  ];

  // Center text based on completion rate
  const centerText = showCompletionRate 
    ? `${completionStats.rate.toFixed(1)}%`
    : completionStats.total.toLocaleString();
    
  const centerSubtext = showCompletionRate 
    ? 'Completed'
    : 'Total Verifications';

  return (
    <DonutChart
      data={chartData}
      title={title}
      subtitle={subtitle}
      height={height}
      centerText={centerText}
      centerSubtext={centerSubtext}
      showLabels={true}
      showLegend={true}
      legendPosition="bottom"
      donutSize="70%"
      customOptions={{
        colors: statusColors,
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
        },
        tooltip: {
          y: {
            formatter: function(value: number, { seriesIndex, w }) {
              // Add null checks for ApexCharts context object
              if (!w || !w.globals || !w.globals.seriesTotals || !w.globals.labels) {
                return `${value} verifications`;
              }
              
              const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
              const status = w.globals.labels[seriesIndex] || 'Unknown';
              return `<strong>${status}</strong><br/>${value} verifications (${percentage}%)`;
            },
          },
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '14px',
                  fontWeight: 500,
                },
                value: {
                  show: true,
                  fontSize: '24px',
                  fontWeight: 600,
                },
                total: {
                  show: true,
                  showAlways: true,
                  label: centerSubtext,
                  fontSize: '14px',
                  fontWeight: 500,
                  formatter: function() {
                    return centerText;
                  },
                },
              },
            },
          },
        },
        dataLabels: {
          enabled: false, // Disabled for cleaner donut appearance
        },
      }}
      {...props}
    />
  );
};

export default VerificationStatusDonutChart; 