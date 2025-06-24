"use client";

import React from 'react';
import { BarChart, BarChartProps, BarSeriesData } from './BarChart';
import { complianceStatusByProvinceData } from '../examples/sample-data';

export interface ComplianceStatusChartProps extends Omit<BarChartProps, 'data' | 'orientation' | 'type'> {
  useSampleData?: boolean;
  customData?: BarSeriesData[];
}

export const ComplianceStatusChart: React.FC<ComplianceStatusChartProps> = ({
  useSampleData = true,
  customData,
  title = "Compliance Status by Province",
  subtitle = "Supplier compliance distribution across South African provinces",
  height = 450,
  ...props
}) => {
  const data = React.useMemo(() => {
    if (!useSampleData && customData) {
      return customData;
    }
    return complianceStatusByProvinceData;
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
        colors: ['#22c55e', '#ef4444', '#f97316'], // Green, Red, Orange for compliance status
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
              const seriesNames = ['Compliant', 'Non-Compliant', 'Under Review'];
              const seriesName = seriesNames[seriesIndex] || '';
              return `${value.toLocaleString('en-ZA')} suppliers ${seriesName.toLowerCase()}`;
            },
          },
        },
        xaxis: {
          title: {
            text: 'South African Provinces',
          },
          labels: {
            rotate: -45,
            maxHeight: 120,
          },
        },
        yaxis: {
          title: {
            text: 'Number of Suppliers',
          },
        },
        annotations: {
          yaxis: [
            {
              y: 300,
              borderColor: '#8b5cf6',
              borderWidth: 2,
              strokeDashArray: 4,
              label: {
                text: 'High Activity Threshold',
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
        console.log('Compliance status clicked:', data);
        // Could trigger drill-down to show specific suppliers in this province/status
      }}
      {...props}
    />
  );
}; 