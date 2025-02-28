import React, { useState, useEffect } from 'react';
import { FilterBar } from './filters/FilterBar';
import { DashboardFiltersConfig, FilterConfig } from '../lib/types/filters';
import { useBreakpoint } from '../lib/hooks/useBreakpoint';
import { Filter, X } from 'lucide-react';

interface DashboardFiltersProps {
  config: DashboardFiltersConfig;
  onFilterChange: (filterId: string, value: any) => void;
  className?: string;
}

export function DashboardFilters({ 
  config, 
  onFilterChange,
  className = '' 
}: DashboardFiltersProps) {
  // Initialize filter values from config defaults
  const initialFilters = config.filters.reduce((acc, filter) => {
    acc[filter.id] = filter.defaultValue;
    return acc;
  }, {} as Record<string, any>);
  
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [showFilterSummary, setShowFilterSummary] = useState(false);
  const breakpoint = useBreakpoint();
  
  // Load persisted filters if enabled
  useEffect(() => {
    if (config.globalSettings?.persistFilters) {
      const storageKey = config.globalSettings.storageKey || 'dashboard_filters';
      const savedFilters = localStorage.getItem(storageKey);
      
      if (savedFilters) {
        try {
          const parsedFilters = JSON.parse(savedFilters);
          setActiveFilters(prev => ({
            ...prev,
            ...parsedFilters
          }));
        } catch (error) {
          console.error('Error loading saved filters:', error);
        }
      }
    }
  }, [config.globalSettings]);
  
  // Sync with URL if enabled
  useEffect(() => {
    if (config.globalSettings?.syncWithUrl) {
      const params = new URLSearchParams(window.location.search);
      
      // Update filters from URL parameters
      const filtersFromUrl: Record<string, any> = {};
      
      config.filters.forEach(filter => {
        if (params.has(filter.id)) {
          const paramValue = params.get(filter.id);
          
          // Parse the value based on filter type
          if (filter.type === 'checkbox' || filter.type === 'dropdown' && filter.multiple) {
            filtersFromUrl[filter.id] = paramValue?.split(',') || [];
          } else if (filter.type === 'rangeSlider') {
            const [min, max] = paramValue?.split(',').map(Number) || [filter.min, filter.max];
            filtersFromUrl[filter.id] = [min, max];
          } else if (filter.type === 'toggle') {
            filtersFromUrl[filter.id] = paramValue === 'true';
          } else if (filter.type === 'dateRange') {
            const [start, end] = paramValue?.split(',') || ['', ''];
            filtersFromUrl[filter.id] = [start, end];
          } else {
            filtersFromUrl[filter.id] = paramValue;
          }
        }
      });
      
      if (Object.keys(filtersFromUrl).length > 0) {
        setActiveFilters(prev => ({
          ...prev,
          ...filtersFromUrl
        }));
      }
    }
  }, [config.filters, config.globalSettings]);
  
  // Handle filter changes
  const handleFilterChange = (filterId: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
    
    // Call the parent's onFilterChange callback
    onFilterChange(filterId, value);
    
    // Update URL if syncWithUrl is enabled
    if (config.globalSettings?.syncWithUrl) {
      const params = new URLSearchParams(window.location.search);
      
      // Format the value based on filter type
      const filter = config.filters.find(f => f.id === filterId);
      
      if (filter) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params.set(filterId, value.join(','));
          } else {
            params.delete(filterId);
          }
        } else if (value === undefined || value === '' || 
                  (filter.type === 'toggle' && value === false) ||
                  (value === filter.defaultValue)) {
          params.delete(filterId);
        } else {
          params.set(filterId, String(value));
        }
        
        // Update URL without reloading the page
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      }
    }
    
    // Save to localStorage if persistFilters is enabled
    if (config.globalSettings?.persistFilters) {
      const storageKey = config.globalSettings.storageKey || 'dashboard_filters';
      const updatedFilters = {
        ...activeFilters,
        [filterId]: value
      };
      
      localStorage.setItem(storageKey, JSON.stringify(updatedFilters));
    }
  };
  
  // Clear all filters in a filter bar
  const handleClearFilters = (filterBarId: string) => {
    const filterBar = config.filterBars.find(fb => fb.id === filterBarId);
    
    if (filterBar) {
      const resetFilters = { ...activeFilters };
      
      filterBar.filters.forEach(filterId => {
        const filter = config.filters.find(f => f.id === filterId);
        if (filter) {
          resetFilters[filterId] = filter.defaultValue;
        }
      });
      
      setActiveFilters(resetFilters);
      
      // Update URL and localStorage
      if (config.globalSettings?.syncWithUrl) {
        const params = new URLSearchParams(window.location.search);
        filterBar.filters.forEach(filterId => {
          params.delete(filterId);
        });
        
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
      }
      
      if (config.globalSettings?.persistFilters) {
        const storageKey = config.globalSettings.storageKey || 'dashboard_filters';
        localStorage.setItem(storageKey, JSON.stringify(resetFilters));
      }
      
      // Notify parent component
      filterBar.filters.forEach(filterId => {
        const filter = config.filters.find(f => f.id === filterId);
        if (filter) {
          onFilterChange(filterId, filter.defaultValue);
        }
      });
    }
  };
  
  // Count active filters (filters with non-default values)
  const activeFilterCount = config.filters.filter(filter => {
    const currentValue = activeFilters[filter.id];
    const defaultValue = filter.defaultValue;
    
    if (currentValue === undefined) return false;
    
    // Compare values based on type
    if (Array.isArray(currentValue) && Array.isArray(defaultValue)) {
      // For arrays, check if they have the same values
      if (currentValue.length !== defaultValue.length) return true;
      return !currentValue.every(v => defaultValue.includes(v));
    }
    
    return currentValue !== defaultValue;
  }).length;
  
  // Render filter bars based on placement
  const renderFilterBars = (placement: 'topbar' | 'sidebar' | 'inline' | 'floating') => {
    return config.filterBars
      .filter(fb => fb.placement === placement)
      .map(filterBar => (
        <FilterBar
          key={filterBar.id}
          config={filterBar}
          filters={config.filters}
          activeFilters={activeFilters}
          onFilterChange={handleFilterChange}
          onClearAll={() => handleClearFilters(filterBar.id)}
        />
      ));
  };
  
  return (
    <div className={`dashboard-filters ${className}`}>
      {/* Top Filter Bar */}
      <div className="topbar-filters mb-4">
        {renderFilterBars('topbar')}
        
        {/* Filter Summary (Mobile) */}
        {breakpoint === 'sm' && config.globalSettings?.showFilterSummary && (
          <div className="filter-summary mt-2">
            <button
              onClick={() => setShowFilterSummary(!showFilterSummary)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <Filter className="h-4 w-4 mr-1" />
              {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} applied
            </button>
            
            {showFilterSummary && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-700">Applied Filters</h4>
                  <button
                    onClick={() => setShowFilterSummary(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {config.filters.map(filter => {
                    const currentValue = activeFilters[filter.id];
                    const defaultValue = filter.defaultValue;
                    
                    // Skip filters with default values
                    if (currentValue === undefined || currentValue === defaultValue) {
                      return null;
                    }
                    
                    // Skip array filters with default values
                    if (Array.isArray(currentValue) && Array.isArray(defaultValue)) {
                      if (currentValue.length === defaultValue.length && 
                          currentValue.every(v => defaultValue.includes(v))) {
                        return null;
                      }
                    }
                    
                    // Format the value for display
                    let displayValue = '';
                    
                    if (filter.type === 'dropdown') {
                      const selectedOptions = filter.options
                        .filter(opt => 
                          Array.isArray(currentValue) 
                            ? currentValue.includes(opt.value)
                            : currentValue === opt.value
                        )
                        .map(opt => opt.label);
                      
                      displayValue = selectedOptions.join(', ');
                    } else if (filter.type === 'dateRange' && Array.isArray(currentValue)) {
                      displayValue = `${currentValue[0]} - ${currentValue[1]}`;
                    } else if (filter.type === 'rangeSlider' && Array.isArray(currentValue)) {
                      const formatValue = filter.formatValue || (v => v.toString());
                      displayValue = `${formatValue(currentValue[0])} - ${formatValue(currentValue[1])}`;
                    } else if (filter.type === 'toggle') {
                      displayValue = currentValue ? 'On' : 'Off';
                    } else if (Array.isArray(currentValue)) {
                      displayValue = currentValue.join(', ');
                    } else {
                      displayValue = String(currentValue);
                    }
                    
                    return (
                      <div 
                        key={filter.id}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center"
                      >
                        <span className="font-medium mr-1">{filter.label}:</span>
                        <span className="truncate max-w-[100px]">{displayValue}</span>
                        <button
                          onClick={() => handleFilterChange(filter.id, filter.defaultValue)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Sidebar Filters */}
      <div className="sidebar-filters">
        {renderFilterBars('sidebar')}
      </div>
      
      {/* Inline Filters */}
      <div className="inline-filters">
        {renderFilterBars('inline')}
      </div>
      
      {/* Floating Filters */}
      <div className="floating-filters">
        {renderFilterBars('floating')}
      </div>
    </div>
  );
}