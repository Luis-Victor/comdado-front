import React from 'react';
import { format } from 'date-fns';

interface InventoryItem {
  id?: string;
  productName?: string;
  category?: string;
  sku?: string;
  currentStock: number;
  reorderLevel: number;
  unitPrice: number;
  lastUpdated: string;
}

interface InventoryTableProps {
  data: InventoryItem[];
  title?: string;
  description?: string;
  pageSize?: number;
}

export function InventoryTable({ 
  data = [], 
  title = "Inventory Data",
  description = "Current inventory levels and product details",
  pageSize = 10 
}: InventoryTableProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format number with fallback
  const formatNumber = (value: number | undefined) => {
    return value?.toLocaleString() ?? '0';
  };

  // Get stock status and color
  const getStockStatus = (currentStock: number, reorderLevel: number) => {
    if (currentStock <= 0) {
      return { status: 'Out of Stock', color: 'text-red-600 bg-red-100' };
    } else if (currentStock <= reorderLevel) {
      return { status: 'Low Stock', color: 'text-yellow-600 bg-yellow-100' };
    } else {
      return { status: 'In Stock', color: 'text-green-600 bg-green-100' };
    }
  };

  // Map data to ensure all required fields have default values
  const safeData = data.map(item => ({
    id: item.id || String(Math.random()),
    productName: item.productName || 'N/A',
    category: item.category || 'Uncategorized',
    sku: item.sku || 'N/A',
    currentStock: Number(item.currentStock) || 0,
    reorderLevel: Number(item.reorderLevel) || 0,
    unitPrice: Number(item.unitPrice) || 0,
    lastUpdated: item.lastUpdated || new Date().toISOString()
  }));

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      {(title || description) && (
        <div className="mb-6">
          {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock Level
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reorder Level
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Value
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeData.slice(0, pageSize).map((item) => {
              const stockStatus = getStockStatus(item.currentStock, item.reorderLevel);
              const totalValue = item.currentStock * item.unitPrice;

              return (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatNumber(item.currentStock)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatNumber(item.reorderLevel)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(totalValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockStatus.color}`}>
                      {stockStatus.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(item.lastUpdated), 'MMM d, yyyy')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.length > pageSize && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Showing {pageSize} of {data.length} items
        </div>
      )}

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No inventory data available.
        </div>
      )}
    </div>
  );
} 