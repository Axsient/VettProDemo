import { ApexOptions } from 'apexcharts';

// Base chart data structure
export interface ChartData {
  x: string | number | Date;
  y: number;
  label?: string;
  color?: string;
  group?: string;
}

// Multi-series data structure
export interface SeriesData {
  name: string;
  data: ChartData[];
  color?: string;
  type?: ChartType;
}

// Chart types supported
export type ChartType = 
  | 'line' 
  | 'area' 
  | 'bar' 
  | 'pie' 
  | 'donut' 
  | 'mixed' 
  | 'scatter' 
  | 'bubble' 
  | 'heatmap' 
  | 'candlestick';

// Theme types
export type ThemeMode = 'light' | 'dark' | 'auto';

// Responsive configuration
export interface ResponsiveConfig {
  mobile?: Partial<BaseChartProps>;
  tablet?: Partial<BaseChartProps>;
  desktop?: Partial<BaseChartProps>;
}

// Data point for click events
export interface DataPoint {
  x: string | number | Date;
  y: number;
  seriesIndex: number;
  dataPointIndex: number;
  series: string;
  label?: string;
}

// Base props for all chart components
export interface BaseChartProps {
  data: ChartData[] | SeriesData[];
  title?: string;
  subtitle?: string;
  height?: number;
  width?: string | number;
  className?: string;
  loading?: boolean;
  error?: string;
  theme?: ThemeMode;
  responsive?: ResponsiveConfig;
  onDataPointClick?: (point: DataPoint) => void;
  onLegendClick?: (seriesName: string, seriesIndex: number) => void;
  customOptions?: Partial<ApexOptions>;
}

// Line chart specific props
export interface LineChartProps extends BaseChartProps {
  smooth?: boolean;
  showMarkers?: boolean;
  markerSize?: number;
  strokeWidth?: number;
  showGrid?: boolean;
  enableZoom?: boolean;
  enablePan?: boolean;
}

// Area chart specific props
export interface AreaChartProps extends BaseChartProps {
  stacked?: boolean;
  fillOpacity?: number;
  gradient?: boolean;
  strokeWidth?: number;
}

// Bar chart specific props
export interface BarChartProps extends BaseChartProps {
  horizontal?: boolean;
  stacked?: boolean;
  grouped?: boolean;
  showDataLabels?: boolean;
  barWidth?: string | number;
}

// Pie/Donut chart specific props
export interface PieChartProps extends BaseChartProps {
  showLabels?: boolean;
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  donutSize?: string;
  centerText?: string;
  centerSubtext?: string;
}

export interface DonutChartProps extends PieChartProps {
  innerRadius?: string;
  outerRadius?: string;
}

// Mixed chart specific props
export interface MixedChartProps extends BaseChartProps {
  primaryType?: ChartType;
  secondaryType?: ChartType;
  dualYAxis?: boolean;
  primaryYAxisTitle?: string;
  secondaryYAxisTitle?: string;
}

// Chart configuration options
export interface ChartConfig {
  type: ChartType;
  data: ChartData[] | SeriesData[];
  options?: Partial<ApexOptions>;
  theme?: ThemeMode;
  responsive?: boolean;
}

// Theme configuration
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  gridColor: string;
  borderColor: string;
  fontFamily: string;
  fontSize: {
    small: number;
    medium: number;
    large: number;
  };
}

// Animation configuration
export interface AnimationConfig {
  enabled?: boolean;
  easing?: 'linear' | 'easein' | 'easeout' | 'easeinout';
  speed?: number;
  animateGradually?: {
    enabled?: boolean;
    delay?: number;
  };
  dynamicAnimation?: {
    enabled?: boolean;
    speed?: number;
  };
}

// Tooltip configuration
export interface TooltipConfig {
  enabled?: boolean;
  shared?: boolean;
  intersect?: boolean;
  followCursor?: boolean;
  custom?: (props: Record<string, unknown>) => string;
  theme?: 'light' | 'dark';
}

// Legend configuration
export interface LegendConfig {
  show?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  horizontalAlign?: 'left' | 'center' | 'right';
  floating?: boolean;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: number;
  itemMargin?: {
    horizontal?: number;
    vertical?: number;
  };
}

// Grid configuration
export interface GridConfig {
  show?: boolean;
  borderColor?: string;
  strokeDashArray?: number;
  position?: 'front' | 'back';
  xaxis?: {
    lines?: {
      show?: boolean;
    };
  };
  yaxis?: {
    lines?: {
      show?: boolean;
    };
  };
}

// Export all types
export type {
  ApexOptions
}; 