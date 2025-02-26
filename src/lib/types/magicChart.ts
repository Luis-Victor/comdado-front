import { BaseChartProps } from './chart';

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
  options?: Partial<BaseChartProps> & {
    [key: string]: any;
  };
}

export interface MagicChartsConfig {
  charts: ChartConfig[];
}