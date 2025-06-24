"use client";

import React from 'react';
import { BarChart, BarChartProps, BarSeriesData } from './BarChart';
import { stackedRiskBreakdownData } from '../examples/sample-data';

export interface StackedRiskChartProps extends Omit<BarChartProps, 'data' | 'orientation' | 'type'> {
  useSampleData?: boolean;
  customData?: BarSeriesData[];
}

export const StackedRiskChart: React.FC<StackedRiskChartProps> = ({
  useSampleData = true,
  customData,
  title = "Risk Score Breakdown by Category",
  subtitle = "Detailed risk analysis showing component scores (out of 10)",
  height = 450,
  ...props
}) => {
  const data = React.useMemo(() => {
    if (!useSampleData && customData) {
      return customData;
    }
    return stackedRiskBreakdownData;
  }, [useSampleData, customData]);

  return (
    <BarChart
      data={data}
      title={title}
      subtitle={subtitle}
      height={height}
      orientation="vertical"
      type="stacked"
      showDataLabels={true}
      dataLabelPosition="center"
      gradient={false}
      customOptions={{
        colors: ['#ef4444', '#f97316', '#eab308', '#f59e0b'], // Red to amber gradient for different risk types
        plotOptions: {
          bar: {
            columnWidth: '65%',
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: '13px',
                  fontWeight: 900
                }
              }
            }
          },
        },
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'center',
        },
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: (value: number, { seriesIndex }) => {
              const seriesNames = ['Financial Risk', 'Compliance Risk', 'Operational Risk', 'Reputational Risk'];
              const seriesName = seriesNames[seriesIndex] || '';
              return `${seriesName}: ${value.toFixed(1)}/10`;
            },
          },
        },
        xaxis: {
          title: {
            text: 'Suppliers',
          },
          labels: {
            rotate: -45,
            maxHeight: 120,
          },
        },
        yaxis: {
          title: {
            text: 'Risk Score (0-10)',
          },
          max: 10,
        },
        annotations: {
          yaxis: [
            {
              y: 7,
              borderColor: '#ef4444',
              borderWidth: 2,
              strokeDashArray: 4,
              label: {
                text: 'High Risk Threshold',
                style: {
                  color: '#ef4444',
                  background: '#fef2f2',
                },
              },
            },
            {
              y: 4,
              borderColor: '#f97316',
              borderWidth: 2,
              strokeDashArray: 4,
              label: {
                text: 'Medium Risk Threshold',
                style: {
                  color: '#f97316',
                  background: '#fff7ed',
                },
              },
            },
          ],
        },
      }}
      onBarClick={(data) => {
        console.log('Risk category clicked:', data);
        // Could trigger detailed risk report for this supplier and category
      }}
      {...props}
    />
  );
}; 