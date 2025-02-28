import React, { useState, useCallback, useEffect } from 'react';
import { DashboardConfig } from '../../lib/types/dashboard';
import { DashboardGrid } from './DashboardGrid';
import { defaultFiltersConfig } from '../../lib/config/filterConfig';

interface DashboardContainerProps {
  initialConfig: DashboardConfig;
}

export function DashboardContainer({ initialConfig }: DashboardContainerProps) {
  const [config, setConfig] = useState(initialConfig);
  const [filteredComponents, setFilteredComponents] = useState(initialConfig.components);

  // Apply filters to components
  useEffect(() => {
    // Get filter values from URL
    const params = new URLSearchParams(window.location.search);
    const hasFilters = Array.from(params.keys()).length > 0;
    
    if (hasFilters) {
      // For demonstration, we'll just filter based on category if present
      const category = params.get('category');
      
      if (category && category !== 'all') {
        // Simple filtering logic - in a real app, this would be more sophisticated
        const filtered = initialConfig.components.filter(component => {
          // For cards, check if the title contains the category
          if (component.type === 'Card') {
            return component.title?.toLowerCase().includes(category.toLowerCase());
          }
          
          // For charts, check if they're in the affected components list
          const categoryFilter = defaultFiltersConfig.filters.find(f => f.id === 'category');
          if (categoryFilter && Array.isArray(categoryFilter.affectsComponents)) {
            return categoryFilter.affectsComponents.includes(component.id);
          }
          
          return true;
        });
        
        setFilteredComponents(filtered);
      } else {
        setFilteredComponents(initialConfig.components);
      }
    } else {
      setFilteredComponents(initialConfig.components);
    }
  }, [initialConfig, window.location.search]);

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
    <DashboardGrid
      config={{
        ...config,
        components: filteredComponents
      }}
      onComponentUpdate={handleComponentUpdate}
    />
  );
}