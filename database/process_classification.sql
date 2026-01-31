-- Procedure to process article classification results (PostgreSQL/Supabase)
-- Input: article_id and JSON classification data
-- Example JSON:
-- {
--   "is_sports_article": true,
--   "sport": "Golf",
--   "country": "USA",
--   "league": "PGA Tour",
--   "event_type": "Tournament",
--   "players": ["Michael Brennan"],
--   "teams": []
-- }

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
            v_sport_name := v_field_value #>> '{}';  -- Extract text value
            
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
                        ON CONFLICT DO NOTHING;
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
                ON CONFLICT DO NOTHING;
            END IF;
        END IF;
    END LOOP;
END;
$$;

-- Add comment for documentation
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

-- Example usage:
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
