import React, { useEffect } from 'react';
import { DataTable } from './DataTable';
import { fixedSalesTableData } from '../../lib/mockData/fixedData';

interface SalesDataTableProps {
  title?: string;
  description?: string;
  data?: any[];
  pageSize?: number;
}

export const SalesDataTable: React.FC<SalesDataTableProps> = ({
  title = "Sales Data",
  description = "Detailed sales data with segment, product, and financial information",
  data = fixedSalesTableData,
  pageSize = 10
}) => {
  // Add debugging to check if data is being passed correctly
  useEffect(() => {
    console.log("SalesDataTable received data:", {
      dataLength: data?.length || 0,
      firstItem: data?.length > 0 ? data[0] : null
    });
  }, [data]);

  // Define priority columns to display first
  const priorityColumns = [
    'Segment', 
    'Country', 
    'Product', 
    'Discount Band', 
    'Units Sold', 
    'Manufacturing Price', 
    'Sale Price', 
    'Gross Sales', 
    'Discounts', 
    'Sales', 
    'Cost of Goods Sold (COGS)', 
    'Profit', 
    'Date', 
    'Month Number', 
    'Month Name', 
    'Year'
  ];

  // If no data is available, show a message
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">No sales data available. Please check your data source or filters.</p>
        </div>
      </div>
    );
  }

  return (
    <DataTable
      data={data}
      title={title}
      description={description}
      pageSize={pageSize}
      priorityColumns={priorityColumns}
    />
  );
}; 