from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid
from datetime import datetime

class UserBase(BaseModel):
    phone_number: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: str
    preferred_language: Optional[str] = "en"

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
