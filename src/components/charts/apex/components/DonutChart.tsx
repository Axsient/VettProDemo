'use client';

import React from 'react';
import { ApexOptions } from 'apexcharts';
import { BaseChart } from './BaseChart';
import { DonutChartProps, ChartData } from '../types';
import { generateApexTheme, generateColorPalette } from '../utils/theme-config';

/**
 * DonutChart Component for Vetting Application
 * 
 * Specialized for South African vetting scenarios with center content:
 * - Risk factor breakdowns with center KPI
 * - Verification completion status with center percentage
 * - Provincial distributions with center total
 * - Service cost distributions with center amount
 * 
 * Features:
 * - Neumorphic theme integration
 * - Center text and subtext support
 * - Responsive design
 * - Interactive legends and tooltips
 * - South African context (percentages, ZAR amounts)
 * - Error boundaries and null safety
 */
export const DonutChart: React.FC<DonutChartProps> = ({
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
  donutSize = '65%',
  centerText,
  centerSubtext,
  onDataPointClick,
  customOptions = {},
  ...props
}) => {
  // Transform and validate data with null safety
  const transformedData = React.useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];
    
    try {
      // For donut charts, we expect ChartData[] not SeriesData[]
      const chartData = data as ChartData[];
      return chartData.map((item) => ({
        x: item.x?.toString() || 'Unknown',
        y: typeof item.y === 'number' ? item.y : 0,
        label: item.label,
        color: item.color,
      }));
    } catch (error) {
      console.warn('DonutChart data transformation error:', error);
      return [];
    }
  }, [data]);

  // Generate theme-appropriate colors
  const colors = React.useMemo(() => {
    return generateColorPalette(transformedData.length);
  }, [transformedData.length]);

  // Calculate center text values
  const centerValues = React.useMemo(() => {
    if (!transformedData.length) return { total: 0, text: '', subtext: '' };
    
    const total = transformedData.reduce((sum, item) => sum + item.y, 0);
    
    return {
      total,
      text: centerText || total.toLocaleString(),
      subtext: centerSubtext || 'Total',
    };
  }, [transformedData, centerText, centerSubtext]);

  // Generate ApexCharts options with null safety
  const options: ApexOptions = React.useMemo(() => {
    const themeOptions = generateApexTheme();
    
    return {
      chart: {
        type: 'donut',
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
                seriesIndex: 0, // Donut charts have single series
                dataPointIndex: config.dataPointIndex,
                series: title || 'Donut Chart',
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
          donut: {
            size: donutSize,
            labels: {
              show: !!(centerValues.text || centerValues.subtext),
              name: {
                show: true,
                fontSize: '14px',
                fontFamily: 'inherit',
                fontWeight: 500,
                color: themeOptions.chart?.foreColor || '#000',
                formatter: function() {
                  return centerValues.subtext;
                },
              },
              value: {
                show: true,
                fontSize: '20px',
                fontFamily: 'inherit',
                fontWeight: 600,
                color: themeOptions.chart?.foreColor || '#000',
                formatter: function() {
                  return centerValues.text;
                },
              },
              total: {
                show: true,
                showAlways: true,
                label: centerValues.subtext,
                fontSize: '14px',
                fontFamily: 'inherit',
                fontWeight: 500,
                color: themeOptions.chart?.foreColor || '#666',
                formatter: function() {
                  return centerValues.text;
                },
              },
            },
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
            plotOptions: {
              pie: {
                donut: {
                  labels: {
                    name: {
                      fontSize: '12px',
                    },
                    value: {
                      fontSize: '16px',
                    },
                    total: {
                      fontSize: '12px',
                    },
                  },
                },
              },
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
            plotOptions: {
              pie: {
                donut: {
                  size: '70%', // Larger donut on small screens
                  labels: {
                    name: {
                      fontSize: '10px',
                    },
                    value: {
                      fontSize: '14px',
                    },
                    total: {
                      fontSize: '10px',
                    },
                  },
                },
              },
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
    donutSize,
    centerValues,
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
            <div className="text-sm mt-1">No data to display in the donut chart</div>
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
        type="donut"
        height={height}
        width={width}
        {...props}
      />
    </div>
  );
};

export default DonutChart; 