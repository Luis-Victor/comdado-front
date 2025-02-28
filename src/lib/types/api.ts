/**
 * API response types for Magic Charts
 */

// Dashboard Configuration API Response
export interface DashboardConfigResponse {
  title: string;
  theme: 'light' | 'dark';
  layout: {
    rows: number;
    columns: number;
    gap: number;
    rowHeight?: string | number;
    responsive?: {
      breakpoints?: {
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
      };
      behavior?: 'reflow' | 'stack' | 'scale' | 'hide-optional';
      columnThreshold?: {
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
      };
      gapThreshold?: {
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
      };
      priorityLevels?: number;
    };
  };
}

// Charts Count API Response
export interface ChartsCountResponse {
  count: number;
  chartIds: string[];
  metadata?: {
    categories?: string[];
    lastUpdated?: string;
  };
}

// Chart Position
export interface ChartPosition {
  row: number;
  column: number;
  width: number;
  height: number;
  responsive?: {
    sm?: {
      row?: number;
      column?: number;
      width?: number;
      height?: number;
      visible?: boolean;
    };
    md?: {
      row?: number;
      column?: number;
      width?: number;
      height?: number;
      visible?: boolean;
    };
    lg?: {
      row?: number;
      column?: number;
      width?: number;
      height?: number;
      visible?: boolean;
    };
    xl?: {
      row?: number;
      column?: number;
      width?: number;
      height?: number;
      visible?: boolean;
    };
  };
}

// Chart Series
export interface ChartSeries {
  key: string;
  color: string;
  name: string;
}

// Chart Data API Response
export interface ChartDataResponse {
  id: string;
  type: string;
  title?: string;
  description?: string;
  position: ChartPosition;
  priority?: number;
  data?: {
    data?: any[];
    series?: ChartSeries[];
    value?: string | number;
    change?: number;
    icon?: string;
    description?: string;
    [key: string]: any;
  };
  options?: {
    showDots?: boolean;
    smoothCurve?: boolean;
    stacked?: boolean;
    layout?: 'vertical' | 'horizontal';
    barSize?: number;
    donut?: boolean;
    innerRadius?: number;
    padAngle?: number;
    cornerRadius?: number;
    enableGridX?: boolean;
    enableGridY?: boolean;
    enableLegend?: boolean;
    enableTooltip?: boolean;
    animate?: boolean;
    legendPosition?: 'top' | 'right' | 'bottom' | 'left';
    xAxis?: {
      title?: string;
      tickFormat?: string;
      tickRotation?: number;
      min?: number;
      max?: number;
    };
    yAxis?: {
      title?: string;
      tickFormat?: string;
      tickRotation?: number;
      min?: number;
      max?: number;
    };
    margin?: {
      top?: number;
      right?: number;
      bottom?: number;
      left?: number;
    };
    colors?: any;
    theme?: 'light' | 'dark';
    [key: string]: any;
  };
}

// Combined API Response (all in one)
export interface CombinedDashboardResponse {
  title: string;
  theme: 'light' | 'dark';
  layout: {
    rows: number;
    columns: number;
    gap: number;
    rowHeight?: string | number;
    responsive?: {
      breakpoints?: {
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
      };
      behavior?: 'reflow' | 'stack' | 'scale' | 'hide-optional';
      columnThreshold?: {
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
      };
      gapThreshold?: {
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
      };
      priorityLevels?: number;
    };
  };
  charts: ChartDataResponse[];
  metadata?: {
    lastUpdated?: string;
    version?: string;
    generatedBy?: string;
  };
}

// API Error Response
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: string;
  timestamp?: string;
}