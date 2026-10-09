-- AI Reports Table for Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE ai_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    child_name TEXT NOT NULL,
    report_data JSONB NOT NULL, -- Stores the full AI report JSON
    summary TEXT,
    strengths TEXT[],
    improvements TEXT[],
    weekly_plan TEXT[],
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    model_used TEXT DEFAULT 'nvidia/nemotron-3-5-lightning'
);

-- Enable RLS
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own AI reports" ON ai_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI reports" ON ai_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_ai_reports_user_id ON ai_reports(user_id);
CREATE INDEX idx_ai_reports_generated_at ON ai_reports(generated_at DESC);

-- Optional: Add to user_stats view or create a new view for reports
CREATE VIEW user_ai_reports AS
SELECT 
    ar.id,
    ar.user_id,
    ar.child_name,
    ar.summary,
    ar.strengths,
    ar.improvements,
    ar.weekly_plan,
    ar.generated_at,
    ar.model_used
FROM ai_reports ar;

GRANT SELECT ON user_ai_reports TO authenticated;