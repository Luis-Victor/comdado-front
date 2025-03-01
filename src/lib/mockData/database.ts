import { v4 as uuidv4 } from 'uuid';

// Define types for our database entities
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: Date;
  isActive: boolean;
  customerSegment: 'retail' | 'wholesale' | 'online' | 'corporate';
  totalSpent: number;
  lastPurchaseDate: Date | null;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  price: number;
  cost: number;
  sku: string;
  inventoryCount: number;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  rating: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  customerId: string;
  orderDate: Date;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  tax: number;
  shipping: number;
  discount: number;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer' | 'cash';
  shippingAddress: string;
  notes: string;
  trackingNumber: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  discount: number;
  total: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  hireDate: Date;
  salary: number;
  isActive: boolean;
  managerId: string | null;
  performanceRating: number;
}

export interface Marketing {
  id: string;
  campaignName: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  channel: 'email' | 'social' | 'search' | 'display' | 'tv' | 'radio' | 'print';
  targetAudience: string;
  impressions: number;
  clicks: number;
  conversions: number;
  roi: number;
}

// Helper functions to generate random data
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomFloat = (min: number, max: number, decimals: number = 2): number => {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
};

const randomElement = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomBoolean = (trueProb: number = 0.5): boolean => {
  return Math.random() < trueProb;
};

// Generate mock data
const generateCustomers = (count: number): Customer[] => {
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Susan', 'Richard', 'Jessica', 'Joseph', 'Sarah', 'Thomas', 'Karen', 'Charles', 'Nancy'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'San Francisco', 'Charlotte', 'Indianapolis', 'Seattle', 'Denver', 'Boston'];
  const states = ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'TX', 'CA', 'TX', 'CA', 'TX', 'FL', 'TX', 'OH', 'CA', 'NC', 'IN', 'WA', 'CO', 'MA'];
  const segments = ['retail', 'wholesale', 'online', 'corporate'] as Array<'retail' | 'wholesale' | 'online' | 'corporate'>;
  
  const customers: Customer[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const city = randomElement(cities);
    const state = states[cities.indexOf(city)];
    const createdAt = randomDate(new Date(2020, 0, 1), new Date());
    const lastPurchaseDate = randomBoolean(0.9) ? randomDate(createdAt, new Date()) : null;
    
    customers.push({
      id: uuidv4(),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      phone: `(${randomInt(100, 999)}) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
      address: `${randomInt(100, 9999)} ${randomElement(['Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm'])} ${randomElement(['St', 'Ave', 'Blvd', 'Rd', 'Ln', 'Dr'])}`,
      city,
      state,
      zipCode: `${randomInt(10000, 99999)}`,
      country: 'USA',
      createdAt,
      isActive: randomBoolean(0.85),
      customerSegment: randomElement(segments),
      totalSpent: randomFloat(0, 10000, 2),
      lastPurchaseDate
    });
  }
  
  return customers;
};

const generateProducts = (count: number): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Beauty', 'Food', 'Automotive', 'Health'];
  const subcategories: Record<string, string[]> = {
    'Electronics': ['Smartphones', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Accessories'],
    'Clothing': ['Men', 'Women', 'Children', 'Shoes', 'Accessories', 'Activewear'],
    'Home & Garden': ['Furniture', 'Decor', 'Kitchen', 'Bedding', 'Garden', 'Lighting'],
    'Sports': ['Fitness', 'Outdoor', 'Team Sports', 'Water Sports', 'Winter Sports', 'Accessories'],
    'Books': ['Fiction', 'Non-Fiction', 'Children', 'Educational', 'Comics', 'Magazines'],
    'Toys': ['Action Figures', 'Dolls', 'Educational', 'Games', 'Outdoor', 'Puzzles'],
    'Beauty': ['Skincare', 'Makeup', 'Hair Care', 'Fragrance', 'Bath & Body', 'Tools'],
    'Food': ['Snacks', 'Beverages', 'Canned Goods', 'Baking', 'Condiments', 'Organic'],
    'Automotive': ['Parts', 'Accessories', 'Tools', 'Electronics', 'Exterior', 'Interior'],
    'Health': ['Vitamins', 'Supplements', 'Personal Care', 'Medical Supplies', 'Fitness', 'Wellness']
  };
  
  const productNames: Record<string, string[]> = {
    'Smartphones': ['iPhone Pro', 'Galaxy S', 'Pixel Pro', 'OnePlus', 'Xiaomi Mi'],
    'Laptops': ['MacBook Pro', 'ThinkPad X1', 'XPS 13', 'Spectre x360', 'Surface Laptop'],
    'Men': ['Classic Shirt', 'Slim Jeans', 'Wool Sweater', 'Leather Jacket', 'Casual Polo'],
    'Women': ['Summer Dress', 'Skinny Jeans', 'Blouse', 'Cardigan', 'Maxi Skirt'],
    'Furniture': ['Sofa', 'Coffee Table', 'Bookshelf', 'Dining Set', 'Bed Frame'],
    'Fitness': ['Yoga Mat', 'Dumbbells', 'Resistance Bands', 'Exercise Bike', 'Treadmill']
  };
  
  const products: Product[] = [];
  
  for (let i = 0; i < count; i++) {
    const category = randomElement(categories);
    const subcategory = randomElement(subcategories[category]);
    
    let name = '';
    if (productNames[subcategory]) {
      name = randomElement(productNames[subcategory]);
    } else {
      name = `${randomElement(['Premium', 'Basic', 'Pro', 'Ultra', 'Essential'])} ${subcategory} ${randomElement(['Set', 'Kit', 'Pack', 'Bundle', 'Collection'])}`;
    }
    
    const createdAt = randomDate(new Date(2020, 0, 1), new Date());
    const updatedAt = randomDate(createdAt, new Date());
    const price = randomFloat(10, 1000, 2);
    
    products.push({
      id: uuidv4(),
      name,
      description: `High-quality ${name.toLowerCase()} for all your ${subcategory.toLowerCase()} needs.`,
      category,
      subcategory,
      price,
      cost: price * randomFloat(0.4, 0.7, 2),
      sku: `${category.substring(0, 3).toUpperCase()}-${subcategory.substring(0, 3).toUpperCase()}-${randomInt(1000, 9999)}`,
      inventoryCount: randomInt(0, 1000),
      isAvailable: randomBoolean(0.9),
      createdAt,
      updatedAt,
      rating: randomFloat(1, 5, 1),
      imageUrl: `https://source.unsplash.com/random/300x300/?${subcategory.toLowerCase().replace(' ', ',')}`
    });
  }
  
  return products;
};

