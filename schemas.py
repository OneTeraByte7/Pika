from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, List, Any
from datetime import datetime
from enum import Enum

class Platfrom(str, Enum):
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
    
