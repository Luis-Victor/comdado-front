import React from 'react';
import { DashboardLayout } from './layout/DashboardLayout';
import { DashboardContainer } from './dashboard/DashboardContainer';
import { defaultDashboardConfig } from '../lib/config/dashboardConfig';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardContainer initialConfig={defaultDashboardConfig} />
    </DashboardLayout>
  );
}