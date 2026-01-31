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
    v_lang_code TEXT;
    v_translation JSONB;
BEGIN
    IF NOT EXISTS (SELECT 1 FROM articles WHERE id = p_article_id) THEN
        RAISE EXCEPTION 'Article with id % does not exist', p_article_id;
    END IF;

    v_is_sports_article := COALESCE((p_classification->>'is_sports_article')::BOOLEAN, true);
    
    IF NOT v_is_sports_article THEN
        RETURN;
    END IF;

    -- Process translations into articles_processed table
    IF p_classification ? 'translations' THEN
        FOR v_lang_code, v_translation IN SELECT * FROM jsonb_each(p_classification->'translations')
        LOOP
            INSERT INTO articles_processed (article_id, language_code, title, summary)
            VALUES (
                p_article_id,
                v_lang_code,
                v_translation->>'title',
                v_translation->>'summary'
            )
            ON CONFLICT ON CONSTRAINT uq_articles_processed 
            DO UPDATE SET title = EXCLUDED.title, summary = EXCLUDED.summary;
        END LOOP;
    END IF;

    FOR v_field_name, v_field_value IN SELECT * FROM jsonb_each(p_classification)
    LOOP
        IF LOWER(v_field_name) IN ('is_sports_article', 'translations') THEN
            CONTINUE;
        END IF;

        IF LOWER(v_field_name) = 'sport' THEN
            v_sport_name := v_field_value #>> '{}';
            
            IF v_sport_name IS NULL OR v_sport_name = '' THEN
                CONTINUE;
            END IF;
            
            SELECT id INTO v_sport_id FROM sports WHERE LOWER(name) = LOWER(v_sport_name);
            
            IF v_sport_id IS NULL THEN
                INSERT INTO sports (name) VALUES (v_sport_name) RETURNING id INTO v_sport_id;
            END IF;
            
            UPDATE articles SET sport_id = v_sport_id WHERE id = p_article_id;
            
        ELSE
            IF jsonb_typeof(v_field_value) = 'array' THEN
                IF jsonb_array_length(v_field_value) = 0 THEN CONTINUE; END IF;
                
                SELECT id INTO v_tag_type_id FROM tag_types WHERE LOWER(name) = LOWER(v_field_name);
                IF v_tag_type_id IS NULL THEN
                    INSERT INTO tag_types (name) VALUES (v_field_name) RETURNING id INTO v_tag_type_id;
                END IF;
                
                FOR v_tag_value IN SELECT jsonb_array_elements_text(v_field_value)
                LOOP
                    IF v_tag_value IS NOT NULL AND v_tag_value != '' THEN
                        INSERT INTO article_tags (article_id, tag_type_id, tagname)
                        VALUES (p_article_id, v_tag_type_id, v_tag_value)
                        ON CONFLICT ON CONSTRAINT uq_article_tags DO NOTHING;
                    END IF;
                END LOOP;
            ELSE
                v_tag_value := v_field_value #>> '{}';
                IF v_tag_value IS NULL OR v_tag_value = '' THEN CONTINUE; END IF;
                
                SELECT id INTO v_tag_type_id FROM tag_types WHERE LOWER(name) = LOWER(v_field_name);
                IF v_tag_type_id IS NULL THEN
                    INSERT INTO tag_types (name) VALUES (v_field_name) RETURNING id INTO v_tag_type_id;
                END IF;
                
                INSERT INTO article_tags (article_id, tag_type_id, tagname)
                VALUES (p_article_id, v_tag_type_id, v_tag_value)
                ON CONFLICT ON CONSTRAINT uq_article_tags DO NOTHING;
            END IF;
        END IF;
    END LOOP;
END;
$$;


