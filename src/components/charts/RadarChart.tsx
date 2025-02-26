import React from 'react';
import { ResponsiveRadar } from '@nivo/radar';
import { BaseChartProps } from '../../lib/types/chart';
import { ChartContainer } from './ChartContainer';

interface RadarChartProps extends BaseChartProps {
  data: Array<{ [key: string]: string | number }>;
  keys: string[];
  indexBy: string;
  maxValue?: number | 'auto';
  curve?: 'linear' | 'catmullRom';
  gridLevels?: number;
  gridShape?: 'circular' | 'linear';
  dotSize?: number;
  dotBorderWidth?: number;
  blendMode?: string;
}

export function RadarChart({
  data,
  keys,
  indexBy,
  maxValue = 'auto',
  curve = 'linear',
  gridLevels = 5,
  gridShape = 'circular',
  dotSize = 8,
  dotBorderWidth = 2,
  blendMode = 'multiply',
  title,
  description,
  margin = { top: 70, right: 80, bottom: 40, left: 80 },
  colors = { scheme: 'nivo' },
  theme = 'light',
  enableLegend = true,
  enableTooltip = true,
  animate = true,
  motionConfig = 'gentle',
  legendPosition = 'top-left',
  tooltipFormat,
}: RadarChartProps) {
  const themeConfig = {
    background: theme === 'dark' ? '#1F2937' : '#ffffff',
    textColor: theme === 'dark' ? '#F3F4F6' : '#111827',
    fontSize: 12,
  };

  return (
    <ChartContainer title={title} description={description}>
      <ResponsiveRadar
        data={data}
        keys={keys}
        indexBy={indexBy}
        maxValue={maxValue}
        curve={curve}
        margin={margin}
        gridLevels={gridLevels}
        gridShape={gridShape}
        dotSize={dotSize}
        dotBorderWidth={dotBorderWidth}
        colors={colors}
        blendMode={blendMode}
        motionConfig={motionConfig}
        animate={animate}
        theme={{
          ...themeConfig,
          tooltip: {
            container: {
              background: themeConfig.background,
              color: themeConfig.textColor,
              fontSize: themeConfig.fontSize,
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }
          }
        }}
        valueFormat={tooltipFormat}
        legends={enableLegend ? [
          {
            anchor: 'top-left',
            direction: 'column',
            translateX: -50,
            translateY: -40,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: themeConfig.textColor,
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: theme === 'dark' ? '#FFFFFF' : '#000000'
                }
              }
            ]
          }
        ] : []}
      />
    </ChartContainer>
  );
}