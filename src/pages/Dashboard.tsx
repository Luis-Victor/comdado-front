import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/Card';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Download, RefreshCw, Share2 } from 'lucide-react';
import { 
  getSalesByDateRange, 
  getSalesByCategory, 
  getTopSellingProducts,
  getCustomerSegments,
  getOrderStatusDistribution,
  getKPIs
} from '../lib/mockData/queries';
import { format, subDays, subMonths, parseISO } from 'date-fns';

// Filter components
import { DatePicker } from '../components/filters/DatePicker';
import { FilterDropdown } from '../components/filters/FilterDropdown';
import { SearchBar } from '../components/filters/SearchBar';
import { RangeSlider } from '../components/filters/RangeSlider';

export default function Dashboard() {
  // State for filters
  const [dateRange, setDateRange] = useState<[string, string]>([
    format(subMonths(new Date(), 3), 'yyyy-MM-dd'),
    format(new Date(), 'yyyy-MM-dd')
  ]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  
  // State for data
  const [salesData, setSalesData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [customerSegments, setCustomerSegments] = useState<any[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<any[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, []);
  
  // Reload data when filters change
  useEffect(() => {
    loadDashboardData();
  }, [dateRange, categoryFilter]);
  
  const loadDashboardData = async () => {
    setIsLoading(true);
    
    try {
      // Get sales data
      const sales = getSalesByDateRange(dateRange[0], dateRange[1]);
      setSalesData(sales);
      
      // Get sales by category
      const categories = getSalesByCategory(dateRange[0], dateRange[1]);
      setCategoryData(categories);
      
      // Apply category filter if needed
      let filteredCategories = categories;
      if (categoryFilter.length > 0) {
        filteredCategories = categories.filter(cat => categoryFilter.includes(cat.category));
      }
      
      // Get top products (filtered by category if needed)
      const products = getTopSellingProducts(dateRange[0], dateRange[1], 10);
      const filteredProducts = categoryFilter.length > 0
        ? products.filter(product => categoryFilter.includes(product.category))
        : products;
      
      // Apply search filter if needed
      const searchedProducts = searchQuery
        ? filteredProducts.filter(product => 
            product.productName.toLowerCase().includes(searchQuery.toLowerCase()))
        : filteredProducts;
      
      // Apply price range filter
      const priceFilteredProducts = searchedProducts.filter(product => 
        product.averagePrice >= priceRange[0] && product.averagePrice <= priceRange[1]
      );
      
      setTopProducts(priceFilteredProducts);
      
      // Get customer segments
      const segments = getCustomerSegments();
      setCustomerSegments(segments);
      
      // Get order statuses
      const statuses = getOrderStatusDistribution(dateRange[0], dateRange[1]);
      setOrderStatuses(statuses);
      
      // Get KPIs
      const kpiData = getKPIs(dateRange[0], dateRange[1]);
      setKpis(kpiData);
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadDashboardData();
  };
  
  const handleExport = () => {
    // Create a JSON blob with all the dashboard data
    const dashboardData = {
      salesData,
      categoryData,
      topProducts,
      customerSegments,
      orderStatuses,
      kpis,
      filters: {
        dateRange,
        categoryFilter,
        searchQuery,
        priceRange
      }
    };
    
    const blob = new Blob([JSON.stringify(dashboardData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleDateRangeChange = (startDate: string, endDate: string) => {
    setDateRange([startDate, endDate]);
  };
  
  const handleCategoryFilterChange = (categories: string[]) => {
    setCategoryFilter(categories);
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Re-filter products based on search
    const filteredProducts = topProducts.filter(product => 
      product.productName.toLowerCase().includes(query.toLowerCase())
    );
    setTopProducts(filteredProducts);
  };
  
  const handlePriceRangeChange = (range: [number, number]) => {
    setPriceRange(range);
    // Re-filter products based on price range
    loadDashboardData();
  };
  
  const handleShare = () => {
    // Create a URL with filter parameters
    const url = new URL(window.location.href);
    url.searchParams.set('startDate', dateRange[0]);
    url.searchParams.set('endDate', dateRange[1]);
    
    if (categoryFilter.length > 0) {
      url.searchParams.set('categories', categoryFilter.join(','));
    }
    
    if (searchQuery) {
      url.searchParams.set('search', searchQuery);
    }
    
    url.searchParams.set('minPrice', priceRange[0].toString());
    url.searchParams.set('maxPrice', priceRange[1].toString());
    
    // Copy to clipboard
    navigator.clipboard.writeText(url.toString()).then(() => {
      alert('Dashboard URL copied to clipboard!');
    });
  };
  
  // Get available categories for filter
  const categoryOptions = categoryData.map(cat => ({
    value: cat.category,
    label: cat.category
  }));
  
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
    return `${(value * 100).toFixed(1)}%`;
  };
  
  return (
    <DashboardLayout>
      <PageHeader
        title="Sales Dashboard"
        description={`Data from ${format(parseISO(dateRange[0]), 'MMM d, yyyy')} to ${format(parseISO(dateRange[1]), 'MMM d, yyyy')}`}
        actions={
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        }
      />
      
      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <DatePicker
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              onStartDateChange={(date) => handleDateRangeChange(date, dateRange[1])}
              onEndDateChange={(date) => handleDateRangeChange(dateRange[0], date)}
              label="Date Range"
            />
          </div>
          
          <div>
            <FilterDropdown
              options={categoryOptions}
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
              label="Product Categories"
              placeholder="All Categories"
              multiple={true}
            />
          </div>
          
          <div>
            <SearchBar
              onSearch={handleSearchChange}
              placeholder="Search products..."
              label="Product Search"
            />
          </div>
          
          <div>
            <RangeSlider
              min={0}
              max={1000}
              step={10}
              value={priceRange}
              onChange={handlePriceRangeChange}
              label="Price Range"
              formatValue={(val) => `$${val}`}
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
              <p className="text-gray-700">Loading dashboard data...</p>
            </div>
          </div>
        )}
        
        {/* KPI Cards */}
        {kpis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card
              title="Total Revenue"
              value={formatCurrency(kpis.totalRevenue)}
              change={kpis.revenueGrowth * 100}
              icon="DollarSign"
              description="vs previous period"
            />
            
            <Card
              title="Orders"
              value={kpis.orderCount.toString()}
              change={kpis.orderCountGrowth * 100}
              icon="ShoppingCart"
              description="vs previous period"
            />
            
            <Card
              title="Average Order Value"
              value={formatCurrency(kpis.averageOrderValue)}
              icon="TrendingUp"
              description="per order"
            />
            
            <Card
              title="Active Customers"
              value={kpis.activeCustomers.toString()}
              icon="Users"
              description={`${kpis.newCustomers} new customers`}
            />
          </div>
        )}
        
        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Sales Trend */}
          <div className="lg:col-span-2">
            <LineChart
              data={salesData}
              series={[
                { key: 'revenue', color: '#8884d8', name: 'Revenue' },
              ]}
              title="Sales Trend"
              description="Daily revenue over the selected period"
              xAxis={{ title: 'Date' }}
              yAxis={{ title: 'Revenue ($)' }}
              tooltipFormat={(value) => formatCurrency(value as number)}
            />
          </div>
          
          {/* Category Distribution */}
          <div>
            <PieChart
              data={categoryData.map(cat => ({
                id: cat.category,
                label: cat.category,
                value: cat.revenue
              }))}
              title="Sales by Category"
              description="Revenue distribution across product categories"
              donut={true}
            />
          </div>
        </div>
        
        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Products */}
          <div className="lg:col-span-2">
            <BarChart
              data={topProducts.map(product => ({
                name: product.productName.length > 20 
                  ? product.productName.substring(0, 20) + '...' 
                  : product.productName,
                revenue: product.revenue,
                units: product.units
              }))}
              series={[
                { key: 'revenue', color: '#82ca9d', name: 'Revenue' },
              ]}
              title="Top Selling Products"
              description="Products with highest revenue in the selected period"
              layout="horizontal"
              xAxis={{ title: 'Revenue ($)' }}
              yAxis={{ title: 'Product' }}
              tooltipFormat={(value) => formatCurrency(value as number)}
            />
          </div>
          
          {/* Order Status */}
          <div>
            <PieChart
              data={orderStatuses.map(status => ({
                id: status.status,
                label: status.status.charAt(0).toUpperCase() + status.status.slice(1),
                value: status.count
              }))}
              title="Order Status Distribution"
              description="Breakdown of orders by current status"
            />
          </div>
        </div>
        
        {/* Customer Segments */}
        <div className="mb-6">
          <BarChart
            data={customerSegments.map(segment => ({
              name: segment.segment.charAt(0).toUpperCase() + segment.segment.slice(1),
              customers: segment.count,
              avgSpent: segment.averageSpent,
              active: segment.active
            }))}
            series={[
              { key: 'customers', color: '#8884d8', name: 'Total Customers' },
              { key: 'active', color: '#82ca9d', name: 'Active Customers' },
            ]}
            title="Customer Segments"
            description="Customer distribution by segment with activity status"
            layout="vertical"
            xAxis={{ title: 'Customers' }}
            yAxis={{ title: 'Segment' }}
          />
        </div>
        
        {/* No Data State */}
        {!isLoading && salesData.length === 0 && (
          <div className="bg-white rounded-xl shadow-card p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No data available</h3>
            <p className="text-gray-500">
              Try adjusting your filters or selecting a different date range.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}