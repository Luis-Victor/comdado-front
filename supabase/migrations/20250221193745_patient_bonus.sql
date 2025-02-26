/*
  # Add RLS policies for analytics tables

  1. Security Changes
    - Enable RLS on servicos_dummy and clientes_dummy tables
    - Add policies to allow authenticated users to read data
    - These are read-only tables for analytics purposes

  2. Notes
    - All authenticated users can read data
    - Tables are read-only through the API
    - No insert/update/delete policies needed as this is for analytics only
*/

-- Enable RLS
ALTER TABLE servicos_dummy ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes_dummy ENABLE ROW LEVEL SECURITY;

-- Policies for servicos_dummy
CREATE POLICY "Allow authenticated users to read services"
  ON servicos_dummy
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for clientes_dummy
CREATE POLICY "Allow authenticated users to read clients"
  ON clientes_dummy
  FOR SELECT
  TO authenticated
  USING (true);