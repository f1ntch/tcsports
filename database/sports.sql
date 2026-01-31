-- Create sports table
CREATE TABLE sports (
    id      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name    VARCHAR2(100) NOT NULL
);

-- Add comments for documentation
COMMENT ON TABLE sports IS 'Lookup table for sports categories';
COMMENT ON COLUMN sports.id IS 'Unique identifier for the sport';
COMMENT ON COLUMN sports.name IS 'Name of the sport (e.g., Football, Tennis, Basketball)';
