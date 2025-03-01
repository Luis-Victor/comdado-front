import React from 'react';
import { DataTable } from './DataTable';

interface DashboardDataTablesProps {
  dashboardType: 'sales' | 'inventory' | 'marketing';
  data: {
    salesData?: any[];
    categoryData?: any[];
    productData?: any[];
    customerSegments?: any[];
    orderStatuses?: any[];
    inventoryData?: any[];
    stockLevels?: any[];
    marketingData?: any[];
    campaignData?: any[];
    channelData?: any[];
    [key: string]: any[] | undefined;
  };
}

export const DashboardDataTables: React.FC<DashboardDataTablesProps> = ({
  dashboardType,
  data
}) => {
  // Common tables for all dashboards
  const commonTables = (
    <>
      {data.salesData && (
        <DataTable 
          data={data.salesData}
          title="Sales Data"
          description="Raw sales data filtered by current filters"
          pageSize={5}
        />
      )}
      
      {data.categoryData && (
        <DataTable 
          data={data.categoryData}
          title="Category Data"
          description="Sales by category filtered by current filters"
          pageSize={5}
        />
      )}
      
      {data.productData && (
        <DataTable 
          data={data.productData}
          title="Products Data"
          description="Product data filtered by current filters"
          pageSize={5}
        />
      )}
    </>
  );
  
  // Sales dashboard specific tables
  const salesTables = (
    <>
      {data.customerSegments && (
        <DataTable 
          data={data.customerSegments}
          title="Customer Segments Data"
          description="Customer segments data"
          pageSize={5}
        />
      )}
      
      {data.orderStatuses && (
        <DataTable 
          data={data.orderStatuses}
          title="Order Statuses Data"
          description="Order status distribution"
          pageSize={5}
        />
      )}
    </>
  );
  
  // Inventory dashboard specific tables
  const inventoryTables = (
    <>
      {data.inventoryData && (
        <DataTable 
          data={data.inventoryData}
          title="Inventory Data"
          description="Raw inventory data filtered by current filters"
          pageSize={5}
        />
      )}
      
      {data.stockLevels && (
        <DataTable 
          data={data.stockLevels}
          title="Stock Levels Data"
          description="Stock levels by product"
          pageSize={5}
        />
      )}
    </>
  );
  
  // Marketing dashboard specific tables
  const marketingTables = (
    <>
      {data.marketingData && (
        <DataTable 
          data={data.marketingData}
          title="Marketing Data"
          description="Raw marketing data filtered by current filters"
          pageSize={5}
        />
      )}
      
      {data.campaignData && (
        <DataTable 
          data={data.campaignData}
          title="Campaign Data"
          description="Campaign performance data"
          pageSize={5}
        />
      )}
      
      {data.channelData && (
        <DataTable 
          data={data.channelData}
          title="Channel Data"
          description="Marketing channel performance data"
          pageSize={5}
        />
      )}
    </>
  );
  
  // Display tables based on dashboard type
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Raw Data Tables</h2>
      
      {/* Display common tables for all dashboards */}
      {commonTables}
      
      {/* Display dashboard-specific tables */}
      {dashboardType === 'sales' && salesTables}
      {dashboardType === 'inventory' && inventoryTables}
      {dashboardType === 'marketing' && marketingTables}
      
      {/* Display any additional data tables */}
      {Object.entries(data).map(([key, value]) => {
        // Skip keys that are already handled above
        const handledKeys = [
          'salesData', 'categoryData', 'productData', 'customerSegments', 
          'orderStatuses', 'inventoryData', 'stockLevels', 'marketingData', 
          'campaignData', 'channelData'
        ];
        
        if (!handledKeys.includes(key) && Array.isArray(value) && value.length > 0) {
          return (
            <DataTable 
              key={key}
              data={value}
              title={`${key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} Data`}
              description={`Raw ${key} data`}
              pageSize={5}
            />
          );
        }
        
        return null;
      })}
    </div>
  );
}; 