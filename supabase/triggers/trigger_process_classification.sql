CREATE OR REPLACE FUNCTION trigger_process_classification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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

-- Create trigger on classification table
DROP TRIGGER IF EXISTS trg_classification_after_insert ON classification;

CREATE TRIGGER trg_classification_after_insert
    AFTER INSERT ON classification
    FOR EACH ROW
    EXECUTE FUNCTION trigger_process_classification();

