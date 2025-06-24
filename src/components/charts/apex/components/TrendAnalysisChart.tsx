"use client";

import React from 'react';
import { LineChart } from './LineChart';
import { BaseChartProps } from '../types/chart-types';
import { sampleData } from '../examples/sample-data';

export interface TrendAnalysisChartProps extends Omit<BaseChartProps, 'data'> {
  /** Use sample data for development, replace with API data later */
  useSampleData?: boolean;
  /** Custom data override */
  data?: BaseChartProps['data'];
}

/**
 * TrendAnalysisChart - Specialized component for tracking supplier risk score trends over time
 * 
 * **Use Cases:**
 * - Track average risk scores of suppliers over time periods
 * - Monitor improvement/deterioration in supplier quality
 * - Identify trends in vetting results
 * - Support risk management decision making
 * 
 * **Data Format:**
 * - X-axis: Time periods (months, quarters, etc.)
 * - Y-axis: Risk scores (1-10 scale, where lower is better)
 * - Multiple series supported for different supplier categories
 */
export const TrendAnalysisChart: React.FC<TrendAnalysisChartProps> = ({
  useSampleData = true,
  data,
  title = "Supplier Risk Score Trends",
  subtitle = "Average risk scores over time (lower is better)",
  height = 350,
  ...props
}) => {
  // Use sample data or provided data
  const chartData = data || (useSampleData ? sampleData.supplierRiskTrends : []);

  return (
    <LineChart
      data={chartData}
      title={title}
      subtitle={subtitle}
      height={height}
      smooth={true}
      showMarkers={true}
      markerSize={5}
      strokeWidth={3}
      showGrid={true}
      enableZoom={true}
      customOptions={{
        colors: ['#EF4444'], // Red color for risk scores
        yaxis: {
          min: 0,
          max: 10,
          title: {
            text: 'Risk Score (1-10)',
          },
          labels: {
            formatter: (value: number) => `${value.toFixed(1)}/10`,
          },
        },
        xaxis: {
          title: {
            text: 'Time Period',
          },
        },
        annotations: {
          yaxis: [
            {
              y: 5.0,
              borderColor: '#FFA500',
              label: {
                text: 'Target Risk Threshold',
                style: {
                  color: '#FFA500',
                },
              },
            },
          ],
        },
        tooltip: {
          y: {
            formatter: (value: number) => `Risk Score: ${value.toFixed(1)}/10`,
          },
        },
      }}
      {...props}
    />
  );
}; 