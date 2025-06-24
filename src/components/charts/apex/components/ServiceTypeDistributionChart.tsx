'use client';

import React from 'react';
import { PieChart } from './PieChart';
import { BaseChartProps } from '../types';
import { vettingServiceTypeDistributionData } from '../examples/sample-data';

/**
 * ServiceTypeDistributionChart - Specialized Pie Chart
 * 
 * Shows distribution of South African vetting service types:
 * - CIPC Registration Check: Company registration verification
 * - Tax Compliance Verification: SARS tax clearance status
 * - BEE Certificate Validation: Black Economic Empowerment compliance
 * - Criminal Background Check: Criminal record verification
 * - Bank Account Verification: Financial account validation
 * - Reference Verification: Professional/personal references
 * - Qualification Verification: Education/certification checks
 * 
 * Use Cases:
 * - Service utilization analysis
 * - Resource allocation planning
 * - Pricing strategy optimization
 * - Compliance monitoring
 */

interface ServiceTypeDistributionChartProps extends Omit<BaseChartProps, 'data'> {
  /** Use sample data for development/demo purposes */
  useSampleData?: boolean;
  /** Custom service type data */
  serviceData?: Array<{
    serviceType: string;
    count: number;
    percentage?: number;
    revenue?: number;
  }>;
  /** Show revenue information in tooltips */
  showRevenue?: boolean;
}

export const ServiceTypeDistributionChart: React.FC<ServiceTypeDistributionChartProps> = ({
  useSampleData = true,
  serviceData,
  showRevenue = false,
  title = "Vetting Service Type Distribution",
  subtitle = "Distribution of verification services utilized",
  height = 450,
  ...props
}) => {
  // Transform service data to chart format
  const chartData = React.useMemo(() => {
    if (useSampleData) {
      return vettingServiceTypeDistributionData;
    }
    
    if (!serviceData || !Array.isArray(serviceData)) {
      return [];
    }
    
    return serviceData.map(item => ({
      x: item.serviceType,
      y: item.percentage || item.count,
      label: `${item.serviceType}: ${item.count} requests`,
      revenue: item.revenue,
    }));
  }, [useSampleData, serviceData]);

  // South African compliance-focused color palette
  const serviceColors = [
    '#8B5CF6', // Purple - CIPC (Primary)
    '#10B981', // Green - Tax Compliance
    '#F59E0B', // Amber - BEE Certificate
    '#EF4444', // Red - Criminal Background
    '#3B82F6', // Blue - Bank Account
    '#6B7280', // Gray - Reference Verification
    '#EC4899', // Pink - Qualification Verification
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
        colors: serviceColors,
        legend: {
          position: 'right',
          height: 300,
          fontSize: '12px',
          itemMargin: {
            horizontal: 5,
            vertical: 3,
          },
        },
        tooltip: {
          y: {
            formatter: function(value: number, { seriesIndex, w }) {
              // Add null checks for ApexCharts context object
              if (!w || !w.globals || !w.globals.seriesTotals || !w.globals.labels) {
                return `${value} requests`;
              }
              
              const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
              const serviceType = w.globals.labels[seriesIndex] || 'Unknown';
              
              let tooltip = `<strong>${serviceType}</strong><br/>${value} requests (${percentage}%)`;
              
              // Add revenue information if available
              if (showRevenue && serviceData && seriesIndex < serviceData.length) {
                const service = serviceData[seriesIndex];
                if (service?.revenue) {
                  tooltip += `<br/>Revenue: R${service.revenue.toLocaleString()}`;
                }
              }
              
              return tooltip;
            },
          },
        },
        plotOptions: {
          pie: {
            dataLabels: {
              minAngleToShowLabel: 8, // Hide labels for very small slices
            },
          },
        },
        dataLabels: {
          formatter: function(val: number) {
            if (val < 5) return ''; // Hide labels for slices smaller than 5%
            return `${val.toFixed(1)}%`;
          },
          style: {
            fontSize: '11px',
            fontWeight: '600',
          },
          dropShadow: {
            enabled: true,
            top: 1,
            left: 1,
            blur: 1,
            opacity: 0.8,
          },
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              legend: {
                position: 'bottom',
                horizontalAlign: 'center',
              },
            },
          },
        ],
      }}
      {...props}
    />
  );
};

export default ServiceTypeDistributionChart; 