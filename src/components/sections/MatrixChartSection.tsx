import React from 'react';
import { MatrixChart } from '../charts/MatrixChart';

// Sample matrix data with consistent structure
const matrixData = [
  {
    id: 'Revenue Growth',
    data: [
      { x: 'Q1', y: 85 },
      { x: 'Q2', y: 92 },
      { x: 'Q3', y: 88 },
      { x: 'Q4', y: 95 }
    ]
  },
  {
    id: 'Customer Satisfaction',
    data: [
      { x: 'Q1', y: 78 },
      { x: 'Q2', y: 82 },
      { x: 'Q3', y: 85 },
      { x: 'Q4', y: 89 }
    ]
  },
  {
    id: 'Service Quality',
    data: [
      { x: 'Q1', y: 90 },
      { x: 'Q2', y: 87 },
      { x: 'Q3', y: 92 },
      { x: 'Q4', y: 94 }
    ]
  },
  {
    id: 'Client Retention',
    data: [
      { x: 'Q1', y: 82 },
      { x: 'Q2', y: 85 },
      { x: 'Q3', y: 88 },
      { x: 'Q4', y: 91 }
    ]
  },
  {
    id: 'New Acquisitions',
    data: [
      { x: 'Q1', y: 75 },
      { x: 'Q2', y: 80 },
      { x: 'Q3', y: 83 },
      { x: 'Q4', y: 87 }
    ]
  }
];

export function MatrixChartSection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Performance Matrix</h2>
          <p className="mt-1 text-sm text-gray-500">
            Quarterly performance metrics across key business dimensions
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card p-6">
        <MatrixChart
          data={matrixData}
          title="Performance Overview"
          description="Scores range from 0 to 100, with higher values indicating better performance"
          xLegend="Quarters"
          yLegend="Metrics"
          colors={{ type: 'sequential', scheme: 'blues' }}
          margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
          sizeVariation={0.4}
          padding={2}
          cellOpacity={0.85}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800">Revenue Growth</h3>
          <p className="mt-1 text-xs text-blue-600">
            Measures quarterly revenue increase compared to previous periods
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800">Customer Satisfaction</h3>
          <p className="mt-1 text-xs text-blue-600">
            Based on customer feedback and satisfaction surveys
          </p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800">Service Quality</h3>
          <p className="mt-1 text-xs text-blue-600">
            Evaluation of service delivery and quality standards
          </p>
        </div>
      </div>
    </div>
  );
}