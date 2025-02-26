// Base types for all charts
export interface BaseChartProps {
  // Basic props
  title?: string;
  description?: string;
  width?: number | string;
  height?: number | string;
  
  // Axes configuration
  xAxis?: AxisConfig;
  yAxis?: AxisConfig;
  
  // Styling
  margin?: Margin;
  colors?: ColorConfig;
  theme?: 'light' | 'dark';
  
  // Features
  enableGridX?: boolean;
  enableGridY?: boolean;
  enableLegend?: boolean;
  enableTooltip?: boolean;
  
  // Animation
  animate?: boolean;
  motionConfig?: 'default' | 'gentle' | 'wobbly' | 'stiff';
  
  // Legend
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  legendDirection?: 'row' | 'column';
  
  // Tooltip
  tooltipFormat?: (value: any) => string | React.ReactNode;
  customTooltip?: React.ComponentType<any>;
}

export interface AxisConfig {
  title?: string;
  tickFormat?: (value: any) => string;
  tickRotation?: number;
  hideGridLines?: boolean;
  min?: number;
  max?: number;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface ColorConfig {
  scheme?: string;
  type?: 'sequential' | 'diverging' | 'categorical';
}

export interface Series {
  key: string;
  color: string;
  name: string;
}

// Common data types
export interface DataPoint {
  name: string;
  [key: string]: string | number;
}

export interface MatrixDataPoint {
  x: string;
  y: number;
}

export interface MatrixData {
  id: string;
  data: MatrixDataPoint[];
}

// Theme configuration
export interface ThemeConfig {
  background: string;
  textColor: string;
  fontSize: number;
  tooltip: {
    container: {
      background: string;
      color: string;
      fontSize: number;
      borderRadius: string;
      boxShadow: string;
    };
  };
}

// Chart-specific types
export interface LineChartProps extends BaseChartProps {
  data: DataPoint[];
  series: Series[];
  showDots?: boolean;
  smoothCurve?: boolean;
}

export interface AreaChartProps extends BaseChartProps {
  data: DataPoint[];
  series: Series[];
  stacked?: boolean;
  curve?: 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
}

export interface MatrixChartProps extends BaseChartProps {
  data: MatrixData[];
  xLegend?: string;
  yLegend?: string;
  sizeVariation?: number;
  forceSquare?: boolean;
  padding?: number;
  cellOpacity?: number;
}

export interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  title?: string;
  format?: (value: number) => string;
  colorScheme?: {
    low: string;
    medium: string;
    high: string;
  };
}

// Utility functions
export const getThemeConfig = (theme: 'light' | 'dark'): ThemeConfig => ({
  background: theme === 'dark' ? '#1F2937' : '#ffffff',
  textColor: theme === 'dark' ? '#F3F4F6' : '#111827',
  fontSize: 12,
  tooltip: {
    container: {
      background: theme === 'dark' ? '#1F2937' : '#ffffff',
      color: theme === 'dark' ? '#F3F4F6' : '#111827',
      fontSize: 12,
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    }
  }
});

export const defaultMargin: Margin = {
  top: 20,
  right: 30,
  bottom: 20,
  left: 30
};

export const defaultColors: ColorConfig = {
  scheme: 'nivo',
  type: 'categorical'
};