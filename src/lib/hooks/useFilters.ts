import { useState, useCallback } from 'react';
import { DashboardFiltersConfig } from '../types/filters';

/**
 * Hook for managing dashboard filter state
 */
export function useFilters(config: DashboardFiltersConfig) {
  // Initialize filter values from config defaults
  const initialFilters = config.filters.reduce((acc, filter) => {
    acc[filter.id] = filter.defaultValue;
    return acc;
  }, {} as Record<string, any>);
  
  const [filters, setFilters] = useState(initialFilters);
  
  // Set a single filter value
  const setFilter = useCallback((filterId: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  }, []);
  
  // Reset all filters to their default values
  const resetFilters = useCallback(() => {
    const defaultValues = config.filters.reduce((acc, filter) => {
      acc[filter.id] = filter.defaultValue;
      return acc;
    }, {} as Record<string, any>);
    
    setFilters(defaultValues);
    
    // Update URL if syncWithUrl is enabled
    if (config.globalSettings?.syncWithUrl) {
      const newUrl = window.location.pathname;
      window.history.pushState({ path: newUrl }, '', newUrl);
    }
    
    // Clear localStorage if persistFilters is enabled
    if (config.globalSettings?.persistFilters) {
      const storageKey = config.globalSettings.storageKey || 'dashboard_filters';
      localStorage.setItem(storageKey, JSON.stringify(defaultValues));
    }
  }, [config.filters, config.globalSettings]);
  
  // Reset filters for a specific filter bar
  const resetFilterBar = useCallback((filterBarId: string) => {
    const filterBar = config.filterBars.find(fb => fb.id === filterBarId);
    
    if (filterBar) {
      const resetFilters = { ...filters };
      
      filterBar.filters.forEach(filterId => {
        const filter = config.filters.find(f => f.id === filterId);
        if (filter) {
          resetFilters[filterId] = filter.defaultValue;
        }
      });
      
      setFilters(resetFilters);
      
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
    }
  }, [filters, config.filters, config.filterBars, config.globalSettings]);
  
  // Get filtered components based on current filters
  const getFilteredComponents = useCallback(() => {
    // Map of component IDs to the filters that affect them
    const componentFilters: Record<string, string[]> = {};
    
    // Build the component-to-filters mapping
    config.filters.forEach(filter => {
      if (filter.affectsComponents) {
        if (filter.affectsComponents === 'all') {
          // This filter affects all components
          // We'll handle this specially later
        } else if (Array.isArray(filter.affectsComponents)) {
          // This filter affects specific components
          filter.affectsComponents.forEach(componentId => {
            if (!componentFilters[componentId]) {
              componentFilters[componentId] = [];
            }
            componentFilters[componentId].push(filter.id);
          });
        }
      }
    });
    
    // Return a function that checks if a component should be filtered
    return (componentId: string) => {
      // Get the filters that affect this component
      const affectingFilters = componentFilters[componentId] || [];
      
      // Check if any global filters (affecting 'all' components) are active
      const globalFilters = config.filters.filter(f => 
        f.affectsComponents === 'all' && 
        filters[f.id] !== f.defaultValue
      );
      
      // If there are no filters affecting this component, show it
      if (affectingFilters.length === 0 && globalFilters.length === 0) {
        return true;
      }
      
      // Check if any of the affecting filters have non-default values
      const hasActiveFilters = [...affectingFilters, ...globalFilters.map(f => f.id)]
        .some(filterId => {
          const filter = config.filters.find(f => f.id === filterId);
          if (!filter) return false;
          
          const currentValue = filters[filterId];
          const defaultValue = filter.defaultValue;
          
          // Compare values based on type
          if (Array.isArray(currentValue) && Array.isArray(defaultValue)) {
            // For arrays, check if they have the same values
            if (currentValue.length !== defaultValue.length) return true;
            return !currentValue.every(v => defaultValue.includes(v));
          }
          
          return currentValue !== defaultValue;
        });
      
      // If no active filters, show the component
      if (!hasActiveFilters) {
        return true;
      }
      
      // TODO: Implement actual filtering logic based on component data
      // For now, we'll just return true to show all components
      return true;
    };
  }, [filters, config.filters]);
  
  return {
    filters,
    setFilter,
    resetFilters,
    resetFilterBar,
    getFilteredComponents,
    hasActiveFilters: Object.keys(filters).some(key => {
      const filter = config.filters.find(f => f.id === key);
      if (!filter) return false;
      
      const currentValue = filters[key];
      const defaultValue = filter.defaultValue;
      
      if (Array.isArray(currentValue) && Array.isArray(defaultValue)) {
        if (currentValue.length !== defaultValue.length) return true;
        return !currentValue.every(v => defaultValue.includes(v));
      }
      
      return currentValue !== defaultValue;
    })
  };
}