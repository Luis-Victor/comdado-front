import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { formatTableValue } from '../../lib/utils/tableUtils';

interface DataTableProps {
  data: any[];
  title: string;
  description?: string;
  pageSize?: number;
  priorityColumns?: string[]; // Columns to show first
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  title,
  description,
  pageSize = 10,
  priorityColumns = ['id', 'name', 'productName', 'category']
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Add debugging to check data and columns
  useEffect(() => {
    console.log("DataTable component received:", {
      dataLength: data?.length || 0,
      priorityColumns,
      firstItem: data?.length > 0 ? data[0] : null,
      allKeys: data?.length > 0 ? Object.keys(data[0]) : []
    });
  }, [data, priorityColumns]);
  
  // Handle empty data case
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
        {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
        <div className="p-4 text-center">
          <p className="text-gray-500">No data available</p>
        </div>
      </div>
    );
  }
  
  // Get column information with memoization for performance
  const { sortedColumns, columnTypes } = useMemo(() => {
    // Get all unique keys from the data objects
    const allKeys = Array.from(
      new Set(
        data.flatMap(item => Object.keys(item))
      )
    );
    
    console.log("DataTable detected columns:", {
      allKeys,
      priorityColumns
    });
    
    // Sort columns to prioritize important ones
    const sortedCols = [
      // First show priority columns in the order specified
      ...priorityColumns.filter(col => allKeys.includes(col)),
      // Then show remaining columns
      ...allKeys.filter(col => !priorityColumns.includes(col))
    ];
    
    // Determine column types for formatting
    const colTypes: Record<string, 'string' | 'number' | 'currency' | 'percentage' | 'date'> = {};
    
    sortedCols.forEach(column => {
      // Determine column type based on name or first non-null value
      if (column.toLowerCase().includes('price') || 
          column.toLowerCase().includes('revenue') || 
          column.toLowerCase().includes('cost') || 
          column.toLowerCase().includes('sales') ||
          column.toLowerCase().includes('profit') ||
          column.toLowerCase().includes('discounts') ||
          column.toLowerCase().includes('value')) {
        colTypes[column] = 'currency';
      } else if (column.toLowerCase().includes('percentage') || 
                column.toLowerCase().includes('ratio') || 
                column.toLowerCase().includes('rate') ||
                column.toLowerCase().includes('margin')) {
        colTypes[column] = 'percentage';
      } else if (column.toLowerCase().includes('date')) {
        colTypes[column] = 'date';
      } else {
        // Check first non-null value
        const firstValue = data.find(item => item[column] !== null && item[column] !== undefined)?.[column];
        if (typeof firstValue === 'number') {
          colTypes[column] = 'number';
        } else {
          colTypes[column] = 'string';
        }
      }
    });
    
    return { sortedColumns: sortedCols, columnTypes: colTypes };
  }, [data, priorityColumns]);
  
  // Sort data with memoization
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      
      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;
      
      // Sort based on column type
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // Default string comparison
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      return sortDirection === 'asc' 
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
  }, [data, sortColumn, sortDirection]);
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedData.length);
  const currentData = sortedData.slice(startIndex, endIndex);
  
  // Handle sorting
  const handleSort = useCallback((column: string) => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn]);
  
  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  return (
    <div className="bg-white rounded-xl shadow-card p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {sortedColumns.map(column => (
                <th 
                  key={column}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center">
                    <span>{column}</span>
                    {sortColumn === column && (
                      <span className="ml-1">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {sortedColumns.map(column => (
                  <td key={`${rowIndex}-${column}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatTableValue(row[column], columnTypes[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{endIndex}</span> of{' '}
            <span className="font-medium">{sortedData.length}</span> results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around current page
              let pageNum = currentPage;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`px-3 py-1 border rounded text-sm ${
                    currentPage === pageNum ? 'bg-blue-500 text-white' : ''
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 