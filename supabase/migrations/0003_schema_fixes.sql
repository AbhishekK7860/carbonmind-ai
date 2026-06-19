-- Phase A: Schema Fixes
-- Fix user_challenges to have start_date / end_date columns to match app code
ALTER TABLE public.user_challenges 
  RENAME COLUMN started_at TO start_date;

ALTER TABLE public.user_challenges 
  ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ;

-- Fix achievements to have 'icon' as well as badge_icon_url for app compatibility
ALTER TABLE public.achievements
  ADD COLUMN IF NOT EXISTS icon TEXT DEFAULT '🌱';

-- Update existing achievement icons
UPDATE public.achievements SET icon = '🌱' WHERE title = 'Eco Beginner';
UPDATE public.achievements SET icon = '⚔️' WHERE title = 'Green Warrior';
UPDATE public.achievements SET icon = '🏆' WHERE title = 'Climate Champion';
UPDATE public.achievements SET icon = '🌍' WHERE title = 'Earth Guardian';

-- Add xp column to user_achievements for tracking
ALTER TABLE public.carbon_profiles
  ADD COLUMN IF NOT EXISTS total_xp INT DEFAULT 0;
