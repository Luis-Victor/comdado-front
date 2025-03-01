import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/Card';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getMarketingCampaigns } from '../lib/mockData/queries';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { DatePicker } from '../components/filters/DatePicker';
import { FilterDropdown } from '../components/filters/FilterDropdown';
import { RefreshCw, Database } from 'lucide-react';
import { MarketingTable } from '../components/common/MarketingTable';

interface MarketingCampaign {
  id: string;
  campaign: string;
  channel: string;
  date: string;
  status: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spent: number;
  revenue: number;
}

export default function MarketingDashboard() {
  const [showRawData, setShowRawData] = useState(false);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<MarketingCampaign[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[string, string]>([
    format(new Date(2024, 0, 1), 'yyyy-MM-dd'), // Jan 1, 2024
    format(new Date(2024, 3, 30), 'yyyy-MM-dd')  // Apr 30, 2024
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMarketingData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [campaigns, selectedChannel, selectedStatus, dateRange]);

  const loadMarketingData = () => {
    setIsLoading(true);
    try {
      const data = getMarketingCampaigns();
      setCampaigns(data);
      setFilteredCampaigns(data);
    } catch (error) {
      console.error('Error loading marketing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...campaigns];

    // Apply date range filter
    filtered = filtered.filter(campaign => {
      const campaignDate = parseISO(campaign.date);
      return isWithinInterval(campaignDate, {
        start: parseISO(dateRange[0]),
        end: parseISO(dateRange[1])
      });
    });

    if (selectedChannel !== 'all') {
      filtered = filtered.filter(campaign => campaign.channel === selectedChannel);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(campaign => campaign.status === selectedStatus);
    }

    setFilteredCampaigns(filtered);
  };

  const channels = useMemo(() => 
    Array.from(new Set(campaigns.map((c: MarketingCampaign) => c.channel))),
    [campaigns]
  );
  
  const statuses = useMemo(() => 
    Array.from(new Set(campaigns.map((c: MarketingCampaign) => c.status))),
    [campaigns]
  );

  const calculateKPIs = () => {
    const totalImpressions = filteredCampaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = filteredCampaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalConversions = filteredCampaigns.reduce((sum, c) => sum + c.conversions, 0);
    const totalSpent = filteredCampaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalRevenue = filteredCampaigns.reduce((sum, c) => sum + c.revenue, 0);

    return {
      totalImpressions: totalImpressions.toLocaleString(),
      totalClicks: totalClicks.toLocaleString(),
      avgCTR: ((totalClicks / totalImpressions) * 100).toFixed(2) + '%',
      totalConversions: totalConversions.toLocaleString(),
      totalSpent: totalSpent.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      totalRevenue: totalRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
      ROI: (((totalRevenue - totalSpent) / totalSpent) * 100).toFixed(2) + '%'
    };
  };

  const kpis = useMemo(() => calculateKPIs(), [filteredCampaigns]);

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

  // Format number with at most 2 decimal places
  const formatNumber = (value: number) => {
    return Number(value.toFixed(2));
  };

  // Memoize channel performance data
  const channelPerformanceData = useMemo(() => 
    channels
      .map(channel => {
        const channelCampaigns = filteredCampaigns.filter(c => c.channel === channel);
        const campaignCount = channelCampaigns.length;
        
        if (campaignCount === 0) return undefined;
        
        const avgImpressions = channelCampaigns.reduce((sum, c) => sum + c.impressions, 0) / campaignCount;
        const avgClicks = channelCampaigns.reduce((sum, c) => sum + c.clicks, 0) / campaignCount;
        const avgConversions = channelCampaigns.reduce((sum, c) => sum + c.conversions, 0) / campaignCount;
        
        return {
          name: channel.charAt(0).toUpperCase() + channel.slice(1),
          impressions: formatNumber(avgImpressions / 1000), // Convert to thousands for better display
          clicks: formatNumber(avgClicks),
          conversions: formatNumber(avgConversions)
        };
      })
      .filter((item): item is { name: string; impressions: number; clicks: number; conversions: number } => 
        item !== undefined
      ),
    [filteredCampaigns, channels]
  );

  // Memoize engagement rates data
  const engagementRatesData = useMemo(() => 
    channels
      .map(channel => {
        const channelCampaigns = filteredCampaigns.filter(c => c.channel === channel);
        const campaignCount = channelCampaigns.length;
        
        if (campaignCount === 0) return undefined;
        
        const totalImpressions = channelCampaigns.reduce((sum, c) => sum + c.impressions, 0);
        const totalClicks = channelCampaigns.reduce((sum, c) => sum + c.clicks, 0);
        const totalConversions = channelCampaigns.reduce((sum, c) => sum + c.conversions, 0);
        
        const avgCTR = (totalClicks / totalImpressions) * 100;
        const avgConvRate = (totalConversions / totalClicks) * 100;
        
        return {
          name: channel.charAt(0).toUpperCase() + channel.slice(1),
          ctr: formatNumber(avgCTR),
          conversionRate: formatNumber(avgConvRate)
        };
      })
      .filter((item): item is { name: string; ctr: number; conversionRate: number } => 
        item !== undefined
      ),
    [filteredCampaigns, channels]
  );

  // Memoize cost analysis data
  const costAnalysisData = useMemo(() => 
    channels
      .map(channel => {
        const channelCampaigns = filteredCampaigns.filter(c => c.channel === channel);
        const campaignCount = channelCampaigns.length;
        
        if (campaignCount === 0) return undefined;
        
        const totalSpent = channelCampaigns.reduce((sum, c) => sum + c.spent, 0);
        const totalConversions = channelCampaigns.reduce((sum, c) => sum + c.conversions, 0);
        
        const avgSpent = totalSpent / campaignCount;
        const avgCPA = totalConversions > 0 ? totalSpent / totalConversions : 0;
        
        return {
          name: channel.charAt(0).toUpperCase() + channel.slice(1),
          spent: formatNumber(avgSpent),
          cpa: formatNumber(avgCPA)
        };
      })
      .filter((item): item is { name: string; spent: number; cpa: number } => 
        item !== undefined
      ),
    [filteredCampaigns, channels]
  );

  // Memoize budget allocation data
  const budgetAllocationData = useMemo(() => 
    channels
      .map(channel => {
        const channelCampaigns = filteredCampaigns.filter(c => c.channel === channel);
        const totalSpent = channelCampaigns.reduce((sum, c) => sum + c.spent, 0);
        
        if (channelCampaigns.length === 0) return undefined;
        
        return {
          id: channel,
          label: channel.charAt(0).toUpperCase() + channel.slice(1),
          value: Number(totalSpent.toFixed(2)) // Round to 2 decimal places
        };
      })
      .filter((item): item is { id: string; label: string; value: number } => 
        item !== undefined
      ),
    [filteredCampaigns, channels]
  );

  return (
    <DashboardLayout>
      <PageHeader
        title="Marketing Dashboard"
        description="Track and analyze marketing campaign performance"
        actions={
          <div className="flex space-x-3">
            <button
              onClick={() => setShowRawData(!showRawData)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Database className="h-4 w-4 mr-2" />
              {showRawData ? 'Hide Raw Data' : 'Show Raw Data'}
            </button>
            <button
              onClick={loadMarketingData}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        }
      />

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card
            title="Total Impressions"
            value={kpis.totalImpressions}
            icon="Eye"
            description="campaign views"
          />
          <Card
            title="Total Clicks"
            value={kpis.totalClicks}
            icon="MousePointer"
            description={`CTR: ${kpis.avgCTR}`}
          />
          <Card
            title="Total Revenue"
            value={kpis.totalRevenue}
            icon="DollarSign"
            description={`Spent: ${kpis.totalSpent}`}
          />
          <Card
            title="ROI"
            value={kpis.ROI}
            icon="TrendingUp"
            description="Return on Investment"
          />
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-card p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DatePicker
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onStartDateChange={(date) => setDateRange([date, dateRange[1]])}
              onEndDateChange={(date) => setDateRange([dateRange[0], date])}
              label="Campaign Date Range"
              minDate="2024-01-01"
              maxDate="2024-04-30"
            />
            <div>
              <FilterDropdown
                options={channels.map(channel => ({
                  value: channel,
                  label: channel.charAt(0).toUpperCase() + channel.slice(1)
                }))}
                value={selectedChannel === 'all' ? [] : [selectedChannel]}
                onChange={(values) => setSelectedChannel(values.length > 0 ? values[0] : 'all')}
                label="Marketing Channels"
                placeholder="All Channels"
                multiple={false}
              />
              {selectedChannel !== 'all' && (
                <button
                  onClick={() => setSelectedChannel('all')}
                  className="mt-1 text-xs text-primary-600 hover:text-primary-800"
                >
                  Clear filter
                </button>
              )}
            </div>
            <div>
              <FilterDropdown
                options={statuses.map(status => ({
                  value: status,
                  label: status.charAt(0).toUpperCase() + status.slice(1)
                }))}
                value={selectedStatus === 'all' ? [] : [selectedStatus]}
                onChange={(values) => setSelectedStatus(values.length > 0 ? values[0] : 'all')}
                label="Campaign Status"
                placeholder="All Statuses"
                multiple={false}
              />
              {selectedStatus !== 'all' && (
                <button
                  onClick={() => setSelectedStatus('all')}
                  className="mt-1 text-xs text-primary-600 hover:text-primary-800"
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        {filteredCampaigns.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Channel Performance */}
            <div>
              <BarChart
                data={channelPerformanceData}
                series={[
                  { key: 'impressions', color: '#8884d8', name: 'Avg Impressions (K)' },
                  { key: 'clicks', color: '#82ca9d', name: 'Avg Clicks' },
                  { key: 'conversions', color: '#ffc658', name: 'Avg Conversions' }
                ]}
                title="Channel Performance (Averages)"
                description="Average metrics by marketing channel"
                layout="vertical"
              />
            </div>

            {/* Conversion Rate by Channel */}
            <div>
              <BarChart
                data={engagementRatesData}
                series={[
                  { key: 'ctr', color: '#8884d8', name: 'CTR (%)' },
                  { key: 'conversionRate', color: '#82ca9d', name: 'Conversion Rate (%)' }
                ]}
                title="Engagement Rates"
                description="Average rates by marketing channel"
                layout="vertical"
              />
            </div>
          </div>
        )}

        {/* Charts Row 2 */}
        {filteredCampaigns.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Cost Analysis */}
            <div>
              <BarChart
                data={costAnalysisData}
                series={[
                  { key: 'spent', color: '#8884d8', name: 'Avg Spent per Campaign ($)' },
                  { key: 'cpa', color: '#ff8042', name: 'Cost per Acquisition ($)' }
                ]}
                title="Cost Analysis"
                description="Average spending and cost efficiency by channel"
                layout="vertical"
              />
            </div>

            {/* Channel Distribution */}
            <div>
              <PieChart
                data={budgetAllocationData}
                title="Budget Allocation"
                description="Total marketing spend by channel ($)"
                tooltipFormat={(value: number) => formatCurrency(value)}
                valueFormat={(value: number) => formatCurrency(value)}
              />
            </div>
          </div>
        )}

        {showRawData && (
          <div className="mb-8 bg-gray-50 p-4 rounded-lg overflow-auto">
            <pre className="text-sm">{JSON.stringify(filteredCampaigns, null, 2)}</pre>
          </div>
        )}

        <MarketingTable
          data={filteredCampaigns}
          title="Marketing Campaigns"
          description="Overview of all marketing campaigns and their performance metrics"
          pageSize={20}
        />

        {/* No Data State */}
        {!isLoading && filteredCampaigns.length === 0 && (
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