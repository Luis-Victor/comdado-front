import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from './ChartContainer';

interface Task {
  id: string;
  name: string;
  start: Date;
  end: Date;
  progress: number;
  dependencies?: string[];
}

interface GanttChartProps {
  data: Task[];
  title?: string;
}

const CustomBar = (props: any) => {
  const { x, y, width, height, fill, progress } = props;
  const progressWidth = width * (progress / 100);

  return (
    <g>
      {/* Background bar */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#f3f4f6"
        rx={4}
        ry={4}
      />
      {/* Progress bar */}
      <rect
        x={x}
        y={y}
        width={progressWidth}
        height={height}
        fill={fill}
        rx={4}
        ry={4}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const startDate = new Date(data.start).toLocaleDateString();
  const endDate = new Date(data.end).toLocaleDateString();

  return (
    <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
      <p className="font-semibold mb-2">{data.name}</p>
      <div className="space-y-1 text-sm">
        <p>Start: {startDate}</p>
        <p>End: {endDate}</p>
        <p>Progress: {data.progress}%</p>
      </div>
    </div>
  );
};

export function GanttChart({ data, title }: GanttChartProps) {
  // Process data for the chart
  const processedData = data.map(task => ({
    ...task,
    start: new Date(task.start).getTime(),
    end: new Date(task.end).getTime(),
  }));

  // Calculate the overall date range
  const startDates = processedData.map(d => d.start);
  const endDates = processedData.map(d => d.end);
  const minDate = Math.min(...startDates);
  const maxDate = Math.max(...endDates);

  // Add some padding to the date range
  const padding = (maxDate - minDate) * 0.05;
  const domainMin = minDate - padding;
  const domainMax = maxDate + padding;

  return (
    <ChartContainer title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={processedData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis
            type="number"
            domain={[domainMin, domainMax]}
            tickFormatter={(value) => new Date(value).toLocaleDateString()}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="end"
            fill="#8884d8"
            shape={<CustomBar />}
            background={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}