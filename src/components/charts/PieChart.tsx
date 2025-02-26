import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { BaseChartProps } from '../../lib/types/chart';
import { ChartContainer } from './ChartContainer';

interface DataPoint {
  id: string;
  value: number;
  color?: string;
  label?: string;
}

interface PieChartProps extends BaseChartProps {
  data: DataPoint[];
  donut?: boolean;
  padAngle?: number;
  cornerRadius?: number;
  sortByValue?: boolean;
  innerRadius?: number;
  activeOuterRadiusOffset?: number;
}

export function PieChart({ 
  data,
  donut = false,
  padAngle = 0.7,
  cornerRadius = 3,
  sortByValue = true,
  innerRadius = donut ? 0.6 : 0,
  activeOuterRadiusOffset = 8,
  title,
  description,
  margin = { top: 40, right: 80, bottom: 80, left: 80 },
  colors = { scheme: 'nivo' },
  theme = 'light',
  enableLegend = true,
  enableTooltip = true,
  animate = true,
  motionConfig = 'gentle',
  legendPosition = 'bottom',
  tooltipFormat,
}: PieChartProps) {
  const themeConfig = {
    background: theme === 'dark' ? '#1F2937' : '#ffffff',
    textColor: theme === 'dark' ? '#F3F4F6' : '#111827',
    fontSize: 12,
  };

  return (
    <ChartContainer title={title} description={description}>
      <ResponsivePie
        data={data}
        margin={margin}
        innerRadius={innerRadius}
        padAngle={padAngle}
        cornerRadius={cornerRadius}
        activeOuterRadiusOffset={activeOuterRadiusOffset}
        colors={colors}
        borderWidth={1}
        borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        enableArcLinkLabels={true}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={themeConfig.textColor}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        sortByValue={sortByValue}
        animate={animate}
        motionConfig={motionConfig}
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
            anchor: legendPosition === 'bottom' ? 'bottom' : 'right',
            direction: legendPosition === 'bottom' ? 'row' : 'column',
            justify: false,
            translateX: legendPosition === 'right' ? 80 : 0,
            translateY: legendPosition === 'bottom' ? 56 : 0,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
          }
        ] : []}
      />
    </ChartContainer>
  );
}