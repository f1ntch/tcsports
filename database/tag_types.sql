-- Create tag_types table
CREATE TABLE tag_types (
    id      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    VARCHAR2(100) NOT NULL
);

-- Add comments for documentation
COMMENT ON TABLE tag_types IS 'Lookup table for tag type categories';
COMMENT ON COLUMN tag_types.id IS 'Unique identifier for the tag type';
COMMENT ON COLUMN tag_types.name IS 'Name of the tag type';
