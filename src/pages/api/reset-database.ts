import { NextApiRequest, NextApiResponse } from 'next';
import { resetMockDatabase } from '../../lib/mockData/database';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('API: Resetting mock database...');
    const db = resetMockDatabase();
    console.log('API: Mock database reset complete');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Database reset successfully',
      data: {
        customers: db.customers.length,
        products: db.products.length,
        orders: db.orders.length,
        orderItems: db.orderItems.length
      }
    });
  } catch (error) {
    console.error('API: Error resetting mock database:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error resetting database',
      error: String(error)
    });
  }
} 