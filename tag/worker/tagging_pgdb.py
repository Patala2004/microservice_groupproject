from sqlmodel import SQLModel, Session, Field, create_engine, select
from sqlalchemy import text, func
from pgvector.sqlalchemy import VECTOR
import numpy as np
import os

DATABASE_URL = os.environ['POSTGRES_TAGGING_DB']
SIMILARITY_THRESHOLD = 0.20
RELATED_TAG_THRESHOLD = 0.45

engine = create_engine(DATABASE_URL)


class Tag(SQLModel, table=True):
    __tablename__ = "tag"
    __table_args__ = {"extend_existing": True}

    id: int | None = Field(default=None, primary_key=True)
    tag_name: str
    embedding: list[float] = Field(sa_type=VECTOR(768))


def get_session():
    return Session(engine)


def similar_tag_exists(embedding: list[float]) -> int | None:
    with get_session() as session:
        stmt = text("""
            SELECT id
            FROM tag
            WHERE embedding <=> CAST(:embedding AS vector) < :threshold
            ORDER BY embedding <=> CAST(:embedding AS vector)
            LIMIT 1
        """)

        row = session.exec(
            stmt,
            params={
                "embedding": embedding,
                "threshold": SIMILARITY_THRESHOLD
            }
        ).first()

        if row is None:
            return None

        return row[0]


def get_top3_related_tags(tag_id: int) -> list[int]:
    with get_session() as session:
        stmt = text("""
            SELECT t2.id
            FROM tag t1
            JOIN tag t2
                ON t1.embedding <=> t2.embedding < :threshold
            WHERE t1.id = :tag_id
                AND t2.id != :tag_id
            ORDER BY t1.embedding <=> t2.embedding
            LIMIT 3
        """)

        rows = session.exec(
            stmt,
            params={
                "tag_id": tag_id,
                "threshold": RELATED_TAG_THRESHOLD
            }
        ).all()

        return [row[0] for row in rows]


def store_tag(name: str, embedding):
    existing_id = similar_tag_exists(embedding)

    if existing_id:
        return existing_id

    else:
        new_tag = Tag(tag_name=name, embedding=embedding)

        with get_session() as session:
            session.add(new_tag)
            session.commit()
            session.refresh(new_tag)
            return new_tag.id
