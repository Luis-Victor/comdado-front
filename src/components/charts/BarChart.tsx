import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
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
  name: string;
  [key: string]: string | number;
}

interface Series {
  key: string;
  color: string;
  name: string;
}

interface BarChartProps extends BaseChartProps {
  data: DataPoint[];
  series: Series[];
  layout?: 'vertical' | 'horizontal';
  barSize?: number;
  stackOffset?: 'none' | 'expand' | 'wiggle' | 'silhouette';
}

export function BarChart({ 
  data, 
  series,
  layout = 'vertical',
  barSize,
  stackOffset = 'none',
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
}: BarChartProps) {
  return (
    <ChartContainer title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart 
          layout={layout}
          data={data}
          margin={margin}
          stackOffset={stackOffset}
        >
          {(enableGridX || enableGridY) && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              horizontal={enableGridY} 
              vertical={enableGridX} 
              stroke="#E5E7EB" 
            />
          )}
          
          <XAxis
            type={layout === 'vertical' ? 'number' : 'category'}
            dataKey={layout === 'vertical' ? undefined : 'name'}
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
            angle={xAxis?.tickRotation}
            domain={xAxis?.min !== undefined ? [xAxis.min, xAxis.max || 'auto'] : undefined}
            tick={{ fontSize: 10 }}
          />
          
          <YAxis
            type={layout === 'vertical' ? 'category' : 'number'}
            dataKey={layout === 'vertical' ? 'name' : undefined}
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
            angle={yAxis?.tickRotation}
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
          
          {series.map(({ key, color, name }) => (
            <Bar
              key={key}
              dataKey={key}
              name={name}
              fill={color}
              barSize={barSize}
              isAnimationActive={animate}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}