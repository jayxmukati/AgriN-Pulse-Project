from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import datetime

class NewsArticleBase(BaseModel):
    title: str
    summary: Optional[str] = None
    content: str
    source_name: str
    source_url: Optional[str] = None
    category: Optional[str] = None
    target_crop: Optional[str] = None
    h3_region: Optional[str] = None

class NewsArticleResponse(NewsArticleBase):
    id: uuid.UUID
    published_at: datetime
    
    class Config:
        from_attributes = True

class SemanticSearchQuery(BaseModel):
    query: str
    limit: Optional[int] = 5
