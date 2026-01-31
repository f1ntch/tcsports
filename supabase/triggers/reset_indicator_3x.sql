CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION reset_indicator_3x() 
RETURNS void 
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE articles SET indicator = 1, created_at = NOW()
  WHERE id IN (
    SELECT id FROM articles 
    WHERE indicator = 0 
    ORDER BY id DESC LIMIT 3
  );
  
  PERFORM pg_sleep(20);
  
  UPDATE articles SET indicator = 1, created_at = NOW()
  WHERE id IN (
    SELECT id FROM articles 
    WHERE indicator = 0 
    ORDER BY id DESC LIMIT 3
  );
  
  PERFORM pg_sleep(20);
  
  UPDATE articles SET indicator = 1, created_at = NOW()
  WHERE id IN (
    SELECT id FROM articles 
    WHERE indicator = 0 
    ORDER BY id DESC LIMIT 3
  );
END;
$$;

COMMENT ON FUNCTION reset_indicator_3x IS 'Marks 3 articles as fresh every 20 seconds (runs 3x per minute)';

-- Schedule cron job (every minute)
SELECT cron.schedule(
  'reset-indicator-3x',
  '* * * * *',
  $$SELECT reset_indicator_3x()$$
);

