import React, { useState } from 'react';
import { FilterBarConfig, FilterConfig } from '../../lib/types/filters';
import { FilterRenderer } from './FilterRenderer';
import { ChevronDown, ChevronUp, X, Filter } from 'lucide-react';
import { useBreakpoint } from '../../lib/hooks/useBreakpoint';

interface FilterBarProps {
  config: FilterBarConfig;
  filters: FilterConfig[];
  activeFilters: Record<string, any>;
  onFilterChange: (filterId: string, value: any) => void;
  onClearAll: () => void;
}

export function FilterBar({ 
  config, 
  filters, 
  activeFilters, 
  onFilterChange, 
  onClearAll 
}: FilterBarProps) {
  const [collapsed, setCollapsed] = useState(config.defaultCollapsed || false);
  const breakpoint = useBreakpoint();
  
  // Check if we should hide this filter bar on current breakpoint
  if (config.responsive?.hideOn?.includes(breakpoint)) {
    return null;
  }
  
  // Count active filters in this filter bar
  const activeFilterCount = config.filters.filter(id => {
    const filter = filters.find(f => f.id === id);
    if (!filter) return false;
    
    // Check if this filter has a non-default value
    const currentValue = activeFilters[id];
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
  
  // Determine if filters should be stacked based on breakpoint
  const shouldStack = config.responsive?.stackOn?.includes(breakpoint) || false;
  
  return (
    <div className={`filter-bar ${config.className || ''} ${config.placement}`}>
      {/* Filter Bar Header */}
      {(config.title || config.collapsible) && (
        <div className="filter-bar-header flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
          <div className="flex items-center">
            {config.title && (
              <h3 className="text-sm font-medium text-gray-700 mr-2">
                {config.title}
              </h3>
            )}
            {config.showFilterCount && activeFilterCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {activeFilterCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            {config.showClearAll && activeFilterCount > 0 && (
              <button
                onClick={onClearAll}
                className="text-sm text-gray-500 hover:text-gray-700 mr-3 flex items-center"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </button>
            )}
            
            {config.collapsible && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-gray-500 hover:text-gray-700"
              >
                {collapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Filter Bar Content */}
      {!collapsed && (
        <div className={`filter-bar-content ${shouldStack ? 'filter-stack' : ''}`}>
          {config.filters.map(filterId => {
            const filter = filters.find(f => f.id === filterId);
            if (!filter) return null;
            
            // Check if this filter should be visible on current breakpoint
            if (filter.responsive?.visibleOn && !filter.responsive.visibleOn.includes(breakpoint)) {
              return null;
            }
            
            // Check if filter should be full width on current breakpoint
            const isFullWidth = filter.responsive?.fullWidthOn?.includes(breakpoint) || false;
            
            return (
              <div 
                key={filterId}
                className={`filter-item ${isFullWidth ? 'col-span-full' : ''}`}
              >
                <FilterRenderer
                  config={filter}
                  value={activeFilters[filterId]}
                  onChange={(value) => onFilterChange(filterId, value)}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}