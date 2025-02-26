import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { ChartContainer } from './ChartContainer';

interface WaterfallData {
  name: string;
  value: number;
  isTotal?: boolean;
}

interface WaterfallChartProps {
  data: WaterfallData[];
  title?: string;
}

export function WaterfallChart({ data, title }: WaterfallChartProps) {
  // Calculate running total and format data
  let runningTotal = 0;
  const formattedData = data.map(item => ({
    ...item,
    start: item.isTotal ? 0 : runningTotal,
    end: item.isTotal ? item.value : (runningTotal += item.value),
    color: item.isTotal ? '#8884d8' : item.value >= 0 ? '#82ca9d' : '#ff8042',
  }));

  return (
    <ChartContainer title={title}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value: any, name: string) => {
              if (name === 'value') {
                return [value, 'Change'];
              }
              return [value, name];
            }}
          />
          <Legend />
          <ReferenceLine y={0} stroke="#000" />
          <Bar
            dataKey="value"
            fill="#8884d8"
            stackId="stack"
            isAnimationActive={true}
          >
            {formattedData.map((entry, index) => (
              <Bar
                key={`bar-${index}`}
                dataKey="value"
                fill={entry.color}
                stackId="stack"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}