import { getMockDatabase } from './database';
import { format, subDays, subMonths, isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';

// Helper function to check if a date is within a range
const isDateInRange = (date: Date, startDate: Date | string, endDate: Date | string): boolean => {
  const start = typeof startDate === 'string' ? parseISO(startDate) : startDate;
  const end = typeof endDate === 'string' ? parseISO(endDate) : endDate;
  
  return isWithinInterval(date, {
    start: startOfDay(start),
    end: endOfDay(end)
  });
};

// Get sales data by date range
export const getSalesByDateRange = (startDate: Date | string, endDate: Date | string) => {
  const db = getMockDatabase();
  
  // Filter orders by date range
  const filteredOrders = db.orders.filter(order => 
    isDateInRange(order.orderDate, startDate, endDate)
  );
  
  // Group by date
  const salesByDate = filteredOrders.reduce((acc, order) => {
    const dateKey = format(order.orderDate, 'yyyy-MM-dd');
    
    if (!acc[dateKey]) {
      acc[dateKey] = {
        date: dateKey,
        revenue: 0,
        orders: 0,
        averageOrderValue: 0
      };
    }
    
    acc[dateKey].revenue += order.total;
    acc[dateKey].orders += 1;
    
    return acc;
  }, {} as Record<string, { date: string; revenue: number; orders: number; averageOrderValue: number }>);
  
  // Calculate average order value
  Object.values(salesByDate).forEach(day => {
    day.averageOrderValue = day.revenue / day.orders;
  });
  
  // Convert to array and sort by date
  return Object.values(salesByDate).sort((a, b) => a.date.localeCompare(b.date));
};

// Get sales by product category
export const getSalesByCategory = (startDate: Date | string, endDate: Date | string) => {
  const db = getMockDatabase();
  
  // Filter orders by date range
  const filteredOrders = db.orders.filter(order => 
    isDateInRange(order.orderDate, startDate, endDate)
  );
  
  // Get order items for filtered orders
  const orderItemIds = filteredOrders.map(order => order.id);
  const filteredOrderItems = db.orderItems.filter(item => 
    orderItemIds.includes(item.orderId)
  );
  
  // Get products for order items
  const productSales: Record<string, { category: string; revenue: number; units: number }> = {};
  
  filteredOrderItems.forEach(item => {
    const product = db.products.find(p => p.id === item.productId);
    
    if (product) {
      if (!productSales[product.category]) {
        productSales[product.category] = {
          category: product.category,
          revenue: 0,
          units: 0
        };
      }
      
      productSales[product.category].revenue += item.total;
      productSales[product.category].units += item.quantity;
    }
  });
  
  // Convert to array and sort by revenue
  return Object.values(productSales).sort((a, b) => b.revenue - a.revenue);
};

// Get top selling products
export const getTopSellingProducts = (startDate: Date | string, endDate: Date | string, limit: number = 10) => {
  const db = getMockDatabase();
  
  // Filter orders by date range
  const filteredOrders = db.orders.filter(order => 
    isDateInRange(order.orderDate, startDate, endDate)
  );
  
  // Get order items for filtered orders
  const orderItemIds = filteredOrders.map(order => order.id);
  const filteredOrderItems = db.orderItems.filter(item => 
    orderItemIds.includes(item.orderId)
  );
  
  // Group by product
  const productSales: Record<string, { 
    productId: string; 
    productName: string; 
    category: string;
    revenue: number; 
    units: number;
    averagePrice: number;
  }> = {};
  
  filteredOrderItems.forEach(item => {
    const product = db.products.find(p => p.id === item.productId);
    
    if (product) {
      if (!productSales[product.id]) {
        productSales[product.id] = {
          productId: product.id,
          productName: product.name,
          category: product.category,
          revenue: 0,
          units: 0,
          averagePrice: 0
        };
      }
      
      productSales[product.id].revenue += item.total;
      productSales[product.id].units += item.quantity;
    }
  });
  
  // Calculate average price
  Object.values(productSales).forEach(product => {
    product.averagePrice = product.revenue / product.units;
  });
  
  // Convert to array, sort by revenue, and limit
  return Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, limit);
};

// Get customer acquisition over time
export const getCustomerAcquisition = (startDate: Date | string, endDate: Date | string, groupBy: 'day' | 'week' | 'month' = 'month') => {
  const db = getMockDatabase();
  
  // Filter customers by creation date
  const filteredCustomers = db.customers.filter(customer => 
    isDateInRange(customer.createdAt, startDate, endDate)
  );
  
  // Group by time period
  const formatString = groupBy === 'day' ? 'yyyy-MM-dd' : 
                      groupBy === 'week' ? 'yyyy-ww' : 'yyyy-MM';
  
  const customersByPeriod = filteredCustomers.reduce((acc, customer) => {
    const periodKey = format(customer.createdAt, formatString);
    
    if (!acc[periodKey]) {
      acc[periodKey] = {
        period: periodKey,
        newCustomers: 0,
        activeCustomers: 0,
        inactiveCustomers: 0
      };
    }
    
    acc[periodKey].newCustomers += 1;
    
    if (customer.isActive) {
      acc[periodKey].activeCustomers += 1;
    } else {
      acc[periodKey].inactiveCustomers += 1;
    }
    
    return acc;
  }, {} as Record<string, { period: string; newCustomers: number; activeCustomers: number; inactiveCustomers: number }>);
  
  // Convert to array and sort by period
  return Object.values(customersByPeriod).sort((a, b) => a.period.localeCompare(b.period));
};

