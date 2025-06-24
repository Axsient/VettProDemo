"use client";

import React from 'react';
import { BarChart, BarChartProps } from './BarChart';
import { supplierRiskCategoriesData } from '../examples/sample-data';

export interface RiskCategoriesChartProps extends Omit<BarChartProps, 'data' | 'orientation' | 'type'> {
  useSampleData?: boolean;
  customData?: { x: string; y: number }[];
}

export const RiskCategoriesChart: React.FC<RiskCategoriesChartProps> = ({
  useSampleData = true,
  customData,
  title = "Supplier Risk Categories Distribution",
  subtitle = "Total suppliers by risk level classification",
  height = 400,
  ...props
}) => {
  const data = React.useMemo(() => {
    if (!useSampleData && customData) {
      return customData;
    }
    return supplierRiskCategoriesData;
  }, [useSampleData, customData]);

  return (
    <BarChart
      data={data}
      title={title}
      subtitle={subtitle}
      height={height}
      orientation="vertical"
      type="basic"
      showDataLabels={true}
      dataLabelPosition="top"
      gradient={true}
      customOptions={{
        colors: ['#ef4444', '#f97316', '#eab308', '#22c55e'], // Red to green gradient for risk levels
        plotOptions: {
          bar: {
            distributed: true, // Different color for each bar
            columnWidth: '60%',
          },
        },
        legend: {
          show: false, // No legend needed for single series with distributed colors
        },
        tooltip: {
          y: {
            formatter: (value: number) => {
              const total = supplierRiskCategoriesData.reduce((sum, item) => sum + item.y, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${value.toLocaleString('en-ZA')} suppliers (${percentage}%)`;
            },
          },
        },
        annotations: {
          yaxis: [
            {
              y: 500,
              borderColor: '#ef4444',
              borderWidth: 2,
              strokeDashArray: 4,
              label: {
                text: 'High Volume Threshold',
                style: {
                  color: '#ef4444',
                  background: '#fef2f2',
                },
              },
            },
          ],
        },
      }}
      onBarClick={(data) => {
        console.log('Risk category clicked:', data);
        // Could trigger drill-down to show specific suppliers in this category
      }}
      {...props}
    />
  );
}; 