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
    
@router.get("/accounts")
async def get_connected_accounts(current_user: User = Depends(get_current_user)):
    
    return{
        "accounts": [
            {
                "platform": "instagram",
                "username": "@demo_user",
                "connected_at": "2024-01-15T10:00:00Z",
                "is_active": True
            }
        ]
    }
    
@router.post("/post", response_model = PostResponse)
async def create_post(
    post: PostCreate,
    current_user: User = Depends(get_current_user)
):
    
    mock_accounts = []
    aggregator = SocialMediaAggregator(mock_accounts)
    
    results = {}
    for platform in post.platform:
        results[platform] = {
            "success": True,
            "post_id": f"mock_{platform}_123",
            "url": f"https://{platform}.com/post/123"
        }
        
    return PostResponse(
        success = True,
        results = results,
        message = f"Posted to {len(post.platforms)} platforms successfully"
    )
    
@router.get("/dms", response_model = List[DMSummary])
async def get_dms(current_user: User = Depends(get_current_user)):
    
    return [
        DMSummary(
            platform = Platform.INSTAGRAM,
            unread_count = 3,
            important_messages = [
                {
                    "from": "Sarah",
                    "preview": "Hey! Did you see my post",
                    "timestamp": "2 hous ago"
                }
            ],
            summary = "3 unread messages on Instagram"
        ),
        DMSummary(
            platform = Platform.TWITTER,
            unread_count = 2,
            important_messages = [
                {
                    "from": "Jake",
                    "preview": "Thanks for the RT!",
                    'timestamp': "1 hour ago"
                }
            ],
            
            summary = "2 unread messages on Twitter"
        )
    ]
    
@router.get("/activity", response_model = ActivityFeed)
async def get_activity_feed(
    hours: int = 24,
    current_user: User = Depends(get_current_user)
):
    activities = [
        {
            "id": 1,
            "platform": "instagram",
            "type": "like",
            "content": "Jake liked your photo",
            "timestamp": "1 hour ago",
            "is_read": False
        },
        {
            "id": 2,
            "platform": "twiiter",
            "type": "retweet",
            "content": "Emma retweeted your tweet",
            "timestamp": "3 hours ago",
            "is_read": False
        }
    ]
    
    return ActivityFeed(
        activities = activities,
        unread_count = 2,
        priority_items = [activities[0]]
    )
    
@router.post("/disconnect/{platform}")
async def disconnect_platform(
    platform: Platform,
    current_user: User = Depends(get_current_user)
):
    
    return{
        "success": True,
        "platform": platform,
        "message": f"Disconnected {platform} successfully"
    }
    
