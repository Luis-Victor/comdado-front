import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardContainer } from '../components/dashboard/DashboardContainer';
import dashboardConfig from '../config/dashboardConfig.json';
import { DashboardConfig } from '../lib/types/dashboard';

export default function Dashboard() {
  const [config, setConfig] = useState<DashboardConfig>(dashboardConfig);

  useEffect(() => {
    // You can fetch dynamic configuration from an API here if needed
    // For now, we're using the static config from the JSON file
  }, []);

  return (
    <DashboardLayout>
      <DashboardContainer initialConfig={config} />
    </DashboardLayout>
  );
}