-- Add video_id column to lotto_results table
-- Run this in Supabase SQL Editor
ALTER TABLE lotto_results ADD COLUMN IF NOT EXISTS video_id TEXT;
