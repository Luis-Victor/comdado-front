import { Card } from '../../components/Card';
import { LineChart } from '../../components/charts/LineChart';
import { BarChart } from '../../components/charts/BarChart';
import { PieChart } from '../../components/charts/PieChart';
import { HeatmapChart } from '../../components/charts/HeatmapChart';
import { FunnelChart } from '../../components/charts/FunnelChart';
import { GanttChart } from '../../components/charts/GanttChart';
import { MatrixChart } from '../../components/charts/MatrixChart';
import { RadarChart } from '../../components/charts/RadarChart';
import { ScatterChart } from '../../components/charts/ScatterChart';
import { TreemapChart } from '../../components/charts/TreemapChart';
import { WaterfallChart } from '../../components/charts/WaterfallChart';
import { DecompositionTreeChart } from '../../components/charts/DecompositionTreeChart';
import { DatePicker } from '../../components/filters/DatePicker';
import { FilterDropdown } from '../../components/filters/FilterDropdown';
import { SearchBar } from '../../components/filters/SearchBar';
import { RangeSlider } from '../../components/filters/RangeSlider';

export const componentRegistry = {
  Card,
  LineChart,
  BarChart,
  PieChart,
  HeatmapChart,
  FunnelChart,
  GanttChart,
  MatrixChart,
  RadarChart,
  ScatterChart,
  TreemapChart,
  WaterfallChart,
  DecompositionChart: DecompositionTreeChart,
  DatePicker,
  Dropdown: FilterDropdown,
  SearchBar,
  RangeSlider,
} as const;

export type ComponentType = keyof typeof componentRegistry;

export function getComponent(type: string) {
  const Component = componentRegistry[type as ComponentType];
  if (!Component) {
    console.warn(`Unknown component type: ${type}`);
    return null;
  }
  return Component;
}