import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/common/PageHeader';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ChartRenderer } from '../components/magic/ChartRenderer';
import { ChartConfig } from '../lib/types/magicChart';
import { FileDown, RefreshCw, Settings, Save, WifiOff } from 'lucide-react';
import { DashboardConfig, Breakpoint } from '../lib/types/dashboard';
import { useBreakpoint } from '../lib/hooks/useBreakpoint';
import { getGridItemStyle } from '../lib/utils/dashboardUtils';
import { saveAs } from 'file-saver';
import { 
  fetchDashboardConfig, 
  fetchChartsCount, 
  fetchChartData
} from '../lib/api/magicChartsApi';
import { generateMagicChartsSchema } from '../lib/utils/schemaGenerator';
import { DashboardManager } from '../components/magic/DashboardManager';
import { fallbackCharts, fallbackDashboardConfig } from '../lib/constants/fallbackCharts';

interface MagicChartsDashboardConfig extends Omit<DashboardConfig, 'components'> {
  charts: (ChartConfig & { 
    position: {
      row: number;
      column: number;
      width: number;
      height: number;
      responsive?: {
        [key in Breakpoint]?: {
          row: number;
          column: number;
          width: number;
          height: number;
          visible?: boolean;
        };
      };
    };
    priority?: number;
  })[];
}

