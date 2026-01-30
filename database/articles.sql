-- Create articles table (Supabase/PostgreSQL)
CREATE TABLE articles (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    body            TEXT,
    indicator       INTEGER DEFAULT 0,
    source          VARCHAR(255) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    language_code   VARCHAR(5) NOT NULL
);

COMMENT ON TABLE articles IS 'Stores article information';
COMMENT ON COLUMN articles.id IS 'Unique identifier for the article';
COMMENT ON COLUMN articles.title IS 'Title of the article';
COMMENT ON COLUMN articles.body IS 'Article body content';
COMMENT ON COLUMN articles.source IS 'Source of the article';
COMMENT ON COLUMN articles.created_at IS 'Record creation timestamp with timezone';
COMMENT ON COLUMN articles.language_code IS 'ISO 639-1 language code (e.g., EN, FR, DE)';
