import React from 'react';
import { ChartConfig } from '../../lib/types/magicChart';
import { LineChart } from '../charts/LineChart';
import { AreaChart } from '../charts/AreaChart';
import { BarChart } from '../charts/BarChart';
import { PieChart } from '../charts/PieChart';
import { RadarChart } from '../charts/RadarChart';
import { ScatterChart } from '../charts/ScatterChart';
import { MatrixChart } from '../charts/MatrixChart';
import { TreemapChart } from '../charts/TreemapChart';
import { GaugeChart } from '../charts/GaugeChart';
import { BoxPlotChart } from '../charts/BoxPlotChart';
import { GanttChart } from '../charts/GanttChart';
import { WaterfallChart } from '../charts/WaterfallChart';

interface ChartRendererProps {
  config: ChartConfig;
}

export function ChartRenderer({ config }: ChartRendererProps) {
  const { type, data, series, options = {}, ...rest } = config;

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <LineChart data={data} series={series!} {...options} {...rest} />;
      case 'area':
        return <AreaChart data={data} series={series!} {...options} {...rest} />;
      case 'bar':
        return <BarChart data={data} series={series!} {...options} {...rest} />;
      case 'pie':
        return <PieChart data={data} {...options} {...rest} />;
      case 'radar':
        return <RadarChart data={data} {...options} {...rest} />;
      case 'scatter':
        return <ScatterChart data={data} {...options} {...rest} />;
      case 'matrix':
        return <MatrixChart data={data} {...options} {...rest} />;
      case 'treemap':
        return <TreemapChart data={data} {...options} {...rest} />;
      case 'gauge':
        return <GaugeChart {...data[0]} {...options} {...rest} />;
      case 'boxplot':
        return <BoxPlotChart data={data} {...options} {...rest} />;
      case 'gantt':
        return <GanttChart data={data} {...options} {...rest} />;
      case 'waterfall':
        return <WaterfallChart data={data} {...options} {...rest} />;
      default:
        return (
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-red-700">Unsupported chart type: {type}</p>
          </div>
        );
    }
  };

  return renderChart();
}