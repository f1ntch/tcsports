-- Create user_articles table (PostgreSQL/Supabase)
-- Links users to articles (e.g., saved/bookmarked articles)
CREATE TABLE user_articles (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id      BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_articles UNIQUE (user_id, article_id)
);

-- Create indexes for query performance
CREATE INDEX idx_user_articles_user_id ON user_articles(user_id);
CREATE INDEX idx_user_articles_article_id ON user_articles(article_id);

-- Add comments for documentation
COMMENT ON TABLE user_articles IS 'Links users to saved/bookmarked articles';
COMMENT ON COLUMN user_articles.id IS 'Unique identifier for the user article record';
COMMENT ON COLUMN user_articles.user_id IS 'Reference to Supabase auth user';
COMMENT ON COLUMN user_articles.article_id IS 'Reference to saved article';
COMMENT ON COLUMN user_articles.created_at IS 'When the article was saved';

-- Enable Row Level Security
ALTER TABLE user_articles ENABLE ROW LEVEL SECURITY;

-- Users can only see/manage their own saved articles
CREATE POLICY "Users can view own saved articles" ON user_articles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save articles" ON user_articles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave articles" ON user_articles
    FOR DELETE USING (auth.uid() = user_id);
