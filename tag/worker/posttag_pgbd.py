from sqlmodel import SQLModel, Session, Field, create_engine, select
import os

DATABASE_URL = os.environ['POST_TAG_DB']

engine = create_engine(DATABASE_URL)


class PostTag(SQLModel, table=True):
    __tablename__ = "post_tag"
    __table_args__ = {"extend_existing": True}

    tag_id: int = Field(primary_key=True)
    post_id: int = Field(primary_key=True)


def get_session():
    return Session(engine)


def add_relations(tag_ids, post_id):
    with get_session() as session:
        for tag_id in tag_ids:
            exists = session.get(PostTag, (tag_id, post_id))
            if not exists:
                rel = PostTag(tag_id=tag_id, post_id=post_id)
                session.add(rel)
        session.commit()


def delete_relations(post_id):
    with get_session() as session:
        stmt = select(PostTag).where(PostTag.post_id == post_id)
        relations = session.exec(stmt).all()
        for rel in relations:
            session.delete(rel)
        session.commit()
