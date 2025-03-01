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
export function getMarketingCampaigns() {
  // Fixed marketing campaign data with varied CTR values
  const campaigns = [
    {
      id: 'MC-1',
      campaign: 'Summer Sale 2024',
      channel: 'facebook',
      date: '2024-03-15T10:00:00Z',
      status: 'active',
      impressions: 250000,
      clicks: 17500,  // 7% CTR
      conversions: 875,
      spent: 5000,
      revenue: 25000
    },
    {
      id: 'MC-2',
      campaign: 'Spring Collection Launch',
      channel: 'instagram',
      date: '2024-03-10T09:00:00Z',
      status: 'active',
      impressions: 180000,
      clicks: 10800,  // 6% CTR
      conversions: 540,
      spent: 3500,
      revenue: 18000
    },
    {
      id: 'MC-3',
      campaign: 'Easter Special',
      channel: 'email',
      date: '2024-03-20T08:00:00Z',
      status: 'scheduled',
      impressions: 100000,
      clicks: 8000,   // 8% CTR
      conversions: 400,
      spent: 1500,
      revenue: 10000
    },
    {
      id: 'MC-4',
      campaign: 'Winter Clearance',
      channel: 'facebook',
      date: '2024-02-15T10:00:00Z',
      status: 'completed',
      impressions: 300000,
      clicks: 12000,  // 4% CTR
      conversions: 600,
      spent: 6000,
      revenue: 30000
    },
    {
      id: 'MC-5',
      campaign: 'Valentine\'s Day Special',
      channel: 'instagram',
      date: '2024-02-14T09:00:00Z',
      status: 'completed',
      impressions: 200000,
      clicks: 14000,  // 7% CTR
      conversions: 700,
      spent: 4000,
      revenue: 20000
    },
    {
      id: 'MC-6',
      campaign: 'New Year Sale',
      channel: 'email',
      date: '2024-01-01T08:00:00Z',
      status: 'completed',
      impressions: 150000,
      clicks: 9000,   // 6% CTR
      conversions: 450,
      spent: 2500,
      revenue: 15000
    },
    {
      id: 'MC-7',
      campaign: 'Back to School',
      channel: 'google',
      date: '2024-03-25T10:00:00Z',
      status: 'scheduled',
      impressions: 220000,
      clicks: 6600,   // 3% CTR
      conversions: 330,
      spent: 4500,
      revenue: 22000
    },
    {
      id: 'MC-8',
      campaign: 'Tech Gadgets Promo',
      channel: 'google',
      date: '2024-03-01T09:00:00Z',
      status: 'active',
      impressions: 280000,
      clicks: 11200,  // 4% CTR
      conversions: 560,
      spent: 5500,
      revenue: 28000
    },
    {
      id: 'MC-9',
      campaign: 'Home Office Essentials',
      channel: 'linkedin',
      date: '2024-02-28T08:00:00Z',
      status: 'completed',
      impressions: 120000,
      clicks: 3600,   // 3% CTR
      conversions: 180,
      spent: 3000,
      revenue: 12000
    },
    {
      id: 'MC-10',
      campaign: 'Fitness Equipment Sale',
      channel: 'facebook',
      date: '2024-03-05T10:00:00Z',
      status: 'active',
      impressions: 260000,
      clicks: 15600,  // 6% CTR
      conversions: 780,
      spent: 5200,
      revenue: 26000
    },
    {
      id: 'MC-11',
      campaign: 'Spring Fashion Week',
      channel: 'instagram',
      date: '2024-03-30T09:00:00Z',
      status: 'scheduled',
      impressions: 240000,
      clicks: 16800,  // 7% CTR
      conversions: 840,
      spent: 4800,
      revenue: 24000
    },
    {
      id: 'MC-12',
      campaign: 'Home Decor Collection',
      channel: 'pinterest',
      date: '2024-03-12T08:00:00Z',
      status: 'active',
      impressions: 160000,
      clicks: 12800,  // 8% CTR
      conversions: 640,
      spent: 3200,
      revenue: 16000
    },
    {
      id: 'MC-13',
      campaign: 'Mother\'s Day Preview',
      channel: 'email',
      date: '2024-04-01T10:00:00Z',
      status: 'scheduled',
      impressions: 190000,
      clicks: 7600,   // 4% CTR
      conversions: 380,
      spent: 3800,
      revenue: 19000
    },
    {
      id: 'MC-14',
      campaign: 'Weekend Flash Sale',
      channel: 'facebook',
      date: '2024-03-08T09:00:00Z',
      status: 'completed',
      impressions: 210000,
      clicks: 10500,  // 5% CTR
      conversions: 525,
      spent: 4200,
      revenue: 21000
    },
    {
      id: 'MC-15',
      campaign: 'Premium Membership Drive',
      channel: 'linkedin',
      date: '2024-03-18T08:00:00Z',
      status: 'active',
      impressions: 140000,
      clicks: 4200,   // 3% CTR
      conversions: 210,
      spent: 2800,
      revenue: 14000
    }
  ];

  return campaigns;
}

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
export function getInventoryStatus() {
  // Fixed products data
  const allProducts = [
    // Electronics
    {
      id: 'PROD-1',
      name: 'Smartphone X12',
      category: 'Electronics',
      inventoryCount: 45,
      price: 899,
      reorderLevel: 20,
      sku: 'ELEC-SP12',
      lastUpdated: '2024-03-15T10:00:00Z'
    },
    {
      id: 'PROD-2',
      name: 'Laptop Pro 15"',
      category: 'Electronics',
      inventoryCount: 12,
      price: 1299,
      reorderLevel: 15,
      sku: 'ELEC-LP15',
      lastUpdated: '2024-03-14T15:30:00Z'
    },
    {
      id: 'PROD-3',
      name: 'Wireless Earbuds',
      category: 'Electronics',
      inventoryCount: 78,
      price: 159,
      reorderLevel: 30,
      sku: 'ELEC-WE01',
      lastUpdated: '2024-03-16T09:15:00Z'
    },
    // Clothing
    {
      id: 'PROD-4',
      name: 'Classic Denim Jeans',
      category: 'Clothing',
      inventoryCount: 95,
      price: 79,
      reorderLevel: 40,
      sku: 'CLO-DJ01',
      lastUpdated: '2024-03-15T11:20:00Z'
    },
    {
      id: 'PROD-5',
      name: 'Cotton T-Shirt',
      category: 'Clothing',
      inventoryCount: 150,
      price: 29,
      reorderLevel: 50,
      sku: 'CLO-TS01',
      lastUpdated: '2024-03-16T08:45:00Z'
    },
    {
      id: 'PROD-6',
      name: 'Winter Jacket',
      category: 'Clothing',
      inventoryCount: 8,
      price: 199,
      reorderLevel: 15,
      sku: 'CLO-WJ01',
      lastUpdated: '2024-03-14T16:40:00Z'
    },
    // Books
    {
      id: 'PROD-7',
      name: 'Programming Guide 2024',
      category: 'Books',
      inventoryCount: 0,
      price: 49,
      reorderLevel: 25,
      sku: 'BOOK-PG24',
      lastUpdated: '2024-03-13T14:20:00Z'
    },
    {
      id: 'PROD-8',
      name: 'Business Strategy',
      category: 'Books',
      inventoryCount: 35,
      price: 39,
      reorderLevel: 20,
      sku: 'BOOK-BS01',
      lastUpdated: '2024-03-15T13:10:00Z'
    },
    {
      id: 'PROD-9',
      name: 'Cooking Masterclass',
      category: 'Books',
      inventoryCount: 42,
      price: 45,
      reorderLevel: 25,
      sku: 'BOOK-CM01',
      lastUpdated: '2024-03-16T10:30:00Z'
    },
    // Home & Garden
    {
      id: 'PROD-10',
      name: 'Garden Tool Set',
      category: 'Home & Garden',
      inventoryCount: 25,
      price: 89,
      reorderLevel: 20,
      sku: 'HG-GTS01',
      lastUpdated: '2024-03-15T09:50:00Z'
    },
    {
      id: 'PROD-11',
      name: 'Smart Plant Pot',
      category: 'Home & Garden',
      inventoryCount: 5,
      price: 59,
      reorderLevel: 15,
      sku: 'HG-SPP01',
      lastUpdated: '2024-03-14T11:25:00Z'
    },
    {
      id: 'PROD-12',
      name: 'LED Grow Light',
      category: 'Home & Garden',
      inventoryCount: 18,
      price: 129,
      reorderLevel: 20,
      sku: 'HG-LGL01',
      lastUpdated: '2024-03-16T12:15:00Z'
    },
    // Sports
    {
      id: 'PROD-13',
      name: 'Yoga Mat Premium',
      category: 'Sports',
      inventoryCount: 55,
      price: 49,
      reorderLevel: 30,
      sku: 'SPT-YM01',
      lastUpdated: '2024-03-15T14:40:00Z'
    },
    {
      id: 'PROD-14',
      name: 'Running Shoes Pro',
      category: 'Sports',
      inventoryCount: 3,
      price: 159,
      reorderLevel: 25,
      sku: 'SPT-RS01',
      lastUpdated: '2024-03-14T13:55:00Z'
    },
    {
      id: 'PROD-15',
      name: 'Fitness Tracker',
      category: 'Sports',
      inventoryCount: 28,
      price: 129,
      reorderLevel: 20,
      sku: 'SPT-FT01',
      lastUpdated: '2024-03-16T11:05:00Z'
    }
  ];

  // Filter products needing restock (inventory count <= reorder level)
  const needsRestocking = allProducts.filter(p => p.inventoryCount <= p.reorderLevel);

  // Calculate inventory levels
  const inventoryLevels = {
    outOfStock: allProducts.filter(p => p.inventoryCount === 0).length,
    low: allProducts.filter(p => p.inventoryCount > 0 && p.inventoryCount < 10).length,
    medium: allProducts.filter(p => p.inventoryCount >= 10 && p.inventoryCount < 50).length,
    high: allProducts.filter(p => p.inventoryCount >= 50).length
  };

  return {
    inventoryLevels,
    needsRestocking,
    allProducts,
    totalProducts: allProducts.length,
    totalInventory: allProducts.reduce((sum, p) => sum + p.inventoryCount, 0),
    inventoryValue: allProducts.reduce((sum, p) => sum + (p.price * p.inventoryCount), 0)
  };
}

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

