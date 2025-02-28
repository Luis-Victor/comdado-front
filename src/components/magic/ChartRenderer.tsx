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
import { Card } from '../Card';

interface ChartRendererProps {
  config: ChartConfig;
}

export function ChartRenderer({ config }: ChartRendererProps) {
  const { type, data, series, options = {}, ...rest } = config;

  // Normalize chart type (handle case differences)
  const normalizedType = type.toLowerCase();

  // Safety check for data
  if (!data) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">Missing data for chart: {rest.title || normalizedType}</p>
      </div>
    );
  }

  const renderChart = () => {
    try {
      switch (normalizedType) {
        case 'line':
        case 'linechart':
          return <LineChart data={data} series={series || []} {...options} {...rest} />;
        case 'area':
        case 'areachart':
          return <AreaChart data={data} series={series || []} {...options} {...rest} />;
        case 'bar':
        case 'barchart':
          return <BarChart data={data} series={series || []} {...options} {...rest} />;
        case 'pie':
        case 'piechart':
          return <PieChart data={data} {...options} {...rest} />;
        case 'radar':
        case 'radarchart':
          return <RadarChart data={data} {...options} {...rest} />;
        case 'scatter':
        case 'scatterchart':
          return <ScatterChart data={data} {...options} {...rest} />;
        case 'matrix':
        case 'matrixchart':
          // Only render if data is properly formatted to avoid errors
          if (Array.isArray(data) && data.every(item => item.id && Array.isArray(item.data))) {
            return <MatrixChart data={data} {...options} {...rest} />;
          }
          return (
            <div className="p-6 text-center">
              <p className="text-amber-600">Matrix chart data format is invalid</p>
            </div>
          );
        case 'treemap':
        case 'treemapchart':
          return <TreemapChart data={data} {...options} {...rest} />;
        case 'gauge':
        case 'gaugechart':
          // Handle both array and direct object formats
          const gaugeData = Array.isArray(data) ? data[0] : data;
          return <GaugeChart {...gaugeData} {...options} {...rest} />;
        case 'boxplot':
        case 'boxplotchart':
          return <BoxPlotChart data={data} {...options} {...rest} />;
        case 'gantt':
        case 'ganttchart':
          return <GanttChart data={data} {...options} {...rest} />;
        case 'waterfall':
        case 'waterfallchart':
          return <WaterfallChart data={data} {...options} {...rest} />;
        case 'card':
          return <Card {...data} title={rest.title} />;
        default:
          return (
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-red-700">Unsupported chart type: {type}</p>
            </div>
          );
      }
    } catch (error) {
      console.error(`Error rendering chart ${rest.title || normalizedType}:`, error);
      return (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-700">Error rendering chart</p>
          <p className="text-red-600 text-sm mt-2">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      );
    }
  };

  return renderChart();
}