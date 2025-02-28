import React from 'react';
import {
  ScatterChart as RechartsScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { BaseChartProps } from '../../lib/types/chart';
import { ChartContainer } from './ChartContainer';

interface DataPoint {
  x: number;
  y: number;
  z?: number;
}

interface Series {
  name: string;
  data: DataPoint[];
  color?: string;
}

interface ScatterChartProps extends BaseChartProps {
  data: Series[];
  bubbleSize?: {
    min: number;
    max: number;
  };
}

export function ScatterChart({ 
  data,
  bubbleSize = { min: 16, max: 36 },
  title,
  description,
  xAxis,
  yAxis,
  margin = { top: 20, right: 20, bottom: 30, left: 40 },
  enableGridX = true,
  enableGridY = true,
  enableLegend = true,
  enableTooltip = true,
  animate = true,
  legendPosition = 'top',
  tooltipFormat,
  customTooltip,
}: ScatterChartProps) {
  return (
    <ChartContainer title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsScatterChart margin={margin}>
          {(enableGridX || enableGridY) && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              horizontal={enableGridY} 
              vertical={enableGridX} 
              stroke="#E5E7EB" 
            />
          )}
          
          <XAxis
            type="number"
            dataKey="x"
            name={xAxis?.title || "X"}
            stroke="#6B7280"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            label={xAxis?.title ? { 
              value: xAxis.title, 
              position: 'insideBottom', 
              offset: -10,
              style: { fontSize: 11, textAnchor: 'middle' }
            } : undefined}
            tickFormatter={xAxis?.tickFormat}
            domain={xAxis?.min !== undefined ? [xAxis.min, xAxis.max || 'auto'] : undefined}
            tick={{ fontSize: 10 }}
          />
          
          <YAxis
            type="number"
            dataKey="y"
            name={yAxis?.title || "Y"}
            stroke="#6B7280"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#E5E7EB' }}
            label={yAxis?.title ? { 
              value: yAxis.title, 
              angle: -90, 
              position: 'insideLeft', 
              offset: -5,
              style: { fontSize: 11, textAnchor: 'middle' }
            } : undefined}
            tickFormatter={yAxis?.tickFormat}
            domain={yAxis?.min !== undefined ? [yAxis.min, yAxis.max || 'auto'] : undefined}
            tick={{ fontSize: 10 }}
            width={40}
          />
          
          {enableTooltip && (
            customTooltip ? (
              <Tooltip content={customTooltip} />
            ) : (
              <Tooltip
                formatter={tooltipFormat}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  fontSize: '11px',
                  padding: '8px'
                }}
              />
            )
          )}
          
          {enableLegend && (
            <Legend
              verticalAlign={legendPosition === 'bottom' ? 'bottom' : 'top'}
              align={legendPosition === 'right' ? 'right' : 'center'}
              height={20}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '11px' }}
              formatter={(value) => (
                <span className="text-xs text-gray-700">{value}</span>
              )}
            />
          )}
          
          {data.map((series, index) => (
            <Scatter
              key={series.name}
              name={series.name}
              data={series.data}
              fill={series.color || `hsl(${index * 45}, 70%, 50%)`}
              isAnimationActive={animate}
            />
          ))}
        </RechartsScatterChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}