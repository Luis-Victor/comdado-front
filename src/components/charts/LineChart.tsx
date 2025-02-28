import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
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

interface LineChartProps extends BaseChartProps {
  data: DataPoint[];
  series: Series[];
  showDots?: boolean;
  smoothCurve?: boolean;
}

export function LineChart({ 
  data, 
  series,
  showDots = true,
  smoothCurve = true,
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
}: LineChartProps) {
  return (
    <ChartContainer title={title} description={description}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={margin}>
          {(enableGridX || enableGridY) && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              horizontal={enableGridY} 
              vertical={enableGridX} 
              stroke="#E5E7EB" 
            />
          )}
          
          <XAxis 
            dataKey="name"
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
            <Line
              key={key}
              type={smoothCurve ? "monotone" : "linear"}
              dataKey={key}
              stroke={color}
              name={name}
              strokeWidth={2}
              dot={showDots ? {
                r: 3,
                strokeWidth: 1,
                fill: 'white',
              } : false}
              activeDot={{
                r: 5,
                strokeWidth: 1,
                fill: 'white',
              }}
              isAnimationActive={animate}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}