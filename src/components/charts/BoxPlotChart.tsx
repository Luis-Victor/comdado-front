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

interface BoxPlotData {
  name: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
}

interface BoxPlotChartProps {
  data: BoxPlotData[];
  title?: string;
  color?: string;
}

const CustomBoxPlot = (props: any) => {
  const { x, y, width, height, fill, payload } = props;

  if (!payload) return null;

  const boxWidth = width * 0.6;
  const xCenter = x + width / 2;
  const xLeft = xCenter - boxWidth / 2;
  const xRight = xCenter + boxWidth / 2;

  // Calculate Y positions directly based on the actual values
  const maxY = y + height * (1 - (payload.max - payload.yMin) / (payload.yMax - payload.yMin));
  const minY = y + height * (1 - (payload.min - payload.yMin) / (payload.yMax - payload.yMin));
  const q1Y = y + height * (1 - (payload.q1 - payload.yMin) / (payload.yMax - payload.yMin));
  const medianY = y + height * (1 - (payload.median - payload.yMin) / (payload.yMax - payload.yMin));
  const q3Y = y + height * (1 - (payload.q3 - payload.yMin) / (payload.yMax - payload.yMin));

  return (
    <g>
      {/* Vertical line from min to max */}
      <line
        x1={xCenter}
        y1={minY}
        x2={xCenter}
        y2={maxY}
        stroke={fill}
        strokeWidth={1}
      />

      {/* Box from Q1 to Q3 */}
      <rect
        x={xLeft}
        y={q3Y}
        width={boxWidth}
        height={q1Y - q3Y}
        fill={fill}
        fillOpacity={0.3}
        stroke={fill}
        strokeWidth={1}
      />

      {/* Median line */}
      <line
        x1={xLeft}
        y1={medianY}
        x2={xRight}
        y2={medianY}
        stroke={fill}
        strokeWidth={2}
      />

      {/* Min and Max horizontal lines */}
      <line
        x1={xLeft + boxWidth * 0.25}
        y1={minY}
        x2={xRight - boxWidth * 0.25}
        y2={minY}
        stroke={fill}
        strokeWidth={1}
      />
      <line
        x1={xLeft + boxWidth * 0.25}
        y1={maxY}
        x2={xRight - boxWidth * 0.25}
        y2={maxY}
        stroke={fill}
        strokeWidth={1}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  return (
    <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
      <p className="font-semibold mb-2">{data.name}</p>
      <div className="space-y-1 text-sm">
        <p>Maximum: {data.max}</p>
        <p>Upper Quartile (Q3): {data.q3}</p>
        <p>Median: {data.median}</p>
        <p>Lower Quartile (Q1): {data.q1}</p>
        <p>Minimum: {data.min}</p>
      </div>
    </div>
  );
};

export function BoxPlotChart({ data, title, color = '#8884d8' }: BoxPlotChartProps) {
  // Find global min and max for proper scaling
  const allValues = data.flatMap(item => [item.min, item.q1, item.median, item.q3, item.max]);
  const yMin = Math.min(...allValues);
  const yMax = Math.max(...allValues);

  // Add padding to the range to prevent values from touching the edges
  const padding = (yMax - yMin) * 0.1;
  const paddedYMin = Math.floor(yMin - padding);
  const paddedYMax = Math.ceil(yMax + padding);

  // Transform data to include the range and global min/max for scaling
  const transformedData = data.map(item => ({
    ...item,
    yMin: paddedYMin,
    yMax: paddedYMax,
    // Range is used for the bar height, but doesn't affect the box plot rendering
    range: paddedYMax - paddedYMin,
  }));

  return (
    <ChartContainer title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={transformedData}
          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" />
          <YAxis 
            domain={[paddedYMin, paddedYMax]}
            tickCount={8}
            allowDataOverflow={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="range"
            fill={color}
            shape={<CustomBoxPlot />}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}