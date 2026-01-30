-- Create user_interests table (PostgreSQL/Supabase)
CREATE TABLE user_interests (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sport_id    BIGINT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_interests UNIQUE (user_id, sport_id)
);

-- Create indexes for query performance
CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_interests_sport_id ON user_interests(sport_id);

-- Add comments for documentation
COMMENT ON TABLE user_interests IS 'Links users to their favorite sports';
COMMENT ON COLUMN user_interests.id IS 'Unique identifier for the user interest';
COMMENT ON COLUMN user_interests.user_id IS 'Reference to Supabase auth user';
COMMENT ON COLUMN user_interests.sport_id IS 'Reference to sport category';
COMMENT ON COLUMN user_interests.created_at IS 'When the interest was added';

-- Enable Row Level Security
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;

-- Users can only see/manage their own interests
CREATE POLICY "Users can view own interests" ON user_interests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interests" ON user_interests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interests" ON user_interests
    FOR DELETE USING (auth.uid() = user_id);
