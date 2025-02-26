import { Series, DataPoint, MatrixData } from '../types/chart';

export function validateChartData<T>(data: T[] | undefined): T[] {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('Invalid or empty chart data provided');
    return [];
  }
  return data;
}

export function normalizeMatrixData(data: MatrixData[]): MatrixData[] {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn('Invalid or empty matrix data provided');
    return [];
  }

  // Get all unique x values
  const xValues = new Set<string>();
  data.forEach(row => {
    if (Array.isArray(row.data)) {
      row.data.forEach(item => {
        if (item.x) xValues.add(item.x.toString());
      });
    }
  });

  // Sort x values for consistent ordering
  const sortedXValues = Array.from(xValues).sort();

  // Normalize each row to ensure all x values are present
  return data.map(row => ({
    id: row.id,
    data: sortedXValues.map(x => {
      const existing = row.data?.find(d => d.x.toString() === x);
      return {
        x,
        y: existing?.y ?? 0
      };
    })
  }));
}

export function formatTooltipValue(value: number, format?: string): string {
  if (!format) return value.toString();
  
  switch (format) {
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'currency':
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(value);
    case 'number':
      return new Intl.NumberFormat('en-US').format(value);
    default:
      return value.toString();
  }
}

export function generateChartColors(count: number): string[] {
  return Array.from({ length: count }, (_, i) => 
    `hsl(${(i * 360) / count}, 70%, 50%)`
  );
}

export function validateSeriesData(data: DataPoint[], series: Series[]): boolean {
  return series.every(({ key }) => 
    data.every(point => typeof point[key] === 'number')
  );
}