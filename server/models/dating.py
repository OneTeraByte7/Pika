from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum
from bson import ObjectId


class GenderEnum(str, Enum):
    MALE = "male"
    FEMALE = "female"
    NON_BINARY = "non_binary"
    PREFER_NOT_TO_SAY = "prefer_not_to_say"


class InterestCategory(str, Enum):
    TRAVEL = "travel"
    SPORTS = "sports"
    MUSIC = "music"
    ART = "art"
    FOOD = "food"
    FITNESS = "fitness"
    READING = "reading"
    GAMING = "gaming"
    TECH = "tech"
    NATURE = "nature"
    MOVIES = "movies"
    VOLUNTEERING = "volunteering"
    PETS = "pets"
    PHOTOGRAPHY = "photography"
    COOKING = "cooking"


class DatingPhotoCreate(BaseModel):
    url: str
    caption: Optional[str] = None
    is_primary: bool = False


class DatingPhotoResponse(BaseModel):
    id: str
    url: str
    caption: Optional[str]
    is_primary: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserPreferenceCreate(BaseModel):
    min_age: int = 18
    max_age: int = 65
    preferred_genders: List[GenderEnum] = [GenderEnum.MALE, GenderEnum.FEMALE]
    max_distance_km: Optional[int] = 50
    interests: List[InterestCategory] = []
    height_cm_min: Optional[int] = None
    height_cm_max: Optional[int] = None

    @validator("min_age", "max_age")
    def validate_age(cls, v):
        if v < 18 or v > 120:
            raise ValueError("Age must be between 18 and 120")
        return v

    @validator("max_distance_km")
    def validate_distance(cls, v):
        if v is not None and v < 1:
            raise ValueError("Distance must be at least 1 km")
        return v


class UserPreferenceResponse(BaseModel):
    id: str
    min_age: int
    max_age: int
    preferred_genders: List[GenderEnum]
    max_distance_km: Optional[int]
    interests: List[InterestCategory]
    height_cm_min: Optional[int]
    height_cm_max: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DatingProfileCreate(BaseModel):
    bio: str = Field(..., min_length=10, max_length=500)
    age: int = Field(..., ge=18, le=120)
    gender: GenderEnum
    location: Dict[str, Any]  # {"latitude": float, "longitude": float, "city": str, "country": str}
    height_cm: Optional[int] = None
    interests: List[InterestCategory] = []
    photos: List[DatingPhotoCreate] = []
    linked_pika_user_id: Optional[str] = None
    verified: bool = False

    @validator("location")
    def validate_location(cls, v):
        required_keys = {"latitude", "longitude"}
        if not all(key in v for key in required_keys):
            raise ValueError("Location must include latitude and longitude")
        if not (-90 <= v["latitude"] <= 90):
            raise ValueError("Latitude must be between -90 and 90")
        if not (-180 <= v["longitude"] <= 180):
            raise ValueError("Longitude must be between -180 and 180")
        return v


class DatingProfileResponse(BaseModel):
    id: str
    bio: str
    age: int
    gender: GenderEnum
    location: Dict[str, Any]
    height_cm: Optional[int]
    interests: List[InterestCategory]
    photos: List[DatingPhotoResponse]
    linked_pika_user_id: Optional[str]
    verified: bool
    created_at: datetime
    updated_at: datetime
    profile_views: int = 0
    likes_received: int = 0

    class Config:
        from_attributes = True


class SwipeAction(str, Enum):
    RIGHT = "right"  # Like
    LEFT = "left"  # Pass


class SwipeCreate(BaseModel):
    target_profile_id: str
    action: SwipeAction


class SwipeResponse(BaseModel):
    id: str
    from_profile_id: str
    to_profile_id: str
    action: SwipeAction
    created_at: datetime
    is_match: bool = False

    class Config:
        from_attributes = True


class MatchResponse(BaseModel):
    id: str
    profile_ids: List[str]  # Two profile IDs
    created_at: datetime
    last_interaction: Optional[datetime] = None
    unread_count: int = 0

    class Config:
        from_attributes = True


class LikeCreate(BaseModel):
    target_profile_id: str


class LikeResponse(BaseModel):
    id: str
    from_profile_id: str
    to_profile_id: str
    created_at: datetime
    is_mutual: bool = False

    class Config:
        from_attributes = True


class CompatibilityScore(BaseModel):
    target_profile_id: str
    score: float = Field(..., ge=0, le=100)
    reason: Optional[str] = None


class RecommendationResponse(BaseModel):
    profile: DatingProfileResponse
    compatibility_score: float
    match_reason: Optional[str] = None

    class Config:
        from_attributes = True


class BlockedUserCreate(BaseModel):
    blocked_profile_id: str


class BlockedUserResponse(BaseModel):
    id: str
    blocker_profile_id: str
    blocked_profile_id: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReportCreate(BaseModel):
    reported_profile_id: str
    reason: str = Field(..., min_length=10, max_length=500)
    description: Optional[str] = None


class ReportResponse(BaseModel):
    id: str
    reporter_profile_id: str
    reported_profile_id: str
    reason: str
    description: Optional[str]
    status: str = "pending"  # pending, reviewed, resolved
    created_at: datetime

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    to_profile_id: str
    content: str = Field(..., min_length=1, max_length=1000)
    message_type: str = "text"  # text, image, emoji


class MessageResponse(BaseModel):
    id: str
    from_profile_id: str
    to_profile_id: str
    content: str
    message_type: str
    is_read: bool = False
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConversationResponse(BaseModel):
    id: str
    profile_ids: List[str]  # Two profile IDs
    last_message: Optional[str] = None
    last_message_timestamp: Optional[datetime] = None
    unread_count: int = 0
    message_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ConversationDetailResponse(BaseModel):
    conversation: ConversationResponse
    messages: List[MessageResponse]

    class Config:
        from_attributes = True


class MessageBatchResponse(BaseModel):
    total: int
    unread: int
    messages: List[MessageResponse]

    class Config:
        from_attributes = True


class TypingIndicatorCreate(BaseModel):
    to_profile_id: str


class ConversationListResponse(BaseModel):
    total_conversations: int
    total_unread: int
    conversations: List[ConversationResponse]

    class Config:
        from_attributes = True
