import { supabase } from '../supabase';

export async function checkTables() {
  // Check if tables exist by attempting to count rows
  const { data: servicesCount, error: servicesError } = await supabase
    .from('servicos_dummy')
    .select('count');

  if (servicesError) {
    console.error('Error checking servicos_dummy table:', servicesError.message);
  }

  const { data: clientsCount, error: clientsError } = await supabase
    .from('clientes_dummy')
    .select('count');

  if (clientsError) {
    console.error('Error checking clientes_dummy table:', clientsError.message);
  }

  // If both tables have errors, something is wrong with the setup
  if (servicesError && clientsError) {
    throw new Error('Could not access required tables. Please check database configuration.');
  }
}