"use client";

import React from 'react';
import { BarChart, BarChartProps, BarSeriesData } from './BarChart';
import { prePostVettingComparisonData } from '../examples/sample-data';

export interface PrePostVettingChartProps extends Omit<BarChartProps, 'data' | 'orientation' | 'type'> {
  useSampleData?: boolean;
  customData?: BarSeriesData[];
}

export const PrePostVettingChart: React.FC<PrePostVettingChartProps> = ({
  useSampleData = true,
  customData,
  title = "Pre vs Post-Vetting Risk Score Comparison",
  subtitle = "Demonstrating risk reduction achieved through vetting process",
  height = 450,
  ...props
}) => {
  const data = React.useMemo(() => {
    if (!useSampleData && customData) {
      return customData;
    }
    return prePostVettingComparisonData;
  }, [useSampleData, customData]);



  return (
    <BarChart
      data={data}
      title={title}
      subtitle={subtitle}
      height={height}
      orientation="vertical"
      type="grouped"
      showDataLabels={true}
      dataLabelPosition="top"
      gradient={true}
      customOptions={{
        colors: ['#ef4444', '#22c55e'], // Red for pre-vetting, green for post-vetting
        plotOptions: {
          bar: {
            columnWidth: '75%',
            dataLabels: {
              position: 'top',
            },
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
              const seriesNames = ['Pre-Vetting', 'Post-Vetting'];
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
        console.log('Pre/Post vetting data clicked:', data);
        // Could trigger detailed improvement report for this supplier
      }}
      {...props}
    />
  );
}; 