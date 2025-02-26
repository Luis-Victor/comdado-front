import { DashboardConfig } from '../types/dashboard';

export const defaultDashboardConfig: DashboardConfig = {
  title: "Performance Overview",
  theme: "light",
  layout: {
    rows: 12,
    columns: 12,
    gap: 16,
    responsive: {
      breakpoints: {
        sm: 576,
        md: 768,
        lg: 992,
        xl: 1200
      },
      behavior: 'reflow',
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
  },
  components: [
    // KPI Cards Row
    {
      id: "total-revenue",
      type: "Card",
      title: "Total Revenue",
      position: {
        row: 1,
        column: 1,
        width: 3,
        height: 1,
        responsive: {
          sm: { row: 1, column: 1, width: 4, height: 1 },
          md: { row: 1, column: 1, width: 3, height: 1 }
        }
      },
      priority: 1,
      data: {
        value: "$48,234",
        change: 12,
        icon: "DollarSign",
        description: "vs last month"
      }
    },
    {
      id: "active-users",
      type: "Card",
      title: "Active Users",
      position: {
        row: 1,
        column: 4,
        width: 3,
        height: 1,
        responsive: {
          sm: { row: 2, column: 1, width: 4, height: 1 },
          md: { row: 1, column: 4, width: 3, height: 1 }
        }
      },
      priority: 1,
      data: {
        value: "2,420",
        change: 8,
        icon: "Users",
        description: "vs last month"
      }
    },
    {
      id: "engagement-rate",
      type: "Card",
      title: "Engagement Rate",
      position: {
        row: 1,
        column: 7,
        width: 3,
        height: 1,
        responsive: {
          sm: { row: 3, column: 1, width: 4, height: 1 },
          md: { row: 1, column: 7, width: 3, height: 1 }
        }
      },
      priority: 2,
      data: {
        value: "67%",
        change: -3,
        icon: "Activity",
        description: "vs last month"
      }
    },
    {
      id: "growth-rate",
      type: "Card",
      title: "Growth Rate",
      position: {
        row: 1,
        column: 10,
        width: 3,
        height: 1,
        responsive: {
          sm: { row: 4, column: 1, width: 4, height: 1 },
          md: { row: 1, column: 10, width: 3, height: 1 }
        }
      },
      priority: 2,
      data: {
        value: "24%",
        change: 15,
        icon: "TrendingUp",
        description: "vs last month"
      }
    },

    // Main Charts Row
    {
      id: "revenue-trend",
      type: "LineChart",
      title: "Revenue Trend",
      position: {
        row: 2,
        column: 1,
        width: 8,
        height: 3,
        responsive: {
          sm: { row: 5, column: 1, width: 4, height: 3 },
          md: { row: 2, column: 1, width: 8, height: 3 }
        }
      },
      priority: 1,
      data: {
        data: [
          { name: 'Jan', value1: 4000, value2: 2400, value3: 1800 },
          { name: 'Feb', value1: 3000, value2: 1398, value3: 2800 },
          { name: 'Mar', value1: 2000, value2: 9800, value3: 2200 },
          { name: 'Apr', value1: 2780, value2: 3908, value3: 2000 },
          { name: 'May', value1: 1890, value2: 4800, value3: 2181 },
          { name: 'Jun', value1: 2390, value2: 3800, value3: 2500 }
        ],
        series: [
          { key: 'value1', color: '#8884d8', name: 'Revenue' },
          { key: 'value2', color: '#82ca9d', name: 'Profit' },
          { key: 'value3', color: '#ffc658', name: 'Cost' }
        ]
      },
      options: {
        showDots: true,
        smoothCurve: true,
        xAxis: { title: 'Month' },
        yAxis: { title: 'Amount ($)' }
      }
    },
    {
      id: "top-products",
      type: "BarChart",
      title: "Top Products",
      position: {
        row: 2,
        column: 9,
        width: 4,
        height: 3,
        responsive: {
          sm: { row: 8, column: 1, width: 4, height: 3 },
          md: { row: 2, column: 9, width: 4, height: 3 }
        }
      },
      priority: 2,
      data: {
        data: [
          { name: 'Product A', sales: 120 },
          { name: 'Product B', sales: 98 },
          { name: 'Product C', sales: 86 },
          { name: 'Product D', sales: 72 },
          { name: 'Product E', sales: 65 }
        ],
        series: [
          { key: 'sales', color: '#8884d8', name: 'Sales' }
        ]
      },
      options: {
        layout: 'vertical'
      }
    },

    // Secondary Charts Row
    {
      id: "sales-distribution",
      type: "PieChart",
      title: "Sales Distribution",
      position: {
        row: 5,
        column: 1,
        width: 4,
        height: 3,
        responsive: {
          sm: { row: 11, column: 1, width: 4, height: 3 },
          md: { row: 5, column: 1, width: 4, height: 3 }
        }
      },
      priority: 2,
      data: [
        { id: 'Direct', value: 45, label: 'Direct' },
        { id: 'Affiliate', value: 25, label: 'Affiliate' },
        { id: 'Social', value: 20, label: 'Social' },
        { id: 'Other', value: 10, label: 'Other' }
      ],
      options: {
        donut: true,
        colors: { scheme: 'nivo' }
      }
    },
    {
      id: "performance-radar",
      type: "RadarChart",
      title: "Performance Metrics",
      position: {
        row: 5,
        column: 5,
        width: 4,
        height: 3,
        responsive: {
          sm: { row: 14, column: 1, width: 4, height: 3 },
          md: { row: 5, column: 5, width: 4, height: 3 }
        }
      },
      priority: 3,
      data: [
        { metric: 'Sales', A: 120, B: 110 },
        { metric: 'Marketing', A: 98, B: 130 },
        { metric: 'Development', A: 86, B: 130 },
        { metric: 'Support', A: 99, B: 85 },
        { metric: 'Admin', A: 85, B: 90 }
      ],
      options: {
        keys: ['A', 'B'],
        indexBy: 'metric',
        maxValue: 'auto'
      }
    },
    {
      id: "activity-heatmap",
      type: "HeatmapChart",
      title: "Activity Heatmap",
      position: {
        row: 5,
        column: 9,
        width: 4,
        height: 3,
        responsive: {
          sm: { row: 17, column: 1, width: 4, height: 3 },
          md: { row: 5, column: 9, width: 4, height: 3 }
        }
      },
      priority: 3,
      data: [
        {
          id: 'Morning',
          data: [
            { x: 'Mon', y: 85 },
            { x: 'Tue', y: 92 },
            { x: 'Wed', y: 88 },
            { x: 'Thu', y: 95 },
            { x: 'Fri', y: 89 }
          ]
        },
        {
          id: 'Afternoon',
          data: [
            { x: 'Mon', y: 78 },
            { x: 'Tue', y: 82 },
            { x: 'Wed', y: 85 },
            { x: 'Thu', y: 89 },
            { x: 'Fri', y: 92 }
          ]
        },
        {
          id: 'Evening',
          data: [
            { x: 'Mon', y: 90 },
            { x: 'Tue', y: 87 },
            { x: 'Wed', y: 92 },
            { x: 'Thu', y: 94 },
            { x: 'Fri', y: 91 }
          ]
        }
      ]
    },

    // Filters Row
    {
      id: "date-filter",
      type: "DatePicker",
      title: "Date Range",
      position: {
        row: 8,
        column: 1,
        width: 3,
        height: 1,
        responsive: {
          sm: { row: 20, column: 1, width: 4, height: 1 },
          md: { row: 8, column: 1, width: 3, height: 1 }
        }
      },
      priority: 1,
      data: {
        startDate: "2024-01-01",
        endDate: "2024-12-31"
      }
    },
    {
      id: "category-filter",
      type: "Dropdown",
      title: "Category",
      position: {
        row: 8,
        column: 4,
        width: 3,
        height: 1,
        responsive: {
          sm: { row: 21, column: 1, width: 4, height: 1 },
          md: { row: 8, column: 4, width: 3, height: 1 }
        }
      },
      priority: 2,
      data: {
        options: [
          { value: 'all', label: 'All Categories' },
          { value: 'electronics', label: 'Electronics' },
          { value: 'clothing', label: 'Clothing' },
          { value: 'food', label: 'Food & Beverage' }
        ],
        value: ['all']
      }
    },
    {
      id: "search-filter",
      type: "SearchBar",
      title: "Search",
      position: {
        row: 8,
        column: 7,
        width: 6,
        height: 1,
        responsive: {
          sm: { row: 22, column: 1, width: 4, height: 1 },
          md: { row: 8, column: 7, width: 6, height: 1 }
        }
      },
      priority: 2,
      data: {
        placeholder: "Search products..."
      }
    }
  ]
};