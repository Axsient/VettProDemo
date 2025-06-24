'use client';

import React from 'react';
import { DonutChart } from './DonutChart';
import { provincialSupplierDistributionData } from '../examples/sample-data';

interface ProvincialSupplierDonutChartProps {
  useSampleData?: boolean;
  provincialData?: Array<{
    province: string;
    supplierCount: number;
    percentage?: number;
    averageRiskScore?: number;
  }>;
  title?: string;
  subtitle?: string;
  height?: number;
  [key: string]: unknown;
}

export const ProvincialSupplierDonutChart: React.FC<ProvincialSupplierDonutChartProps> = ({
  useSampleData = true,
  provincialData,
  title = "Supplier Distribution by Province",
  subtitle = "Geographic distribution of registered suppliers",
  height = 450,
  ...props
}) => {
  const chartData = React.useMemo(() => {
    if (useSampleData) {
      return provincialSupplierDistributionData;
    }
    
    if (!provincialData || !Array.isArray(provincialData)) {
      return [];
    }
    
    return provincialData.map((item) => ({
      x: item.province,
      y: item.percentage || item.supplierCount,
      label: `${item.province}: ${item.supplierCount} suppliers`,
      riskScore: item.averageRiskScore,
    }));
  }, [useSampleData, provincialData]);

  const totalSuppliers = React.useMemo(() => {
    if (useSampleData) {
      return chartData.reduce((sum, item) => sum + item.y, 0);
    }
    
    if (provincialData) {
      return provincialData.reduce((sum: number, item) => sum + item.supplierCount, 0);
    }
    
    return 0;
  }, [chartData, provincialData, useSampleData]);

  const provincialColors = [
    '#8B5CF6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', 
    '#EC4899', '#6B7280', '#14B8A6', '#F97316'
  ];

  return (
    <DonutChart
      data={chartData}
      title={title}
      subtitle={subtitle}
      height={height}
      centerText={useSampleData ? `${totalSuppliers}%` : totalSuppliers.toLocaleString()}
      centerSubtext={useSampleData ? 'Coverage' : 'Total Suppliers'}
      showLabels={true}
      showLegend={true}
      legendPosition="right"
      donutSize="65%"
      customOptions={{
        colors: provincialColors,
        legend: {
          position: 'right',
          height: 350,
        },
      }}
      {...props}
    />
  );
};

export default ProvincialSupplierDonutChart; 