import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface ColumnChartProps {
  data: DataPoint[];
  series: { key: string; color: string }[];
  title?: string;
}

export function ColumnChart({ data, series, title }: ColumnChartProps) {
  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-md p-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {series.map(({ key, color }) => (
            <Bar key={key} dataKey={key} fill={color} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}