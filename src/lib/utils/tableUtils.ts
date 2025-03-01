/**
 * Table Utilities
 * 
 * This file contains utility functions for working with table data
 */

/**
 * Merges multiple data arrays into a single consolidated array with improved type safety
 * @param data Record of data arrays to merge
 * @param keyField Field to use as the key for merging
 * @returns Consolidated array of data
 */
export function consolidateData<T extends Record<string, any>>(
  data: Record<string, any[]>,
  keyField: string = 'id'
): T[] {
  console.log("consolidateData called with:", {
    dataKeys: Object.keys(data),
    keyField,
    dataSizes: Object.entries(data).map(([key, arr]) => `${key}: ${Array.isArray(arr) ? arr.length : 'not array'}`)
  });
  
  if (!data || Object.keys(data).length === 0) {
    console.log("consolidateData: No data provided");
    return [];
  }
  
  // Get all unique keys
  const allKeys = new Set<string>();
  Object.entries(data).forEach(([dataKey, array]) => {
    console.log(`Processing ${dataKey} array with ${Array.isArray(array) ? array.length : 'not array'} items`);
    if (Array.isArray(array)) {
      array.forEach(item => {
        if (item && item[keyField]) {
          allKeys.add(String(item[keyField]));
        } else if (item) {
          console.log(`Item missing keyField ${keyField}:`, item);
        }
      });
    }
  });
  
  console.log(`Found ${allKeys.size} unique keys`);
  
  // Create consolidated data
  const result: T[] = [];
  allKeys.forEach(key => {
    const consolidatedItem: Record<string, any> = { [keyField]: key };
    
    // Merge data from all arrays
    Object.entries(data).forEach(([dataKey, array]) => {
      if (Array.isArray(array)) {
        const matchingItem = array.find(item => String(item[keyField]) === key);
        if (matchingItem) {
          // Add all fields from the matching item
          Object.entries(matchingItem).forEach(([field, value]) => {
            // Avoid duplicate key fields
            if (field !== keyField || !consolidatedItem[field]) {
              consolidatedItem[field] = value;
            }
          });
        }
      }
    });
    
    result.push(consolidatedItem as T);
  });
  
  console.log(`Returning ${result.length} consolidated items`);
  return result;
}

/**
 * Format a value for display in a table based on its type
 * @param value The value to format
 * @param type The type of the value
 * @returns Formatted value as a string
 */
export function formatTableValue(
  value: any, 
  type?: string
): string {
  if (value === null || value === undefined) {
    return '-';
  }
  
  // Add debugging for troubleshooting
  console.log(`Formatting value: ${value}, type: ${type}, valueType: ${typeof value}`);
  
  switch (type) {
    case 'currency':
      // Ensure value is a number
      const numValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
      if (isNaN(numValue)) return '-';
      
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(numValue);
      
    case 'percentage':
      // Handle both decimal (0.25) and whole number (25) percentages
      const num = Number(value);
      if (isNaN(num)) return '-';
      
      const percentValue = num <= 1 && num >= 0 ? num * 100 : num;
      return `${percentValue.toFixed(1)}%`;
      
    case 'number':
      // Format numbers with commas for thousands
      const numberValue = Number(value);
      if (isNaN(numberValue)) return '-';
      
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(numberValue);
      
    case 'date':
      // Try to format date strings
      try {
        const date = new Date(value);
        if (isNaN(date.getTime())) return String(value);
        
        return new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date);
      } catch (e) {
        return String(value);
      }
      
    default:
      return String(value);
  }
}

/**
 * Calculate derived fields for data items based on their type
 * @param item The data item to calculate derived fields for
 * @param itemType The type of the item (sales, inventory, marketing)
 * @returns The item with derived fields added
 */
export function calculateDerivedFields<T extends Record<string, any>>(
  item: T,
  itemType: 'sales' | 'inventory' | 'marketing'
): Record<string, any> {
  // Create a new object that can have any properties added to it
  const result: Record<string, any> = { ...item };
  
  try {
    switch (itemType) {
      case 'sales':
        // Calculate profit if we have revenue and cost
        if ('revenue' in result && 'cost' in result && typeof result.revenue === 'number' && typeof result.cost === 'number') {
          result.profit = result.revenue - result.cost;
          result.profitMargin = result.revenue > 0 ? result.profit / result.revenue : 0;
        }
        break;
        
      case 'inventory':
        // Calculate inventory value
        if ('price' in result && 'inventoryCount' in result && typeof result.price === 'number' && typeof result.inventoryCount === 'number') {
          result.inventoryValue = result.price * result.inventoryCount;
        }
        
        // Calculate restock status
        if ('inventoryCount' in result && 'reorderLevel' in result) {
          result.stockStatus = result.inventoryCount <= result.reorderLevel ? 'Low' : 'OK';
        }
        break;
        
      case 'marketing':
        // Calculate ROI
        if ('revenue' in result && 'cost' in result && typeof result.revenue === 'number' && typeof result.cost === 'number') {
          result.roi = result.cost > 0 ? (result.revenue - result.cost) / result.cost : 0;
        }
        
        // Calculate conversion rate
        if ('conversions' in result && 'clicks' in result && typeof result.conversions === 'number' && typeof result.clicks === 'number') {
          result.conversionRate = result.clicks > 0 ? result.conversions / result.clicks : 0;
        }
        break;
    }
  } catch (error) {
    console.error('Error calculating derived fields:', error);
  }
  
  return result;
} 