const generateOrders = (count: number, customers: Customer[], products: Product[]): { orders: Order[], orderItems: OrderItem[] } => {
  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] as Array<'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>;
  const paymentMethods = ['credit_card', 'paypal', 'bank_transfer', 'cash'] as Array<'credit_card' | 'paypal' | 'bank_transfer' | 'cash'>;
  
  const orders: Order[] = [];
  const orderItems: OrderItem[] = [];
  
  // Ensure we have orders in the last year
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  for (let i = 0; i < count; i++) {
    const customer = randomElement(customers);
    // Generate more recent orders to ensure we have data in common date ranges
    const orderDate = randomDate(oneYearAgo, new Date());
    const status = randomElement(statuses);
    
    // Generate between 1 and 5 items per order
    const itemCount = randomInt(1, 5);
    const orderTotal = { subtotal: 0, tax: 0, shipping: 0, discount: 0 };
    
    const orderId = uuidv4();
    
    // Create order items
    for (let j = 0; j < itemCount; j++) {
      const product = randomElement(products);
      const quantity = randomInt(1, 5);
      const price = product.price;
      const discount = randomBoolean(0.3) ? price * randomFloat(0.05, 0.2, 2) : 0;
      const total = (price - discount) * quantity;
      
      orderItems.push({
        id: uuidv4(),
        orderId,
        productId: product.id,
        quantity,
        price,
        discount,
        total
      });
      
      orderTotal.subtotal += total;
    }
    
    // Calculate order totals
    orderTotal.tax = orderTotal.subtotal * 0.08;
    orderTotal.shipping = randomFloat(5, 25, 2);
    orderTotal.discount = randomBoolean(0.4) ? orderTotal.subtotal * randomFloat(0.05, 0.15, 2) : 0;
    
    const total = orderTotal.subtotal + orderTotal.tax + orderTotal.shipping - orderTotal.discount;
    
    orders.push({
      id: orderId,
      customerId: customer.id,
      orderDate,
      status,
      total,
      tax: orderTotal.tax,
      shipping: orderTotal.shipping,
      discount: orderTotal.discount,
      paymentMethod: randomElement(paymentMethods),
      shippingAddress: `${customer.address}, ${customer.city}, ${customer.state} ${customer.zipCode}`,
      notes: randomBoolean(0.2) ? 'Please leave package at the door.' : '',
      trackingNumber: status !== 'pending' && status !== 'processing' ? `TRK${randomInt(1000000, 9999999)}` : ''
    });
  }
  
  return { orders, orderItems };
};

