CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION trigger_classify_article()
RETURNS TRIGGER 
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.indicator = 1 AND (OLD.indicator IS NULL OR OLD.indicator = 0) THEN
    PERFORM net.http_post(
      url := 'https://vhronqgtadyvwdehdnhd.supabase.co/functions/v1/classify-article',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocm9ucWd0YWR5dndkZWhkbmhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzOTMyMzIsImV4cCI6MjA4Mzk2OTIzMn0.SkE_oLXIKQNHMOHXiuC5ZWvt3GqPEr9DNb3bt9Y-QY0"}'::jsonb,
      body := jsonb_build_object('record', row_to_json(NEW))
    );
  END IF;
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION trigger_classify_article IS 'Calls Edge Function to classify article when indicator changes to 1';

-- Create trigger on articles table
DROP TRIGGER IF EXISTS on_article_indicator_update ON articles;

CREATE TRIGGER on_article_indicator_update
  AFTER UPDATE ON articles
  FOR EACH ROW
  EXECUTE FUNCTION trigger_classify_article();

