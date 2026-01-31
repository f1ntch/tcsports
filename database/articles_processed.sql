-- Create articles_processed table for multilingual content
CREATE TABLE articles_processed (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_id      BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    language_code   VARCHAR(5) NOT NULL,
    title           TEXT NOT NULL,
    summary         TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_articles_processed UNIQUE (article_id, language_code)
);

CREATE INDEX idx_articles_processed_article_id ON articles_processed(article_id);
CREATE INDEX idx_articles_processed_language ON articles_processed(language_code);

COMMENT ON TABLE articles_processed IS 'Stores translated article content in multiple languages';
COMMENT ON COLUMN articles_processed.article_id IS 'Reference to original article';
COMMENT ON COLUMN articles_processed.language_code IS 'ISO 639-1 language code (en, nl, fr)';
COMMENT ON COLUMN articles_processed.title IS 'Translated title';
COMMENT ON COLUMN articles_processed.summary IS 'Translated summary';

-- RLS Policy
ALTER TABLE articles_processed ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles processed are publicly readable" ON articles_processed
    FOR SELECT USING (true);

