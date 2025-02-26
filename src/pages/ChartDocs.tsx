import React from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/common/PageHeader';
import { LineChart } from '../components/charts/LineChart';
import { AreaChart } from '../components/charts/AreaChart';
import { PieChart } from '../components/charts/PieChart';
import { BarChart } from '../components/charts/BarChart';
import { RadarChart } from '../components/charts/RadarChart';
import { BoxPlotChart } from '../components/charts/BoxPlotChart';
import { GanttChart } from '../components/charts/GanttChart';
import { GaugeChart } from '../components/charts/GaugeChart';
import { ScatterChart } from '../components/charts/ScatterChart';
import { WaterfallChart } from '../components/charts/WaterfallChart';
import { TreemapChart } from '../components/charts/TreemapChart';
import { scatterData, radarData, ganttData, decompositionData } from '../lib/constants/chartData';

// Sample data for each chart type
const lineChartData = [
  { name: 'Jan', value1: 100, value2: 200, value3: 150 },
  { name: 'Feb', value1: 120, value2: 180, value3: 170 },
  { name: 'Mar', value1: 140, value2: 250, value3: 160 },
  { name: 'Apr', value1: 160, value2: 220, value3: 180 },
  { name: 'May', value1: 180, value2: 270, value3: 200 },
];

const areaChartData = [
  { name: 'Jan', desktop: 4000, mobile: 2400, tablet: 1800 },
  { name: 'Feb', desktop: 3000, mobile: 2210, tablet: 1600 },
  { name: 'Mar', desktop: 2000, mobile: 2290, tablet: 2100 },
  { name: 'Apr', desktop: 2780, mobile: 2000, tablet: 2300 },
  { name: 'May', desktop: 1890, mobile: 2400, tablet: 2500 },
];

const pieChartData = [
  { id: 'Desktop', value: 45, label: 'Desktop' },
  { id: 'Mobile', value: 35, label: 'Mobile' },
  { id: 'Tablet', value: 20, label: 'Tablet' },
];

const boxPlotData = [
  { name: 'Project A', min: 20, q1: 40, median: 50, q3: 70, max: 90 },
  { name: 'Project B', min: 30, q1: 45, median: 55, q3: 65, max: 85 },
  { name: 'Project C', min: 15, q1: 35, median: 45, q3: 60, max: 95 },
];

const waterfallData = [
  { name: 'Initial', value: 1000 },
  { name: 'Revenue', value: 500 },
  { name: 'Costs', value: -300 },
  { name: 'Tax', value: -100 },
  { name: 'Final', value: 1100, isTotal: true },
];

interface ChartSectionProps {
  title: string;
  schema: string;
  props?: string;
  children: React.ReactNode;
}

