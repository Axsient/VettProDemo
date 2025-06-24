"use client";

import React from 'react';
import { ApexOptions } from 'apexcharts';
import { BaseChart } from './BaseChart';
import { generateColorPalette, generateApexTheme } from '../utils/theme-config';

export interface BarChartProps {
  data: BarChartData[] | BarSeriesData[];
  title?: string;
  subtitle?: string;
  height?: number;
  width?: string | number;
  loading?: boolean;
  error?: string;
  
  // Bar-specific props
  orientation?: 'vertical' | 'horizontal';
  type?: 'basic' | 'grouped' | 'stacked' | 'stacked100';
  showDataLabels?: boolean;
  dataLabelPosition?: 'top' | 'center' | 'bottom';
  
  // Styling
  barWidth?: string | number;
  borderRadius?: number;
  gradient?: boolean;
  
  // Interactions
  enableZoom?: boolean;
  onBarClick?: (data: { category: string; value: number; seriesName?: string }) => void;
  
  customOptions?: Partial<ApexOptions>;
  className?: string;
}

export interface BarChartData {
  x: string;
  y: number;
  color?: string;
  label?: string;
}

export interface BarSeriesData {
  name: string;
  data: BarChartData[];
  color?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  subtitle,
  height = 350,
  width = '100%',
  loading = false,
  error,
  orientation = 'vertical',
  type = 'basic',
  showDataLabels = true,
  dataLabelPosition = 'top',
  barWidth = '70%',
  borderRadius = 4,
  gradient = true,
  enableZoom = false,
  onBarClick,
  customOptions = {},
  className
}) => {
  // Transform data for ApexCharts
  const transformedData = React.useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    // Check if data is BarSeriesData[] (multi-series) or BarChartData[] (single series)
    if (data.length > 0 && 'name' in data[0]) {
      // Multi-series data
      const seriesData = data as BarSeriesData[];
      return seriesData.map((series, index) => ({
        name: series.name,
        data: series.data.map((point) => ({
          x: point.x,
          y: point.y,
        })),
        color: series.color || generateColorPalette(seriesData.length)[index],
      }));
    } else {
      // Single series data
      const singleData = data as BarChartData[];
      return [{
        name: title || 'Data',
        data: singleData.map((point) => ({
          x: point.x,
          y: point.y,
        })),
        color: generateColorPalette(1)[0],
      }];
    }
  }, [data, title]);

  // Generate ApexCharts options
  const options: ApexOptions = React.useMemo(() => {
    console.log('BarChart transformedData:', transformedData);
    
    const isHorizontal = orientation === 'horizontal';
    const isStacked = type === 'stacked' || type === 'stacked100';
    const isGrouped = type === 'grouped';

    // Get theme colors for text elements
    const themeOptions = generateApexTheme();
    const textColor = themeOptions.chart?.foreColor || '#000000';

    return {
      chart: {
        type: 'bar',
        stacked: isStacked,
        stackType: type === 'stacked100' ? '100%' : undefined,
        zoom: {
          enabled: enableZoom,
        },
        events: onBarClick ? {
          dataPointSelection: (event: unknown, chartContext: unknown, config: { seriesIndex: number; dataPointIndex: number }) => {
            try {
              const seriesIndex = config.seriesIndex;
              const dataPointIndex = config.dataPointIndex;
              const series = transformedData[seriesIndex];
              const point = series?.data[dataPointIndex];
              if (point && onBarClick) {
                onBarClick({
                  category: String(point.x),
                  value: point.y,
                  seriesName: series.name,
                });
              }
            } catch (error) {
              console.warn('Error in bar click handler:', error);
            }
          }
        } : {},
      },
      plotOptions: {
        bar: {
          horizontal: isHorizontal,
          columnWidth: barWidth,
          borderRadius: borderRadius,
          dataLabels: {
            position: dataLabelPosition,
          },
        },
      },
      dataLabels: {
        enabled: showDataLabels,
        formatter: (value: number) => {
          // Format numbers with South African formatting
          if (typeof value === 'number') {
            if (type === 'stacked100') {
              return `${value.toFixed(1)}%`;
            } else if (value >= 1000000) {
              return `${(value / 1000000).toFixed(1)}M`;
            } else if (value >= 1000) {
              return `${(value / 1000).toFixed(1)}K`;
            } else if (value % 1 === 0) {
              return value.toString();
            } else {
              return value.toFixed(1);
            }
          }
          return value;
        },
        style: {
          fontSize: '12px',
          fontWeight: 'bold',
          colors: [textColor], // Force data label color
        },
      },
      fill: {
        type: gradient ? 'gradient' : 'solid',
        gradient: gradient ? {
          shade: 'light',
          type: isHorizontal ? 'horizontal' : 'vertical',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        } : undefined,
      },
      grid: {
        show: true,
        borderColor: 'var(--neumorphic-border)',
        strokeDashArray: 0,
        position: 'back',
        xaxis: {
          lines: {
            show: false
          }
        },   
        yaxis: {
          lines: {
            show: true
          }
        },
      },
      xaxis: {
        type: 'category',
        labels: {
          style: {
            fontSize: '12px',
            colors: [textColor], // Force axis label color
          },
          rotate: isHorizontal ? 0 : -45,
          maxHeight: isHorizontal ? undefined : 120,
        },
      },
      yaxis: {
        labels: {
          formatter: (value: number) => {
            // Format numbers with proper South African number formatting
            if (typeof value === 'number') {
              if (type === 'stacked100') {
                return `${value}%`;
              } else if (value >= 1000000) {
                return `${(value / 1000000).toFixed(1)}M`;
              } else if (value >= 1000) {
                return `${(value / 1000).toFixed(1)}K`;
              } else if (value % 1 === 0) {
                return value.toString();
              } else {
                return value.toFixed(1);
              }
            }
            return value;
          },
          style: {
            fontSize: '12px',
            colors: [textColor], // Force Y-axis label color
          },
        },
      },
      tooltip: {
        shared: isStacked || isGrouped,
        intersect: false,
        y: {
          formatter: (value: number, { seriesIndex }) => {
            const seriesName = (transformedData && transformedData[seriesIndex]?.name) || '';
            
            // Custom formatting based on series name or data type
            if (type === 'stacked100') {
              return `${value.toFixed(1)}%`;
            } else if (seriesName.toLowerCase().includes('cost') || seriesName.toLowerCase().includes('zar')) {
              return `R ${value.toLocaleString('en-ZA')}`;
            } else if (seriesName.toLowerCase().includes('score') || seriesName.toLowerCase().includes('rating')) {
              return `${value}/10`;
            } else if (seriesName.toLowerCase().includes('percentage') || seriesName.toLowerCase().includes('%')) {
              return `${value}%`;
            } else {
              return value.toLocaleString('en-ZA');
            }
          },
        },
      },
      legend: {
        show: transformedData && transformedData.length > 1,
        position: 'top',
        horizontalAlign: 'center',
      },
      colors: transformedData?.map(series => series.color) || generateColorPalette(1),
      // Merge with base theme options to ensure proper theming
      ...themeOptions,
      // Apply custom options last to allow overrides
      ...customOptions,
    };
  }, [
    orientation,
    type,
    showDataLabels,
    dataLabelPosition,
    barWidth,
    borderRadius,
    gradient,
    enableZoom,
    transformedData,
    onBarClick,
    customOptions,
  ]);

  return (
    <div className={className}>
      <BaseChart
        options={options}
        series={transformedData || []}
        type="bar"
        height={height}
        width={width}
        title={title}
        subtitle={subtitle}
        loading={loading}
        error={error}
        noData={!data || !Array.isArray(data) || data.length === 0}
      />
    </div>
  );
}; 