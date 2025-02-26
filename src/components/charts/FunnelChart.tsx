import React from 'react';
import { ResponsivePie } from '@nivo/pie';

interface FunnelData {
  id: string;
  value: number;
  label: string;
}

interface FunnelChartProps {
  data: FunnelData[];
  title?: string;
}

export function FunnelChart({ data, title }: FunnelChartProps) {
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const total = sortedData[0]?.value || 0;

  const funnelData = sortedData.map(item => ({
    id: item.id,
    value: item.value,
    label: `${item.label} (${((item.value / total) * 100).toFixed(1)}%)`,
  }));

  return (
    <div className="w-full h-[400px] bg-white rounded-lg shadow-md p-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      )}
      <div className="w-full h-[calc(100%-2rem)]">
        <ResponsivePie
          data={funnelData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.6}
          padAngle={0.5}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          colors={{ scheme: 'nivo' }}
          role="funnel"
          ariaLabel={title || "Funnel Chart"}
          borderWidth={1}
          borderColor="#ffffff"
          enableArcLinkLabels={true}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#333333"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          startAngle={-90}
          endAngle={90}
          sortByValue={true}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
            },
          ]}
        />
      </div>
    </div>
  );
}