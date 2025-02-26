/*
  # Create dummy tables for services and clients

  1. New Tables
    - `servicos_dummy`
      - `id` (uuid, primary key)
      - `data_comanda` (text, for date in DD/MM/YYYY format)
      - `valor` (text, for monetary value)
      - `created_at` (timestamp)
    
    - `clientes_dummy`
      - `id` (uuid, primary key)
      - `cadastrado` (text, for date in DD/MM/YYYY format)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read data
*/

-- Create servicos_dummy table
CREATE TABLE IF NOT EXISTS servicos_dummy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data_comanda text NOT NULL,
  valor text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create clientes_dummy table
CREATE TABLE IF NOT EXISTS clientes_dummy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cadastrado text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE servicos_dummy ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes_dummy ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to authenticated users for servicos_dummy"
  ON servicos_dummy
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow read access to authenticated users for clientes_dummy"
  ON clientes_dummy
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO servicos_dummy (data_comanda, valor)
VALUES 
  ('01/01/2024', 'R$ 150,00'),
  ('15/01/2024', 'R$ 200,00'),
  ('01/02/2024', 'R$ 175,00'),
  ('15/02/2024', 'R$ 225,00');

INSERT INTO clientes_dummy (cadastrado)
VALUES 
  ('01/01/2024'),
  ('15/01/2024'),
  ('01/02/2024'),
  ('15/02/2024');