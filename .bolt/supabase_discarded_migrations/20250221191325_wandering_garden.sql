/*
  # Create line chart data table

  1. New Tables
    - `line_chart_data`
      - `id` (uuid, primary key)
      - `month` (text, not null)
      - `series1` (numeric, not null)
      - `series2` (numeric, not null)
      - `series3` (numeric, not null)
      - `created_at` (timestamptz, default now())
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `line_chart_data` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
*/

CREATE TABLE IF NOT EXISTS line_chart_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month text NOT NULL,
  series1 numeric NOT NULL,
  series2 numeric NOT NULL,
  series3 numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE line_chart_data ENABLE ROW LEVEL SECURITY;

-- Policy to read own data
CREATE POLICY "Users can read own line chart data"
  ON line_chart_data
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy to insert own data
CREATE POLICY "Users can insert own line chart data"
  ON line_chart_data
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);