'use client';

import React from 'react';
import { PieChart } from './PieChart';
import { BaseChartProps } from '../types';
// import { supplierRiskLevelDistributionData } from '../examples/sample-data';

/**
 * RiskLevelDistributionChart - Specialized Pie Chart
 * 
 * Shows supplier distribution across risk levels for South African vetting:
 * - Low Risk (1-3): Green - Suppliers with minimal concerns
 * - Medium Risk (4-6): Yellow/Orange - Suppliers requiring standard monitoring
 * - High Risk (7-8): Orange/Red - Suppliers needing enhanced due diligence
 * - Critical Risk (9-10): Red - Suppliers requiring immediate attention
 * 
 * Use Cases:
 * - Risk portfolio overview
 * - Compliance dashboard summary
 * - Executive reporting
 * - Resource allocation planning
 */

interface RiskLevelDistributionChartProps extends Omit<BaseChartProps, 'data'> {
  /** Use sample data for development/demo purposes */
  useSampleData?: boolean;
  /** Custom risk level distribution data */
  riskData?: Array<{
    level: string;
    count: number;
    percentage?: number;
  }>;
}

export const RiskLevelDistributionChart: React.FC<RiskLevelDistributionChartProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  useSampleData = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  riskData,
  title = "Supplier Risk Level Distribution",
  subtitle = "Distribution of suppliers across risk categories",
  height = 400,
  ...props
}) => {
  // Transform risk data to chart format
  const chartData = React.useMemo(() => {
    // TEMPORARY TEST: Use inline data instead of imported sample data
    return [
      { x: 'Low Risk (1-3)', y: 42 },
      { x: 'Medium Risk (4-6)', y: 35 },
      { x: 'High Risk (7-8)', y: 18 },
      { x: 'Critical Risk (9-10)', y: 5 },
    ];
    
    // if (useSampleData) {
    //   return supplierRiskLevelDistributionData;
    // }
    
    // if (!riskData || !Array.isArray(riskData)) {
    //   return [];
    // }
    
    // return riskData.map(item => ({
    //   x: item.level,
    //   y: item.percentage || item.count,
    //   label: `${item.level}: ${item.count} suppliers`,
    // }));
  }, []);

  // Risk-appropriate color scheme (green to red)
  const riskColors = [
    '#10B981', // Green - Low Risk
    '#F59E0B', // Amber - Medium Risk  
    '#EF4444', // Red - High Risk
    '#DC2626', // Dark Red - Critical Risk
  ];

  return (
    <PieChart
      data={chartData}
      title={title}
      subtitle={subtitle}
      height={height}
      showLabels={true}
      showLegend={true}
      legendPosition="right"
      customOptions={{
        colors: riskColors,
        legend: {
          position: 'right',
          height: 230,
        },
        tooltip: {
          y: {
            formatter: function(value: number, { seriesIndex, w }) {
              // Add null checks for ApexCharts context object
              if (!w || !w.globals || !w.globals.seriesTotals || !w.globals.labels) {
                return `${value} suppliers`;
              }
              
              const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
              const riskLevel = w.globals.labels[seriesIndex] || 'Unknown';
              return `<strong>${riskLevel}</strong><br/>${value} suppliers (${percentage}%)`;
            },
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
            },
          },
        },
        dataLabels: {
          formatter: function(val: number, opts: { seriesIndex: number; w: { globals: { labels: string[] } } }) {
            // Add null checks for ApexCharts context object
            if (!opts || !opts.w || !opts.w.globals || !opts.w.globals.labels) {
              return `${val.toFixed(1)}%`;
            }
            
            const name = opts.w.globals.labels[opts.seriesIndex] || 'Unknown';
            return [`${val.toFixed(1)}%`, name];
          },
          style: {
            fontSize: '12px',
            fontWeight: 'bold',
          },
        },
      }}
      {...props}
    />
  );
};

export default RiskLevelDistributionChart; 