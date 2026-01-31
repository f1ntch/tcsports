-- Alter articles table to add sport_id column
-- Run this if the articles table already exists without sport_id

-- Add the column (nullable to avoid issues with existing data)
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS sport_id BIGINT;

-- Add foreign key constraint
ALTER TABLE articles 
ADD CONSTRAINT fk_articles_sport 
    FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE SET NULL;

-- Create index for join performance
CREATE INDEX IF NOT EXISTS idx_articles_sport_id ON articles(sport_id);

-- Add column comment
COMMENT ON COLUMN articles.sport_id IS 'Reference to sport category';
