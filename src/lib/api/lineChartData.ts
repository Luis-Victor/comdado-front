import { supabase } from '../supabase';
import { checkTables } from './checkTables';

export interface LineChartDataPoint {
  month: string;
  total_clients: number;
  active_services: number;
  revenue: number;
}

function parseTextDate(dateStr: string): Date {
  // Split the date string into parts (assuming format DD/MM/YYYY)
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day); // month is 0-based in JavaScript
}

function getColumnValue(row: any, possibleNames: string[]): string | undefined {
  for (const name of possibleNames) {
    if (row[name] !== undefined) {
      return row[name];
    }
  }
  return undefined;
}

export async function fetchLineChartData(): Promise<LineChartDataPoint[]> {
  try {
    // First check tables
    await checkTables();

    // Get services data
    const { data: servicesData, error: servicesError } = await supabase
      .from('servicos_dummy')
      .select('*');

    if (servicesError) {
      console.error('Error fetching services data:', servicesError);
      throw servicesError;
    }

    // Get clients data
    const { data: clientsData, error: clientsError } = await supabase
      .from('clientes_dummy')
      .select('*');

    if (clientsError) {
      console.error('Error fetching clients data:', clientsError);
      throw clientsError;
    }

    // Process the data to group by month
    const monthlyData = new Map<string, LineChartDataPoint>();

    // Initialize with all months from the current year
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    months.forEach(month => {
      monthlyData.set(month, {
        month,
        total_clients: 0,
        active_services: 0,
        revenue: 0
      });
    });

    // Process clients data
    if (clientsData) {
      clientsData.forEach(client => {
        try {
          const cadastrado = getColumnValue(client, ['cadastrado', 'Cadastrado']);
          
          if (!cadastrado) {
            console.warn('Client missing Cadastrado date:', client);
            return;
          }

          const date = parseTextDate(cadastrado);
          const month = months[date.getMonth()];
          const currentData = monthlyData.get(month)!;
          currentData.total_clients++;
        } catch (error) {
          console.error('Error processing client:', client, error);
        }
      });
    }

    // Process services data
    if (servicesData) {
      servicesData.forEach(service => {
        try {
          const dataComanda = getColumnValue(service, ['data_comanda', 'Data Comanda', 'Data_Comanda']);
          const valor = getColumnValue(service, ['valor', 'Valor']);
          
          if (!dataComanda || !valor) {
            console.warn('Service missing required data:', service);
            return;
          }

          const date = parseTextDate(dataComanda);
          const month = months[date.getMonth()];
          const currentData = monthlyData.get(month)!;
          currentData.active_services++;

          // Handle different possible formats of the valor field
          let revenueValue = valor;
          if (typeof valor === 'string') {
            revenueValue = valor
              .replace('R$', '')
              .replace(/\./g, '')
              .replace(',', '.')
              .trim();
          }

          const parsedRevenue = parseFloat(revenueValue);
          if (!isNaN(parsedRevenue)) {
            currentData.revenue += parsedRevenue;
          } else {
            console.warn('Invalid revenue value:', valor);
          }
        } catch (error) {
          console.error('Error processing service:', service, error);
        }
      });
    }

    const result = Array.from(monthlyData.values())
      .sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));
    
    return result;
  } catch (error) {
    console.error('Error in fetchLineChartData:', error);
    throw error;
  }
}