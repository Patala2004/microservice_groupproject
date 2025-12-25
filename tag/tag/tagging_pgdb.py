from sqlmodel import SQLModel, Session, Field, create_engine, select
from sqlalchemy import text, func
from pgvector.sqlalchemy import VECTOR
import os

DATABASE_URL = os.environ['POSTGRES_TAGGING_DB']
SIMILARITY_THRESHOLD = 0.35

engine = create_engine(DATABASE_URL)


class Tag(SQLModel, table=True):
    __tablename__ = "tag"
    __table_args__ = {"extend_existing": True}

    id: int | None = Field(default=None, primary_key=True)
    tag_name: str
    embedding: list[float] = Field(sa_type=VECTOR(768))


def get_session():
    return Session(engine)


def similar_tag_exists(embedding):
    if not isinstance(embedding, np.ndarray):
        embedding = np.array(embedding, dtype=np.float32)
    else:
        embedding = embedding.astype(np.float32)
    with get_session() as session:
        distance = Tag.embedding.op("<=>")(embedding)

        stmt = (
            select(
                Tag.id,
                Tag.tag_name,
                Tag.embedding,
                distance.label("dist")
            )
            .order_by(distance)
            .limit(1)
        )
        result = session.exec(stmt).first()

        if result is None:
            return None

        tag, distance = result

        if distance < SIMILARITY_THRESHOLD:
            return tag

        return None


def store_tag(name: str, embedding):
    existing = similar_tag_exists(embedding)

    if existing:
        return existing

    else:
        new_tag = Tag(tag_name=name, embedding=embedding)

        with get_session() as session:
            session.add(new_tag)
            session.commit()
            session.refresh(new_tag)
            return new_tag