// Get customer segments
export const getCustomerSegments = () => {
  const db = getMockDatabase();
  
  // Group by segment
  const segments = db.customers.reduce((acc, customer) => {
    if (!acc[customer.customerSegment]) {
      acc[customer.customerSegment] = {
        segment: customer.customerSegment,
        count: 0,
        totalSpent: 0,
        averageSpent: 0,
        active: 0
      };
    }
    
    acc[customer.customerSegment].count += 1;
    acc[customer.customerSegment].totalSpent += customer.totalSpent;
    
    if (customer.isActive) {
      acc[customer.customerSegment].active += 1;
    }
    
    return acc;
  }, {} as Record<string, { segment: string; count: number; totalSpent: number; averageSpent: number; active: number }>);
  
  // Calculate average spent
  Object.values(segments).forEach(segment => {
    segment.averageSpent = segment.totalSpent / segment.count;
  });
  
  // Convert to array
  return Object.values(segments);
};

// Get order status distribution
export const getOrderStatusDistribution = (startDate: Date | string, endDate: Date | string) => {
  const db = getMockDatabase();
  
  // Filter orders by date range
  const filteredOrders = db.orders.filter(order => 
    isDateInRange(order.orderDate, startDate, endDate)
  );
  
  // Group by status
  const statusCounts = filteredOrders.reduce((acc, order) => {
    if (!acc[order.status]) {
      acc[order.status] = {
        status: order.status,
        count: 0,
        value: 0
      };
    }
    
    acc[order.status].count += 1;
    acc[order.status].value += order.total;
    
    return acc;
  }, {} as Record<string, { status: string; count: number; value: number }>);
  
  // Convert to array
  return Object.values(statusCounts);
};

// Get marketing campaign performance
export const getMarketingPerformance = (startDate: Date | string, endDate: Date | string) => {
  const db = getMockDatabase();
  
  // Filter campaigns by date range (campaigns that were active during the period)
  const filteredCampaigns = db.marketingCampaigns.filter(campaign => {
    // Campaign end date is after start date and campaign start date is before end date
    return campaign.endDate >= (typeof startDate === 'string' ? new Date(startDate) : startDate) &&
           campaign.startDate <= (typeof endDate === 'string' ? new Date(endDate) : endDate);
  });
  
  // Group by channel
  const channelPerformance = filteredCampaigns.reduce((acc, campaign) => {
    if (!acc[campaign.channel]) {
      acc[campaign.channel] = {
        channel: campaign.channel,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        spent: 0,
        ctr: 0,
        conversionRate: 0,
        cpa: 0
      };
    }
    
    acc[campaign.channel].impressions += campaign.impressions;
    acc[campaign.channel].clicks += campaign.clicks;
    acc[campaign.channel].conversions += campaign.conversions;
    acc[campaign.channel].spent += campaign.spent;
    
    return acc;
  }, {} as Record<string, { 
    channel: string; 
    impressions: number; 
    clicks: number; 
    conversions: number; 
    spent: number;
    ctr: number;
    conversionRate: number;
    cpa: number;
  }>);
  
  // Calculate metrics
  Object.values(channelPerformance).forEach(channel => {
    channel.ctr = channel.clicks / channel.impressions;
    channel.conversionRate = channel.conversions / channel.clicks;
    channel.cpa = channel.spent / channel.conversions;
  });
  
  // Convert to array
  return Object.values(channelPerformance);
};

// Get employee performance by department
export const getEmployeePerformance = () => {
  const db = getMockDatabase();
  
  // Group by department
  const departmentPerformance = db.employees.reduce((acc, employee) => {
    if (!acc[employee.department]) {
      acc[employee.department] = {
        department: employee.department,
        employeeCount: 0,
        averageSalary: 0,
        averagePerformance: 0,
        topPerformer: null as null | { name: string; rating: number },
        activeEmployees: 0
      };
    }
    
    const dept = acc[employee.department];
    
    dept.employeeCount += 1;
    dept.averageSalary += employee.salary;
    dept.averagePerformance += employee.performanceRating;
    
    if (employee.isActive) {
      dept.activeEmployees += 1;
    }
    
    // Track top performer
    if (!dept.topPerformer || employee.performanceRating > dept.topPerformer.rating) {
      dept.topPerformer = {
        name: `${employee.firstName} ${employee.lastName}`,
        rating: employee.performanceRating
      };
    }
    
    return acc;
  }, {} as Record<string, { 
    department: string; 
    employeeCount: number; 
    averageSalary: number; 
    averagePerformance: number;
    topPerformer: null | { name: string; rating: number };
    activeEmployees: number;
  }>);
  
  // Calculate averages
  Object.values(departmentPerformance).forEach(dept => {
    dept.averageSalary = dept.averageSalary / dept.employeeCount;
    dept.averagePerformance = dept.averagePerformance / dept.employeeCount;
  });
  
  // Convert to array and sort by performance
  return Object.values(departmentPerformance).sort((a, b) => b.averagePerformance - a.averagePerformance);
};