const generateEmployees = (count: number): Employee[] => {
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'];
  const departments = ['Sales', 'Marketing', 'IT', 'HR', 'Finance', 'Operations', 'Customer Service', 'R&D'];
  const positions = {
    'Sales': ['Sales Representative', 'Sales Manager', 'Account Executive', 'Sales Director'],
    'Marketing': ['Marketing Specialist', 'Marketing Manager', 'Content Creator', 'SEO Specialist'],
    'IT': ['Software Developer', 'IT Support', 'System Administrator', 'IT Manager'],
    'HR': ['HR Specialist', 'Recruiter', 'HR Manager', 'Talent Acquisition'],
    'Finance': ['Accountant', 'Financial Analyst', 'Finance Manager', 'Controller'],
    'Operations': ['Operations Manager', 'Project Manager', 'Business Analyst', 'Operations Director'],
    'Customer Service': ['Customer Service Rep', 'Support Specialist', 'Customer Success Manager', 'Support Lead'],
    'R&D': ['Research Scientist', 'Product Developer', 'R&D Manager', 'Innovation Lead']
  };
  
  const employees: Employee[] = [];
  
  // First create managers
  for (let i = 0; i < departments.length; i++) {
    const department = departments[i];
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const position = positions[department as keyof typeof positions][randomInt(2, 3)]; // Higher positions for managers
    const hireDate = randomDate(new Date(2015, 0, 1), new Date(2020, 0, 1));
    
    employees.push({
      id: uuidv4(),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      department,
      position,
      hireDate,
      salary: randomInt(80000, 150000),
      isActive: true,
      managerId: null,
      performanceRating: randomFloat(3, 5, 1)
    });
  }
  
  // Then create regular employees with managers
  for (let i = departments.length; i < count; i++) {
    const department = randomElement(departments);
    const firstName = randomElement(firstNames);
    const lastName = randomElement(lastNames);
    const position = positions[department as keyof typeof positions][randomInt(0, 1)]; // Lower positions for regular employees
    const hireDate = randomDate(new Date(2018, 0, 1), new Date());
    
    // Find a manager for this department
    const departmentManagers = employees.filter(e => e.department === department && e.managerId === null);
    const manager = departmentManagers.length > 0 ? randomElement(departmentManagers) : null;
    
    employees.push({
      id: uuidv4(),
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      department,
      position,
      hireDate,
      salary: randomInt(40000, 80000),
      isActive: randomBoolean(0.9),
      managerId: manager ? manager.id : null,
      performanceRating: randomFloat(2, 5, 1)
    });
  }
  
  return employees;
};

const generateMarketingCampaigns = (count: number): Marketing[] => {
  const campaignNames = [
    'Summer Sale', 'Back to School', 'Holiday Special', 'Spring Collection', 'Black Friday',
    'Cyber Monday', 'New Year New You', 'Valentine\'s Day', 'Mother\'s Day', 'Father\'s Day',
    'Anniversary Sale', 'Customer Appreciation', 'Flash Sale', 'Clearance Event', 'Product Launch',
    'Brand Awareness', 'Loyalty Program', 'Referral Campaign', 'Reengagement', 'Welcome Series'
  ];
  
  const channels = ['email', 'social', 'search', 'display', 'tv', 'radio', 'print'] as Array<'email' | 'social' | 'search' | 'display' | 'tv' | 'radio' | 'print'>;
  const audiences = ['Young Adults', 'Parents', 'Professionals', 'Seniors', 'Students', 'Homeowners', 'Tech Enthusiasts', 'Fitness Enthusiasts', 'Luxury Shoppers', 'Budget Shoppers'];
  
  const campaigns: Marketing[] = [];
  
  for (let i = 0; i < count; i++) {
    const startDate = randomDate(new Date(2022, 0, 1), new Date());
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + randomInt(7, 90)); // Campaign duration between 1 week and 3 months
    
    const budget = randomFloat(5000, 100000, 2);
    const spent = randomFloat(budget * 0.7, budget, 2);
    const impressions = randomInt(10000, 1000000);
    const clicks = randomInt(100, impressions * 0.1);
    const conversions = randomInt(1, clicks * 0.2);
    const revenue = conversions * randomFloat(50, 200, 2);
    const roi = (revenue - spent) / spent;
    
    campaigns.push({
      id: uuidv4(),
      campaignName: randomElement(campaignNames),
      startDate,
      endDate,
      budget,
      spent,
      channel: randomElement(channels),
      targetAudience: randomElement(audiences),
      impressions,
      clicks,
      conversions,
      roi
    });
  }
  
  return campaigns;
};

// Generate the mock database
export const generateMockDatabase = () => {
  console.log("Generating mock database...");
  const customers = generateCustomers(100);
  const products = generateProducts(50);
  const { orders, orderItems } = generateOrders(500, customers, products);
  const employees = generateEmployees(30);
  const marketingCampaigns = generateMarketingCampaigns(20);
  
  console.log(`Generated mock database with ${customers.length} customers, ${products.length} products, ${orders.length} orders, ${orderItems.length} order items`);
  
  return {
    customers,
    products,
    orders,
    orderItems,
    employees,
    marketingCampaigns
  };
};

// Create a singleton instance of the database
let mockDatabase: ReturnType<typeof generateMockDatabase> | null = null;

export const getMockDatabase = () => {
  if (!mockDatabase) {
    console.log("Mock database not initialized, generating now...");
    mockDatabase = generateMockDatabase();
  }
  return mockDatabase;
};

// Reset the database (useful for testing)
export const resetMockDatabase = () => {
  console.log("Resetting mock database...");
  mockDatabase = null;
  const newDb = getMockDatabase();
  console.log("Mock database reset complete with data:", {
    customers: newDb.customers.length,
    products: newDb.products.length,
    orders: newDb.orders.length,
    orderItems: newDb.orderItems.length
  });
  return newDb;
};