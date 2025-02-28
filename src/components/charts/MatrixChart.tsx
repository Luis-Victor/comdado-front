import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { BaseChartProps } from '../../lib/types/chart';
import { ChartContainer } from './ChartContainer';

interface MatrixDataPoint {
  x: string;
  y: number;
}

interface MatrixData {
  id: string;
  data: MatrixDataPoint[];
}

interface MatrixChartProps extends BaseChartProps {
  data: MatrixData[];
  xLegend?: string;
  yLegend?: string;
  sizeVariation?: number;
  forceSquare?: boolean;
  padding?: number;
  cellOpacity?: number;
}

export function MatrixChart({
  data,
  xLegend,
  yLegend,
  sizeVariation = 0.6,
  forceSquare = true,
  padding = 2,
  cellOpacity = 1,
  title,
  description,
  margin = { top: 30, right: 30, bottom: 40, left: 60 },
  colors = { type: 'sequential', scheme: 'blues' },
  theme = 'light',
  enableLegend = true,
  animate = true,
  motionConfig = 'gentle',
}: MatrixChartProps) {
  // Validate and normalize data
  const normalizedData = React.useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    // Get all unique x values
    const xValues = new Set<string>();
    data.forEach(row => {
      if (Array.isArray(row.data)) {
        row.data.forEach(item => {
          if (item.x) xValues.add(item.x.toString());
        });
      }
    });

    if (xValues.size === 0) {
      return [];
    }

    // Sort x values for consistent ordering
    const sortedXValues = Array.from(xValues).sort();

    // Normalize each row to ensure all x values are present
    return data.map(row => ({
      id: row.id,
      data: sortedXValues.map(x => {
        const existing = row.data?.find(d => d.x.toString() === x);
        return {
          x,
          y: existing?.y ?? 0
        };
      })
    }));
  }, [data]);

  // Early return if data is invalid
  if (normalizedData.length === 0) {
    return (
      <ChartContainer title={title} description={description}>
        <div className="flex items-center justify-center h-full text-gray-500">
          No data available
        </div>
      </ChartContainer>
    );
  }

  // Extract keys (x values) from the first row
  const keys = normalizedData[0].data.map(d => d.x);

  const themeConfig = {
    background: theme === 'dark' ? '#1F2937' : '#ffffff',
    textColor: theme === 'dark' ? '#F3F4F6' : '#111827',
    fontSize: 11,
  };

  return (
    <ChartContainer title={title} description={description}>
      <ResponsiveHeatMap
        data={normalizedData}
        keys={keys}
        indexBy="id"
        margin={margin}
        forceSquare={forceSquare}
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: xLegend,
          legendPosition: 'middle',
          legendOffset: -20,
          renderTick: (tick) => (
            <g transform={`translate(${tick.x},${tick.y})`}>
              <line stroke="#777" strokeWidth={1} y1={0} y2={5} />
              <text
                textAnchor="middle"
                dominantBaseline="text-before-edge"
                transform={`translate(0,7) rotate(-45)`}
                style={{
                  fontSize: 10,
                  fill: themeConfig.textColor,
                }}
              >
                {tick.value.length > 8 ? `${tick.value.substring(0, 8)}...` : tick.value}
              </text>
            </g>
          )
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: yLegend,
          legendPosition: 'middle',
          legendOffset: -40,
          renderTick: (tick) => (
            <g transform={`translate(${tick.x},${tick.y})`}>
              <line stroke="#777" strokeWidth={1} x1={0} x2={-5} />
              <text
                textAnchor="end"
                dominantBaseline="middle"
                transform="translate(-10,0)"
                style={{
                  fontSize: 10,
                  fill: themeConfig.textColor,
                }}
              >
                {tick.value.length > 12 ? `${tick.value.substring(0, 12)}...` : tick.value}
              </text>
            </g>
          )
        }}
        colors={colors}
        emptyColor={theme === 'dark' ? '#374151' : '#ffffff'}
        borderRadius={2}
        borderWidth={1}
        borderColor={theme === 'dark' ? '#374151' : '#ffffff'}
        enableLabels={true}
        labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
        sizeVariation={sizeVariation}
        padding={padding}
        cellOpacity={cellOpacity}
        animate={animate}
        motionConfig={motionConfig}
        theme={{
          ...themeConfig,
          labels: {
            text: {
              fontSize: 10
            }
          },
          tooltip: {
            container: {
              background: themeConfig.background,
              color: themeConfig.textColor,
              fontSize: themeConfig.fontSize,
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '8px'
            }
          }
        }}
        legends={enableLegend ? [
          {
            anchor: 'bottom',
            translateX: 0,
            translateY: 20,
            length: 120,
            thickness: 8,
            direction: 'row',
            tickPosition: 'after',
            tickSize: 3,
            tickSpacing: 4,
            tickOverlap: false,
            title: 'Value →',
            titleAlign: 'start',
            titleOffset: 4
          }
        ] : []}
      />
    </ChartContainer>
  );
}