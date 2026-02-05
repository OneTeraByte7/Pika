from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, List, Any
from datetime import datetime
from enum import Enum

class Platform(str, Enum):
    INSTAGRAM = "instagram"
    TWITTER = "twitter"
    TIKTOK = "tiktok"
    
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    passowrd: str
    fullname: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    full_name:Optional[str]
    is_premiun: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
    
class SocialAccountConnect(BaseModel):
    platform: Platform
    access_token: str
    platform_user_id: str
    username:Optional[str] = None
    
class VoiceQuery(BaseModel):
    audio_data: Optional[str] = None
    text: Optional[str] = None
    session_id: str
    
class VoiceResponse(BaseModel):
    text:str
    audio_url: Optional[str] = None
    actions: List[Dict[str, Any]] = []
    
    
class BriefingRequest(BaseModel):
    time_range: str = "24h"
    

class BriefingResponse(BaseModel):
    summary: str
    highlights: List[Dict[str, Any]]
    unread_dms: int
    top_posts: List[Dict[str, Any]]
    notifications: List[Dict[str, Any]]
    
class PostCreate(BaseModel):
    platform: List[Platform]
    content: str
    media_url: Optional[str] = None
    media_type: Optional[str] = None
    
    