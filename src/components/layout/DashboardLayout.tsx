import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex h-screen pt-16">
        <Sidebar 
          isOpen={sidebarOpen} 
          isExpanded={sidebarExpanded}
          onClose={() => setSidebarOpen(false)}
          onToggleExpand={() => setSidebarExpanded(!sidebarExpanded)}
        />
        <main 
          className={`flex-1 overflow-y-auto py-8 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
            sidebarExpanded ? 'md:ml-64' : 'md:ml-16'
          }`}
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}