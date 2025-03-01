import React from 'react';
import { DashboardLayout } from './layout/DashboardLayout';
import { DashboardContainer } from './dashboard/DashboardContainer';
import { defaultDashboardConfig } from '../lib/config/dashboardConfig';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="bg-red-600 p-8 text-white text-center rounded-lg mb-4">
        <h1 className="text-3xl font-bold mb-6">DASHBOARD.TSX DEBUG MESSAGE</h1>
        <p className="text-xl mb-4">This debug message is coming from Dashboard.tsx, not DashboardContainer.tsx</p>
        <button 
          className="bg-white text-red-600 font-bold py-3 px-6 rounded-lg text-xl"
          onClick={() => alert('Debug message from Dashboard.tsx')}
        >
          Click to confirm visibility
        </button>
      </div>
      <DashboardContainer initialConfig={defaultDashboardConfig} />
    </DashboardLayout>
  );
}