"use client";

import React from 'react';
import { LineChart } from './LineChart';
import { BaseChartProps } from '../types/chart-types';
import { sampleData } from '../examples/sample-data';

export interface PerformanceMonitoringChartProps extends Omit<BaseChartProps, 'data'> {
  /** Use sample data for development, replace with API data later */
  useSampleData?: boolean;
  /** Custom data override */
  data?: BaseChartProps['data'];
  /** Show weekend patterns (lower volume) */
  showWeekendPatterns?: boolean;
}

/**
 * PerformanceMonitoringChart - Specialized component for tracking verification processing performance
 * 
 * **Use Cases:**
 * - Monitor daily/weekly verification processing volume
 * - Track operational efficiency and capacity utilization
 * - Identify processing bottlenecks and peak periods
 * - Support resource planning and staffing decisions
 * - Monitor SLA compliance through processing speed
 * 
 * **Data Format:**
 * - X-axis: Time periods (days, weeks, months)
 * - Y-axis: Number of verifications processed
 * - Automatically handles weekend patterns (lower processing on weekends)
 */
export const PerformanceMonitoringChart: React.FC<PerformanceMonitoringChartProps> = ({
  useSampleData = true,
  data,
  title = "Verification Processing Performance",
  subtitle = "Daily verification volume over time",
  height = 350,
  showWeekendPatterns = true,
  ...props
}) => {
  // Use sample data or provided data
  const chartData = data || (useSampleData ? sampleData.verificationVolume : []);

  return (
    <LineChart
      data={chartData}
      title={title}
      subtitle={subtitle}
      height={height}
      smooth={true}
      showMarkers={true}
      markerSize={4}
      strokeWidth={2}
      showGrid={true}
      enableZoom={true}
      enablePan={true}
      customOptions={{
        colors: ['#10B981'], // Green color for performance metrics
        yaxis: {
          min: 0,
          title: {
            text: 'Verifications Processed',
          },
          labels: {
            formatter: (value: number) => Math.floor(value).toString(),
          },
        },
        xaxis: {
          type: 'datetime',
          title: {
            text: 'Date',
          },
          labels: {
            datetimeFormatter: {
              year: 'yyyy',
              month: 'MMM \'yy',
              day: 'dd MMM',
              hour: 'HH:mm',
            },
          },
        },
        ...(showWeekendPatterns && {
          annotations: {
            points: [
              {
                x: new Date().getTime(),
                y: 45,
                marker: {
                  size: 0,
                },
                label: {
                  text: 'Weekday Average',
                  style: {
                    color: '#10B981',
                  },
                },
              },
            ],
          },
        }),
        tooltip: {
          x: {
            format: 'dd MMM yyyy',
          },
          y: {
            formatter: (value: number) => `${Math.floor(value)} verifications`,
          },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.25,
            gradientToColors: ['#34D399'],
            inverseColors: false,
            opacityFrom: 0.85,
            opacityTo: 0.85,
          },
        },
      }}
      {...props}
    />
  );
}; 