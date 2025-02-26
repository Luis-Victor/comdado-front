import React from 'react';
import { 
  BarChart as BarChartIcon, 
  LineChart as LineChartIcon, 
  PieChart as PieChartIcon, 
  Activity, 
  ScatterChart, 
  BarChart as RadarChart, 
  Square as TreeSquare, 
  Grid, 
  GitFork, 
  ArrowUpDown, 
  BoxSelect,
  GanttChart as GanttChartIcon,
  GitBranch,
  Table,
  Gauge,
} from 'lucide-react';

interface ChartTypeProps {
  icon: React.ReactNode;
  name: string;
}

function ChartType({ icon, name }: ChartTypeProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="p-3 bg-primary-50 rounded-lg mb-3">
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700">{name}</span>
    </div>
  );
}

export function ChartIconsSection() {
  const chartTypes = [
    { name: 'Line Chart', icon: <LineChartIcon className="h-6 w-6 text-primary-600" /> },
    { name: 'Bar Chart', icon: <BarChartIcon className="h-6 w-6 text-primary-600" /> },
    { name: 'Area Chart', icon: <Activity className="h-6 w-6 text-primary-600" /> },
    { name: 'Pie Chart', icon: <PieChartIcon className="h-6 w-6 text-primary-600" /> },
    { name: 'Scatter Plot', icon: <ScatterChart className="h-6 w-6 text-primary-600" /> },
    { name: 'Radar Chart', icon: <RadarChart className="h-6 w-6 text-primary-600" /> },
    { name: 'Treemap', icon: <TreeSquare className="h-6 w-6 text-primary-600" /> },
    { name: 'Heatmap', icon: <Grid className="h-6 w-6 text-primary-600" /> },
    { name: 'Funnel Chart', icon: <GitFork className="h-6 w-6 text-primary-600" /> },
    { name: 'Waterfall', icon: <ArrowUpDown className="h-6 w-6 text-primary-600" /> },
    { name: 'Box Plot', icon: <BoxSelect className="h-6 w-6 text-primary-600" /> },
    { name: 'Gantt Chart', icon: <GanttChartIcon className="h-6 w-6 text-primary-600" /> },
    { name: 'Decomposition Tree', icon: <GitBranch className="h-6 w-6 text-primary-600" /> },
    { name: 'Matrix', icon: <Table className="h-6 w-6 text-primary-600" /> },
    { name: 'Gauge', icon: <Gauge className="h-6 w-6 text-primary-600" /> },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Available Chart Types</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {chartTypes.map((chart) => (
          <ChartType key={chart.name} {...chart} />
        ))}
      </div>
    </div>
  );
}