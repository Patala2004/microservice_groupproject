CREATE TABLE IF NOT EXISTS tag (
    id SERIAL PRIMARY KEY,
    tag_name TEXT NOT NULL,
    embedding VECTOR(768)
);