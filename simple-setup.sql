-- Simple table creation for Lucky645
CREATE TABLE lotto_results (
  round INTEGER PRIMARY KEY,
  date DATE NOT NULL,
  num1 INTEGER NOT NULL,
  num2 INTEGER NOT NULL,
  num3 INTEGER NOT NULL,
  num4 INTEGER NOT NULL,
  num5 INTEGER NOT NULL,
  num6 INTEGER NOT NULL,
  bonus INTEGER NOT NULL,
  first_prize BIGINT NOT NULL DEFAULT 0,
  first_winners INTEGER NOT NULL DEFAULT 0,
  second_prize BIGINT NOT NULL DEFAULT 0,
  second_winners INTEGER NOT NULL DEFAULT 0,
  third_prize BIGINT NOT NULL DEFAULT 0,
  third_winners INTEGER NOT NULL DEFAULT 0
);

-- Add sample data
INSERT INTO lotto_results (round, date, num1, num2, num3, num4, num5, num6, bonus, first_prize, first_winners, second_prize, second_winners, third_prize, third_winners) VALUES 
(1174, '2024-12-28', 8, 15, 25, 33, 39, 45, 12, 2500000000, 12, 55000000, 89, 1500000, 2567),
(1173, '2024-12-21', 3, 11, 19, 28, 35, 42, 7, 2800000000, 8, 62000000, 124, 1500000, 3124),
(1172, '2024-12-14', 5, 12, 18, 24, 41, 44, 33, 1800000000, 15, 45000000, 156, 1500000, 4231);