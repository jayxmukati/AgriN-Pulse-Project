from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid
from pgvector.sqlalchemy import Vector
from app.database import Base

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=False)
    source_name = Column(String(100), nullable=False)
    source_url = Column(String(512), unique=True, nullable=True)
    category = Column(String(50), nullable=True)
    target_crop = Column(String(100), nullable=True)
    h3_region = Column(String(15), nullable=True)
    
    # 384 dimensions to match all-MiniLM-L6-v2 output
    embedding = Column(Vector(384))
    
    published_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