export default function MagicCharts() {
  const [config, setConfig] = useState<MagicChartsDashboardConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');
  const breakpoint = useBreakpoint(config?.layout.responsive?.breakpoints);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  // For progressive loading
  const [dashboardLayout, setDashboardLayout] = useState<any>(null);
  const [loadedCharts, setLoadedCharts] = useState<ChartConfig[]>([]);
  const [totalCharts, setTotalCharts] = useState(0);
  const [chartIds, setChartIds] = useState<string[]>([]);

  const fetchMagicChartsConfig = async () => {
    setIsLoading(true);
    setError(null);
    setLoadingProgress(0);
    setLoadedCharts([]);
    setIsOfflineMode(false);

    try {
      // Multi-step loading process with progressive chart rendering
      setLoadingStatus('Step 1: Fetching dashboard configuration...');
      setLoadingProgress(10);
      
      // Fetch dashboard layout first
      const dashboardConfig = await fetchDashboardConfig();
      setDashboardLayout(dashboardConfig);
      setLoadingProgress(20);
      
      // Create initial config with empty charts array
      setConfig({
        ...dashboardConfig,
        charts: []
      });
      
      setLoadingStatus('Step 2: Fetching charts count...');
      setLoadingProgress(30);
      
      // Fetch chart count and IDs
      const chartsCountData = await fetchChartsCount();
      setTotalCharts(chartsCountData.count);
      setChartIds(chartsCountData.chartIds);
      setLoadingProgress(40);
      
      setLoadingStatus('Step 3: Loading charts progressively...');
      
      // Load charts one by one and update the UI as each loads
      for (let i = 0; i < chartsCountData.chartIds.length; i++) {
        const chartId = chartsCountData.chartIds[i];
        setLoadingStatus(`Loading chart ${i + 1} of ${chartsCountData.count}: ${chartId}`);
        
        try {
          const chartData = await fetchChartData(chartId);
          
          // Add the new chart to the loaded charts
          setLoadedCharts(prev => [...prev, chartData]);
          
          // Update the config with the new chart
          setConfig(prevConfig => {
            if (!prevConfig) return null;
            
            // Ensure we don't add duplicate charts with the same ID
            const existingChartIndex = prevConfig.charts.findIndex(c => c.id === chartData.id);
            
            if (existingChartIndex >= 0) {
              // Replace existing chart
              const updatedCharts = [...prevConfig.charts];
              updatedCharts[existingChartIndex] = chartData;
              return {
                ...prevConfig,
                charts: updatedCharts
              };
            } else {
              // Add new chart
              return {
                ...prevConfig,
                charts: [...prevConfig.charts, chartData]
              };
            }
          });
          
          // Update progress
          const progressIncrement = 50 / chartsCountData.count;
          setLoadingProgress(40 + ((i + 1) * progressIncrement));
        } catch (chartError) {
          console.error(`Error loading chart ${chartId}:`, chartError);
          // Continue with other charts even if one fails
        }
      }
      
      setLoadingStatus('All charts loaded successfully');
      setLoadingProgress(100);
      
      // We're done loading but we'll keep isLoading true until all charts are displayed
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch magic charts configuration';
      setError(errorMessage);
      console.error('Error fetching magic charts configuration:', err);
      
      // Switch to offline mode with fallback charts
      setIsOfflineMode(true);
      setConfig({
        ...fallbackDashboardConfig,
        charts: fallbackCharts
      });
      
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMagicChartsConfig();
  }, []);

  const handleRefresh = () => {
    fetchMagicChartsConfig();
  };

  const generateDocumentation = () => {
    if (!config) return;
    
    // Generate schema from current config
    const schema = generateMagicChartsSchema(
      { title: config.title, theme: config.theme, layout: config.layout },
      { count: config.charts.length, chartIds: config.charts.map(c => c.id) },
      config.charts[0] || {}
    );
    
    // Download the schema
    const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
    saveAs(blob, 'magic-charts-api-schema.json');
  };

  const handleOpenConfigModal = () => {
    setShowConfigModal(true);
  };

  const handleSaveConfig = (newConfig: MagicChartsDashboardConfig) => {
    setConfig(newConfig);
    setShowConfigModal(false);
  };

  // Render loading state with progressive chart display
  if (isLoading) {
    return (
      <DashboardLayout>
        <PageHeader
          title="Magic Charts"
          description="AI-powered dynamic chart generation"
          actions={
            <div className="flex space-x-4">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Charts
              </button>
            </div>
          }
        />
        
        <div className="bg-white rounded-xl shadow-card p-8 mb-6">
          <div className="flex flex-col items-center justify-center">
            <LoadingSpinner size="large" className="mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {loadingStatus}
            </h3>
            <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              Loaded {loadedCharts.length} of {totalCharts || '?'} charts
            </p>
          </div>
        </div>
        
        {/* Progressive chart display during loading */}
        {dashboardLayout && loadedCharts.length > 0 && (
          <div className="w-full min-h-screen bg-gray-50">
            <div className="max-w-[2400px] mx-auto">
              <div className="p-4 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 font-medium">
                  Loading in progress: Displaying {loadedCharts.length} of {totalCharts} charts
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Charts are being loaded progressively. You can interact with loaded charts while others are being fetched.
                </p>
              </div>
              
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${dashboardLayout.layout.columns}, minmax(0, 1fr))`,
                  gap: `${dashboardLayout.layout.gap}px`,
                  padding: `${dashboardLayout.layout.gap}px`,
                }}
                className="mt-6"
              >
                {loadedCharts.map((chart, index) => {
                  const gridItemStyle = {
                    gridColumn: `${chart.position.column} / span ${chart.position.width}`,
                    gridRow: `${chart.position.row} / span ${chart.position.height}`,
                  };
                  
                  // Use a combination of chart.id and index to ensure uniqueness
                  const uniqueKey = `chart-${chart.id}-${index}`;
                  
                  return (
                    <div
                      key={uniqueKey}
                      style={gridItemStyle}
                      className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
                    >
                      <ChartRenderer config={chart} />
                    </div>
                  );
                })}
                
                {/* Placeholder skeletons for charts not yet loaded */}
                {chartIds.filter(id => !loadedCharts.some(c => c.id === id)).map((id, index) => {
                  // Use a simple placeholder position if we don't know the actual position yet
                  const placeholderPosition = {
                    gridColumn: `${(index % dashboardLayout.layout.columns) + 1} / span 1`,
                    gridRow: `${Math.floor(index / dashboardLayout.layout.columns) + loadedCharts.length + 1} / span 1`,
                  };
                  
                  return (
                    <div
                      key={`placeholder-${id}-${index}`}
                      style={placeholderPosition}
                      className="bg-white rounded-xl shadow-card p-6 animate-pulse"
                    >
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-32 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }

  if (error && !isOfflineMode) {
    return (
      <DashboardLayout>
        <PageHeader
          title="Magic Charts"
          description="AI-powered dynamic chart generation"
          actions={
            <div className="flex space-x-4">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Charts
              </button>
            </div>
          }
        />
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-700">{error || "Failed to load configuration"}</p>
          <p className="text-sm text-red-600 mt-2">
            Please check that the API is returning data in the expected format.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  if (!config) {
    return (
      <DashboardLayout>
        <PageHeader
          title="Magic Charts"
          description="AI-powered dynamic chart generation"
        />
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </DashboardLayout>
    );
  }

  // Calculate grid styles
  const { layout, charts } = config;
  const columns = layout.responsive?.columnThreshold?.[breakpoint] || layout.columns;
  const gap = layout.responsive?.gapThreshold?.[breakpoint] || layout.gap;

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gridTemplateRows: layout.rowHeight || `repeat(${layout.rows}, minmax(100px, auto))`,
    gap: `${gap}px`,
    padding: `${gap}px`,
  };

  return (
    <DashboardLayout>
      <PageHeader
        title={config.title || "Magic Charts"}
        description={isOfflineMode ? 
          "Offline mode - displaying fallback charts" : 
          "AI-powered dynamic chart generation"}
        actions={
          <div className="flex space-x-4">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Charts
            </button>
            <button
              onClick={handleOpenConfigModal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage Dashboard
            </button>
            <button
              onClick={generateDocumentation}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download Schema
            </button>
          </div>
        }
      />

      {/* Dashboard Configuration Modal */}
      {showConfigModal && (
        <DashboardManager
          config={config}
          onSave={handleSaveConfig}
          onClose={() => setShowConfigModal(false)}
        />
      )}

      {/* Offline mode banner */}
      {isOfflineMode && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start">
            <WifiOff className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">
                You're viewing charts in offline mode
              </h3>
              <p className="mt-1 text-sm text-amber-700">
                We couldn't connect to the Magic Charts API. Displaying fallback charts instead.
                Click "Refresh Charts" to try connecting again.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="w-full min-h-screen bg-gray-50">
        <div className="max-w-[2400px] mx-auto">
          <div style={gridStyle} className="mt-6">
            {charts
              .filter(chart => {
                // Check for responsive visibility
                const position = chart.position.responsive?.[breakpoint];
                return position?.visible !== false;
              })
              .map((chart, index) => {
                // Get the position for current breakpoint
                const gridItemStyle = getGridItemStyle(
                  {
                    id: chart.id,
                    type: chart.type,
                    position: chart.position,
                    priority: chart.priority
                  },
                  breakpoint,
                  columns
                );

                // Use a combination of chart.id and index to ensure uniqueness
                const uniqueKey = `chart-${chart.id}-${index}`;

                return (
                  <div
                    key={uniqueKey}
                    style={gridItemStyle}
                    className="bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
                  >
                    <ChartRenderer config={chart} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}