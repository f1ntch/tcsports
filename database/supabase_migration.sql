-- Supabase PostgreSQL Migration
-- Execute in order: tables are arranged by dependency

-- ============================================
-- Table: articles
-- ============================================
CREATE TABLE articles (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    source          VARCHAR(255) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    language_code   VARCHAR(5) NOT NULL
);

COMMENT ON TABLE articles IS 'Stores article information';
COMMENT ON COLUMN articles.id IS 'Unique identifier for the article';
COMMENT ON COLUMN articles.title IS 'Title of the article';
COMMENT ON COLUMN articles.source IS 'Source of the article';
COMMENT ON COLUMN articles.created_at IS 'Record creation timestamp with timezone';
COMMENT ON COLUMN articles.language_code IS 'ISO 639-1 language code (e.g., EN, FR, DE)';

-- ============================================
-- Table: article_media
-- ============================================
CREATE TABLE article_media (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_id      BIGINT NOT NULL,
    media_type      VARCHAR(50) NOT NULL,
    hyperlink       TEXT NOT NULL,
    CONSTRAINT fk_article_media_article 
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    CONSTRAINT chk_article_media_type 
        CHECK (media_type IN ('IMAGE', 'VIDEO', 'AUDIO'))
);

CREATE INDEX idx_article_media_article_id ON article_media(article_id);

COMMENT ON TABLE article_media IS 'Stores media references associated with articles';
COMMENT ON COLUMN article_media.id IS 'Unique identifier for the media record';
COMMENT ON COLUMN article_media.article_id IS 'Reference to parent article';
COMMENT ON COLUMN article_media.media_type IS 'Type of media: IMAGE, VIDEO, AUDIO';
COMMENT ON COLUMN article_media.hyperlink IS 'URL or path to the media resource';

-- ============================================
-- Table: tag_types
-- ============================================
CREATE TABLE tag_types (
    id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    VARCHAR(100) NOT NULL
);

COMMENT ON TABLE tag_types IS 'Lookup table for tag type categories';
COMMENT ON COLUMN tag_types.id IS 'Unique identifier for the tag type';
COMMENT ON COLUMN tag_types.name IS 'Name of the tag type';

-- ============================================
-- Table: article_tags
-- ============================================
CREATE TABLE article_tags (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_id      BIGINT NOT NULL,
    tag_type_id     BIGINT NOT NULL,
    tagname         VARCHAR(255) NOT NULL,
    CONSTRAINT fk_article_tags_article 
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    CONSTRAINT fk_article_tags_tag_type 
        FOREIGN KEY (tag_type_id) REFERENCES tag_types(id) ON DELETE RESTRICT
);

CREATE INDEX idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX idx_article_tags_tag_type_id ON article_tags(tag_type_id);

COMMENT ON TABLE article_tags IS 'Associates tags with articles';
COMMENT ON COLUMN article_tags.id IS 'Unique identifier for the article tag';
COMMENT ON COLUMN article_tags.article_id IS 'Reference to parent article';
COMMENT ON COLUMN article_tags.tag_type_id IS 'Reference to tag type category';
COMMENT ON COLUMN article_tags.tagname IS 'Tag value/label';

-- ============================================
-- Enable Row Level Security (Supabase best practice)
-- Uncomment and customize policies as needed
-- ============================================
-- ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE article_media ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE tag_types ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
