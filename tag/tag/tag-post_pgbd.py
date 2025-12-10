from sqlmodel import SQLModel, Session, Field, create_engine, select
import os

DATABASE_URL = os.environ['TAG_POST_DB']

engine = create_engine(DATABASE_URL)

class TagPost(SQLModel, table=True):
    __tablename__ = "???"
    __table_args__ = {"extend_existing": True}
    
    tag_id: int = Field(foreign_key="???", primary_key=True)
    post_id: int = Field(foreign_key="???", primary_key=True)

def get_session():
    return Session(engine)

def add_relations(tag_ids, post_id):
    with get_session() as session:
        for tag_id in tag_ids:
            exists = session.get(TagPost, (tag_id, post_id))
            if not exists:
                rel = TagPost(tag_id=tag_id, post_id=post_id)
                session.add(rel)
        session.commit()

def delete_relations(post_id):
    with get_session() as session:
        stmt = select(TagPost).where(TagPost.post_id == post_id)
        relations = session.exec(stmt).all()
        for rel in relations:
            session.delete(rel)
        session.commit()