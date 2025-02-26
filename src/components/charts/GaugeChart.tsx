import React from 'react';
import { ChartContainer } from './ChartContainer';

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  title?: string;
  format?: (value: number) => string;
  colorScheme?: {
    low: string;
    medium: string;
    high: string;
  };
}

export function GaugeChart({
  value,
  min,
  max,
  title,
  format = (v) => `${v}%`,
  colorScheme = {
    low: '#22c55e',    // green-500
    medium: '#eab308', // yellow-500
    high: '#ef4444',   // red-500
  },
}: GaugeChartProps) {
  // Normalize value between 0 and 1
  const normalizedValue = Math.min(Math.max((value - min) / (max - min), 0), 1);
  
  // Calculate arc properties
  const radius = 120;
  const strokeWidth = 30;
  const startAngle = -180;
  const endAngle = 0;
  const angleRange = endAngle - startAngle;
  const valueAngle = startAngle + (angleRange * normalizedValue);
  
  // Calculate SVG arc path
  const generateArc = (angle: number) => {
    const startRadians = (Math.PI * startAngle) / 180;
    const endRadians = (Math.PI * angle) / 180;
    
    const startX = 150 + radius * Math.cos(startRadians);
    const startY = 150 + radius * Math.sin(startRadians);
    const endX = 150 + radius * Math.cos(endRadians);
    const endY = 150 + radius * Math.sin(endRadians);
    
    const largeArcFlag = Math.abs(angle - startAngle) <= 180 ? "0" : "1";
    
    return `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;
  };

  // Determine color based on value
  const getColor = (value: number) => {
    if (value <= 0.33) return colorScheme.low;
    if (value <= 0.66) return colorScheme.medium;
    return colorScheme.high;
  };

  const color = getColor(normalizedValue);
  const gradientId = `gauge-gradient-${title?.replace(/\s+/g, '-').toLowerCase() ?? 'default'}`;

  return (
    <ChartContainer title={title}>
      <div className="w-full h-full flex flex-col items-center justify-center p-4">
        <div className="relative w-full max-w-[300px] mx-auto">
          <svg
            className="w-full h-auto"
            viewBox="0 0 300 200"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colorScheme.low} />
                <stop offset="50%" stopColor={colorScheme.medium} />
                <stop offset="100%" stopColor={colorScheme.high} />
              </linearGradient>
            </defs>
            
            {/* Background track */}
            <path
              d={generateArc(endAngle)}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            
            {/* Value arc */}
            <path
              d={generateArc(valueAngle)}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              className="transition-all duration-500 ease-in-out"
            />
            
            {/* Center text */}
            <text
              x="150"
              y="160"
              textAnchor="middle"
              className="text-4xl font-bold"
              fill="#111827"
            >
              {format(value)}
            </text>
            
            {/* Range text */}
            <text
              x="150"
              y="180"
              textAnchor="middle"
              className="text-sm"
              fill="#6B7280"
            >
              {min} - {max}
            </text>
          </svg>
        </div>

        {/* Ticks */}
        <div className="flex justify-between w-full max-w-[300px] mt-2 px-4">
          <div className="flex flex-col items-center">
            <div className="h-2 w-0.5 bg-gray-300" />
            <span className="text-sm text-gray-500 mt-1">{min}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-2 w-0.5 bg-gray-300" />
            <span className="text-sm text-gray-500 mt-1">{(min + max) / 2}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="h-2 w-0.5 bg-gray-300" />
            <span className="text-sm text-gray-500 mt-1">{max}</span>
          </div>
        </div>
      </div>
    </ChartContainer>
  );
}