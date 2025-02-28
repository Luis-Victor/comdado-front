// src/lib/types/magicChart.ts
import { BaseChartProps } from './chart';
import { Breakpoint } from './dashboard';

export interface ChartConfig {
  id: string;
  type: 'line' | 'area' | 'bar' | 'pie' | 'radar' | 'scatter' | 'matrix' | 'treemap' | 'gauge' | 'boxplot' | 'gantt' | 'waterfall';
  title?: string;
  description?: string;
  data: any[];
  series?: {
    key: string;
    color: string;
    name: string;
  }[];
  position?: {
    row: number;
    column: number;
    width: number;
    height: number;
    responsive?: {
      [key in Breakpoint]?: {
        row: number;
        column: number;
        width: number;
        height: number;
        visible?: boolean;
      };
    };
  };
  priority?: number;
  options?: Partial<BaseChartProps> & {
    [key: string]: any;
  };
}

export interface MagicChartsConfig {
  title: string;
  theme?: 'light' | 'dark';
  layout: {
    rows: number;
    columns: number;
    gap: number;
    rowHeight?: string;
    responsive?: {
      breakpoints: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
      behavior: 'stack' | 'reflow' | 'scale' | 'hide-optional';
      columnThreshold: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
      gapThreshold: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
      };
      priorityLevels: number;
    };
  };
  charts: ChartConfig[];
}