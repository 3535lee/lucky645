-- Create the lotto_results table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS lotto_results (
  round INTEGER PRIMARY KEY,
  date DATE NOT NULL,
  num1 INTEGER NOT NULL CHECK (num1 >= 1 AND num1 <= 45),
  num2 INTEGER NOT NULL CHECK (num2 >= 1 AND num2 <= 45),
  num3 INTEGER NOT NULL CHECK (num3 >= 1 AND num3 <= 45),
  num4 INTEGER NOT NULL CHECK (num4 >= 1 AND num4 <= 45),
  num5 INTEGER NOT NULL CHECK (num5 >= 1 AND num5 <= 45),
  num6 INTEGER NOT NULL CHECK (num6 >= 1 AND num6 <= 45),
  bonus INTEGER NOT NULL CHECK (bonus >= 1 AND bonus <= 45),
  first_prize BIGINT NOT NULL DEFAULT 0,
  first_winners INTEGER NOT NULL DEFAULT 0,
  second_prize BIGINT NOT NULL DEFAULT 0,
  second_winners INTEGER NOT NULL DEFAULT 0,
  third_prize BIGINT NOT NULL DEFAULT 0,
  third_winners INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lotto_results_round ON lotto_results(round DESC);
CREATE INDEX IF NOT EXISTS idx_lotto_results_date ON lotto_results(date DESC);

-- Add some sample data for testing
INSERT INTO lotto_results (round, date, num1, num2, num3, num4, num5, num6, bonus, first_prize, first_winners, second_prize, second_winners, third_prize, third_winners) 
VALUES 
  (1174, '2024-12-28', 8, 15, 25, 33, 39, 45, 12, 2500000000, 12, 55000000, 89, 1500000, 2567),
  (1173, '2024-12-21', 3, 11, 19, 28, 35, 42, 7, 2800000000, 8, 62000000, 124, 1500000, 3124)
ON CONFLICT (round) DO NOTHING;