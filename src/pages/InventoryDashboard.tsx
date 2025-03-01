import React, { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { PageHeader } from '../components/common/PageHeader';
import { Card } from '../components/Card';
import { PieChart } from '../components/charts/PieChart';
import { BarChart } from '../components/charts/BarChart';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getInventoryStatus, getInventoryStatusOptions } from '../lib/mockData/queries';
import { FilterDropdown } from '../components/filters/FilterDropdown';
import { SearchBar } from '../components/filters/SearchBar';
import { RangeSlider } from '../components/filters/RangeSlider';
import { RefreshCw, AlertTriangle, Database } from 'lucide-react';
import { InventoryTable } from '../components/common/InventoryTable';

// Define interfaces for type safety
interface InventoryProduct {
  id: string;
  name: string;
  category: string;
  inventoryCount: number;
  price: number;
  reorderLevel: number;
  sku?: string;
  lastUpdated?: string;
}

interface InventoryStatus {
  inventoryLevels: {
    outOfStock: number;
    low: number;
    medium: number;
    high: number;
  };
  needsRestocking: InventoryProduct[];
  allProducts: InventoryProduct[];
  totalProducts: number;
  totalInventory: number;
  inventoryValue: number;
}

export default function InventoryDashboard() {
  // State for filters
  const [stockStatusFilter, setStockStatusFilter] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockRange, setStockRange] = useState<[number, number]>([0, 0]);
  const [maxStockLevel, setMaxStockLevel] = useState<number>(0);
  
  // State for available filter options
  const [stockStatusOptions, setStockStatusOptions] = useState<{value: string, label: string}[]>([]);
  
  // State for data
  const [inventoryData, setInventoryData] = useState<InventoryStatus | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<InventoryProduct[]>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // State for showing raw data
  const [showRawData, setShowRawData] = useState(false);
  
  // Load initial data
  useEffect(() => {
    // Load available stock status options
    const statusOptions = getInventoryStatusOptions();
    setStockStatusOptions(statusOptions);
    
    loadInventoryData();
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    if (inventoryData) {
      applyFilters();
    }
  }, [stockStatusFilter, searchQuery, stockRange, inventoryData]);
  
  // Helper function to deduplicate products
  const deduplicateProducts = (products: InventoryProduct[]): InventoryProduct[] => {
    return products.reduce((unique: InventoryProduct[], item: InventoryProduct) => {
      const exists = unique.some(x => x.id === item.id);
      if (!exists) {
        unique.push(item);
      }
      return unique;
    }, []);
  };
  
  const loadInventoryData = async () => {
    setIsLoading(true);
    
    try {
      // Get inventory status
      const inventory = getInventoryStatus() as InventoryStatus;
      setInventoryData(inventory);
      
      // Combine and deduplicate products
      const allProducts = deduplicateProducts([
        ...(inventory.allProducts || []),
        ...(inventory.needsRestocking || [])
      ]);

      // Calculate max stock level from actual data
      const maxStock = Math.max(...allProducts.map(p => p.inventoryCount));
      setMaxStockLevel(maxStock);
      
      // Initialize stock range with actual min/max values
      setStockRange([0, maxStock]);
      
      setFilteredProducts(allProducts);
      
    } catch (error) {
      console.error('Error loading inventory data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    if (!inventoryData) return;
    
    // Start with all products
    const allProducts = deduplicateProducts([
      ...(inventoryData.allProducts || []),
      ...(inventoryData.needsRestocking || [])
    ]);
    
    // Apply all filters in a single pass
    const filtered = allProducts.filter(product => {
      // Stock status filter
      if (stockStatusFilter.length > 0) {
        let status = 'high';
        if (product.inventoryCount === 0) {
          status = 'outOfStock';
        } else if (product.inventoryCount < 10) {
          status = 'low';
        } else if (product.inventoryCount < 50) {
          status = 'medium';
        }
        
        if (!stockStatusFilter.includes(status)) {
          return false;
        }
      }
      
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Stock range filter
      if (product.inventoryCount < stockRange[0] || product.inventoryCount > stockRange[1]) {
        return false;
      }
      
      return true;
    });
    
    setFilteredProducts(filtered);
  };
  
  // Format currency - memoized to avoid recreating on each render
  const formatCurrency = useMemo(() => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return (value: number) => formatter.format(value);
  }, []);
  
  // Memoized calculations for KPIs to avoid recalculating on each render
  const kpis = useMemo(() => {
    if (!filteredProducts.length) return null;
    
    return {
      totalProducts: filteredProducts.length,
      totalInventory: filteredProducts.reduce((sum, p) => sum + p.inventoryCount, 0),
      inventoryValue: filteredProducts.reduce((sum, p) => sum + (p.price * p.inventoryCount), 0),
      outOfStock: filteredProducts.filter(p => p.inventoryCount === 0).length
    };
  }, [filteredProducts]);
  
  // Memoized data for charts
  const chartData = useMemo(() => {
    if (!filteredProducts.length) return null;
    
    return {
      inventoryLevels: [
        { 
          id: 'Out of Stock', 
          label: 'Out of Stock', 
          value: filteredProducts.filter(p => p.inventoryCount === 0).length 
        },
        { 
          id: 'Low Stock', 
          label: 'Low Stock', 
          value: filteredProducts.filter(p => p.inventoryCount > 0 && p.inventoryCount < 10).length 
        },
        { 
          id: 'Medium Stock', 
          label: 'Medium Stock', 
          value: filteredProducts.filter(p => p.inventoryCount >= 10 && p.inventoryCount < 50).length 
        },
        { 
          id: 'High Stock', 
          label: 'High Stock', 
          value: filteredProducts.filter(p => p.inventoryCount >= 50).length 
        },
      ],
      topProductsByValue: filteredProducts
        .sort((a, b) => (b.price * b.inventoryCount) - (a.price * a.inventoryCount))
        .slice(0, 10)
        .map(product => ({
          name: product.name.length > 20 
            ? product.name.substring(0, 20) + '...' 
            : product.name,
          value: product.price * product.inventoryCount
        }))
    };
  }, [filteredProducts]);
  
  return (
    <DashboardLayout>
      <PageHeader
        title="Inventory Dashboard"
        description="Real-time inventory management and analytics"
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
              onClick={loadInventoryData}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </button>
          </div>
        }
      />
      
      {/* Show raw data section */}
      {showRawData && (
        <div className="mb-6">
          <InventoryTable
            data={filteredProducts.map(product => ({
              id: product.id,
              productName: product.name,
              category: product.category,
              sku: product.sku || `SKU-${product.id}`,
              currentStock: product.inventoryCount || 0,
              reorderLevel: product.reorderLevel || 10,
              unitPrice: product.price || 0,
              lastUpdated: product.lastUpdated || new Date().toISOString()
            }))}
            title="Inventory Data"
            description={`Showing ${filteredProducts.length} products`}
            pageSize={20}
          />
        </div>
      )}
      
      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <FilterDropdown
              options={stockStatusOptions}
              value={stockStatusFilter}
              onChange={setStockStatusFilter}
              label="Stock Status"
              placeholder="All Statuses"
              multiple={true}
            />
          </div>
          
          <div>
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search products..."
              label="Product Search"
            />
          </div>
          
          <div>
            <RangeSlider
              min={0}
              max={maxStockLevel}
              step={Math.max(1, Math.floor(maxStockLevel / 100))}
              value={stockRange}
              onChange={setStockRange}
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
        {kpis && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card
              title="Total Products"
              value={kpis.totalProducts.toString()}
              icon="Package"
              description="in inventory"
            />
            
            <Card
              title="Total Inventory"
              value={kpis.totalInventory.toString()}
              icon="Boxes"
              description="units in stock"
            />
            
            <Card
              title="Inventory Value"
              value={formatCurrency(kpis.inventoryValue)}
              icon="DollarSign"
              description="total value"
            />
            
            <Card
              title="Out of Stock"
              value={kpis.outOfStock.toString()}
              icon="AlertTriangle"
              description="products"
              className={kpis.outOfStock > 0 ? "border-l-4 border-red-500" : ""}
            />
          </div>
        )}
        
        {/* Charts Row */}
        {chartData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Inventory Levels */}
            <div>
              <PieChart
                data={chartData.inventoryLevels}
                title="Inventory Levels"
                description={`Distribution of ${filteredProducts.length} filtered products by stock level`}
                colors={{ scheme: 'red_yellow_green' }}
                tooltipFormat={(value: number) => `${value} products`}
                valueFormat={(value: number) => `${value}`}
              />
            </div>
            
            {/* Top Products by Value */}
            <div>
              <BarChart
                data={chartData.topProductsByValue}
                series={[
                  { key: 'value', color: '#8884d8', name: 'Inventory Value' },
                ]}
                title="Top Products by Value"
                description={`Top 10 products by total inventory value from ${filteredProducts.length} filtered products`}
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