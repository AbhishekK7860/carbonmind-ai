-- Phase 1: Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emission_factors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. USERS TABLE
CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

-- 2. CARBON PROFILES TABLE
CREATE POLICY "Users can read own profile" ON public.carbon_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.carbon_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.carbon_profiles FOR UPDATE USING (auth.uid() = user_id);

-- 3. EMISSION FACTORS TABLE (Global Dictionary)
CREATE POLICY "Anyone can read emission factors" ON public.emission_factors FOR SELECT USING (true);
-- No insert/update/delete policies; only admin can modify.

-- 3.5 CONVERSION CONSTANTS TABLE (Global Dictionary)
CREATE POLICY "Anyone can read conversion constants" ON public.conversion_constants FOR SELECT USING (true);
-- No insert/update/delete policies; only admin can modify.

-- 4. ACTIVITY LOGS TABLE
CREATE POLICY "Users can manage own activity logs" ON public.activity_logs FOR ALL USING (auth.uid() = user_id);

-- 5. CARBON CALCULATIONS TABLE
-- Activity log id belongs to the user
CREATE POLICY "Users can read own carbon calculations" ON public.carbon_calculations FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.activity_logs WHERE id = activity_log_id AND user_id = auth.uid())
);
CREATE POLICY "Users can insert own carbon calculations" ON public.carbon_calculations FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.activity_logs WHERE id = activity_log_id AND user_id = auth.uid())
);

-- 6. RECOMMENDATIONS TABLE
CREATE POLICY "Users can manage own recommendations" ON public.recommendations FOR ALL USING (auth.uid() = user_id);

-- 7. ECO CHALLENGES TABLE (Global Dictionary)
CREATE POLICY "Anyone can read eco challenges" ON public.eco_challenges FOR SELECT USING (true);

-- 8. USER CHALLENGES TABLE
CREATE POLICY "Users can manage own user challenges" ON public.user_challenges FOR ALL USING (auth.uid() = user_id);

-- 9. ACHIEVEMENTS TABLE (Global Dictionary)
CREATE POLICY "Anyone can read achievements" ON public.achievements FOR SELECT USING (true);

-- 10. USER ACHIEVEMENTS TABLE
CREATE POLICY "Users can manage own user achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);

-- 11. WEEKLY REPORTS TABLE
CREATE POLICY "Users can read own weekly reports" ON public.weekly_reports FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own weekly reports" ON public.weekly_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 12. NOTIFICATIONS TABLE
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- 13. AUDIT LOGS TABLE
-- Users can only insert audit logs for themselves, but only system/admin should be able to read all.
-- To allow testing/verification we allow reading own logs.
CREATE POLICY "Users can insert own audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own audit logs" ON public.audit_logs FOR SELECT USING (auth.uid() = user_id);
