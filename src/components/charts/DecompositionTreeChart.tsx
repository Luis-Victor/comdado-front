import React from 'react';
import { ResponsiveTreeMap } from '@nivo/treemap';
import { ChartContainer } from './ChartContainer';

interface TreeNode {
  id: string;
  name: string;
  value: number;
  children?: TreeNode[];
  color?: string;
}

interface DecompositionTreeChartProps {
  data: TreeNode;
  title?: string;
}

export function DecompositionTreeChart({ data, title }: DecompositionTreeChartProps) {
  return (
    <ChartContainer title={title}>
      <ResponsiveTreeMap
        data={data}
        identity="id"
        value="value"
        valueFormat=".02s"
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        labelSkipSize={12}
        label={node => `${node.data.name}\n${node.formattedValue}`}
        labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
        parentLabelPosition="left"
        parentLabelTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
        borderColor={{ from: 'color', modifiers: [['darker', 0.1]] }}
        animate={true}
        motionConfig="gentle"
        colors={{ scheme: 'blues' }}
        theme={{
          labels: {
            text: {
              fontSize: 14,
              fontWeight: 600
            }
          },
          tooltip: {
            container: {
              background: '#ffffff',
              fontSize: 12,
              borderRadius: 6,
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.25)',
              padding: 12
            }
          }
        }}
      />
    </ChartContainer>
  );
}