// Get available date range from the database
export const getAvailableDates = () => {
  const db = getMockDatabase();
  
  // Get min and max dates from orders
  let minDate = new Date();
  let maxDate = new Date(2000, 0, 1); // Start with old date
  
  db.orders.forEach(order => {
    if (order.orderDate < minDate) {
      minDate = order.orderDate;
    }
    if (order.orderDate > maxDate) {
      maxDate = order.orderDate;
    }
  });
  
  return {
    min: format(minDate, 'yyyy-MM-dd'),
    max: format(maxDate, 'yyyy-MM-dd')
  };
};

// Get available product categories from the database
export const getAvailableCategories = () => {
  const db = getMockDatabase();
  
  // Extract unique categories
  const uniqueCategories = new Set<string>();
  
  db.products.forEach(product => {
    uniqueCategories.add(product.category);
  });
  
  // Convert to array of options
  return Array.from(uniqueCategories)
    .sort()
    .map(category => ({
      value: category,
      label: category
    }));
};

// Get available categories for Sales Dashboard
export const getSalesCategories = () => {
  const db = getMockDatabase();
  
  // Extract unique categories that have sales data
  const categoriesWithSales = new Set<string>();
  
  // Get all products that have been ordered
  const productIds = new Set<string>();
  db.orderItems.forEach(item => {
    productIds.add(item.productId);
  });
  
  // Get categories of products that have been ordered
  db.products
    .filter(product => productIds.has(product.id))
    .forEach(product => {
      categoriesWithSales.add(product.category);
    });
  
  // Convert to array of options
  return Array.from(categoriesWithSales)
    .sort()
    .map(category => ({
      value: category,
      label: category
    }));
};

// Get available inventory status options for Inventory Dashboard
export const getInventoryStatusOptions = () => {
  return [
    { value: 'outOfStock', label: 'Out of Stock' },
    { value: 'low', label: 'Low Stock' },
    { value: 'medium', label: 'Medium Stock' },
    { value: 'high', label: 'High Stock' }
  ];
};

// Get available marketing channels for Marketing Dashboard
export const getMarketingChannels = () => {
  const db = getMockDatabase();
  
  // Extract unique marketing channels
  const uniqueChannels = new Set<string>();
  
  db.marketingCampaigns.forEach(campaign => {
    uniqueChannels.add(campaign.channel);
  });
  
  // Convert to array of options
  return Array.from(uniqueChannels)
    .sort()
    .map(channel => ({
      value: channel,
      label: channel.charAt(0).toUpperCase() + channel.slice(1) // Capitalize first letter
    }));
};