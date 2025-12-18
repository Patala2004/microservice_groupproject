from sqlmodel import SQLModel, Session, Field, create_engine, select
from sqlalchemy import text, func
from pgvector.sqlalchemy import VECTOR
import os

DATABASE_URL = os.environ['POSTGRES_TAGGING_DB']
SIMILARITY_THRESHOLD = 0.2

engine = create_engine(DATABASE_URL)


class Tag(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    embedding: list[float] = Field(sa_type=VECTOR(384))


def init_db():
    with engine.connect() as conn:
        conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        conn.commit()
    SQLModel.metadata.create_all(engine)


def get_session():
    return Session(engine)


def similar_tag_exists(embedding: list[float]):
    with get_session() as session:
        stmt = (
            select(Tag, func.cosine_distance(
                Tag.embedding, embedding).label("dist"))
            .order_by(func.cosine_distance(Tag.embedding, embedding))
            .limit(1)
        )
        result = session.exec(stmt).first()

        if result is None:
            return None

        tag, distance = result

        if distance > SIMILARITY_THRESHOLD:
            return tag

        return None


def store_tag(name: str, embedding: list[float]):
    existing = similar_tag_exists(embedding)

    if existing:
        return existing

    else:
        new_tag = Tag(name=name, embedding=embedding)

        with get_session() as session:
            session.add(new_tag)
            session.commit()
            session.refresh(new_tag)
            return new_tag
