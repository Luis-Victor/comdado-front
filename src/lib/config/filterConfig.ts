import { DashboardFiltersConfig } from '../types/filters';

/**
 * Default dashboard filter configuration
 */
export const defaultFiltersConfig: DashboardFiltersConfig = {
  filters: [
    // Date Range Filter
    {
      id: 'dateRange',
      type: 'dateRange',
      label: 'Date Range',
      placement: 'topbar',
      alignment: 'right',
      defaultValue: ['2025-01-01', '2025-12-31'],
      placeholder: 'Select date range',
      clearable: true,
      affectsComponents: 'all',
      presets: [
        { label: 'Last 7 days', value: ['2025-12-24', '2025-12-31'] },
        { label: 'Last 30 days', value: ['2025-12-01', '2025-12-31'] },
        { label: 'This month', value: ['2025-12-01', '2025-12-31'] },
        { label: 'Last month', value: ['2025-11-01', '2025-11-30'] },
        { label: 'This year', value: ['2025-01-01', '2025-12-31'] },
      ],
      responsive: {
        visibleOn: ['sm', 'md', 'lg', 'xl'],
        fullWidthOn: ['sm']
      }
    },
    
    // Category Dropdown Filter
    {
      id: 'category',
      type: 'dropdown',
      label: 'Category',
      placement: 'topbar',
      alignment: 'left',
      options: [
        { value: 'all', label: 'All Categories' },
        { value: 'revenue', label: 'Revenue' },
        { value: 'customers', label: 'Customers' },
        { value: 'products', label: 'Products' },
        { value: 'marketing', label: 'Marketing' }
      ],
      defaultValue: 'all',
      multiple: false,
      searchable: true,
      affectsComponents: [
        'revenue-trend', 
        'top-products', 
        'customer-segments'
      ],
      responsive: {
        visibleOn: ['sm', 'md', 'lg', 'xl'],
        fullWidthOn: ['sm']
      }
    },
    
    // Region Dropdown Filter
    {
      id: 'region',
      type: 'dropdown',
      label: 'Region',
      placement: 'topbar',
      alignment: 'left',
      options: [
        { value: 'all', label: 'All Regions' },
        { value: 'north', label: 'North' },
        { value: 'south', label: 'South' },
        { value: 'east', label: 'East' },
        { value: 'west', label: 'West' },
        { value: 'central', label: 'Central' }
      ],
      defaultValue: 'all',
      multiple: true,
      searchable: true,
      affectsComponents: [
        'total-revenue',
        'active-users',
        'revenue-trend'
      ],
      responsive: {
        visibleOn: ['md', 'lg', 'xl'],
        fullWidthOn: ['sm']
      }
    },
    
    // Search Filter
    {
      id: 'search',
      type: 'search',
      label: 'Search',
      placement: 'topbar',
      alignment: 'right',
      placeholder: 'Search dashboards...',
      debounceMs: 300,
      affectsComponents: 'all',
      searchFields: ['title', 'description', 'tags'],
      minLength: 2,
      responsive: {
        visibleOn: ['sm', 'md', 'lg', 'xl'],
        fullWidthOn: ['sm']
      }
    },
    
    // Value Range Slider
    {
      id: 'valueRange',
      type: 'rangeSlider',
      label: 'Value Range',
      placement: 'sidebar',
      min: 0,
      max: 1000,
      step: 10,
      defaultValue: [0, 1000],
      formatValue: (value) => `$${value}`,
      affectsComponents: [
        'revenue-trend',
        'top-products'
      ],
      responsive: {
        visibleOn: ['md', 'lg', 'xl']
      }
    },
    
    // Metric Checkboxes
    {
      id: 'metrics',
      type: 'checkbox',
      label: 'Metrics',
      placement: 'sidebar',
      options: [
        { value: 'revenue', label: 'Revenue' },
        { value: 'profit', label: 'Profit' },
        { value: 'cost', label: 'Cost' },
        { value: 'volume', label: 'Volume' }
      ],
      defaultValue: ['revenue', 'profit'],
      layout: 'vertical',
      affectsComponents: [
        'revenue-trend'
      ],
      responsive: {
        visibleOn: ['md', 'lg', 'xl']
      }
    },
    
    // View Type Radio
    {
      id: 'viewType',
      type: 'radio',
      label: 'View Type',
      placement: 'sidebar',
      options: [
        { value: 'chart', label: 'Chart View' },
        { value: 'table', label: 'Table View' }
      ],
      defaultValue: 'chart',
      layout: 'horizontal',
      affectsComponents: [
        'revenue-trend',
        'top-products',
        'customer-segments'
      ],
      responsive: {
        visibleOn: ['md', 'lg', 'xl']
      }
    },
    
    // Real-time Toggle
    {
      id: 'realtime',
      type: 'toggle',
      label: 'Real-time Updates',
      placement: 'topbar',
      alignment: 'right',
      defaultValue: false,
      onLabel: 'On',
      offLabel: 'Off',
      affectsComponents: 'all',
      responsive: {
        visibleOn: ['lg', 'xl']
      }
    },
    
    // Comparison Period Dropdown
    {
      id: 'comparisonPeriod',
      type: 'dropdown',
      label: 'Compare To',
      placement: 'inline',
      options: [
        { value: 'none', label: 'No Comparison' },
        { value: 'previousPeriod', label: 'Previous Period' },
        { value: 'previousYear', label: 'Previous Year' },
        { value: 'custom', label: 'Custom Period' }
      ],
      defaultValue: 'none',
      multiple: false,
      affectsComponents: [
        'revenue-trend',
        'total-revenue',
        'active-users',
        'engagement-rate',
        'growth-rate'
      ],
      dependsOn: ['dateRange'],
      responsive: {
        visibleOn: ['md', 'lg', 'xl']
      }
    }
  ],
  
  filterBars: [
    // Top Filter Bar
    {
      id: 'topFilters',
      placement: 'topbar',
      alignment: 'left',
      filters: ['dateRange', 'category', 'region', 'search', 'realtime'],
      title: 'Dashboard Filters',
      collapsible: true,
      defaultCollapsed: false,
      showFilterCount: true,
      showClearAll: true,
      responsive: {
        stackOn: ['sm'],
        hideOn: []
      }
    },
    
    // Sidebar Filter Panel
    {
      id: 'sidebarFilters',
      placement: 'sidebar',
      filters: ['valueRange', 'metrics', 'viewType'],
      title: 'Advanced Filters',
      collapsible: true,
      defaultCollapsed: true,
      showFilterCount: true,
      showClearAll: true,
      responsive: {
        hideOn: ['sm']
      }
    },
    
    // Inline Chart Filters
    {
      id: 'chartFilters',
      placement: 'inline',
      filters: ['comparisonPeriod'],
      showFilterCount: false,
      showClearAll: false,
      responsive: {
        hideOn: ['sm']
      }
    }
  ],
  
  globalSettings: {
    syncWithUrl: true,
    persistFilters: true,
    storageKey: 'dashboard_filters',
    defaultCollapsed: false,
    animateChanges: true,
    showFilterSummary: true
  }
};