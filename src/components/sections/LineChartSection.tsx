import React, { useEffect, useState } from 'react';
import { LineChart } from '../charts/LineChart';
import { ChartContainer } from '../charts/ChartContainer';
import { fetchLineChartData, LineChartDataPoint } from '../../lib/api/lineChartData';
import { LoadingSpinner } from '../common/LoadingSpinner';

const chartSeries = [
  { key: 'total_clients', color: '#8884d8', name: 'Total Clients' },
  { key: 'active_services', color: '#82ca9d', name: 'Active Services' },
  { key: 'revenue', color: '#ffc658', name: 'Revenue (R$)' },
];

export function LineChartSection() {
  const [data, setData] = useState<LineChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const chartData = await fetchLineChartData();
        setData(chartData);
      } catch (err) {
        setError('Failed to load chart data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
        <p className="text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Business Growth Overview</h2>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <ChartContainer>
          <LineChart
            data={data}
            series={chartSeries}
            showDots={true}
            smoothCurve={true}
            showGrid={true}
            showLegend={true}
          />
        </ChartContainer>
      </div>
    </div>
  );
}