import React, { useState, useEffect } from 'react';
import { DataTable } from './DataTable';
import { consolidateData, calculateDerivedFields } from '../../lib/utils/tableUtils';

interface ConsolidatedDataTableProps {
  dashboardType: 'sales' | 'inventory' | 'marketing';
  data: Record<string, any[]>;
}

export const ConsolidatedDataTable: React.FC<ConsolidatedDataTableProps> = ({
  dashboardType,
  data
}) => {
  const [consolidatedData, setConsolidatedData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(true);
  
  useEffect(() => {
    consolidateTableData();
  }, [data, dashboardType]);
  
  const consolidateTableData = () => {
    setIsProcessing(true);
    
    try {
      console.log("ConsolidatedDataTable - Processing data:", Object.keys(data));
      let result: any[] = [];
      
      if (dashboardType === 'sales') {
        // For Sales Dashboard, focus on products with sales data
        if (data.topProducts && data.topProducts.length > 0) {
          console.log("ConsolidatedDataTable - Using topProducts:", data.topProducts.length);
          
          // Use the consolidateData function to merge data
          const mergedData = consolidateData({
            products: data.topProducts,
            categories: data.categoryData || []
          }, 'productId');
          
          // Apply derived fields to each item
          result = mergedData.map(item => calculateDerivedFields(item, 'sales'));
          console.log("ConsolidatedDataTable - Processed topProducts into:", result.length, "items");
        } else {
          console.log("ConsolidatedDataTable - No topProducts found");
          
          // Fallback to using salesData if available
          if (data.salesData && data.salesData.length > 0) {
            console.log("ConsolidatedDataTable - Using salesData:", data.salesData.length);
            
            // Check if salesData has the expected structure for display
            const hasSalesStructure = data.salesData[0] && 
              (data.salesData[0].revenue !== undefined || 
               data.salesData[0].orders !== undefined);
            
            if (hasSalesStructure) {
              // For data that already has the right structure, we can use it directly
              result = [...data.salesData];
              console.log("ConsolidatedDataTable - Using salesData directly:", result.length, "items");
            }
            
            // If we need to process it through consolidateData:
            if (data.categoryData && data.categoryData.length > 0) {
              console.log("ConsolidatedDataTable - Also have categoryData, will consolidate");
              const mergedData = consolidateData({
                sales: data.salesData,
                categories: data.categoryData
              }, 'date');
              
              // Apply derived fields to each item
              result = mergedData.map(item => calculateDerivedFields(item, 'sales'));
              console.log("ConsolidatedDataTable - Processed consolidated data into:", result.length, "items");
            }
          } else if (data.categoryData && data.categoryData.length > 0) {
            // If we have category data but no sales or products, use that
            console.log("ConsolidatedDataTable - Using categoryData as fallback:", data.categoryData.length);
            result = [...data.categoryData];
          }
        }
      } 
      else if (dashboardType === 'inventory') {
        // For Inventory Dashboard, focus on inventory items
        if (data.inventoryData && data.inventoryData.length > 0) {
          result = data.inventoryData.map(item => {
            // Calculate any derived fields
            return calculateDerivedFields(item, 'inventory');
          });
        }
      }
      else if (dashboardType === 'marketing') {
        // For Marketing Dashboard, focus on campaign performance
        if (data.marketingCampaigns && data.marketingCampaigns.length > 0) {
          // Use the consolidateData function to merge data
          const mergedData = consolidateData({
            campaigns: data.marketingCampaigns,
            channels: data.channelData || []
          }, 'id');
          
          // Apply derived fields to each item
          result = mergedData.map(item => calculateDerivedFields(item, 'marketing'));
        }
      }
      
      console.log("ConsolidatedDataTable - Final result:", result.length);
      setConsolidatedData(result);
    } catch (error) {
      console.error('Error consolidating data:', error);
      setConsolidatedData([]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const getInventoryStatus = (item: any): string => {
    if (!item.quantity) return 'Out of Stock';
    if (item.quantity <= item.reorderLevel) return 'Low Stock';
    if (item.quantity > item.reorderLevel * 3) return 'Overstocked';
    return 'In Stock';
  };
  
  const getTableTitle = (): string => {
    switch (dashboardType) {
      case 'sales':
        return 'Sales Dashboard Data';
      case 'inventory':
        return 'Inventory Dashboard Data';
      case 'marketing':
        return 'Marketing Dashboard Data';
      default:
        return 'Dashboard Data';
    }
  };
  
  const getTableDescription = (): string => {
    switch (dashboardType) {
      case 'sales':
        return 'Consolidated view of products, sales, and category data';
      case 'inventory':
        return 'Consolidated view of inventory items with status and value';
      case 'marketing':
        return 'Consolidated view of marketing campaigns and performance metrics';
      default:
        return 'Consolidated dashboard data';
    }
  };
  
  if (isProcessing) {
    return <div className="p-4 text-center">Processing data...</div>;
  }
  
  return (
    <DataTable
      data={consolidatedData}
      title={getTableTitle()}
      description={getTableDescription()}
      pageSize={10}
    />
  );
}; 