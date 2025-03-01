import {
  DashboardComponentSizes,
  ComponentSize,
  DashboardComponent,
  Breakpoint,
  ResponsivePosition
} from '../types/dashboard';

export function validateComponentSize(
  component: DashboardComponent,
  sizes: DashboardComponentSizes
): boolean {
  const componentType = sizes.visualizationComponents.find(vc => vc.type === component.type) ||
                       sizes.filterComponents.find(fc => fc.type === component.type);

  if (!componentType) {
    console.warn(`Unknown component type: ${component.type}`);
    return false;
  }

  const { minimum } = componentType.sizes;
  const { width, height } = component.position;

  return width >= minimum.width && height >= minimum.height;
}

export function getResponsivePosition(
  component: DashboardComponent,
  breakpoint: Breakpoint
): ResponsivePosition {
  const responsiveLayout = component.position.responsive?.[breakpoint];
  if (responsiveLayout) {
    return responsiveLayout;
  }

  return {
    row: component.position.row,
    column: component.position.column,
    width: component.position.width,
    height: component.position.height,
  };
}

export function getGridItemStyle(
  component: DashboardComponent,
  breakpoint: Breakpoint,
  columns: number
) {
  const position = getResponsivePosition(component, breakpoint);
  const { row, column, width, height } = position;

  return {
    gridColumn: `${column} / span ${Math.min(width, columns)}`,
    gridRow: `${row} / span ${height}`,
    display: position.visible === false ? 'none' : undefined,
  };
}

export function getRecommendedSize(
  componentType: string,
  sizes: DashboardComponentSizes
): ComponentSize {
  const visualComponent = sizes.visualizationComponents.find(vc => vc.type === componentType);
  if (visualComponent) {
    return visualComponent.sizes.recommended;
  }

  const filterComponent = sizes.filterComponents.find(fc => fc.type === componentType);
  if (filterComponent) {
    return filterComponent.sizes.recommended;
  }

  return { width: 1, height: 1 };
}

export function calculatePixelDimensions(
  gridDimensions: { width: number; height: number },
  layout: { columns: number; rows: number; gap: number }
): { cellWidth: number; cellHeight: number } {
  const totalGapWidth = (layout.columns - 1) * layout.gap;
  const totalGapHeight = (layout.rows - 1) * layout.gap;
  
  const cellWidth = (gridDimensions.width - totalGapWidth) / layout.columns;
  const cellHeight = (gridDimensions.height - totalGapHeight) / layout.rows;

  return { cellWidth, cellHeight };
}

/**
 * Dashboard Utilities
 * 
 * This file contains utility functions for working with dashboard data
 */

/**
 * Analyzes dashboard data and returns information about its structure
 * @param data Any data object to analyze
 * @returns Object with information about the data structure
 */
export function analyzeDashboardData(data: any): { 
  type: string; 
  hasData: boolean;
  fields: string[];
  sampleValues: Record<string, any>;
  count: number;
} {
  // Default return value
  const result = {
    type: 'unknown',
    hasData: false,
    fields: [],
    sampleValues: {},
    count: 0
  };
  
  // Check if data exists and is an array
  if (!data || !Array.isArray(data) || data.length === 0) {
    return result;
  }
  
  // Update basic info
  result.hasData = true;
  result.count = data.length;
  
  // Get the first item to analyze
  const firstItem = data[0];
  
  // Determine the type based on object properties
  if (typeof firstItem === 'object') {
    // Get all fields
    result.fields = Object.keys(firstItem);
    
    // Get sample values for each field
    result.fields.forEach(field => {
      result.sampleValues[field] = firstItem[field];
    });
    
    // Try to determine the data type
    if ('revenue' in firstItem && 'date' in firstItem) {
      result.type = 'sales';
    } else if ('category' in firstItem && 'revenue' in firstItem) {
      result.type = 'category';
    } else if ('productName' in firstItem || 'productId' in firstItem) {
      result.type = 'product';
    } else if ('segment' in firstItem) {
      result.type = 'customerSegment';
    } else if ('status' in firstItem) {
      result.type = 'orderStatus';
    } else if ('stock' in firstItem || 'quantity' in firstItem) {
      result.type = 'inventory';
    } else if ('campaign' in firstItem || 'campaignName' in firstItem) {
      result.type = 'campaign';
    } else if ('channel' in firstItem) {
      result.type = 'channel';
    }
  }
  
  return result;
}

/**
 * Formats a value for display based on its type
 * @param value Any value to format
 * @param type Optional type hint
 * @returns Formatted string
 */
export function formatDashboardValue(value: any, type?: string): string {
  if (value === null || value === undefined) {
    return '-';
  }
  
  if (typeof value === 'number') {
    // Format as currency if it looks like money
    if (type === 'currency' || type === 'price' || type === 'revenue' || 
        type === 'sales' || type === 'cost' || type === 'value') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    }
    
    // Format as percentage if it looks like a percentage
    if (type === 'percentage' || type === 'percent' || 
        (value >= 0 && value <= 1 && type?.includes('rate'))) {
      return `${(value * 100).toFixed(1)}%`;
    }
    
    // Default number formatting
    return value.toLocaleString();
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }
  
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }
  
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  
  return String(value);
}

/**
 * Extracts unique values from an array of objects for a specific field
 * @param data Array of objects
 * @param field Field name to extract values from
 * @returns Array of unique values
 */
export function getUniqueValues(data: any[], field: string): any[] {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }
  
  const values = data.map(item => item[field]);
  return [...new Set(values)].filter(value => value !== undefined && value !== null);
}

/**
 * Checks if a data array has a specific field
 * @param data Array of objects
 * @param field Field name to check
 * @returns Boolean indicating if the field exists
 */
export function hasField(data: any[], field: string): boolean {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return false;
  }
  
  return data.some(item => field in item);
}