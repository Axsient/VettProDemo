"use client";

import React from 'react';
import { ApexOptions } from 'apexcharts';
import { BaseChart } from './BaseChart';
import { LineChartProps } from '../types/chart-types';
import { generateColorPalette } from '../utils/theme-config';
// import { responsiveOptions } from '../utils/theme-config'; // Temporarily commented out for debugging

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  subtitle,
  height = 350,
  width = '100%',
  loading = false,
  error,
  smooth = true,
  showMarkers = true,
  markerSize = 4,
  strokeWidth = 2,
  showGrid = true,
  enableZoom = true,
  enablePan = false,
  onDataPointClick,
  onLegendClick,
  customOptions = {},
  ...props
}) => {
  // Transform data for ApexCharts
  const transformedData = React.useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return [];

    // Check if data is SeriesData[] (multi-series) or ChartData[] (single series)
    if (data.length > 0 && 'name' in data[0]) {
      // Multi-series data
      return (data as { name: string; data: { x: string | number | Date; y: number }[]; color?: string }[]).map((series, index) => ({
        name: series.name,
        data: series.data.map((point) => ({
          x: point.x,
          y: point.y,
        })),
        color: series.color || generateColorPalette(data.length)[index],
      }));
    } else {
      // Single series data
      return [{
        name: title || 'Data',
        data: (data as { x: string | number | Date; y: number }[]).map((point) => ({
          x: point.x,
          y: point.y,
        })),
        color: generateColorPalette(1)[0],
      }];
    }
  }, [data, title]);

  // Generate ApexCharts options
  const options: ApexOptions = React.useMemo(() => {
    console.log('LineChart transformedData:', transformedData);
    
    return {
      chart: {
        type: 'line',
        zoom: {
          enabled: enableZoom,
        },
        pan: {
          enabled: enablePan,
        },
        events: onDataPointClick || onLegendClick ? {
          ...(onDataPointClick && {
            dataPointSelection: (event: unknown, chartContext: unknown, config: { seriesIndex: number; dataPointIndex: number }) => {
              try {
                const seriesIndex = config.seriesIndex;
                const dataPointIndex = config.dataPointIndex;
                const series = transformedData[seriesIndex];
                const point = series?.data[dataPointIndex];
                if (point) {
                  onDataPointClick({
                    x: point.x,
                    y: point.y,
                    seriesIndex,
                    dataPointIndex,
                    series: series.name || '',
                  });
                }
              } catch (error) {
                console.warn('Error in dataPointSelection:', error);
              }
            }
          }),
          ...(onLegendClick && {
            legendClick: (chartContext: unknown, seriesIndex: number) => {
              try {
                const seriesName = transformedData[seriesIndex]?.name || '';
                onLegendClick(seriesName, seriesIndex);
              } catch (error) {
                console.warn('Error in legendClick:', error);
              }
            }
          }),
        } : {},
      },
      stroke: {
        curve: smooth ? 'smooth' : 'straight',
        width: strokeWidth,
      },
      markers: {
        size: showMarkers ? markerSize : 0,
        strokeWidth: 1,
        strokeOpacity: 0.9,
        fillOpacity: 1,
        hover: {
          size: showMarkers ? markerSize + 2 : 0,
        },
      },
      grid: {
        show: showGrid,
      },
      xaxis: {
        type: 'category',
        labels: {
          rotate: -45,
          maxHeight: 120,
        },
      },
      yaxis: {
        labels: {
          formatter: (value) => {
            // Format numbers with proper South African number formatting
            if (typeof value === 'number') {
              if (value >= 1000000) {
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
        },
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (value, { seriesIndex }) => {
            const seriesName = (transformedData && transformedData[seriesIndex]?.name) || '';
            
            // Custom formatting based on series name or data type
            if (seriesName.toLowerCase().includes('cost') || seriesName.toLowerCase().includes('zar')) {
              return `R ${value.toLocaleString('en-ZA')}`;
            } else if (seriesName.toLowerCase().includes('score') || seriesName.toLowerCase().includes('rating')) {
              return `${value}/10`;
            } else if (seriesName.toLowerCase().includes('percentage') || seriesName.toLowerCase().includes('%')) {
              return `${value}%`;
            } else if (seriesName.toLowerCase().includes('days')) {
              return `${value} days`;
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
      // Temporarily remove responsive options to debug
      // responsive: responsiveOptions,
      ...customOptions,
    };
  }, [
    smooth,
    showMarkers,
    markerSize,
    strokeWidth,
    showGrid,
    enableZoom,
    enablePan,
    transformedData,
    onDataPointClick,
    onLegendClick,
    customOptions,
  ]);

  return (
    <BaseChart
      options={options}
      series={transformedData || []}
      type="line"
      height={height}
      width={width}
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
      noData={!data || !Array.isArray(data) || data.length === 0}
      {...props}
    />
  );
}; 