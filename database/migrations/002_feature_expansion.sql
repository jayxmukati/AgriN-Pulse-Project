-- 002_feature_expansion.sql

-- 1. User Authentication & RBAC
CREATE TYPE user_role AS ENUM ('farmer', 'extension_officer', 'policymaker', 'admin');

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'farmer',
    preferred_language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Multi-Tenant Plot Association
ALTER TABLE fields 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS crop_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS field_name VARCHAR(255);

-- 3. Live Agricultural News & Market Intelligence
CREATE TABLE IF NOT EXISTS news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    source_name VARCHAR(100) NOT NULL,
    source_url VARCHAR(512) UNIQUE,
    category VARCHAR(50),
    target_crop VARCHAR(100),
    h3_region VARCHAR(15),
    embedding VECTOR(384), -- Using 384 for all-MiniLM-L6-v2 local model
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- B-Tree index on published_at for time-series queries
CREATE INDEX idx_news_published_at ON news_articles(published_at);
