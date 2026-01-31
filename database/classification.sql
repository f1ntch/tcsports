-- Create classification table (Oracle)
-- Stores AI classification results for articles
CREATE TABLE classification (
    id              NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_id      NUMBER,
    json_response   CLOB,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_classification_article 
        FOREIGN KEY (article_id) REFERENCES articles(id)
);

-- Create index on foreign key for join performance
CREATE INDEX idx_classification_article_id ON classification(article_id);

-- Add comments for documentation
COMMENT ON TABLE classification IS 'Stores AI classification results for articles';
COMMENT ON COLUMN classification.id IS 'Unique identifier for the classification record';
COMMENT ON COLUMN classification.article_id IS 'Reference to the classified article';
COMMENT ON COLUMN classification.json_response IS 'Raw JSON response from AI classification';
COMMENT ON COLUMN classification.created_at IS 'When the classification was created';
