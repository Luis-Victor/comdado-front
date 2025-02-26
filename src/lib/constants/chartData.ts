// Chart data constants
export const timeSeriesData = [
  { name: 'Jan', sales: 4000, profit: 2400, revenue: 6000 },
  { name: 'Feb', sales: 3000, profit: 1398, revenue: 5000 },
  { name: 'Mar', sales: 2000, profit: 9800, revenue: 4000 },
  { name: 'Apr', sales: 2780, profit: 3908, revenue: 7000 },
  { name: 'May', sales: 1890, profit: 4800, revenue: 4500 },
  { name: 'Jun', sales: 2390, profit: 3800, revenue: 6500 },
];

export const stackedAreaData = [
  { name: 'Jan', desktop: 4000, mobile: 2400, tablet: 1800 },
  { name: 'Feb', desktop: 3000, mobile: 2210, tablet: 1600 },
  { name: 'Mar', desktop: 2000, mobile: 2290, tablet: 2100 },
  { name: 'Apr', desktop: 2780, mobile: 2000, tablet: 2300 },
  { name: 'May', desktop: 1890, mobile: 2400, tablet: 2500 },
  { name: 'Jun', desktop: 2390, mobile: 2800, tablet: 2100 },
];

export const boxPlotData = [
  { name: 'Project A', min: 20, q1: 40, median: 50, q3: 70, max: 90 },
  { name: 'Project B', min: 30, q1: 45, median: 55, q3: 65, max: 85 },
  { name: 'Project C', min: 15, q1: 35, median: 45, q3: 60, max: 95 },
  { name: 'Project D', min: 25, q1: 42, median: 58, q3: 75, max: 88 },
  { name: 'Project E', min: 10, q1: 30, median: 52, q3: 68, max: 92 },
];

export const pieData = [
  { id: 'Product A', value: 35 },
  { id: 'Product B', value: 25 },
  { id: 'Product C', value: 20 },
  { id: 'Product D', value: 15 },
  { id: 'Product E', value: 5 },
];

export const matrixData = [
  {
    id: 'Product Quality',
    data: [
      { x: 'Q1', y: 85 },
      { x: 'Q2', y: 92 },
      { x: 'Q3', y: 88 },
      { x: 'Q4', y: 95 },
    ],
  },
  {
    id: 'Customer Satisfaction',
    data: [
      { x: 'Q1', y: 78 },
      { x: 'Q2', y: 82 },
      { x: 'Q3', y: 85 },
      { x: 'Q4', y: 89 },
    ],
  },
  {
    id: 'On-Time Delivery',
    data: [
      { x: 'Q1', y: 90 },
      { x: 'Q2', y: 87 },
      { x: 'Q3', y: 92 },
      { x: 'Q4', y: 94 },
    ],
  },
  {
    id: 'Cost Efficiency',
    data: [
      { x: 'Q1', y: 75 },
      { x: 'Q2', y: 80 },
      { x: 'Q3', y: 83 },
      { x: 'Q4', y: 87 },
    ],
  },
  {
    id: 'Employee Productivity',
    data: [
      { x: 'Q1', y: 82 },
      { x: 'Q2', y: 85 },
      { x: 'Q3', y: 88 },
      { x: 'Q4', y: 91 },
    ],
  },
];

export const scatterData = [
  {
    name: 'Series A',
    data: [
      { x: 100, y: 200, z: 200 },
      { x: 120, y: 100, z: 260 },
      { x: 170, y: 300, z: 400 },
      { x: 140, y: 250, z: 280 },
      { x: 150, y: 400, z: 500 },
      { x: 110, y: 280, z: 200 },
    ],
  },
  {
    name: 'Series B',
    data: [
      { x: 200, y: 260, z: 240 },
      { x: 240, y: 290, z: 220 },
      { x: 190, y: 290, z: 250 },
      { x: 198, y: 250, z: 210 },
      { x: 180, y: 280, z: 260 },
      { x: 210, y: 220, z: 230 },
    ],
  },
];

export const radarData = [
  {
    metric: 'Performance',
    A: 120,
    B: 110,
    C: 140,
  },
  {
    metric: 'Reliability',
    A: 98,
    B: 130,
    C: 140,
  },
  {
    metric: 'Speed',
    A: 86,
    B: 130,
    C: 120,
  },
  {
    metric: 'Quality',
    A: 99,
    B: 85,
    C: 110,
  },
  {
    metric: 'Satisfaction',
    A: 85,
    B: 90,
    C: 100,
  },
];

export const ganttData = [
  {
    id: '1',
    name: 'Project Planning',
    start: new Date(2025, 0, 1),
    end: new Date(2025, 0, 15),
    progress: 100,
  },
  {
    id: '2',
    name: 'Design Phase',
    start: new Date(2025, 0, 15),
    end: new Date(2025, 1, 15),
    progress: 85,
    dependencies: ['1'],
  },
  {
    id: '3',
    name: 'Development',
    start: new Date(2025, 1, 15),
    end: new Date(2025, 3, 15),
    progress: 70,
    dependencies: ['2'],
  },
  {
    id: '4',
    name: 'Testing',
    start: new Date(2025, 3, 1),
    end: new Date(2025, 3, 30),
    progress: 45,
    dependencies: ['3'],
  },
  {
    id: '5',
    name: 'Deployment',
    start: new Date(2025, 4, 1),
    end: new Date(2025, 4, 15),
    progress: 20,
    dependencies: ['4'],
  },
];

export const decompositionData = {
  id: 'total-revenue',
  name: 'Total Revenue',
  value: 1000000,
  children: [
    {
      id: 'product-sales',
      name: 'Product Sales',
      value: 600000,
      children: [
        {
          id: 'hardware',
          name: 'Hardware',
          value: 350000,
          children: [
            { id: 'laptops', name: 'Laptops', value: 200000 },
            { id: 'desktops', name: 'Desktops', value: 100000 },
            { id: 'accessories', name: 'Accessories', value: 50000 }
          ]
        },
        {
          id: 'software',
          name: 'Software',
          value: 250000,
          children: [
            { id: 'licenses', name: 'Licenses', value: 150000 },
            { id: 'subscriptions', name: 'Subscriptions', value: 100000 }
          ]
        }
      ]
    },
    {
      id: 'services',
      name: 'Services',
      value: 400000,
      children: [
        {
          id: 'consulting',
          name: 'Consulting',
          value: 250000,
          children: [
            { id: 'implementation', name: 'Implementation', value: 150000 },
            { id: 'training', name: 'Training', value: 100000 }
          ]
        },
        {
          id: 'support',
          name: 'Support',
          value: 150000,
          children: [
            { id: 'maintenance', name: 'Maintenance', value: 100000 },
            { id: 'helpdesk', name: 'Helpdesk', value: 50000 }
          ]
        }
      ]
    }
  ]
};

export const gaugeData = [
  { name: 'CPU Usage', value: 75, min: 0, max: 100 },
  { name: 'Memory Usage', value: 45, min: 0, max: 100 },
  { name: 'Disk Space', value: 92, min: 0, max: 100 },
];