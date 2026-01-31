-- Create article_tags table
CREATE TABLE article_tags (
    id              NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    article_id      NUMBER NOT NULL,
    tag_type_id     NUMBER NOT NULL,
    tagname         VARCHAR2(255) NOT NULL,
    CONSTRAINT fk_article_tags_article 
        FOREIGN KEY (article_id) REFERENCES articles(id),
    CONSTRAINT fk_article_tags_tag_type 
        FOREIGN KEY (tag_type_id) REFERENCES tag_types(id),
    CONSTRAINT uq_article_tags 
        UNIQUE (article_id, tag_type_id, tagname)
);

-- Create indexes on foreign keys for join performance
CREATE INDEX idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX idx_article_tags_tag_type_id ON article_tags(tag_type_id);

-- Add comments for documentation
COMMENT ON TABLE article_tags IS 'Associates tags with articles';
COMMENT ON COLUMN article_tags.id IS 'Unique identifier for the article tag';
COMMENT ON COLUMN article_tags.article_id IS 'Reference to parent article';
COMMENT ON COLUMN article_tags.tag_type_id IS 'Reference to tag type category';
COMMENT ON COLUMN article_tags.tagname IS 'Tag value/label';
