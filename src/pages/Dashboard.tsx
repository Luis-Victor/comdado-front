import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/Card';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { RefreshCw, Database } from 'lucide-react';
import { format, parseISO } from 'date-fns';

// Import only fixedSalesTableData
import { fixedSalesTableData } from '../lib/mockData/fixedData';

// Filter components
import { DatePicker } from '../components/filters/DatePicker';
import { FilterDropdown } from '../components/filters/FilterDropdown';
import { RangeSlider } from '../components/filters/RangeSlider';
import { SalesDataTable } from '../components/common/SalesDataTable';

export default function Dashboard() {
  // State for filters
  const [dateRange, setDateRange] = useState<[string, string]>([
    "2023-01-01",
    "2023-12-31"
  ]);
  const [segmentFilter, setSegmentFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  // State for available filter options
  const [availableDates, setAvailableDates] = useState<{min: string, max: string}>({
    min: "2023-01-01",
    max: "2023-12-31"
  });
  
  // State for price range limits
  const [priceRangeLimits, setPriceRangeLimits] = useState<{min: number, max: number}>({
    min: 0,
    max: 1000
  });
  
  // State for filtered data
  const [filteredData, setFilteredData] = useState<any[]>(fixedSalesTableData);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // State for showing raw data tables
  const [showRawData, setShowRawData] = useState(false);
  
  // Load initial data and available filter options
  useEffect(() => {
    // Calculate available dates from the data
    const dates = fixedSalesTableData.map(item => item.Date);
    setAvailableDates({
      min: dates.reduce((a, b) => a < b ? a : b),
      max: dates.reduce((a, b) => a > b ? a : b)
    });
    
    // Calculate price range limits from the data
    const prices = fixedSalesTableData.map(item => item["Sale Price"]);
    setPriceRangeLimits({
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices))
    });
    
    // Set initial price range
    setPriceRange([
      Math.floor(Math.min(...prices)),
      Math.ceil(Math.max(...prices))
    ]);
    
    loadDashboardData();
  }, []);
  
  // Reload data when filters change
  useEffect(() => {
    loadDashboardData();
  }, [dateRange, segmentFilter, priceRange]);

  const loadDashboardData = () => {
    setIsLoading(true);
    
    try {
      // Filter the data based on current filters
      let filtered = [...fixedSalesTableData];
      
      // Apply date filter
      filtered = filtered.filter(item => 
        item.Date >= dateRange[0] && item.Date <= dateRange[1]
      );
      
      // Apply segment filter
      if (segmentFilter.length > 0) {
        filtered = filtered.filter(item => 
          segmentFilter.includes(item.Segment)
        );
      }
      
      // Apply price filter
      filtered = filtered.filter(item => 
        item["Sale Price"] >= priceRange[0] && 
        item["Sale Price"] <= priceRange[1]
      );
      
      setFilteredData(filtered);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Aggregate sales data by date for the line chart
  const aggregateSalesByDate = (data: any[]) => {
    const aggregated = new Map();
    
    data.forEach(item => {
      const date = format(parseISO(item.Date), 'MMM d');
      if (!aggregated.has(date)) {
        aggregated.set(date, {
          date: item.Date,
          name: date,
          revenue: 0,
          units: 0
        });
      }
      const current = aggregated.get(date);
      current.revenue += item.Sales;
      current.units += item["Units Sold"];
    });
    
    return Array.from(aggregated.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };
  
  // Aggregate sales by segment for the pie chart
  const aggregateSalesBySegment = (data: any[]) => {
    const aggregated = new Map();
    
    data.forEach(item => {
      if (!aggregated.has(item.Segment)) {
        aggregated.set(item.Segment, {
          id: item.Segment,
          label: item.Segment,
          value: 0
        });
      }
      const current = aggregated.get(item.Segment);
      current.value += item.Sales;
    });
    
    // Round values to 2 decimal places to avoid floating point precision issues
    return Array.from(aggregated.values()).map(item => ({
      ...item,
      value: Number(item.value.toFixed(2))
    }));
  };
  
  // Get top products by sales
  const getTopProducts = (data: any[], limit = 10) => {
    const aggregated = new Map();
    
    data.forEach(item => {
      if (!aggregated.has(item.Product)) {
        aggregated.set(item.Product, {
          name: item.Product,
          revenue: 0,
          units: 0
        });
      }
      const current = aggregated.get(item.Product);
      current.revenue += item.Sales;
      current.units += item["Units Sold"];
    });
    
    return Array.from(aggregated.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, limit);
  };
  
  // Calculate KPIs from the filtered data
  const calculateKPIs = (data: any[]) => {
    const totalRevenue = data.reduce((sum, item) => sum + item.Sales, 0);
    const totalUnits = data.reduce((sum, item) => sum + item["Units Sold"], 0);
    const totalProfit = data.reduce((sum, item) => sum + item.Profit, 0);
    const uniqueCustomers = new Set(data.map(item => item.Segment)).size;
    
    return {
      totalRevenue,
      totalUnits,
      averageOrderValue: totalRevenue / totalUnits,
      totalProfit,
      profitMargin: (totalProfit / totalRevenue) * 100,
      uniqueCustomers
    };
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
  
  // Get available segments for filter
  const segmentOptions = useMemo(() => 
    Array.from(new Set(fixedSalesTableData.map(item => item.Segment)))
      .map(segment => ({
        value: segment,
        label: segment
      })),
    [fixedSalesTableData]
  );

  // Calculate KPIs
  const kpis = useMemo(() => calculateKPIs(filteredData), [filteredData]);

  // Memoize expensive calculations
  const salesByDate = useMemo(() => aggregateSalesByDate(filteredData), [filteredData]);
  const salesBySegment = useMemo(() => aggregateSalesBySegment(filteredData), [filteredData]);
  const topProductsData = useMemo(() => getTopProducts(filteredData), [filteredData]);

  return (
    <DashboardLayout>
      <PageHeader
        title="Sales Dashboard"
        description={`Data from ${format(parseISO(dateRange[0]), 'MMM d, yyyy')} to ${format(parseISO(dateRange[1]), 'MMM d, yyyy')}`}
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
              onClick={loadDashboardData}
              disabled={isRefreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        }
      />
      
      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="w-full">
            <DatePicker
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onStartDateChange={(date) => setDateRange([date, dateRange[1]])}
              onEndDateChange={(date) => setDateRange([dateRange[0], date])}
              label="Date Range"
              minDate={availableDates.min}
              maxDate={availableDates.max}
            />
          </div>
          
          <div className="w-full">
            <FilterDropdown
              options={segmentOptions}
              value={segmentFilter}
              onChange={setSegmentFilter}
              label="Customer Segments"
              placeholder="All Segments"
              multiple={true}
            />
          </div>
          
          <div className="w-full">
            <RangeSlider
              min={priceRangeLimits.min}
              max={priceRangeLimits.max}
              step={Math.max(1, Math.floor((priceRangeLimits.max - priceRangeLimits.min) / 100))}
              value={priceRange}
              onChange={setPriceRange}
              label="Price Range"
              formatValue={(val) => formatCurrency(val)}
            />
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
            <LoadingSpinner size="medium" />
          </div>
        )}
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card
            title="Total Revenue"
            value={formatCurrency(kpis.totalRevenue)}
            icon="DollarSign"
            description="Total sales revenue"
          />
          
          <Card
            title="Total Units Sold"
            value={kpis.totalUnits.toString()}
            icon="Package"
            description="Number of units sold"
          />
          
          <Card
            title="Average Order Value"
            value={formatCurrency(kpis.averageOrderValue)}
            icon="TrendingUp"
            description="Average revenue per unit"
          />
          
          <Card
            title="Profit Margin"
            value={`${kpis.profitMargin.toFixed(1)}%`}
            icon="PieChart"
            description="Overall profit margin"
          />
        </div>
        
        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Sales Trend */}
          <div className="lg:col-span-2">
            <LineChart
              data={salesByDate}
              series={[
                { key: 'revenue', color: '#8884d8', name: 'Revenue' },
                { key: 'units', color: '#82ca9d', name: 'Units Sold' }
              ]}
              title="Sales Trend"
              description="Daily revenue and units sold"
              xAxis={{ title: 'Date' }}
              yAxis={{ title: 'Amount' }}
              tooltipFormat={(value: number | string) => typeof value === 'number' ? formatCurrency(value) : value.toString()}
            />
          </div>
          
          {/* Segment Distribution */}
          <div>
            <PieChart
              data={salesBySegment}
              title="Sales by Segment"
              description="Revenue distribution across customer segments"
              donut={true}
              tooltipFormat={(value: number) => formatCurrency(value)}
              valueFormat={(value: number) => formatCurrency(value)}
            />
          </div>
        </div>
        
        {/* Top Products */}
        <div className="mb-6">
          <BarChart
            data={topProductsData}
            series={[
              { key: 'revenue', color: '#8884d8', name: 'Revenue' },
              { key: 'units', color: '#82ca9d', name: 'Units' }
            ]}
            title="Top Products"
            description="Best performing products by revenue"
            layout="vertical"
            xAxis={{ title: 'Revenue ($)' }}
            yAxis={{ title: 'Product' }}
            tooltipFormat={(value: number | string) => typeof value === 'number' ? formatCurrency(value) : value.toString()}
          />
        </div>
        
        {/* Sales Data Table */}
        <div className="mb-6">
          <SalesDataTable 
            title="Detailed Sales Data"
            description="Comprehensive sales data with segment, product, and financial information"
            data={filteredData}
            pageSize={10}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}