-- Create article_media table
CREATE TABLE article_media (
    id              NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_id      NUMBER NOT NULL,
    media_type      VARCHAR2(50) NOT NULL,
    hyperlink       VARCHAR2(2000) NOT NULL,
    CONSTRAINT fk_article_media_article 
        FOREIGN KEY (article_id) REFERENCES articles(id),
    CONSTRAINT chk_article_media_type 
        CHECK (media_type IN ('IMAGE', 'VIDEO', 'AUDIO'))
);

-- Create index on foreign key for join performance
CREATE INDEX idx_article_media_article_id ON article_media(article_id);

-- Add comments for documentation
COMMENT ON TABLE article_media IS 'Stores media references associated with articles';
COMMENT ON COLUMN article_media.id IS 'Unique identifier for the media record';
COMMENT ON COLUMN article_media.article_id IS 'Reference to parent article';
COMMENT ON COLUMN article_media.media_type IS 'Type of media: IMAGE, VIDEO, AUDIO';
COMMENT ON COLUMN article_media.hyperlink IS 'URL or path to the media resource';
