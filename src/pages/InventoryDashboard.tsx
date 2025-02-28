import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/Card';
import { PieChart } from '../components/charts/PieChart';
import { BarChart } from '../components/charts/BarChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getInventoryStatus, getTopSellingProducts } from '../lib/mockData/queries';
import { format, subMonths } from 'date-fns';
import { FilterDropdown } from '../components/filters/FilterDropdown';
import { SearchBar } from '../components/filters/SearchBar';
import { RangeSlider } from '../components/filters/RangeSlider';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function InventoryDashboard() {
  // State for filters
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockRange, setStockRange] = useState<[number, number]>([0, 1000]);
  
  // State for data
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Load initial data
  useEffect(() => {
    loadInventoryData();
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    if (inventoryData) {
      applyFilters();
    }
  }, [categoryFilter, searchQuery, stockRange, inventoryData]);
  
  const loadInventoryData = async () => {
    setIsLoading(true);
    
    try {
      // Get inventory status
      const inventory = getInventoryStatus();
      setInventoryData(inventory);
      
      // Get top selling products for the last 3 months
      const endDate = new Date();
      const startDate = subMonths(endDate, 3);
      const products = getTopSellingProducts(startDate, endDate, 50);
      setTopProducts(products);
      
      // Initialize filtered products
      setFilteredProducts(inventory.needsRestocking);
      
    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    if (!inventoryData) return;
    
    // Start with all products that need restocking
    let filtered = [...inventoryData.needsRestocking];
    
    // Apply category filter
    if (categoryFilter.length > 0) {
      filtered = filtered.filter(product => categoryFilter.includes(product.category));
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply stock range filter
    filtered = filtered.filter(product => 
      product.inventoryCount >= stockRange[0] && product.inventoryCount <= stockRange[1]
    );
    
    setFilteredProducts(filtered);
  };
  
  const handleRefresh = () => {
    loadInventoryData();
  };
  
  const handleCategoryFilterChange = (categories: string[]) => {
    setCategoryFilter(categories);
  };
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const handleStockRangeChange = (range: [number, number]) => {
    setStockRange(range);
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
  
  // Get available categories for filter
  const categoryOptions = inventoryData 
    ? Array.from(new Set(inventoryData.needsRestocking.map((p: any) => p.category)))
        .map(cat => ({ value: cat as string, label: cat as string }))
    : [];
  
  return (
    <DashboardLayout>
      <PageHeader
        title="Inventory Dashboard"
        description="Monitor inventory levels and identify products that need restocking"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              max={50}
              step={1}
              value={stockRange}
              onChange={handleStockRangeChange}
              label="Stock Level"
              formatValue={(val) => `${val} units`}
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
              <p className="text-gray-700">Loading inventory data...</p>
            </div>
          </div>
        )}
        
        {/* KPI Cards */}
        {inventoryData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card
              title="Total Products"
              value={inventoryData.totalProducts.toString()}
              icon="Package"
              description="in inventory"
            />
            
            <Card
              title="Total Inventory"
              value={inventoryData.totalInventory.toString()}
              icon="Boxes"
              description="units in stock"
            />
            
            <Card
              title="Inventory Value"
              value={formatCurrency(inventoryData.inventoryValue)}
              icon="DollarSign"
              description="total value"
            />
            
            <Card
              title="Out of Stock"
              value={inventoryData.inventoryLevels.outOfStock.toString()}
              icon="AlertTriangle"
              description="products"
              className={inventoryData.inventoryLevels.outOfStock > 0 ? "border-l-4 border-red-500" : ""}
            />
          </div>
        )}
        
        {/* Charts Row */}
        {inventoryData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Inventory Levels */}
            <div>
              <PieChart
                data={[
                  { id: 'Out of Stock', label: 'Out of Stock', value: inventoryData.inventoryLevels.outOfStock },
                  { id: 'Low Stock', label: 'Low Stock', value: inventoryData.inventoryLevels.low },
                  { id: 'Medium Stock', label: 'Medium Stock', value: inventoryData.inventoryLevels.medium },
                  { id: 'High Stock', label: 'High Stock', value: inventoryData.inventoryLevels.high },
                ]}
                title="Inventory Levels"
                description="Distribution of products by stock level"
                colors={{ scheme: 'red_yellow_green' }}
              />
            </div>
            
            {/* Top Selling Products */}
            <div>
              <BarChart
                data={topProducts.slice(0, 10).map(product => ({
                  name: product.productName.length > 20 
                    ? product.productName.substring(0, 20) + '...' 
                    : product.productName,
                  units: product.units
                }))}
                series={[
                  { key: 'units', color: '#8884d8', name: 'Units Sold' },
                ]}
                title="Top Selling Products"
                description="Products with highest sales volume in the last 3 months"
                layout="horizontal"
              />
            </div>
          </div>
        )}
        
        {/* Products Needing Restock */}
        {inventoryData && (
          <div className="bg-white rounded-xl shadow-card p-6 mb-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">Products Needing Restock</h2>
              <span className="ml-2 bg-amber-100 text-amber-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {filteredProducts.length} products
              </span>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Level
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className={product.inventoryCount === 0 ? "bg-red-50" : ""}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.inventoryCount === 0 
                                ? 'bg-red-100 text-red-800' 
                                : product.inventoryCount < 5 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {product.inventoryCount} units
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(product.price)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No products match the current filters.
              </div>
            )}
          </div>
        )}
        
        {/* No Data State */}
        {!isLoading && !inventoryData && (
          <div className="bg-white rounded-xl shadow-card p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory data available</h3>
            <p className="text-gray-500">
              Try refreshing the page or check back later.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}