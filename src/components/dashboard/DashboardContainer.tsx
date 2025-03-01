import React, { useState, useCallback, useEffect } from 'react';
import { DashboardConfig, DashboardComponent } from '../../lib/types/dashboard';
import { DashboardGrid } from './DashboardGrid';
import { defaultFiltersConfig } from '../../lib/config/filterConfig';
import { DashboardFilters } from '../DashboardFilters';

interface DashboardContainerProps {
  initialConfig: DashboardConfig;
}

export function DashboardContainer({ initialConfig }: DashboardContainerProps) {
  // Create a custom logger
  useEffect(() => {
    // Save the original console methods
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    // Function to add a message to the UI log
    const addToUILog = (message: string, type: 'log' | 'error' | 'warn' = 'log') => {
      const logContainer = document.getElementById('filter-messages');
      if (logContainer) {
        // Create new message element
        const messageEl = document.createElement('div');
        messageEl.className = `text-xs py-1 border-b border-gray-100 ${
          type === 'error' ? 'text-red-600' : 
          type === 'warn' ? 'text-amber-600' : 'text-gray-700'
        }`;
        
        // Format the timestamp
        const timestamp = new Date().toLocaleTimeString();
        
        // Clean and prepare the message
        let cleanMessage = '';
        if (typeof message === 'object') {
          try {
            cleanMessage = JSON.stringify(message);
          } catch (e) {
            cleanMessage = String(message);
          }
        } else {
          cleanMessage = String(message);
        }
        
        // Truncate long messages for display
        const displayMessage = cleanMessage.length > 200 
          ? cleanMessage.slice(0, 200) + '...' 
          : cleanMessage;
        
        messageEl.innerHTML = `<span class="text-gray-400">[${timestamp}]</span> ${displayMessage}`;
        
        // Add to the container
        logContainer.appendChild(messageEl);
        
        // Only keep the last 50 messages
        while (logContainer.children.length > 50) {
          logContainer.removeChild(logContainer.firstChild as Node);
        }
        
        // Auto-scroll to latest message
        logContainer.scrollTop = logContainer.scrollHeight;
      }
    };
    
    // Override console methods
    console.log = function(...args) {
      // Call original function
      originalConsoleLog.apply(console, args);
      // Add first argument to UI log
      if (args.length > 0) {
        let message = args[0];
        if (typeof message === 'object') {
          try {
            message = JSON.stringify(message);
          } catch (e) {
            message = '[Object]';
          }
        }
        addToUILog(message, 'log');
      }
    };
    
    console.error = function(...args) {
      originalConsoleError.apply(console, args);
      if (args.length > 0) {
        addToUILog(args[0], 'error');
      }
    };
    
    console.warn = function(...args) {
      originalConsoleWarn.apply(console, args);
      if (args.length > 0) {
        addToUILog(args[0], 'warn');
      }
    };
    
    // Restore original console methods on component unmount
    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  const [config, setConfig] = useState(initialConfig);
  const [filteredComponents, setFilteredComponents] = useState(initialConfig.components);
  // Track active filters separately
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  // Add debug state to help identify filtering issues
  const [filterDebug, setFilterDebug] = useState<string>("");
  // Add debug data state to show raw data
  const [debugData, setDebugData] = useState<{
    sales: any[];
    inventory: any[];
    marketing: any[];
    componentTypes: Record<string, number>;
  }>({
    sales: [],
    inventory: [],
    marketing: [],
    componentTypes: {}
  });

  // Function to update debug data
  const updateDebugData = useCallback(() => {
    // Count component types
    const componentTypes: Record<string, number> = {};
    initialConfig.components.forEach(comp => {
      const type = comp.type || 'unknown';
      componentTypes[type] = (componentTypes[type] || 0) + 1;
    });

    // Try to extract data from dashboards based on naming conventions
    const salesData: any[] = [];
    const inventoryData: any[] = [];
    const marketingData: any[] = [];

    initialConfig.components.forEach(comp => {
      // Extract first few rows of data when possible
      if (comp.data) {
        if (comp.title?.toLowerCase().includes('sales') || 
            comp.id?.toLowerCase().includes('sales')) {
          if (Array.isArray(comp.data)) {
            salesData.push(...comp.data.slice(0, 3));
          } else if (comp.data.series && Array.isArray(comp.data.series)) {
            salesData.push(...comp.data.series.slice(0, 3));
          } else if (comp.data.items && Array.isArray(comp.data.items)) {
            salesData.push(...comp.data.items.slice(0, 3));
          } else {
            salesData.push(comp.data);
          }
        } else if (comp.title?.toLowerCase().includes('inventory') || 
                  comp.id?.toLowerCase().includes('inventory')) {
          if (Array.isArray(comp.data)) {
            inventoryData.push(...comp.data.slice(0, 3));
          } else if (comp.data.series && Array.isArray(comp.data.series)) {
            inventoryData.push(...comp.data.series.slice(0, 3));
          } else if (comp.data.items && Array.isArray(comp.data.items)) {
            inventoryData.push(...comp.data.items.slice(0, 3));
          } else if (comp.data.needsRestocking && Array.isArray(comp.data.needsRestocking)) {
            inventoryData.push(...comp.data.needsRestocking.slice(0, 3));
          } else {
            inventoryData.push(comp.data);
          }
        } else if (comp.title?.toLowerCase().includes('market') || 
                  comp.id?.toLowerCase().includes('market')) {
          if (Array.isArray(comp.data)) {
            marketingData.push(...comp.data.slice(0, 3));
          } else if (comp.data.series && Array.isArray(comp.data.series)) {
            marketingData.push(...comp.data.series.slice(0, 3));
          } else if (comp.data.items && Array.isArray(comp.data.items)) {
            marketingData.push(...comp.data.items.slice(0, 3));
          } else {
            marketingData.push(comp.data);
          }
        }
      }
    });

    setDebugData({
      sales: salesData.slice(0, 5),  // Limit to 5 items
      inventory: inventoryData.slice(0, 5),
      marketing: marketingData.slice(0, 5),
      componentTypes
    });

  }, [initialConfig.components]);

  // Call updateDebugData on initial load
  useEffect(() => {
    updateDebugData();
  }, [updateDebugData, initialConfig]);

  // Apply filters to components based on active filters
  const applyFilters = useCallback((filters: Record<string, any>) => {
    // Debug info
    console.log("Applying filters:", filters);
    
    // If no active filters, show all components
    if (Object.keys(filters).length === 0) {
      console.log("No active filters, showing all components");
      setFilteredComponents(initialConfig.components);
      setFilterDebug("No active filters applied");
      return;
    }

    let debugInfo = `Active filters: ${Object.keys(filters).join(', ')}\n`;
    
    // Filter components based on active filters
    const filtered = initialConfig.components.filter(component => {
      // Debug component
      console.log(`Checking component: ${component.id} (${component.type})`, component);
      
      // For each filter, check if it affects this component
      for (const [filterId, filterValue] of Object.entries(filters)) {
        // Skip filters with default or empty values
        if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
          continue;
        }

        // Find the filter configuration
        const filterConfig = defaultFiltersConfig.filters.find(f => f.id === filterId);
        if (!filterConfig) {
          console.log(`Filter config not found for ${filterId}`);
          continue;
        }

        console.log(`Applying filter ${filterId} with value:`, filterValue);
        
        // Check component type - cards, time series, and aggregations need special handling
        const isCard = component.type === 'Card' || 
                      (typeof component.type === 'string' && component.type.includes('Card')) ||
                      (component.type.toLowerCase && component.type.toLowerCase().includes('card')) ||
                      // Additional checks for cards
                      (component as any).layout?.type === 'card' ||
                      (component as any).layout?.display === 'card' ||
                      (component as any).style?.type === 'card' ||
                      (component as any).component === 'Card' ||
                      (component as any).name?.toLowerCase?.()?.includes('card') ||
                      component.title?.toLowerCase?.()?.includes('card') ||
                      component.id?.toLowerCase?.()?.includes('card') ||
                      // Common card attributes
                      component.data?.cardType || 
                      component.data?.cardStyle ||
                      (typeof component.data?.content === 'string');
                      
        const isTimeSeries = component.type === 'TimeSeriesChart' || 
                           (typeof component.type === 'string' && component.type.includes('TimeSeries')) ||
                           (component.type.toLowerCase && component.type.toLowerCase().includes('timeseries')) ||
                           (component.type.toLowerCase && component.type.toLowerCase().includes('linechart')) ||
                           // Additional checks for time series
                           component.type === 'LineChart' ||
                           component.type === 'AreaChart' ||
                           (component as any).chart?.type === 'line' ||
                           (component as any).chart?.type === 'area' ||
                           (component as any).chartType === 'time' ||
                           component.data?.timeframe ||
                           (component.data?.series && Array.isArray(component.data.series) && 
                            component.data?.series[0]?.data?.length > 1 &&
                            (component.data?.series[0]?.data[0]?.x || 
                             typeof component.data?.series[0]?.data[0]?.[0] === 'string' && 
                             /^\d{4}-\d{2}-\d{2}/.test(component.data?.series[0]?.data[0]?.[0])));
                           
        const isAggregation = component.type === 'Aggregation' || 
                            (typeof component.type === 'string' && component.type.includes('Aggregation')) || 
                            (component.type === 'KPI' || component.type.includes('KPI')) ||
                            (component.type.toLowerCase && component.type.toLowerCase().includes('aggregation')) ||
                            (component.type.toLowerCase && component.type.toLowerCase().includes('kpi')) ||
                            // Additional checks for aggregations/KPIs
                            component.type === 'Stat' ||
                            component.type === 'Value' ||
                            component.type === 'CounterCard' ||
                            component.type === 'MetricCard' ||
                            component.data?.metric ||
                            (component.data?.value !== undefined && (
                              component.data?.label || 
                              component.data?.title ||
                              component.data?.description)) ||
                            (component.title && component.data?.value !== undefined);
        
        console.log(`Component ID: ${component.id}, Type: ${component.type}, Classification: Card=${isCard}, TimeSeries=${isTimeSeries}, Aggregation=${isAggregation}`);
        
        // Apply filter based on filter type and component data
        switch (filterConfig.type) {
          case 'dateRange':
            // Apply date range filter
            if (Array.isArray(filterValue) && filterValue.length === 2) {
              const [startDate, endDate] = filterValue;
              if (!startDate && !endDate) continue;

              console.log(`DateRange filter: ${startDate} to ${endDate}`);
              
              let dateField = null;
              
              // Special handling for time series charts - they always have time data
              if (isTimeSeries) {
                // For time series, check the data array for dates
                if (component.data?.series && Array.isArray(component.data.series)) {
                  // Get the first point's date from any series
                  for (const series of component.data.series) {
                    if (Array.isArray(series.data) && series.data.length > 0) {
                      // Check if data points have x values (dates)
                      if (series.data[0].x) {
                        dateField = series.data[0].x;
                        console.log(`Found date in time series data: ${dateField}`);
                        break;
                      }
                    }
                  }
                }
                
                // If no date found in series data, try timeframe property
                if (!dateField && component.data?.timeframe) {
                  dateField = component.data.timeframe.start || component.data.timeframe.end;
                  console.log(`Using timeframe from time series: ${dateField}`);
                }
              }
              // Special handling for cards and aggregations
              else if (isCard || isAggregation) {
                // Cards and aggregations often have a time period they refer to
                if (component.data?.period) {
                  dateField = component.data.period;
                  console.log(`Using period from card/aggregation: ${dateField}`);
                } else if (component.data?.timestamp) {
                  dateField = component.data.timestamp;
                  console.log(`Using timestamp from card/aggregation: ${dateField}`);
                } else if (component.data?.date) {
                  dateField = component.data.date;
                  console.log(`Using date from card/aggregation: ${dateField}`);
                }
                
                // If no specific date field, check for a timeframe reference
                if (!dateField && component.data?.timeframe) {
                  dateField = component.data.timeframe.start || component.data.timeframe.end;
                  console.log(`Using timeframe reference: ${dateField}`);
                }
                
                // For aggregations, also check for calculation period
                if (!dateField && isAggregation && component.data?.calculationPeriod) {
                  dateField = component.data.calculationPeriod.start || component.data.calculationPeriod.end;
                  console.log(`Using calculation period: ${dateField}`);
                }
              }
              
              // If still no date found, try common date fields
              if (!dateField && component.data) {
                // Try common date fields
                const possibleDateFields = [
                  'date', 'dateField', 'timestamp', 'created', 'updated', 
                  'time', 'datetime', 'period', 'reportDate', 'orderDate',
                  'createdAt', 'updatedAt', 'startDate', 'endDate'
                ];
                
                for (const field of possibleDateFields) {
                  if (component.data[field]) {
                    dateField = component.data[field];
                    console.log(`Found date field: ${field} = ${dateField}`);
                    break;
                  }
                }
                
                // Look for nested date fields
                if (!dateField && typeof component.data === 'object') {
                  // Check one level deeper
                  for (const [key, value] of Object.entries(component.data)) {
                    if (typeof value === 'object' && value !== null) {
                      for (const deepField of possibleDateFields) {
                        if ((value as any)[deepField]) {
                          dateField = (value as any)[deepField];
                          console.log(`Found nested date field: ${key}.${deepField} = ${dateField}`);
                          break;
                        }
                      }
                      if (dateField) break;
                    }
                  }
                }
                
                // Look for any ISO date string in the data
                if (!dateField) {
                  for (const [key, value] of Object.entries(component.data)) {
                    if (typeof value === 'string' && 
                        /^\d{4}-\d{2}-\d{2}/.test(value)) {
                      dateField = value;
                      console.log(`Found ISO date string: ${key} = ${value}`);
                      break;
                    }
                  }
                }
              }
              
              if (!dateField) {
                console.log(`No date field found in component ${component.id}`);
                // Don't filter out if we can't find a date field
                continue;
              }

              // Convert all to Date objects for comparison
              const componentDate = new Date(dateField);
              const filterStart = startDate ? new Date(startDate) : new Date(0);
              const filterEnd = endDate ? new Date(endDate) : new Date(8640000000000000);

              console.log(`Component date: ${componentDate}`);
              console.log(`Filter range: ${filterStart} to ${filterEnd}`);
              
              // Check if date is in range
              if (componentDate < filterStart || componentDate > filterEnd) {
                console.log(`Date out of range for component ${component.id}`);
                return false;
              }
            }
            break;

          case 'dropdown':
          case 'checkbox':
            // Apply multi-select filters
            if (Array.isArray(filterValue) && filterValue.length > 0) {
              console.log(`Dropdown/checkbox filter values: ${filterValue.join(', ')}`);
              
              let fieldToFilter: any = null;
              let fieldToFilterName: string = '';
              
              // Special handling for different component types
              if (isCard) {
                // Cards often have category, tag, or type information
                if (component.data?.category) {
                  fieldToFilter = component.data.category;
                  fieldToFilterName = 'category';
                } else if (component.data?.tags) {
                  fieldToFilter = component.data.tags;
                  fieldToFilterName = 'tags';
                } else if (component.data?.cardType) {
                  fieldToFilter = component.data.cardType;
                  fieldToFilterName = 'cardType';
                }
              } else if (isTimeSeries) {
                // Time series might have categories in series or metadata
                if (component.data?.series && Array.isArray(component.data.series)) {
                  // Check if any series has category info
                  for (const series of component.data.series) {
                    if (series.category) {
                      fieldToFilter = series.category;
                      fieldToFilterName = 'series.category';
                      break;
                    }
                  }
                }
                
                // If no category in series, check metadata
                if (!fieldToFilter && component.data?.metadata) {
                  if (component.data.metadata.category) {
                    fieldToFilter = component.data.metadata.category;
                    fieldToFilterName = 'metadata.category';
                  } else if (component.data.metadata.tags) {
                    fieldToFilter = component.data.metadata.tags;
                    fieldToFilterName = 'metadata.tags';
                  }
                }
              } else if (isAggregation) {
                // Aggregations might have category in metadata or dimensions
                if (component.data?.metadata) {
                  if (component.data.metadata.category) {
                    fieldToFilter = component.data.metadata.category;
                    fieldToFilterName = 'metadata.category';
                  }
                } else if (component.data?.dimensions) {
                  // Check if any dimension matches filter id
                  const matchingDimension = Object.keys(component.data.dimensions).find(
                    dim => dim.toLowerCase() === filterId.toLowerCase()
                  );
                  
                  if (matchingDimension) {
                    fieldToFilter = component.data.dimensions[matchingDimension];
                    fieldToFilterName = `dimensions.${matchingDimension}`;
                  }
                }
              }
              
              // If we haven't found anything specific to the component type, try generic approaches
              if (!fieldToFilter) {
                // Check top level component properties
                const possibleComponentProps = ['category', 'type', 'tags', 'group'];
                for (const prop of possibleComponentProps) {
                  if ((component as any)[prop]) {
                    fieldToFilter = (component as any)[prop];
                    fieldToFilterName = prop;
                    console.log(`Found property in component: ${prop}`);
                    break;
                  }
                }
                
                // If not found at component level, check in data
                if (!fieldToFilter && component.data) {
                  // First, try matching the filter id directly
                  if (component.data[filterId]) {
                    fieldToFilter = component.data[filterId];
                    fieldToFilterName = filterId;
                    console.log(`Found direct match for filter id in data: ${filterId}`);
                  } else {
                    // Try common category/classification fields
                    const possibleFields = [
                      'category', 'type', 'tags', 'group', 'classification', 
                      'segment', 'region', 'product', 'department'
                    ];
                    
                    for (const field of possibleFields) {
                      if (component.data[field]) {
                        fieldToFilter = component.data[field];
                        fieldToFilterName = field;
                        console.log(`Found field in data: ${field}`);
                        break;
                      }
                    }
                  }
                }
                
                // If we still haven't found anything, use component type as fallback
                if (!fieldToFilter) {
                  fieldToFilter = component.type;
                  fieldToFilterName = 'type';
                  console.log(`Using component type as fallback: ${fieldToFilter}`);
                }
              }
              
              console.log(`Using field for filtering: ${fieldToFilterName} = `, fieldToFilter);
              
              // Special handling for cards with simpler structure
              if (isCard && (!fieldToFilter || fieldToFilter === component.type)) {
                console.log(`Applying special card handling for component ${component.id}`);
                // For simple cards, try direct property matching with the filter values
                const hasDirectMatch = Object.entries(component).some(([key, value]) => {
                  if (typeof value !== 'object') {
                    const strValue = String(value).toLowerCase();
                    return filterValue.some(val => strValue.includes(val.toLowerCase()));
                  }
                  return false;
                });
                
                if (hasDirectMatch) {
                  console.log(`Found direct match in card properties for ${component.id}`);
                  // Skip further filtering checks if we found a match
                  continue;
                }
              }
              
              // Handle various data structures for the field value
              if (Array.isArray(fieldToFilter)) {
                // Check if any value in the array matches any selected filter value
                const hasMatch = fieldToFilter.some(val => 
                  filterValue.includes(String(val).toLowerCase())
                );
                
                if (!hasMatch) {
                  console.log(`No match found in array [${fieldToFilter.join(', ')}]`);
                  return false;
                }
              } else if (typeof fieldToFilter === 'object' && fieldToFilter !== null) {
                // For objects, check if any key or value matches
                const objValues = Object.values(fieldToFilter);
                const hasMatch = objValues.some(val => 
                  filterValue.includes(String(val).toLowerCase())
                );
                
                if (!hasMatch) {
                  console.log(`No match found in object values`);
                  return false;
                }
              } else {
                // For simple values, do a direct comparison
                const stringValue = String(fieldToFilter).toLowerCase();
                const hasMatch = filterValue.some(val => 
                  stringValue.includes(val.toLowerCase())
                );
                
                if (!hasMatch) {
                  console.log(`No match for value: ${stringValue}`);
                  return false;
                }
              }
            }
            break;

          case 'search':
            // Apply search filter
            if (typeof filterValue === 'string' && filterValue.trim() !== '') {
              const searchTerm = filterValue.toLowerCase();
              console.log(`Search term: ${searchTerm}`);
              
              // Search in title and description
              const matchesTitle = component.title?.toLowerCase().includes(searchTerm) || false;
              
              // Deep search function for objects
              const searchObject = (obj: any): boolean => {
                if (!obj) return false;
                
                for (const [key, value] of Object.entries(obj)) {
                  if (typeof value === 'string' && value.toLowerCase().includes(searchTerm)) {
                    console.log(`Search match in ${key}: ${value}`);
                    return true;
                  } else if (typeof value === 'object' && value !== null) {
                    if (searchObject(value)) return true;
                  }
                }
                
                return false;
              };
              
              // For cards, also check card content
              let matchesCardContent = false;
              if (isCard && component.data?.content) {
                matchesCardContent = typeof component.data.content === 'string' && 
                                  component.data.content.toLowerCase().includes(searchTerm);
              }
              
              // For all components, search in data object
              const matchesData = searchObject(component.data);
              
              if (!matchesTitle && !matchesCardContent && !matchesData) {
                console.log(`No search matches for component ${component.id}`);
                return false;
              }
            }
            break;

          case 'rangeSlider':
            // Apply range slider filter
            if (Array.isArray(filterValue) && filterValue.length === 2) {
              const [min, max] = filterValue;
              console.log(`Range filter: ${min} to ${max}`);
              
              let numericField: number | null = null;
              let numericFieldName: string = '';
              
              // Special handling for component types
              if (isAggregation || isCard) {
                // Aggregations and KPI cards typically have a value
                if (component.data?.value !== undefined && typeof component.data.value === 'number') {
                  numericField = component.data.value;
                  numericFieldName = 'value';
                } else if (component.data?.total !== undefined && typeof component.data.total === 'number') {
                  numericField = component.data.total;
                  numericFieldName = 'total';
                } else if (component.data?.count !== undefined && typeof component.data.count === 'number') {
                  numericField = component.data.count;
                  numericFieldName = 'count';
                }
              } else if (isTimeSeries) {
                // For time series, we could use the latest value or an aggregation
                if (component.data?.summary?.average !== undefined) {
                  numericField = component.data.summary.average;
                  numericFieldName = 'summary.average';
                } else if (component.data?.summary?.latest !== undefined) {
                  numericField = component.data.summary.latest;
                  numericFieldName = 'summary.latest';
                } else if (component.data?.series && Array.isArray(component.data.series)) {
                  // Try to get the latest value from the first series
                  for (const series of component.data.series) {
                    if (Array.isArray(series.data) && series.data.length > 0) {
                      const lastPoint = series.data[series.data.length - 1];
                      if (typeof lastPoint === 'number') {
                        numericField = lastPoint;
                        numericFieldName = 'last data point';
                        break;
                      } else if (typeof lastPoint?.y === 'number') {
                        numericField = lastPoint.y;
                        numericFieldName = 'last data point y';
                        break;
                      }
                    }
                  }
                }
              }
              
              // If no specific field found, look for any numeric field
              if (numericField === null && component.data) {
                for (const [key, value] of Object.entries(component.data)) {
                  if (typeof value === 'number') {
                    numericField = value;
                    numericFieldName = key;
                    console.log(`Found numeric field: ${key} = ${value}`);
                    break;
                  }
                  
                  // Also check one level deeper for numeric values
                  if (typeof value === 'object' && value !== null) {
                    for (const [nestedKey, nestedValue] of Object.entries(value)) {
                      if (typeof nestedValue === 'number') {
                        numericField = nestedValue;
                        numericFieldName = `${key}.${nestedKey}`;
                        console.log(`Found nested numeric field: ${key}.${nestedKey} = ${nestedValue}`);
                        break;
                      }
                    }
                  }
                }
              }
              
              if (numericField === null) {
                console.log(`No numeric field found for component ${component.id}`);
                // Don't filter out if we can't find a numeric field
                continue;
              }
              
              console.log(`Using numeric field for range filtering: ${numericFieldName} = ${numericField}`);
              
              // Check if value is in range
              if (numericField < min || numericField > max) {
                console.log(`Value ${numericField} out of range ${min}-${max}`);
                return false;
              }
            }
            break;

          case 'toggle':
            // Apply toggle filter
            if (typeof filterValue === 'boolean') {
              console.log(`Toggle filter: ${filterValue}`);
              
              let boolField: boolean | null = null;
              let boolFieldName: string = '';
              
              // First check for fields that match the filter id
              if (component.data && component.data[filterId] !== undefined) {
                if (typeof component.data[filterId] === 'boolean') {
                  boolField = component.data[filterId];
                  boolFieldName = filterId;
                }
              }
              
              // If not found, look for common boolean fields
              if (boolField === null && component.data) {
                const possibleBooleanFields = [
                  'isActive', 'isEnabled', 'isVisible', 'active', 'enabled',
                  'visible', 'status', 'completed', 'success'
                ];
                
                for (const field of possibleBooleanFields) {
                  if (typeof component.data[field] === 'boolean') {
                    boolField = component.data[field];
                    boolFieldName = field;
                    break;
                  } else if (field === 'status' && component.data[field] === 'active') {
                    // Handle status='active' case
                    boolField = true;
                    boolFieldName = 'status';
                    break;
                  }
                }
              }
              
              if (boolField === null) {
                console.log(`No boolean field found for component ${component.id}`);
                // Don't filter out if we can't find a boolean field
                continue;
              }
              
              console.log(`Using boolean field for toggle filtering: ${boolFieldName} = ${boolField}`);
              
              // If filter is true, component field must be true
              if (filterValue && !boolField) {
                console.log(`Toggle mismatch: filter=${filterValue}, component=${boolField}`);
                return false;
              }
            }
            break;
            
          default:
            // Other filter types - no specific implementation yet
            break;
        }
      }
      
      // If component passed all filters, include it
      console.log(`Component ${component.id} passed all filters`);
          return true;
        });
        
    debugInfo += `Filtered ${initialConfig.components.length} components down to ${filtered.length}`;
    console.log(debugInfo);
    setFilterDebug(debugInfo);
        setFilteredComponents(filtered);
  }, [initialConfig.components]);

  // Initialize filters from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlFilters: Record<string, any> = {};
    
    // Parse URL parameters into filter values
    defaultFiltersConfig.filters.forEach(filter => {
      if (params.has(filter.id)) {
        const paramValue = params.get(filter.id);
        
        // Parse the value based on filter type
        if (filter.type === 'checkbox' || (filter.type === 'dropdown' && filter.multiple)) {
          urlFilters[filter.id] = paramValue?.split(',') || [];
        } else if (filter.type === 'rangeSlider') {
          const [min, max] = paramValue?.split(',').map(Number) || [filter.min, filter.max];
          urlFilters[filter.id] = [min, max];
        } else if (filter.type === 'toggle') {
          urlFilters[filter.id] = paramValue === 'true';
        } else if (filter.type === 'dateRange') {
          const [start, end] = paramValue?.split(',') || ['', ''];
          urlFilters[filter.id] = [start, end];
        } else {
          urlFilters[filter.id] = paramValue;
        }
      }
    });
    
    // Log the initial state
    console.log("Initial config:", initialConfig);
    console.log("Default filters config:", defaultFiltersConfig);
    
    setActiveFilters(urlFilters);
    applyFilters(urlFilters);
  }, [applyFilters]);

  // Handle filter changes
  const handleFilterChange = useCallback((filterId: string, value: any) => {
    console.log(`Filter changed: ${filterId} = `, value);
    
    setActiveFilters(prev => {
      // If value is default or empty, remove the filter
      const filterConfig = defaultFiltersConfig.filters.find(f => f.id === filterId);
      
      // Log the filter config for debugging
      console.log(`Filter config for ${filterId}:`, filterConfig);
      
      const isDefault = filterConfig && value === filterConfig.defaultValue;
      const isEmpty = Array.isArray(value) && value.length === 0;
      
      if (isDefault || isEmpty || value === undefined || value === '') {
        const { [filterId]: _, ...rest } = prev;
        const newFilters = { ...rest };
        console.log(`Removing filter ${filterId}, new filters:`, newFilters);
        applyFilters(newFilters);
        return newFilters;
      } else {
        // Otherwise, update the filter value
        const newFilters = { ...prev, [filterId]: value };
        console.log(`Updating filter ${filterId}, new filters:`, newFilters);
        applyFilters(newFilters);
        return newFilters;
      }
    });
  }, [applyFilters]);

  const handleComponentUpdate = useCallback((componentId: string, data: any) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      components: prevConfig.components.map(component =>
        component.id === componentId
          ? { ...component, data: { ...component.data, ...data } }
          : component
      ),
    }));
    
    setFilteredComponents(prevFiltered => 
      prevFiltered.map(component =>
        component.id === componentId
          ? { ...component, data: { ...component.data, ...data } }
          : component
      )
    );
  }, []);

  return (
    <div className="dashboard-wrapper">
      <div className="bg-red-600 p-8 text-white text-center rounded-lg mb-4">
        <h1 className="text-3xl font-bold mb-6">EMERGENCY DEBUG MODE</h1>
        <p className="text-xl mb-4">If you can see this message, our changes ARE being applied!</p>
        <button 
          className="bg-white text-red-600 font-bold py-3 px-6 rounded-lg text-xl"
          onClick={() => alert('Debug panel is visible!')}
        >
          Click to confirm visibility
        </button>
      </div>
      
      <DashboardFilters 
        config={defaultFiltersConfig}
        onFilterChange={handleFilterChange}
        className="mb-4"
      />
      
    <DashboardGrid
      config={{
        ...config,
        components: filteredComponents
      }}
      onComponentUpdate={handleComponentUpdate}
    />
    </div>
  );
}