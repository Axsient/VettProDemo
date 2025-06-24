"use client";

import React from 'react';
import { BaseChart } from '../components/BaseChart';
import { generateApexTheme, generateColorPalette } from '../utils/theme-config';
import { monthlyRevenueData } from './sample-data';
import { ApexOptions } from 'apexcharts';

export const BasicDemo: React.FC = () => {
  // Chart configuration with neumorphic theme
  const chartOptions: ApexOptions = {
    ...generateApexTheme(),
    colors: generateColorPalette(1),
    chart: {
      ...generateApexTheme().chart,
      type: 'line',
      height: 350,
      zoom: {
        enabled: true,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 6,
      strokeWidth: 2,
      hover: {
        size: 8,
      },
    },
    xaxis: {
      ...generateApexTheme().xaxis,
      categories: monthlyRevenueData.map(item => item.x as string),
    },
    yaxis: {
      ...generateApexTheme().yaxis,
      labels: {
        formatter: (value: number) => `R${(value / 1000).toFixed(0)}k`,
      },
    },
    tooltip: {
      ...generateApexTheme().tooltip,
      y: {
        formatter: (value: number) => `R${value.toLocaleString('en-ZA')}`,
      },
    },
  };

  const series = [
    {
      name: 'Monthly Revenue',
      data: monthlyRevenueData.map(item => ({
        x: item.x as string | number,
        y: item.y,
      })),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-neumorphic-text-primary mb-2">
          ApexCharts Basic Demo
        </h2>
        <p className="text-neumorphic-text-secondary">
          Testing the ApexCharts setup with neumorphic theme integration.
        </p>
      </div>

      <BaseChart
        options={chartOptions}
        series={series}
        type="line"
        height={400}
        title="Monthly Revenue Trend"
        subtitle="Revenue performance over the past 12 months"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loading state demo */}
        <BaseChart
          options={chartOptions}
          series={[]}
          type="line"
          height={300}
          title="Loading State Demo"
          loading={true}
        />

        {/* Error state demo */}
        <BaseChart
          options={chartOptions}
          series={[]}
          type="line"
          height={300}
          title="Error State Demo"
          error="Failed to load chart data"
        />
      </div>
    </div>
  );
}; 