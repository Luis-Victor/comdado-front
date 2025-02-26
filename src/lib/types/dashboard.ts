import { ReactNode } from 'react';

// Breakpoint definitions
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

export interface BreakpointThresholds {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ResponsivePosition {
  row: number;
  column: number;
  width: number;
  height: number;
  visible?: boolean;
}

export interface ResponsiveLayout {
  [key in Breakpoint]?: ResponsivePosition;
}

export interface ResponsiveOptions {
  [key in Breakpoint]?: Record<string, any>;
}

export interface DashboardBreakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export type ResponsiveBehavior = 'stack' | 'reflow' | 'scale' | 'hide-optional';

export interface ColumnThreshold {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface GapThreshold {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ResponsiveConfig {
  breakpoints: DashboardBreakpoints;
  behavior: ResponsiveBehavior;
  columnThreshold: ColumnThreshold;
  gapThreshold: GapThreshold;
  priorityLevels: number;
}

export interface DashboardLayout {
  rows: number;
  columns: number;
  gap: number;
  rowHeight?: string;
  responsive?: ResponsiveConfig;
}

export interface ComponentPosition {
  row: number;
  column: number;
  width: number;
  height: number;
  responsive?: ResponsiveLayout;
}

export interface DashboardComponent {
  id: string;
  type: string;
  title?: string;
  position: ComponentPosition;
  priority?: number;
  minWidth?: number;
  minHeight?: number;
  responsiveBehavior?: ResponsiveBehavior;
  data?: any;
  options?: {
    responsiveOptions?: ResponsiveOptions;
    [key: string]: any;
  };
  children?: DashboardComponent[];
}

export interface DashboardConfig {
  title: string;
  theme?: 'light' | 'dark';
  layout: DashboardLayout;
  components: DashboardComponent[];
}

// Component size definitions
export interface ComponentSize {
  width: number;
  height: number;
}

export interface ComponentSizes {
  minimum: ComponentSize;
  recommended: ComponentSize;
  large?: ComponentSize;
  pixelMinimum: {
    width: number;
    height: number;
  };
}

export interface VisualizationComponent {
  type: string;
  description: string;
  sizes: ComponentSizes;
  notes?: string;
}

export interface FilterComponent {
  type: string;
  sizes: ComponentSizes;
}

export interface GridRecommendations {
  columnsRange: {
    minimum: number;
    recommended: number;
    maximum: number;
  };
  rowsRange: {
    minimum: number;
    recommended: number;
    maximum: number;
  };
  gapRange: {
    minimum: number;
    recommended: number;
    maximum: number;
  };
}

export interface DashboardComponentSizes {
  description: string;
  visualizationComponents: VisualizationComponent[];
  filterComponents: FilterComponent[];
  gridRecommendations: GridRecommendations;
}