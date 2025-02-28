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
  margin = { top: 10, right: 10, bottom: 80, left: 10 }, // Increased bottom margin for legend
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
    fontSize: 10,
    tooltip: {
      container: {
        background: theme === 'dark' ? '#1F2937' : '#ffffff',
        color: theme === 'dark' ? '#F3F4F6' : '#111827',
        fontSize: 10,
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        padding: '6px'
      }
    }
  };

  // Calculate appropriate legend settings based on container size
  const legendSettings = React.useMemo(() => {
    if (legendPosition === 'bottom') {
      return {
        anchor: 'bottom',
        direction: 'row',
        justify: false,
        translateX: 0,
        translateY: 56, // Increased to prevent overflow
        itemsSpacing: 0,
        itemWidth: 60,
        itemHeight: 12,
        itemDirection: 'left-to-right',
        symbolSize: 8
      };
    } else {
      return {
        anchor: 'right',
        direction: 'column',
        justify: false,
        translateX: 10,
        translateY: 0,
        itemsSpacing: 0,
        itemWidth: 60,
        itemHeight: 12,
        itemDirection: 'left-to-right',
        symbolSize: 8
      };
    }
  }, [legendPosition]);

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
        enableArcLinkLabels={false}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={themeConfig.textColor}
        arcLinkLabelsThickness={1}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={15}
        arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
        arcLabelsRadiusOffset={0.6}
        arcLabelsThickness={2}
        sortByValue={sortByValue}
        animate={animate}
        motionConfig={motionConfig}
        theme={{
          ...themeConfig,
          labels: {
            text: {
              fontSize: 9,
              fontWeight: 600
            }
          },
          tooltip: {
            container: {
              background: themeConfig.background,
              color: themeConfig.textColor,
              fontSize: themeConfig.fontSize,
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              padding: '6px'
            }
          }
        }}
        valueFormat={tooltipFormat}
        legends={enableLegend ? [
          {
            ...legendSettings,
            itemOpacity: 1,
            symbolShape: 'circle',
            itemTextColor: themeConfig.textColor,
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