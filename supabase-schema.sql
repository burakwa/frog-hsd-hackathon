# Supabase Database Schema
# Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    ad TEXT NOT NULL,
    yas INTEGER,
    avatar TEXT DEFAULT 'kurbaga',
    toplam_yildiz INTEGER DEFAULT 0,
    seviye INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Game sessions table
CREATE TABLE game_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    oyun TEXT CHECK (oyun IN ('ses-tekrari', 'hece-avi', 'cumle-soyle', 'sesli-masal')) NOT NULL,
    skor INTEGER NOT NULL DEFAULT 0,
    yildiz INTEGER NOT NULL DEFAULT 0,
    sure_saniye INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for game_sessions
CREATE POLICY "Users can view own sessions" ON game_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON game_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Badges table
CREATE TABLE badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    badge_id TEXT NOT NULL, -- e.g., 'first_word', 'star_collector', etc.
    kazanildi BOOLEAN DEFAULT FALSE,
    kazanildigi_tarih TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Enable RLS
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges" ON badges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges" ON badges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own badges" ON badges
    FOR UPDATE USING (auth.uid() = user_id);

-- 4. Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, ad, avatar)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'ad', COALESCE(NEW.raw_user_meta_data->>'avatar', 'kurbaga'))
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Function to update stars and level
CREATE OR REPLACE FUNCTION update_user_progress(user_uuid UUID, new_stars INTEGER)
RETURNS VOID AS $$
DECLARE
    current_stars INTEGER;
    new_level INTEGER;
BEGIN
    -- Get current stars
    SELECT toplam_yildiz INTO current_stars FROM profiles WHERE id = user_uuid;
    
    -- Calculate new total
    IF current_stars IS NULL THEN
        current_stars := 0;
    END IF;
    
    -- Calculate new level (every 10 stars = 1 level)
    new_level := FLOOR((current_stars + new_stars) / 10) + 1;
    
    -- Update profile
    UPDATE profiles 
    SET 
        toplam_yildiz = current_stars + new_stars,
        seviye = new_level,
        updated_at = NOW()
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Indexes for performance
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_created_at ON game_sessions(created_at DESC);
CREATE INDEX idx_game_sessions_oyun ON game_sessions(oyun);
CREATE INDEX idx_badges_user_id ON badges(user_id);

-- 8. View for user stats
CREATE VIEW user_stats AS
SELECT 
    p.id,
    p.ad,
    p.avatar,
    p.toplam_yildiz,
    p.seviye,
    COUNT(gs.id) as total_sessions,
    COALESCE(SUM(gs.skor), 0) as total_score,
    COALESCE(SUM(gs.sure_saniye), 0) as total_time_seconds,
    MAX(gs.created_at) as last_played
FROM profiles p
LEFT JOIN game_sessions gs ON p.id = gs.user_id
GROUP BY p.id, p.ad, p.avatar, p.toplam_yildiz, p.seviye;

-- Grant permissions
GRANT SELECT ON user_stats TO authenticated;