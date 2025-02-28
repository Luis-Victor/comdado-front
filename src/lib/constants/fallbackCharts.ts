import { ChartConfig } from '../types/magicChart';
import { 
  timeSeriesData, 
  pieData, 
  boxPlotData, 
  matrixData, 
  scatterData,
  radarData,
  gaugeData
} from './chartData';

/**
 * Fallback charts to display when API fails to fetch data
 */
export const fallbackCharts: ChartConfig[] = [
  {
    id: 'total-revenue-fallback',
    type: 'card',
    title: 'Total Revenue',
    data: {
      value: '$48,234',
      change: 12,
      icon: 'DollarSign',
      description: 'vs last month'
    },
    position: {
      row: 1,
      column: 1,
      width: 3,
      height: 1
    }
  },
  {
    id: 'active-users-fallback',
    type: 'card',
    title: 'Active Users',
    data: {
      value: '2,420',
      change: 8,
      icon: 'Users',
      description: 'vs last month'
    },
    position: {
      row: 1,
      column: 4,
      width: 3,
      height: 1
    }
  },
  {
    id: 'engagement-rate-fallback',
    type: 'card',
    title: 'Engagement Rate',
    data: {
      value: '67%',
      change: -3,
      icon: 'Activity',
      description: 'vs last month'
    },
    position: {
      row: 1,
      column: 7,
      width: 3,
      height: 1
    }
  },
  {
    id: 'growth-rate-fallback',
    type: 'card',
    title: 'Growth Rate',
    data: {
      value: '24%',
      change: 15,
      icon: 'TrendingUp',
      description: 'vs last month'
    },
    position: {
      row: 1,
      column: 10,
      width: 3,
      height: 1
    }
  },
  {
    id: 'revenue-trend-fallback',
    type: 'line',
    title: 'Revenue Trend',
    data: timeSeriesData,
    series: [
      { key: 'sales', color: '#8884d8', name: 'Sales' },
      { key: 'profit', color: '#82ca9d', name: 'Profit' },
      { key: 'revenue', color: '#ffc658', name: 'Revenue' }
    ],
    position: {
      row: 2,
      column: 1,
      width: 8,
      height: 3
    },
    options: {
      showDots: true,
      smoothCurve: true,
      xAxis: { title: 'Month' },
      yAxis: { title: 'Amount ($)' }
    }
  },
  {
    id: 'top-products-fallback',
    type: 'bar',
    title: 'Top Products',
    data: timeSeriesData,
    series: [
      { key: 'sales', color: '#8884d8', name: 'Sales' }
    ],
    position: {
      row: 2,
      column: 9,
      width: 4,
      height: 3
    },
    options: {
      layout: 'vertical'
    }
  },
  {
    id: 'customer-segments-fallback',
    type: 'pie',
    title: 'Customer Segments',
    data: pieData,
    position: {
      row: 5,
      column: 1,
      width: 4,
      height: 3
    },
    options: {
      donut: true,
      enableLegend: true,
      legendPosition: 'bottom'
    }
  },
  {
    id: 'performance-metrics-fallback',
    type: 'radar',
    title: 'Performance Metrics',
    data: radarData,
    position: {
      row: 5,
      column: 5,
      width: 4,
      height: 3
    },
    options: {
      keys: ['A', 'B', 'C'],
      indexBy: 'metric'
    }
  },
  {
    id: 'data-distribution-fallback',
    type: 'scatter',
    title: 'Data Distribution',
    data: scatterData,
    position: {
      row: 5,
      column: 9,
      width: 4,
      height: 3
    }
  },
  // Removing the matrix chart that's causing errors
  {
    id: 'statistical-distribution-fallback',
    type: 'boxplot',
    title: 'Statistical Distribution',
    data: boxPlotData,
    position: {
      row: 8,
      column: 1,
      width: 6,
      height: 3
    }
  },
  {
    id: 'system-usage-fallback',
    type: 'gauge',
    title: 'System Usage',
    data: gaugeData[0],
    position: {
      row: 8,
      column: 7,
      width: 6,
      height: 3
    }
  },
  {
    id: 'waterfall-analysis-fallback',
    type: 'waterfall',
    title: 'Financial Analysis',
    data: [
      { name: 'Initial', value: 1000 },
      { name: 'Revenue', value: 500 },
      { name: 'Costs', value: -300 },
      { name: 'Tax', value: -100 },
      { name: 'Final', value: 1100, isTotal: true }
    ],
    position: {
      row: 11,
      column: 5,
      width: 8,
      height: 3
    }
  }
];

/**
 * Default dashboard layout configuration for fallback
 */
export const fallbackDashboardConfig = {
  title: "Performance Dashboard (Offline Mode)",
  theme: "light",
  layout: {
    rows: 14,
    columns: 12,
    gap: 16,
    rowHeight: "auto",
    responsive: {
      breakpoints: {
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200
      },
      behavior: "reflow",
      columnThreshold: {
        sm: 4,
        md: 6,
        lg: 8,
        xl: 12
      },
      gapThreshold: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 16
      },
      priorityLevels: 3
    }
  }
};