import React from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';

interface HeatmapData {
  id: string;
  data: Array<{
    x: string;
    y: number;
  }>;
}

interface HeatmapChartProps {
  data: HeatmapData[];
  title?: string;
}

export function HeatmapChart({ data, title }: HeatmapChartProps) {
  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-md p-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      )}
      <div className="w-full h-[calc(100%-2rem)]">
        <ResponsiveHeatMap
          data={data}
          margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
          valueFormat=">-.2s"
          role="heatmap"
          ariaLabel={title || "Heatmap Chart"}
          theme={{
            axis: {
              ticks: {
                text: {
                  fontSize: 10
                }
              }
            },
            legends: {
              text: {
                fontSize: 12
              }
            }
          }}
          axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: '',
            legendOffset: 46
          }}
          axisRight={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 70
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -72
          }}
          colors={{
            type: 'sequential',
            scheme: 'blues'
          }}
          emptyColor="#ffffff"
          borderRadius={1}
          borderWidth={1}
          borderColor="#ffffff"
          enableLabels={true}
          labelTextColor={{ from: 'color', modifiers: [['darker', 3]] }}
          legends={[
            {
              anchor: 'bottom',
              translateX: 0,
              translateY: 30,
              length: 400,
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
          ]}
        />
      </div>
    </div>
  );
}