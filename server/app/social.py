from fastapi import APIRouter, Depends, HTTPException
from typing import List

from models.schemas import (
    SocialAccountConnect, PostCreate, PostResponse,
    DMSummary, ActivityFeed, Platform
)

from models.database import User
from app.auth import get_current_user
from services. social_media.aggregator import SocialMediaAggregator

router = APIRouter(prefix = "/social", tags = ["social"])

@router.post("/connect")
async def connect_platform(
    account: SocialAccountConnect,
    current_user: User = Depends(get_current_user)
):
    
    return{
        "success": True,
        "platform": account.platform,
        "username": account.username,
        "message": f"Successfully connected {account.platform}"
    }
    
    