// Get sales forecast (simple linear projection based on historical data)
export const getSalesForecast = (days: number = 30) => {
  // Get historical sales data for the past 90 days
  const endDate = new Date();
  const startDate = subDays(endDate, 90);
  
  const historicalSales = getSalesByDateRange(startDate, endDate);
  
  // Calculate average daily growth rate
  let totalGrowthRate = 0;
  let validDays = 0;
  
  for (let i = 1; i < historicalSales.length; i++) {
    const yesterday = historicalSales[i - 1].revenue;
    const today = historicalSales[i].revenue;
    
    if (yesterday > 0) {
      const dailyGrowthRate = (today - yesterday) / yesterday;
      totalGrowthRate += dailyGrowthRate;
      validDays++;
    }
  }
  
  const averageDailyGrowthRate = validDays > 0 ? totalGrowthRate / validDays : 0.01; // Default to 1% if no valid data
  
  // Get the last day's revenue as starting point
  const lastDayRevenue = historicalSales.length > 0 
    ? historicalSales[historicalSales.length - 1].revenue 
    : 1000; // Default starting point
  
  // Project future revenue
  const forecast = [];
  let projectedRevenue = lastDayRevenue;
  
  for (let i = 1; i <= days; i++) {
    const forecastDate = format(subDays(endDate, -i), 'yyyy-MM-dd');
    projectedRevenue = projectedRevenue * (1 + averageDailyGrowthRate);
    
    forecast.push({
      date: forecastDate,
      revenue: projectedRevenue,
      isProjection: true
    });
  }
  
  // Return both historical and forecast data
  return {
    historical: historicalSales.map(day => ({
      ...day,
      isProjection: false
    })),
    forecast
  };
};

// Get inventory status
export const getInventoryStatus = () => {
  const db = getMockDatabase();
  
  // Group products by inventory level
  const inventoryLevels = {
    outOfStock: 0,
    low: 0,
    medium: 0,
    high: 0
  };
  
  db.products.forEach(product => {
    if (product.inventoryCount === 0) {
      inventoryLevels.outOfStock++;
    } else if (product.inventoryCount < 10) {
      inventoryLevels.low++;
    } else if (product.inventoryCount < 50) {
      inventoryLevels.medium++;
    } else {
      inventoryLevels.high++;
    }
  });
  
  // Get products that need restocking
  const needsRestocking = db.products
    .filter(product => product.inventoryCount < 10 && product.isAvailable)
    .map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      inventoryCount: product.inventoryCount,
      price: product.price
    }))
    .sort((a, b) => a.inventoryCount - b.inventoryCount);
  
  return {
    inventoryLevels,
    needsRestocking,
    totalProducts: db.products.length,
    totalInventory: db.products.reduce((sum, product) => sum + product.inventoryCount, 0),
    inventoryValue: db.products.reduce((sum, product) => sum + (product.price * product.inventoryCount), 0)
  };
};

// Get key performance indicators
export const getKPIs = (startDate: Date | string, endDate: Date | string) => {
  const db = getMockDatabase();
  
  // Filter orders by date range
  const filteredOrders = db.orders.filter(order => 
    isDateInRange(order.orderDate, startDate, endDate)
  );
  
  // Calculate KPIs
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const orderCount = filteredOrders.length;
  const averageOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
  
  // Get previous period for comparison
  const currentStartDate = typeof startDate === 'string' ? new Date(startDate) : startDate;
  const currentEndDate = typeof endDate === 'string' ? new Date(endDate) : endDate;
  
  const daysDiff = Math.round((currentEndDate.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24));
  
  const previousStartDate = subDays(currentStartDate, daysDiff);
  const previousEndDate = subDays(currentEndDate, daysDiff);
  
  const previousOrders = db.orders.filter(order => 
    isDateInRange(order.orderDate, previousStartDate, previousEndDate)
  );
  
  const previousRevenue = previousOrders.reduce((sum, order) => sum + order.total, 0);
  const previousOrderCount = previousOrders.length;
  
  // Calculate growth rates
  const revenueGrowth = previousRevenue > 0 ? (totalRevenue - previousRevenue) / previousRevenue : 0;
  const orderCountGrowth = previousOrderCount > 0 ? (orderCount - previousOrderCount) / previousOrderCount : 0;
  
  // Get active customers in period
  const activeCustomers = new Set(filteredOrders.map(order => order.customerId)).size;
  
  // Get new customers in period
  const newCustomers = db.customers.filter(customer => 
    isDateInRange(customer.createdAt, startDate, endDate)
  ).length;
  
  return {
    totalRevenue,
    orderCount,
    averageOrderValue,
    revenueGrowth,
    orderCountGrowth,
    activeCustomers,
    newCustomers
  };
};