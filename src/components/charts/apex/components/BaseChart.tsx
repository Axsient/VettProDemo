"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { generateApexTheme } from '../utils/theme-config';
import { neumorphicChartStyles } from '../utils/theme-config';

// Dynamically import ReactApexChart to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), { 
  ssr: false,
  loading: () => <div className={neumorphicChartStyles.loading}>Loading chart...</div>
});

export interface BaseChartProps {
  options: ApexOptions;
  series: ApexOptions['series'];
  type: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick';
  height?: number;
  width?: string | number;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  error?: string | null;
  noData?: boolean;
}

export const BaseChart: React.FC<BaseChartProps> = ({
  options,
  series,
  type,
  height = 350,
  width = '100%',
  title,
  subtitle,
  loading = false,
  error = null,
  noData = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [themeKey, setThemeKey] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen for theme changes and force re-render
  useEffect(() => {
    if (!mounted) return;

    const handleThemeChange = () => {
      console.log('Theme changed, forcing chart re-render');
      setThemeKey(prev => prev + 1);
      

    };

    // Watch for class changes on document element (theme switching)
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, [mounted]);



  // Show loading state
  if (loading) {
    return (
      <div className={neumorphicChartStyles.container}>
        {title && <h3 className={neumorphicChartStyles.title}>{title}</h3>}
        {subtitle && <p className={neumorphicChartStyles.subtitle}>{subtitle}</p>}
        <div className={neumorphicChartStyles.loading}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neumorphic-border"></div>
          <span className="ml-2">Loading chart...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={neumorphicChartStyles.container}>
        {title && <h3 className={neumorphicChartStyles.title}>{title}</h3>}
        {subtitle && <p className={neumorphicChartStyles.subtitle}>{subtitle}</p>}
        <div className={neumorphicChartStyles.error}>
          <span>⚠️ {error}</span>
        </div>
      </div>
    );
  }

  // Show no data state
  if (noData || !series || series.length === 0) {
    return (
      <div className={neumorphicChartStyles.container}>
        {title && <h3 className={neumorphicChartStyles.title}>{title}</h3>}
        {subtitle && <p className={neumorphicChartStyles.subtitle}>{subtitle}</p>}
        <div className={neumorphicChartStyles.noData}>
          <span>📊 No data available</span>
        </div>
      </div>
    );
  }

  // Don't render on server
  if (!mounted) {
    return (
      <div className={neumorphicChartStyles.container}>
        {title && <h3 className={neumorphicChartStyles.title}>{title}</h3>}
        {subtitle && <p className={neumorphicChartStyles.subtitle}>{subtitle}</p>}
        <div className={neumorphicChartStyles.loading}>Loading chart...</div>
      </div>
    );
  }

  // Create properly merged options with theme integration
  const themeOptions = generateApexTheme();
  console.log('BaseChart themeOptions:', themeOptions);
  console.log('BaseChart options:', options);
  
  // Create properly merged options with theme integration
  // For pie/donut charts, avoid axis configurations that can cause offsetY errors
  const isPieOrDonut = type === 'pie' || type === 'donut';
  
  const mergedOptions: ApexOptions = {
    // Start with theme options as base
    ...themeOptions,
    // Then apply user options
    ...options,
    // Finally ensure critical theme values are preserved
    chart: {
      ...themeOptions.chart,
      ...options.chart,
      background: 'transparent',
      foreColor: themeOptions.chart?.foreColor || '#000',
      fontFamily: 'inherit',
    },
  };

  // Only add axis configurations for non-pie/donut charts
  if (!isPieOrDonut) {
    // Ensure axis labels use theme colors
    mergedOptions.xaxis = {
      ...themeOptions.xaxis,
      ...options.xaxis,
      labels: {
        ...themeOptions.xaxis?.labels,
        ...options.xaxis?.labels,
        style: {
          ...themeOptions.xaxis?.labels?.style,
          ...options.xaxis?.labels?.style,
          colors: themeOptions.xaxis?.labels?.style?.colors || [themeOptions.chart?.foreColor || '#000'],
        },
      },
    };

    // Handle yaxis (can be single object or array)
    mergedOptions.yaxis = (() => {
      const themeYaxis = themeOptions.yaxis;
      const userYaxis = options.yaxis;
      
      // If user provided array, preserve it but apply theme to first element
      if (Array.isArray(userYaxis)) {
        return userYaxis.map((axis) => ({
          ...axis,
          labels: {
            ...axis.labels,
            style: {
              ...axis.labels?.style,
              colors: [themeOptions.chart?.foreColor || '#000'],
            },
          },
        }));
      }
      
      // Single yaxis object
      return {
        ...(typeof themeYaxis === 'object' && !Array.isArray(themeYaxis) ? themeYaxis : {}),
        ...(typeof userYaxis === 'object' && !Array.isArray(userYaxis) ? userYaxis : {}),
        labels: {
          ...(typeof themeYaxis === 'object' && !Array.isArray(themeYaxis) ? themeYaxis.labels : {}),
          ...(typeof userYaxis === 'object' && !Array.isArray(userYaxis) ? userYaxis.labels : {}),
          style: {
            ...(typeof themeYaxis === 'object' && !Array.isArray(themeYaxis) ? themeYaxis.labels?.style : {}),
            ...(typeof userYaxis === 'object' && !Array.isArray(userYaxis) ? userYaxis.labels?.style : {}),
            colors: [themeOptions.chart?.foreColor || '#000'],
          },
        },
      };
    })();
  }

  return (
    <div className={neumorphicChartStyles.container}>
      {title && <h3 className={neumorphicChartStyles.title}>{title}</h3>}
      {subtitle && <p className={neumorphicChartStyles.subtitle}>{subtitle}</p>}
      
      <ReactApexChart
        key={themeKey} // Force re-render when theme changes
        options={mergedOptions}
        series={series}
        type={type}
        height={height}
        width={width}
      />
    </div>
  );
}; 