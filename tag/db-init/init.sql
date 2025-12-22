CREATE EXTENSION IF NOT EXISTS vector;

CREATE USER app_user WITH PASSWORD 'app_password';
GRANT CONNECT ON DATABASE tags_db TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;

CREATE TABLE IF NOT EXISTS embeddings (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    embedding VECTOR(384)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE embeddings TO app_user;
GRANT USAGE, SELECT ON SEQUENCE embeddings_id_seq TO app_user;
