'use client';

import React from 'react';
import { ApexOptions } from 'apexcharts';
import { BaseChart } from './BaseChart';
import { PieChartProps, ChartData } from '../types';
import { generateApexTheme, generateColorPalette } from '../utils/theme-config';

/**
 * PieChart Component for Vetting Application
 * 
 * Specialized for South African vetting scenarios:
 * - Risk level distributions
 * - Verification outcome breakdowns
 * - Service type distributions
 * - Sector/provincial distributions
 * 
 * Features:
 * - Neumorphic theme integration
 * - Responsive design
 * - Interactive legends and tooltips
 * - South African context (percentages, local business categories)
 * - Error boundaries and null safety
 */
export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  subtitle,
  height = 400,
  width,
  className,
  loading,
  error,
  showLabels = true,
  showLegend = true,
  legendPosition = 'bottom',
  onDataPointClick,
  // onLegendClick, // TODO: Implement legend click handling
  customOptions = {},
  ...props
}) => {
  // Transform and validate data with null safety
  const transformedData = React.useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    
    try {
      // For pie charts, we expect ChartData[] not SeriesData[]
      const chartData = data as ChartData[];
      return chartData.map((item) => ({
        x: item.x?.toString() || 'Unknown',
        y: typeof item.y === 'number' ? item.y : 0,
        label: item.label,
        color: item.color,
      }));
    } catch (error) {
      console.warn('PieChart data transformation error:', error);
      return [];
    }
  }, [data]);

  // Generate theme-appropriate colors
  const colors = React.useMemo(() => {
    return generateColorPalette(transformedData.length);
  }, [transformedData.length]);

  // Generate ApexCharts options with null safety
  const options: ApexOptions = React.useMemo(() => {
    const themeOptions = generateApexTheme();
    
    return {
      chart: {
        type: 'pie',
        fontFamily: 'inherit',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false,
          },
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
        },
        events: onDataPointClick ? {
          dataPointSelection: (event: unknown, chartContext: unknown, config: { seriesIndex: number; dataPointIndex: number }) => {
            const point = transformedData[config.dataPointIndex];
            if (point) {
              onDataPointClick({
                x: point.x,
                y: point.y,
                seriesIndex: 0, // Pie charts have single series
                dataPointIndex: config.dataPointIndex,
                series: title || 'Pie Chart',
                label: point.label,
              });
            }
          },
        } : {},
        ...themeOptions.chart,
      },
      colors,
      labels: transformedData.map(item => item.x),
      series: transformedData.map(item => item.y),
      title: title ? {
        text: title,
        style: {
          fontSize: '16px',
          fontWeight: '600',
          color: themeOptions.chart?.foreColor || '#000',
        },
        align: 'center',
        margin: 20,
      } : undefined,
      subtitle: subtitle ? {
        text: subtitle,
        style: {
          fontSize: '14px',
          color: themeOptions.chart?.foreColor || '#666',
        },
        align: 'center',
      } : undefined,
      legend: {
        show: showLegend && transformedData && transformedData.length > 1,
        position: legendPosition,
        horizontalAlign: 'center',
        fontSize: '13px',
        fontFamily: 'inherit',
        fontWeight: 500,
        itemMargin: {
          horizontal: 8,
          vertical: 4,
        },
        onItemClick: {
          toggleDataSeries: true,
        },
        onItemHover: {
          highlightDataSeries: true,
        },
      },
      dataLabels: {
        enabled: showLabels,
        style: {
          fontSize: '12px',
          fontFamily: 'inherit',
          fontWeight: '500',
        },
        formatter: function(val: number) {
          return `${val.toFixed(1)}%`;
        },
        dropShadow: {
          enabled: false,
        },
      },
      plotOptions: {
        pie: {
          size: undefined, // Let ApexCharts auto-size
          donut: {
            size: '0%', // 0% for pie chart (not donut)
          },
          expandOnClick: true,
          dataLabels: {
            minAngleToShowLabel: 10,
          },
        },
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          fontSize: '13px',
          fontFamily: 'inherit',
        },
        y: {
          formatter: function(value: number, { w }) {
            // Add null checks for ApexCharts context object
            if (!w || !w.globals || !w.globals.seriesTotals) {
              return `${value}`;
            }
            
            const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
            return `${value} (${percentage}%)`;
          },
        },
        marker: {
          show: true,
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
            dataLabels: {
              enabled: false, // Hide labels on mobile for cleaner look
            },
          },
        },
        {
          breakpoint: 480,
          options: {
            legend: {
              show: false, // Hide legend on very small screens
            },
            dataLabels: {
              enabled: false,
            },
          },
        },
      ],
      // Apply custom options last to allow overrides
      ...customOptions,
    };
  }, [
    transformedData,
    title,
    subtitle,
    showLabels,
    showLegend,
    legendPosition,
    colors,
    onDataPointClick,
    customOptions,
  ]);

  // Show loading state
  if (loading) {
    return (
      <div className={className}>
        <div 
          className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg"
          style={{ height }}
        >
          <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={className}>
        <div 
          className="flex items-center justify-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          style={{ height }}
        >
          <div className="text-red-600 dark:text-red-400 text-center p-4">
            <div className="font-semibold">Chart Error</div>
            <div className="text-sm mt-1">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!transformedData || transformedData.length === 0) {
    return (
      <div className={className}>
        <div 
          className="flex items-center justify-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          style={{ height }}
        >
          <div className="text-gray-500 dark:text-gray-400 text-center">
            <div className="font-medium">No Data Available</div>
            <div className="text-sm mt-1">No data to display in the pie chart</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <BaseChart
        options={options}
        series={transformedData.map(item => item.y)}
        type="pie"
        height={height}
        width={width}
        {...props}
      />
    </div>
  );
};

export default PieChart; 