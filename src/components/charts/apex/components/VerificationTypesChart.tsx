"use client";

import React from 'react';
import { BarChart, BarChartProps } from './BarChart';
import { verificationTypesBarData } from '../examples/sample-data';

export interface VerificationTypesChartProps extends Omit<BarChartProps, 'data' | 'orientation' | 'type'> {
  useSampleData?: boolean;
  customData?: { x: string; y: number }[];
}

export const VerificationTypesChart: React.FC<VerificationTypesChartProps> = ({
  useSampleData = true,
  customData,
  title = "Verification Types Distribution",
  subtitle = "Total verifications performed by type (monthly)",
  height = 500,
  ...props
}) => {
  const data = React.useMemo(() => {
    if (!useSampleData && customData) {
      return customData;
    }
    return verificationTypesBarData;
  }, [useSampleData, customData]);

  return (
    <BarChart
      data={data}
      title={title}
      subtitle={subtitle}
      height={height}
      orientation="horizontal"
      type="basic"
      showDataLabels={true}
      dataLabelPosition="center"
      gradient={true}
      customOptions={{
        colors: ['#8b5cf6'], // Purple theme
        plotOptions: {
          bar: {
            distributed: false,
            barHeight: '80%',
          },
        },
        tooltip: {
          y: {
            formatter: (value: number) => {
              const total = verificationTypesBarData.reduce((sum, item) => sum + item.y, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${value.toLocaleString('en-ZA')} verifications (${percentage}%)`;
            },
          },
        },
        xaxis: {
          title: {
            text: 'Number of Verifications',
          },
        },
        yaxis: {
          title: {
            text: 'Verification Type',
          },
        },
        annotations: {
          xaxis: [
            {
              x: 1000,
              borderColor: '#8b5cf6',
              borderWidth: 2,
              strokeDashArray: 4,
              label: {
                text: 'High Volume',
                style: {
                  color: '#8b5cf6',
                  background: '#f3f4f6',
                },
              },
            },
          ],
        },
      }}
      onBarClick={(data) => {
        console.log('Verification type clicked:', data);
        // Could trigger drill-down to show monthly trends for this verification type
      }}
      {...props}
    />
  );
}; 