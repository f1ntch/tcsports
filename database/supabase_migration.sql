-- Supabase PostgreSQL Migration
-- TCsports Hackathon Database Schema
-- Execute in order: tables are arranged by dependency

-- ============================================
-- Table: sports
-- ============================================
CREATE TABLE sports (
    id      BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    VARCHAR(100) NOT NULL
);

COMMENT ON TABLE sports IS 'Lookup table for sports categories';
COMMENT ON COLUMN sports.id IS 'Unique identifier for the sport';
COMMENT ON COLUMN sports.name IS 'Name of the sport (e.g., Football, Tennis, Basketball)';

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
-- Table: articles
-- ============================================
CREATE TABLE articles (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    source          VARCHAR(255) NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    language_code   VARCHAR(5) NOT NULL,
    sport_id        BIGINT,
    CONSTRAINT fk_articles_sport 
        FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE SET NULL
);

CREATE INDEX idx_articles_sport_id ON articles(sport_id);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);

COMMENT ON TABLE articles IS 'Stores article information';
COMMENT ON COLUMN articles.id IS 'Unique identifier for the article';
COMMENT ON COLUMN articles.title IS 'Title of the article';
COMMENT ON COLUMN articles.source IS 'Source of the article';
COMMENT ON COLUMN articles.created_at IS 'Record creation timestamp with timezone';
COMMENT ON COLUMN articles.language_code IS 'ISO 639-1 language code (e.g., EN, FR, DE)';
COMMENT ON COLUMN articles.sport_id IS 'Reference to sport category';

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
-- Table: user_interests
-- ============================================
CREATE TABLE user_interests (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    sport_id    BIGINT NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_interests UNIQUE (user_id, sport_id)
);

CREATE INDEX idx_user_interests_user_id ON user_interests(user_id);
CREATE INDEX idx_user_interests_sport_id ON user_interests(sport_id);

COMMENT ON TABLE user_interests IS 'Links users to their favorite sports';
COMMENT ON COLUMN user_interests.id IS 'Unique identifier for the user interest';
COMMENT ON COLUMN user_interests.user_id IS 'Reference to Supabase auth user';
COMMENT ON COLUMN user_interests.sport_id IS 'Reference to sport category';
COMMENT ON COLUMN user_interests.created_at IS 'When the interest was added';

-- ============================================
-- Row Level Security Policies
-- ============================================

-- user_interests: Users can only manage their own interests
ALTER TABLE user_interests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own interests" ON user_interests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own interests" ON user_interests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own interests" ON user_interests
    FOR DELETE USING (auth.uid() = user_id);

-- articles: Public read access
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Articles are publicly readable" ON articles
    FOR SELECT USING (true);

-- article_media: Public read access
ALTER TABLE article_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article media is publicly readable" ON article_media
    FOR SELECT USING (true);

-- article_tags: Public read access
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article tags are publicly readable" ON article_tags
    FOR SELECT USING (true);

-- sports: Public read access
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sports are publicly readable" ON sports
    FOR SELECT USING (true);

-- tag_types: Public read access
ALTER TABLE tag_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tag types are publicly readable" ON tag_types
    FOR SELECT USING (true);

-- ============================================
-- Seed data for sports (optional)
-- ============================================
-- INSERT INTO sports (name) VALUES 
--     ('Football'),
--     ('Basketball'),
--     ('Tennis'),
--     ('Formula 1'),
--     ('Golf'),
--     ('Cricket'),
--     ('Rugby'),
--     ('Baseball'),
--     ('Hockey'),
--     ('MMA');
