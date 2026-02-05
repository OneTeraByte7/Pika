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

