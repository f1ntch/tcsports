-- Create articles table
CREATE TABLE articles (
    id              NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title           VARCHAR2(255) NOT NULL,
    source          VARCHAR2(255) NOT NULL,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP NOT NULL,
    language_code   VARCHAR2(5) NOT NULL
);

-- Add comments for documentation
COMMENT ON TABLE articles IS 'Stores article information';
COMMENT ON COLUMN articles.id IS 'Unique identifier for the article';
COMMENT ON COLUMN articles.title IS 'Title of the article';
COMMENT ON COLUMN articles.source IS 'Source of the article';
COMMENT ON COLUMN articles.created_at IS 'Record creation timestamp with timezone';
COMMENT ON COLUMN articles.language_code IS 'ISO 639-1 language code (e.g., EN, FR, DE)';
