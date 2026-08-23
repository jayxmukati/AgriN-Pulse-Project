from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.news import NewsArticle
from app.schemas.news import NewsArticleResponse, SemanticSearchQuery
from app.services.rag import embed_text

router = APIRouter()

@router.get("/", response_model=List[NewsArticleResponse])
def get_news(
    category: Optional[str] = None,
    crop_type: Optional[str] = None,
    h3_region: Optional[str] = None,
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(NewsArticle)
    
    if category:
        query = query.filter(NewsArticle.category == category)
    if crop_type:
        query = query.filter(NewsArticle.target_crop == crop_type)
    if h3_region:
        query = query.filter(NewsArticle.h3_region == h3_region)
        
    return query.order_by(NewsArticle.published_at.desc()).limit(limit).all()

@router.post("/semantic-search", response_model=List[NewsArticleResponse])
def semantic_search_news(
    search_query: SemanticSearchQuery,
    db: Session = Depends(get_db)
):
    # 1. Embed the search query
    query_embedding = embed_text(search_query.query)
    
    # 2. Perform vector similarity search using pgvector cosine distance (<=>)
    results = (
        db.query(NewsArticle)
        .order_by(NewsArticle.embedding.cosine_distance(query_embedding))
        .limit(search_query.limit)
        .all()
    )
    
    return results
