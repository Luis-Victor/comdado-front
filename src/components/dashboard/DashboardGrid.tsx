import React from 'react';
import { useBreakpoint } from '../../lib/hooks/useBreakpoint';
import {
  DashboardConfig,
  DashboardComponent,
  Breakpoint,
  ResponsivePosition,
} from '../../lib/types/dashboard';
import { getComponent } from '../../lib/utils/componentRegistry';
import { getResponsivePosition, getGridItemStyle } from '../../lib/utils/dashboardUtils';
import { Card } from '../Card';
import { LineChart } from '../charts/LineChart';
import { BarChart } from '../charts/BarChart';

interface DashboardGridProps {
  config: DashboardConfig;
  onComponentUpdate?: (componentId: string, data: any) => void;
}

export function DashboardGrid({ config, onComponentUpdate }: DashboardGridProps) {
  const { layout, components } = config;
  const breakpoint = useBreakpoint(layout.responsive?.breakpoints);

  // Get responsive columns and gap
  const columns = layout.responsive?.columnThreshold?.[breakpoint] || layout.columns;
  const gap = layout.responsive?.gapThreshold?.[breakpoint] || layout.gap;

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gridTemplateRows: layout.rowHeight || `repeat(${layout.rows}, minmax(100px, auto))`,
    gap: `${gap}px`,
    padding: `${gap}px`,
  };

  const renderComponent = (component: DashboardComponent) => {
    // Generate a unique key for each component
    const componentKey = `component-${component.id}`;
    
    // Special handling for Card components
    if (component.type === 'Card') {
      return (
        <div
          key={componentKey}
          style={getGridItemStyle(component, breakpoint, columns)}
          className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
        >
          <Card {...component.data} />
        </div>
      );
    }

    // Special handling for LineChart
    if (component.type === 'LineChart') {
      return (
        <div
          key={componentKey}
          style={getGridItemStyle(component, breakpoint, columns)}
          className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
        >
          <LineChart
            data={component.data.data}
            series={component.data.series}
            title={component.title}
            {...component.options}
          />
        </div>
      );
    }

    // Special handling for BarChart
    if (component.type === 'BarChart') {
      return (
        <div
          key={componentKey}
          style={getGridItemStyle(component, breakpoint, columns)}
          className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
        >
          <BarChart
            data={component.data.data}
            series={component.data.series}
            title={component.title}
            {...component.options}
          />
        </div>
      );
    }

    // For now, return null for other component types
    // We'll implement them progressively to ensure each works correctly
    return null;
  };

  // Handle empty state
  if (components.length === 0) {
    return (
      <div className="w-full min-h-[400px] bg-gray-50 rounded-xl flex items-center justify-center">
        <div className="text-center p-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No data to display</h3>
          <p className="text-gray-500">
            Try adjusting your filters or refreshing the dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-[2400px] mx-auto">
        <div style={gridStyle}>
          {components
            .filter(component => {
              const position = getResponsivePosition(component, breakpoint);
              return position.visible !== false;
            })
            .map(renderComponent)}
        </div>
      </div>
    </div>
  );
}