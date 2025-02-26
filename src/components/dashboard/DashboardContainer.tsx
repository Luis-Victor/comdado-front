import React, { useState, useCallback } from 'react';
import { DashboardConfig } from '../../lib/types/dashboard';
import { DashboardGrid } from './DashboardGrid';

interface DashboardContainerProps {
  initialConfig: DashboardConfig;
}

export function DashboardContainer({ initialConfig }: DashboardContainerProps) {
  const [config, setConfig] = useState(initialConfig);

  const handleComponentUpdate = useCallback((componentId: string, data: any) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      components: prevConfig.components.map(component =>
        component.id === componentId
          ? { ...component, data: { ...component.data, ...data } }
          : component
      ),
    }));
  }, []);

  return (
    <DashboardGrid
      config={config}
      onComponentUpdate={handleComponentUpdate}
    />
  );
}