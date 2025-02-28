import React from 'react';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { BaseChartProps } from '../../lib/types/chart';
import { ChartContainer } from './ChartContainer';

interface TreemapNode {
  name: string;
  value?: number;
  children?: TreemapNode[];
  color?: string;
}

interface TreemapChartProps extends BaseChartProps {
  data: TreemapNode;
  valueFormat?: string;
  labelSkipSize?: number;
  enableParentLabel?: boolean;
  parentLabelSize?: number;
  parentLabelPosition?: 'top' | 'center' | 'bottom';
  colorMode?: 'parentInherit' | 'gradient';
}

export function TreemapChart({ 
  data,
  valueFormat = ".02s",
  labelSkipSize = 12,
  enableParentLabel = true,
  parentLabelSize = 14,
  parentLabelPosition = 'top',
  colorMode = 'parentInherit',
  title,
  description,
  margin = { top: 10, right: 10, bottom: 10, left: 10 },
  colors = { scheme: 'nivo' },
  theme = 'light',
  animate = true,
  motionConfig = 'gentle',
}: TreemapChartProps) {
  const themeConfig = {
    background: theme === 'dark' ? '#1F2937' : '#ffffff',
    textColor: theme === 'dark' ? '#F3F4F6' : '#111827',
    fontSize: 11,
  };

  return (
    <ChartContainer title={title} description={description}>
      <ResponsiveTreeMap
        data={data}
        identity="name"
        value="value"
        valueFormat={valueFormat}
        margin={margin}
        labelSkipSize={labelSkipSize}
        theme={{
          ...themeConfig,
          labels: {
            text: {
              fontSize: 10,
              fill: theme === 'dark' ? '#F3F4F6' : '#111827'
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
        colors={colors}
        colorMode={colorMode}
        nodeOpacity={0.8}
        borderWidth={1}
        borderColor={theme === 'dark' ? '#374151' : '#ffffff'}
        role="treemap"
        ariaLabel={title || "Treemap Chart"}
        enableParentLabel={enableParentLabel}
        parentLabelSize={parentLabelSize}
        parentLabelPosition={parentLabelPosition}
        parentLabelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
        animate={animate}
        motionConfig={motionConfig}
      />
    </ChartContainer>
  );
}