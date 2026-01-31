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
    body            TEXT,
    indicator       INTEGER DEFAULT 0,
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
-- Table: classification
-- ============================================
CREATE TABLE classification (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_id      BIGINT,
    json_response   TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_classification_article 
        FOREIGN KEY (article_id) REFERENCES articles(id)
);

CREATE INDEX idx_classification_article_id ON classification(article_id);

COMMENT ON TABLE classification IS 'Stores AI classification results for articles';
COMMENT ON COLUMN classification.id IS 'Unique identifier for the classification record';
COMMENT ON COLUMN classification.article_id IS 'Reference to the classified article';
COMMENT ON COLUMN classification.json_response IS 'Raw JSON response from AI classification';
COMMENT ON COLUMN classification.created_at IS 'When the classification was created';

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
        FOREIGN KEY (tag_type_id) REFERENCES tag_types(id) ON DELETE RESTRICT,
    CONSTRAINT uq_article_tags 
        UNIQUE (article_id, tag_type_id, tagname)
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
-- Table: user_articles
-- ============================================
CREATE TABLE user_articles (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    article_id      BIGINT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT uq_user_articles UNIQUE (user_id, article_id)
);

CREATE INDEX idx_user_articles_user_id ON user_articles(user_id);
CREATE INDEX idx_user_articles_article_id ON user_articles(article_id);

COMMENT ON TABLE user_articles IS 'Links users to saved/bookmarked articles';
COMMENT ON COLUMN user_articles.id IS 'Unique identifier for the user article record';
COMMENT ON COLUMN user_articles.user_id IS 'Reference to Supabase auth user';
COMMENT ON COLUMN user_articles.article_id IS 'Reference to saved article';
COMMENT ON COLUMN user_articles.created_at IS 'When the article was saved';

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

-- user_articles: Users can only manage their own saved articles
ALTER TABLE user_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved articles" ON user_articles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save articles" ON user_articles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave articles" ON user_articles
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

-- classification: Public read access
ALTER TABLE classification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Classification is publicly readable" ON classification
    FOR SELECT USING (true);

-- ============================================
-- Function: process_article_classification
-- Processes AI classification results for articles
-- ============================================
CREATE OR REPLACE FUNCTION process_article_classification(
    p_article_id BIGINT,
    p_classification JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_sport_name TEXT;
    v_sport_id BIGINT;
    v_field_name TEXT;
    v_field_value JSONB;
    v_tag_type_id BIGINT;
    v_tag_value TEXT;
    v_is_sports_article BOOLEAN;
BEGIN
    -- Validate article exists
    IF NOT EXISTS (SELECT 1 FROM articles WHERE id = p_article_id) THEN
        RAISE EXCEPTION 'Article with id % does not exist', p_article_id;
    END IF;

    -- Check if this is a sports article (optional validation)
    v_is_sports_article := COALESCE((p_classification->>'is_sports_article')::BOOLEAN, true);
    
    IF NOT v_is_sports_article THEN
        -- Not a sports article, nothing to process
        RETURN;
    END IF;

    -- Process each key in the classification JSON
    FOR v_field_name, v_field_value IN SELECT * FROM jsonb_each(p_classification)
    LOOP
        -- Skip metadata fields
        IF LOWER(v_field_name) = 'is_sports_article' THEN
            CONTINUE;
        END IF;

        IF LOWER(v_field_name) = 'sport' THEN
            -- Handle sport field specially
            v_sport_name := v_field_value #>> '{}';
            
            -- Skip if null or empty
            IF v_sport_name IS NULL OR v_sport_name = '' THEN
                CONTINUE;
            END IF;
            
            -- Lookup sport (case insensitive), insert if not exists
            SELECT id INTO v_sport_id
            FROM sports
            WHERE LOWER(name) = LOWER(v_sport_name);
            
            IF v_sport_id IS NULL THEN
                INSERT INTO sports (name)
                VALUES (v_sport_name)
                RETURNING id INTO v_sport_id;
            END IF;
            
            -- Update article with sport_id
            UPDATE articles
            SET sport_id = v_sport_id
            WHERE id = p_article_id;
            
        ELSE
            -- Handle all other fields as tags
            
            -- Process arrays (players, teams, etc.)
            IF jsonb_typeof(v_field_value) = 'array' THEN
                -- Skip empty arrays
                IF jsonb_array_length(v_field_value) = 0 THEN
                    CONTINUE;
                END IF;
                
                -- Lookup or create tag type
                SELECT id INTO v_tag_type_id
                FROM tag_types
                WHERE LOWER(name) = LOWER(v_field_name);
                
                IF v_tag_type_id IS NULL THEN
                    INSERT INTO tag_types (name)
                    VALUES (v_field_name)
                    RETURNING id INTO v_tag_type_id;
                END IF;
                
                -- Insert each value in the array
                FOR v_tag_value IN SELECT jsonb_array_elements_text(v_field_value)
                LOOP
                    -- Skip empty values
                    IF v_tag_value IS NOT NULL AND v_tag_value != '' THEN
                        INSERT INTO article_tags (article_id, tag_type_id, tagname)
                        VALUES (p_article_id, v_tag_type_id, v_tag_value)
                        ON CONFLICT ON CONSTRAINT uq_article_tags DO NOTHING;
                    END IF;
                END LOOP;
                
            ELSE
                -- Handle single string values (country, league, event_type)
                v_tag_value := v_field_value #>> '{}';
                
                -- Skip null or empty values
                IF v_tag_value IS NULL OR v_tag_value = '' THEN
                    CONTINUE;
                END IF;
                
                -- Lookup or create tag type
                SELECT id INTO v_tag_type_id
                FROM tag_types
                WHERE LOWER(name) = LOWER(v_field_name);
                
                IF v_tag_type_id IS NULL THEN
                    INSERT INTO tag_types (name)
                    VALUES (v_field_name)
                    RETURNING id INTO v_tag_type_id;
                END IF;
                
                INSERT INTO article_tags (article_id, tag_type_id, tagname)
                VALUES (p_article_id, v_tag_type_id, v_tag_value)
                ON CONFLICT ON CONSTRAINT uq_article_tags DO NOTHING;
            END IF;
        END IF;
    END LOOP;
END;
$$;

COMMENT ON FUNCTION process_article_classification IS 'Processes AI classification results for an article, updating sport and creating tags';

-- ============================================
-- Trigger function for classification table
-- ============================================
CREATE OR REPLACE FUNCTION trigger_process_classification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only process if we have both article_id and json_response
    IF NEW.article_id IS NOT NULL AND NEW.json_response IS NOT NULL THEN
        PERFORM process_article_classification(
            NEW.article_id,
            NEW.json_response::JSONB
        );
    END IF;
    
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_process_classification IS 'Trigger function that calls process_article_classification on insert';

-- ============================================
-- Trigger on classification table
-- ============================================
CREATE TRIGGER trg_classification_after_insert
    AFTER INSERT ON classification
    FOR EACH ROW
    EXECUTE FUNCTION trigger_process_classification();

-- ============================================
-- Example usage:
-- ============================================
-- INSERT INTO classification (article_id, json_response)
-- VALUES (
--     1,
--     '{
--         "is_sports_article": true,
--         "sport": "Golf",
--         "country": "USA",
--         "league": "PGA Tour",
--         "event_type": "Tournament",
--         "players": ["Michael Brennan"],
--         "teams": []
--     }'
-- );
-- This will automatically process the classification and update articles/tags
