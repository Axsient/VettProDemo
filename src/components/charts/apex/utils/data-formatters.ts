import { ChartData, SeriesData, ChartType } from '../types';

// Transform simple array to chart data format
export const transformToChartData = (
  data: Array<{ x: string | number | Date; y: number; [key: string]: unknown }>,
  xKey: string = 'x',
  yKey: string = 'y'
): ChartData[] => {
  return data.map(item => ({
    x: item[xKey] as string | number | Date,
    y: item[yKey] as number,
    label: item.label as string,
    color: item.color as string,
    group: item.group as string,
  }));
};

// Transform object array to multiple series
export const transformToMultiSeries = (
  data: Array<Record<string, unknown>>,
  xKey: string,
  seriesKeys: string[],
  seriesNames?: string[]
): SeriesData[] => {
  return seriesKeys.map((key, index) => ({
    name: seriesNames?.[index] || key,
    data: data.map(item => ({
      x: item[xKey] as string | number | Date,
      y: item[key] as number,
    })),
  }));
};

// Format data for time series
export const formatTimeSeriesData = (
  data: Array<{ date: string | Date; value: number; [key: string]: unknown }>,
  dateFormat: 'timestamp' | 'date-string' = 'timestamp'
): ChartData[] => {
  return data.map(item => {
    const date = typeof item.date === 'string' ? new Date(item.date) : item.date;
    return {
      x: dateFormat === 'timestamp' ? date.getTime() : date.toISOString().split('T')[0],
      y: item.value,
      label: item.label as string,
    };
  });
};

// Aggregate data by time period
export const aggregateByTimePeriod = (
  data: ChartData[],
  period: 'hour' | 'day' | 'week' | 'month' | 'year',
  aggregateFunction: 'sum' | 'average' | 'count' | 'min' | 'max' = 'sum'
): ChartData[] => {
  const grouped = new Map<string, number[]>();

  data.forEach(item => {
    const date = new Date(item.x);
    let key: string;

    switch (period) {
      case 'hour':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
        break;
      case 'day':
        key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        break;
      case 'week':
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
        break;
      case 'month':
        key = `${date.getFullYear()}-${date.getMonth()}`;
        break;
      case 'year':
        key = `${date.getFullYear()}`;
        break;
      default:
        key = date.toISOString().split('T')[0];
    }

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(item.y);
  });

  return Array.from(grouped.entries()).map(([key, values]) => {
    let aggregatedValue: number;

    switch (aggregateFunction) {
      case 'sum':
        aggregatedValue = values.reduce((sum, val) => sum + val, 0);
        break;
      case 'average':
        aggregatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        break;
      case 'count':
        aggregatedValue = values.length;
        break;
      case 'min':
        aggregatedValue = Math.min(...values);
        break;
      case 'max':
        aggregatedValue = Math.max(...values);
        break;
      default:
        aggregatedValue = values.reduce((sum, val) => sum + val, 0);
    }

    return {
      x: key,
      y: aggregatedValue,
    };
  }).sort((a, b) => String(a.x).localeCompare(String(b.x)));
};

// Sample data for large datasets
export const sampleData = (
  data: ChartData[],
  maxPoints: number,
  method: 'uniform' | 'average' | 'min-max' = 'uniform'
): ChartData[] => {
  if (data.length <= maxPoints) {
    return data;
  }

  switch (method) {
    case 'uniform':
      const step = Math.floor(data.length / maxPoints);
      return data.filter((_, index) => index % step === 0).slice(0, maxPoints);

    case 'average':
      const chunkSize = Math.floor(data.length / maxPoints);
      const sampled: ChartData[] = [];
      
      for (let i = 0; i < data.length; i += chunkSize) {
        const chunk = data.slice(i, i + chunkSize);
        const avgY = chunk.reduce((sum, item) => sum + item.y, 0) / chunk.length;
        sampled.push({
          x: chunk[Math.floor(chunk.length / 2)].x,
          y: avgY,
        });
      }
      return sampled.slice(0, maxPoints);

    case 'min-max':
      const minMaxSampled: ChartData[] = [];
      const chunkSizeMinMax = Math.floor(data.length / (maxPoints / 2));
      
      for (let i = 0; i < data.length; i += chunkSizeMinMax) {
        const chunk = data.slice(i, i + chunkSizeMinMax);
        const minItem = chunk.reduce((min, item) => item.y < min.y ? item : min);
        const maxItem = chunk.reduce((max, item) => item.y > max.y ? item : max);
        
        if (minItem.x !== maxItem.x) {
          minMaxSampled.push(minItem, maxItem);
        } else {
          minMaxSampled.push(minItem);
        }
      }
      return minMaxSampled.slice(0, maxPoints);

    default:
      return data.slice(0, maxPoints);
  }
};

// Convert data to ApexCharts series format
export const toApexSeries = (
  data: ChartData[] | SeriesData[],
  chartType: ChartType
): Array<{ name?: string; data: Array<{ x: string | number; y: number }> }> => {
  // Helper function to convert x value to string or number
  const convertXValue = (x: string | number | Date): string | number => {
    if (x instanceof Date) {
      return x.getTime(); // Convert Date to timestamp
    }
    return x;
  };

  // Check if it's already series data
  if (data.length > 0 && 'name' in data[0]) {
    const seriesData = data as SeriesData[];
    return seriesData.map(series => ({
      name: series.name,
      data: series.data.map(point => ({
        x: convertXValue(point.x),
        y: point.y,
      })),
    }));
  }

  // Single series data
  const chartData = data as ChartData[];
  
  if (chartType === 'pie' || chartType === 'donut') {
    return [{
      data: chartData.map(point => ({
        x: convertXValue(point.x),
        y: point.y,
      })),
    }];
  }

  return [{
    name: 'Series 1',
    data: chartData.map(point => ({
      x: convertXValue(point.x),
      y: point.y,
    })),
  }];
};

// Format numbers for display
export const formatNumber = (
  value: number,
  options: {
    decimals?: number;
    prefix?: string;
    suffix?: string;
    thousands?: string;
    currency?: boolean;
    percentage?: boolean;
  } = {}
): string => {
  const {
    decimals = 0,
    prefix = '',
    suffix = '',
    thousands = ',',
    currency = false,
    percentage = false,
  } = options;

  let formatted = value.toFixed(decimals);
  
  // Add thousands separator
  if (thousands) {
    formatted = formatted.replace(/\B(?=(\d{3})+(?!\d))/g, thousands);
  }

  // Add currency formatting
  if (currency) {
    formatted = `R${formatted}`;
  }

  // Add percentage formatting
  if (percentage) {
    formatted = `${formatted}%`;
  }

  return `${prefix}${formatted}${suffix}`;
};

// Format dates for display
export const formatDate = (
  date: string | number | Date,
  format: 'short' | 'medium' | 'long' | 'time' | 'datetime' = 'medium'
): string => {
  const d = new Date(date);
  
  switch (format) {
    case 'short':
      return d.toLocaleDateString('en-ZA', { 
        day: '2-digit', 
        month: '2-digit', 
        year: '2-digit' 
      });
    case 'medium':
      return d.toLocaleDateString('en-ZA', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
    case 'long':
      return d.toLocaleDateString('en-ZA', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    case 'time':
      return d.toLocaleTimeString('en-ZA', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    case 'datetime':
      return d.toLocaleString('en-ZA', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit' 
      });
    default:
      return d.toLocaleDateString('en-ZA');
  }
};

// Generate color palette
 