function ChartSection({ title, schema, props, children }: ChartSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="mb-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Data Schema</h3>
            <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
              <code className="text-sm text-gray-800">{schema}</code>
            </pre>
          </div>
          {props && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Props</h3>
              <pre className="bg-gray-50 rounded-lg p-4 overflow-x-auto">
                <code className="text-sm text-gray-800">{props}</code>
              </pre>
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function ChartDocs() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Chart Documentation"
        description="Documentation for all available chart components and their data schemas"
      />

      <div className="space-y-12">
        {/* Common Props */}
        <ChartSection
          title="Common Props"
          schema={`// These props are available for all charts
interface BaseChartProps {
  title?: string;           // Chart title
  description?: string;     // Chart description
  width?: number | string;  // Chart width
  height?: number | string; // Chart height
  
  // Axes configuration
  xAxis?: {
    title?: string;
    tickFormat?: (value: any) => string;
    tickRotation?: number;
    min?: number;
    max?: number;
  };
  yAxis?: {
    title?: string;
    tickFormat?: (value: any) => string;
    tickRotation?: number;
    min?: number;
    max?: number;
  };
  
  // Styling
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  colors?: {
    scheme?: string;
    type?: 'sequential' | 'diverging' | 'categorical';
  };
  theme?: 'light' | 'dark';
  
  // Features
  enableGridX?: boolean;
  enableGridY?: boolean;
  enableLegend?: boolean;
  enableTooltip?: boolean;
  
  // Animation
  animate?: boolean;
  motionConfig?: 'default' | 'gentle' | 'wobbly' | 'stiff';
  
  // Legend
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  legendDirection?: 'row' | 'column';
  
  // Tooltip
  tooltipFormat?: (value: any) => string | React.ReactNode;
  customTooltip?: React.ComponentType<any>;
}`}
        >
          <div className="text-gray-600">
            These props are inherited by all chart components and provide consistent configuration options across the library.
          </div>
        </ChartSection>

        {/* Line Chart */}
        <ChartSection
          title="Line Chart"
          schema={`interface DataPoint {
  name: string;      // X-axis label
  [key: string]: string | number;  // Values for each line
}

interface Series {
  key: string;       // Key in DataPoint for this line
  color: string;     // Line color (hex)
  name: string;      // Legend label
}`}
          props={`interface LineChartProps extends BaseChartProps {
  data: DataPoint[];
  series: Series[];
  showDots?: boolean;      // Show data points
  smoothCurve?: boolean;   // Use curved lines
}`}
        >
          <LineChart
            data={lineChartData}
            series={[
              { key: 'value1', color: '#8884d8', name: 'Series A' },
              { key: 'value2', color: '#82ca9d', name: 'Series B' },
              { key: 'value3', color: '#ffc658', name: 'Series C' },
            ]}
            title="Monthly Trends"
            xAxis={{ title: 'Month' }}
            yAxis={{ title: 'Value' }}
          />
        </ChartSection>

        {/* Area Chart */}
        <ChartSection
          title="Area Chart"
          schema={`interface DataPoint {
  name: string;      // X-axis label
  [key: string]: string | number;  // Values for each area
}

interface Series {
  key: string;       // Key in DataPoint for this area
  color: string;     // Area color (hex)
  name: string;      // Legend label
}`}
          props={`interface AreaChartProps extends BaseChartProps {
  data: DataPoint[];
  series: Series[];
  stacked?: boolean;     // Stack areas on top of each other
  curve?: 'linear' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
}`}
        >
          <AreaChart
            data={areaChartData}
            series={[
              { key: 'desktop', color: '#8884d8', name: 'Desktop' },
              { key: 'mobile', color: '#82ca9d', name: 'Mobile' },
              { key: 'tablet', color: '#ffc658', name: 'Tablet' },
            ]}
            stacked={true}
            title="Device Usage"
            xAxis={{ title: 'Month' }}
            yAxis={{ title: 'Users' }}
          />
        </ChartSection>

        {/* Bar Chart */}
        <ChartSection
          title="Bar Chart"
          schema={`interface DataPoint {
  name: string;      // Category label
  [key: string]: string | number;  // Values for each bar
}

interface Series {
  key: string;       // Key in DataPoint for this bar
  color: string;     // Bar color (hex)
  name: string;      // Legend label
}`}
          props={`interface BarChartProps extends BaseChartProps {
  data: DataPoint[];
  series: Series[];
  layout?: 'vertical' | 'horizontal';  // Bar orientation
  barSize?: number;                    // Width of bars
  stackOffset?: 'none' | 'expand' | 'wiggle' | 'silhouette';
}`}
        >
          <BarChart
            data={lineChartData}
            series={[
              { key: 'value1', color: '#8884d8', name: 'Series A' },
              { key: 'value2', color: '#82ca9d', name: 'Series B' },
            ]}
            layout="vertical"
            title="Category Comparison"
          />
        </ChartSection>

        {/* Pie Chart */}
        <ChartSection
          title="Pie Chart"
          schema={`interface DataPoint {
  id: string;        // Unique identifier
  value: number;     // Segment value
  label?: string;    // Segment label
  color?: string;    // Optional custom color
}`}
          props={`interface PieChartProps extends BaseChartProps {
  data: DataPoint[];
  donut?: boolean;                 // Create donut chart
  padAngle?: number;               // Space between segments
  cornerRadius?: number;           // Rounded corners
  sortByValue?: boolean;           // Sort segments by value
  innerRadius?: number;            // Inner radius for donut
  activeOuterRadiusOffset?: number; // Hover offset
}`}
        >
          <PieChart
            data={pieChartData}
            title="Device Distribution"
            donut={true}
          />
        </ChartSection>

        {/* Radar Chart */}
        <ChartSection
          title="Radar Chart"
          schema={`interface DataPoint {
  metric: string;    // Metric name
  [key: string]: string | number;  // Values for each category
}`}
          props={`interface RadarChartProps extends BaseChartProps {
  data: DataPoint[];
  keys: string[];              // Keys to plot
  indexBy: string;             // Key for categories
  maxValue?: number | 'auto';  // Maximum value
  curve?: 'linear' | 'catmullRom';
  gridLevels?: number;         // Number of grid levels
  gridShape?: 'circular' | 'linear';
  dotSize?: number;            // Size of data points
  dotBorderWidth?: number;     // Border of data points
  blendMode?: string;          // CSS blend mode
}`}
        >
          <RadarChart
            data={radarData}
            keys={['A', 'B', 'C']}
            indexBy="metric"
            title="Performance Metrics"
          />
        </ChartSection>

        {/* Scatter Chart */}
        <ChartSection
          title="Scatter Chart"
          schema={`interface ScatterData {
  name: string;      // Series name
  data: Array<{
    x: number;       // X coordinate
    y: number;       // Y coordinate
    z?: number;      // Optional bubble size
  }>;
}`}
          props={`interface ScatterChartProps extends BaseChartProps {
  data: ScatterData[];
  bubbleSize?: {
    min: number;     // Minimum bubble size
    max: number;     // Maximum bubble size
  };
}`}
        >
          <ScatterChart 
            data={scatterData}
            title="Data Distribution"
            xAxis={{ title: 'X Value' }}
            yAxis={{ title: 'Y Value' }}
          />
        </ChartSection>

        {/* Waterfall Chart */}
        <ChartSection
          title="Waterfall Chart"
          schema={`interface WaterfallData {
  name: string;      // Step name
  value: number;     // Value change
  isTotal?: boolean; // Whether this is a total step
}`}
          props={`interface WaterfallChartProps extends BaseChartProps {
  data: WaterfallData[];
  positiveColor?: string;   // Color for positive changes
  negativeColor?: string;   // Color for negative changes
  totalColor?: string;      // Color for total bars
}`}
        >
          <WaterfallChart 
            data={waterfallData}
            title="Financial Flow"
          />
        </ChartSection>

        {/* Gantt Chart */}
        <ChartSection
          title="Gantt Chart"
          schema={`interface Task {
  id: string;           // Task identifier
  name: string;         // Task name
  start: Date;          // Start date
  end: Date;           // End date
  progress: number;     // Completion percentage
  dependencies?: string[]; // IDs of dependent tasks
}`}
          props={`interface GanttChartProps extends BaseChartProps {
  data: Task[];
  showProgress?: boolean;    // Show progress bars
  showDependencies?: boolean; // Show dependency lines
  barHeight?: number;        // Height of task bars
  barPadding?: number;       // Padding between bars
}`}
        >
          <GanttChart 
            data={ganttData}
            title="Project Timeline"
          />
        </ChartSection>

        {/* Treemap Chart */}
        <ChartSection
          title="Treemap Chart"
          schema={`interface TreemapNode {
  name: string;         // Node name
  value?: number;       // Node value
  children?: TreemapNode[]; // Child nodes
  color?: string;       // Optional custom color
}`}
          props={`interface TreemapChartProps extends BaseChartProps {
  data: TreemapNode;
  valueFormat?: string;          // Value format string
  labelSkipSize?: number;        // Skip labels below size
  enableParentLabel?: boolean;   // Show parent labels
  parentLabelSize?: number;      // Parent label size
  parentLabelPosition?: 'top' | 'center' | 'bottom';
  colorMode?: 'parentInherit' | 'gradient';
}`}
        >
          <TreemapChart 
            data={decompositionData}
            title="Revenue Breakdown"
          />
        </ChartSection>

        {/* Box Plot */}
        <ChartSection
          title="Box Plot"
          schema={`interface BoxPlotData {
  name: string;      // Category name
  min: number;       // Minimum value
  q1: number;        // First quartile
  median: number;    // Median value
  q3: number;        // Third quartile
  max: number;       // Maximum value
}`}
          props={`interface BoxPlotChartProps extends BaseChartProps {
  data: BoxPlotData[];
  orientation?: 'vertical' | 'horizontal';
  medianWidth?: number;      // Width of median line
  whiskerWidth?: number;     // Width of whiskers
  outlierRadius?: number;    // Size of outlier points
  showOutliers?: boolean;    // Show outlier points
}`}
        >
          <BoxPlotChart 
            data={boxPlotData}
            title="Statistical Distribution"
          />
        </ChartSection>

        {/* Gauge Chart */}
        <ChartSection
          title="Gauge Chart"
          schema={`interface GaugeChartProps {
  value: number;     // Current value
  min: number;       // Minimum value
  max: number;       // Maximum value
  title?: string;    // Chart title
  format?: (value: number) => string;  // Value formatter
}`}
          props={`interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  title?: string;
  format?: (value: number) => string;
  colorScheme?: {
    low: string;     // Color for low values
    medium: string;  // Color for medium values
    high: string;    // Color for high values
  };
  arcThickness?: number;     // Thickness of gauge arc
  showTicks?: boolean;       // Show tick marks
  tickCount?: number;        // Number of ticks
  animated?: boolean;        // Enable animations
}`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GaugeChart 
              value={75} 
              min={0}
              max={100}
              title="CPU Usage"
              format={(v) => `${v}%`}
            />
            <GaugeChart 
              value={45} 
              min={0}
              max={100}
              title="Memory Usage"
              format={(v) => `${v}%`}
            />
          </div>
        </ChartSection>
      </div>
    </DashboardLayout>
  );
}

export default ChartDocs;