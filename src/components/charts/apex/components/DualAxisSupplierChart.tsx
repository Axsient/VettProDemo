"use client";

import React from 'react';
import { LineChart } from './LineChart';
import { BaseChartProps } from '../types/chart-types';
import { sampleData } from '../examples/sample-data';

export interface DualAxisSupplierChartProps extends Omit<BaseChartProps, 'data'> {
  /** Use sample data for development, replace with API data later */
  useSampleData?: boolean;
  /** Custom data override */
  data?: BaseChartProps['data'];
}

/**
 * DualAxisSupplierChart - Specialized dual-axis chart for supplier vetting metrics
 * 
 * **Use Cases:**
 * - Compare supplier volume vs quality metrics
 * - Track relationship between vetting volume and average risk scores
 * - Identify if increased vetting leads to better risk management
 * - Support capacity vs quality trade-off analysis
 * 
 * **Data Format:**
 * - Primary Y-axis (left): Number of suppliers vetted
 * - Secondary Y-axis (right): Average risk scores (1-10 scale)
 * - X-axis: Time periods (months, quarters)
 * - Two series: "Suppliers Vetted" and "Average Risk Score"
 */
export const DualAxisSupplierChart: React.FC<DualAxisSupplierChartProps> = ({
  useSampleData = true,
  data,
  title = "Suppliers Vetted vs Average Risk Score",
  subtitle = "Volume and quality metrics correlation",
  height = 400,
  ...props
}) => {
  // Use sample data or provided data
  const chartData = data || (useSampleData ? sampleData.suppliersVsRisk : []);

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
        colors: ['#3B82F6', '#EF4444'], // Blue for volume, Red for risk
        yaxis: [
          {
            seriesName: 'Suppliers Vetted',
            title: {
              text: 'Suppliers Vetted',
              style: {
                color: '#3B82F6',
              },
            },
            labels: {
              style: {
                colors: '#3B82F6',
              },
              formatter: (value: number) => Math.floor(value).toString(),
            },
            min: 0,
          },
          {
            seriesName: 'Average Risk Score',
            opposite: true,
            title: {
              text: 'Average Risk Score (1-10)',
              style: {
                color: '#EF4444',
              },
            },
            labels: {
              style: {
                colors: '#EF4444',
              },
              formatter: (value: number) => `${value.toFixed(1)}/10`,
            },
            min: 0,
            max: 10,
          },
        ],
        xaxis: {
          title: {
            text: 'Time Period',
          },
        },
        stroke: {
          width: [3, 3],
        },
        markers: {
          size: [5, 5],
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: [
            {
              formatter: (value: number) => `${Math.floor(value)} suppliers`,
            },
            {
              formatter: (value: number) => `Risk: ${value.toFixed(1)}/10`,
            },
          ],
        },
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'center',
        },
        annotations: {
          yaxis: [
            {
              y: 5.0,
              y2: 5.0,
              yAxisIndex: 1,
              borderColor: '#FFA500',
              strokeDashArray: 3,
              label: {
                text: 'Risk Target',
                style: {
                  color: '#FFA500',
                  fontSize: '12px',
                },
              },
            },
          ],
        },
      }}
      {...props}
    />
  );
}; 