import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/Card';
import { BarChart } from '../components/charts/BarChart';
import { LineChart } from '../components/charts/LineChart';
import { PieChart } from '../components/charts/PieChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getMarketingPerformance } from '../lib/mockData/queries';
import { format, subMonths, parseISO } from 'date-fns';
import { DatePicker } from '../components/filters/DatePicker';
import { FilterDropdown } from '../components/filters/FilterDropdown';
import { RefreshCw } from 'lucide-react';

export default function MarketingDashboard() {
  // State for filters
  const [dateRange, setDateRange] = useState<[string, string]>([
    format(subMonths(new Date(), 6), 'yyyy-MM-dd'),
    format(new Date(), 'yyyy-MM-dd')
  ]);
  const [channelFilter, setChannelFilter] = useState<string[]>([]);
  
  // State for data
  const [marketingData, setMarketingData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Load initial data
  useEffect(() => {
    loadMarketingData();
  }, [dateRange]);
  
  // Apply filters when they change
  useEffect(() => {
    if (marketingData.length > 0) {
      applyFilters();
    }
  }, [channelFilter, marketingData]);
  
  const loadMarketingData = async () => {
    setIsLoading(true);
    
    try {
      // Get marketing performance data
      const performance = getMarketingPerformance(dateRange[0], dateRange[1]);
      setMarketingData(performance);
      setFilteredData(performance);
      
    } catch (error) {
      console.error('Error loading marketing data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    // Apply channel filter
    if (channelFilter.length > 0) {
      const filtered = marketingData.filter(channel => 
        channelFilter.includes(channel.channel)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(marketingData);
    }
  };
  
  const handleRefresh = () => {
    loadMarketingData();
  };
  
  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange([startDate, endDate]);
  };
  
  const handleChannelFilterChange = (channels: string[]) => {
    setChannelFilter(channels);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format percentage
  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };
  
  // Calculate totals
  const calculateTotals = () => {
    if (filteredData.length === 0) return null;
    
    return {
      impressions: filteredData.reduce((sum, channel) => sum + channel.impressions, 0),
      clicks: filteredData.reduce((sum, channel) => sum + channel.clicks, 0),
      conversions: filteredData.reduce((sum, channel) => sum + channel.conversions, 0),
      spent: filteredData.reduce((sum, channel) => sum + channel.spent, 0),
      ctr: filteredData.reduce((sum, channel) => sum + channel.clicks, 0) / 
           filteredData.reduce((sum, channel) => sum + channel.impressions, 0),
      conversionRate: filteredData.reduce((sum, channel) => sum + channel.conversions, 0) / 
                     filteredData.reduce((sum, channel) => sum + channel.clicks, 0),
      cpa: filteredData.reduce((sum, channel) => sum + channel.spent, 0) / 
           filteredData.reduce((sum, channel) => sum + channel.conversions, 0)
    };
  };
  
  const totals = calculateTotals();
  
  // Get available channels for filter
  const channelOptions = Array.from(new Set(marketingData.map(channel => channel.channel)))
    .map(channel => ({ value: channel, label: channel.charAt(0).toUpperCase() + channel.slice(1) }));
  
  return (
    <DashboardLayout>
      <PageHeader
        title="Marketing Dashboard"
        description={`Campaign performance from ${format(parseISO(dateRange[0]), 'MMM d, yyyy')} to ${format(parseISO(dateRange[1]), 'MMM d, yyyy')}`}
        actions={
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        }
      />
      
      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <DatePicker
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onStartDateChange={(date) => handleDateRangeChange(date, dateRange[1])}
              onEndDateChange={(date) => handleDateRangeChange(dateRange[0], date)}
              label="Campaign Date Range"
            />
          </div>
          
          <div>
            <FilterDropdown
              options={channelOptions}
              value={channelFilter}
              onChange={handleChannelFilterChange}
              label="Marketing Channels"
              placeholder="All Channels"
              multiple={true}
            />
          </div>
        </div>
      </div>
      
      {/* Loading Overlay */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center">
              <LoadingSpinner size="medium" className="mr-3" />
              <p className="text-gray-700">Loading marketing data...</p>
            </div>
          </div>
        )}
        
        {/* KPI Cards */}
        {totals && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card
              title="Total Impressions"
              value={totals.impressions.toLocaleString()}
              icon="Eye"
              description="campaign views"
            />
            
            <Card
              title="Total Clicks"
              value={totals.clicks.toLocaleString()}
              icon="MousePointer"
              description={`CTR: ${formatPercentage(totals.ctr)}`}
            />
            
            <Card
              title="Conversions"
              value={totals.conversions.toLocaleString()}
              icon="CheckCircle"
              description={`Conv. Rate: ${formatPercentage(totals.conversionRate)}`}
            />
            
            <Card
              title="Total Spent"
              value={formatCurrency(totals.spent)}
              icon="DollarSign"
              description={`CPA: ${formatCurrency(totals.cpa)}`}
            />
          </div>
        )}
        
        {/* Charts Row 1 */}
        {filteredData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Channel Performance */}
            <div>
              <BarChart
                data={filteredData.map(channel => ({
                  name: channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1),
                  impressions: channel.impressions / 1000, // Convert to thousands for better display
                  clicks: channel.clicks,
                  conversions: channel.conversions
                }))}
                series={[
                  { key: 'impressions', color: '#8884d8', name: 'Impressions (K)' },
                  { key: 'clicks', color: '#82ca9d', name: 'Clicks' },
                  { key: 'conversions', color: '#ffc658', name: 'Conversions' }
                ]}
                title="Channel Performance"
                description="Key metrics by marketing channel"
                layout="vertical"
              />
            </div>
            
            {/* Conversion Rate by Channel */}
            <div>
              <BarChart
                data={filteredData.map(channel => ({
                  name: channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1),
                  ctr: channel.ctr * 100,
                  conversionRate: channel.conversionRate * 100
                }))}
                series={[
                  { key: 'ctr', color: '#8884d8', name: 'CTR (%)' },
                  { key: 'conversionRate', color: '#82ca9d', name: 'Conversion Rate (%)' }
                ]}
                title="Engagement Rates"
                description="Click-through and conversion rates by channel"
                layout="vertical"
              />
            </div>
          </div>
        )}
        
        {/* Charts Row 2 */}
        {filteredData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Cost Analysis */}
            <div>
              <BarChart
                data={filteredData.map(channel => ({
                  name: channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1),
                  spent: channel.spent,
                  cpa: channel.cpa
                }))}
                series={[
                  { key: 'spent', color: '#8884d8', name: 'Total Spent ($)' },
                  { key: 'cpa', color: '#ff8042', name: 'Cost per Acquisition ($)' }
                ]}
                title="Cost Analysis"
                description="Spending and cost efficiency by channel"
                layout="vertical"
              />
            </div>
            
            {/* Channel Distribution */}
            <div>
              <PieChart
                data={filteredData.map(channel => ({
                  id: channel.channel,
                  label: channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1),
                  value: channel.spent
                }))}
                title="Budget Allocation"
                description="Marketing spend distribution by channel"
              />
            </div>
          </div>
        )}
        
        {/* ROI Analysis */}
        {filteredData.length > 0 && (
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">ROI Analysis</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Channel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Impressions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicks
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversions
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Spent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CTR
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conv. Rate
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CPA
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((channel) => (
                    <tr key={channel.channel}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {channel.channel.charAt(0).toUpperCase() + channel.channel.slice(1)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {channel.impressions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {channel.clicks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {channel.conversions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(channel.spent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPercentage(channel.ctr)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatPercentage(channel.conversionRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(channel.cpa)}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Totals row */}
                  {totals && (
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        Total
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {totals.impressions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {totals.clicks.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {totals.conversions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(totals.spent)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPercentage(totals.ctr)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatPercentage(totals.conversionRate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(totals.cpa)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* No Data State */}
        {!isLoading && filteredData.length === 0 && (
          <div className="bg-white rounded-xl shadow-card p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No marketing data available</h3>
            <p className="text-gray-500">
              Try adjusting your filters or selecting a different date range.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}