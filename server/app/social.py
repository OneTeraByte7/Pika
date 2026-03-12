from fastapi import APIRouter, Depends, HTTPException
from typing import List
from datetime import datetime

from server.models.schemas import (
    SocialAccountConnect, PostCreate, PostResponse,
    DMSummary, ActivityFeed, Platform
)

from server.models.database import User, SocialAccount, Post, DirectMessage, Activity
from server.app.auth import get_current_user
from server.services.social_media.aggregator import SocialMediaAggregator
from server.models.mongodb import get_db, COLLECTIONS

router = APIRouter(prefix = "/social", tags = ["social"])

@router.post("/connect")
async def connect_platform(
    account: SocialAccountConnect,
    current_user: User = Depends(get_current_user)
):
    db = get_db()
    
    # Store social account connection
    social_account = SocialAccount(
        user_id=str(current_user.id),
        platform=account.platform,
        platform_user_id=account.platform_user_id,
        username=account.username,
        access_token=account.access_token,
        is_active=True,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    await db[COLLECTIONS["social_accounts"]].insert_one(
        social_account.dict(by_alias=True, exclude={"id"})
    )
    
    return{
        "success": True,
        "platform": account.platform,
        "username": account.username,
        "message": f"Successfully connected {account.platform}"
    }
    
@router.get("/accounts")
async def get_connected_accounts(current_user: User = Depends(get_current_user)):
    db = get_db()
    
    # Fetch user's connected accounts from MongoDB
    accounts_cursor = db[COLLECTIONS["social_accounts"]].find({
        "user_id": str(current_user.id),
        "is_active": True
    })
    
    accounts = []
    async for account in accounts_cursor:
        accounts.append({
            "platform": account["platform"],
            "username": account.get("username", ""),
            "connected_at": account["created_at"].isoformat(),
            "is_active": account["is_active"]
        })
    
    return{"accounts": accounts}
    
@router.post("/post", response_model = PostResponse)
async def create_post(
    post: PostCreate,
    current_user: User = Depends(get_current_user)
):
    db = get_db()
    
    # Fetch user's connected accounts
    accounts_cursor = db[COLLECTIONS["social_accounts"]].find({
        "user_id": str(current_user.id),
        "is_active": True
    })
    
    connected_accounts = []
    async for account in accounts_cursor:
        connected_accounts.append(account)
    
    # Create aggregator with real accounts
    aggregator = SocialMediaAggregator(connected_accounts)
    
    results = {}
    for platform in post.platform:
        try:
            # Use aggregator to post to the platform
            result = await aggregator.post_content(
                platform=platform,
                content=post.content,
                media_url=post.media_url
            )
            results[platform] = result
        except Exception as e:
            results[platform] = {
                "success": False,
                "error": str(e)
            }
    
    # Store post in MongoDB
    post_doc = Post(
        user_id=str(current_user.id),
        platforms=post.platform,
        content=post.content,
        media_url=post.media_url,
        media_type=post.media_type,
        results=results,
        status="posted" if any(r.get("success") for r in results.values()) else "failed",
        created_at=datetime.utcnow()
    )
    
    await db[COLLECTIONS["posts"]].insert_one(
        post_doc.dict(by_alias=True, exclude={"id"})
    )
        
    successful_posts = sum(1 for r in results.values() if r.get("success"))
    return PostResponse(
        success = successful_posts > 0,
        results = results,
        message = f"Posted to {successful_posts}/{len(post.platform)} platforms successfully"
    )
    
@router.get("/dms", response_model = List[DMSummary])
async def get_dms(current_user: User = Depends(get_current_user)):
    db = get_db()
    
    # Fetch DMs from MongoDB
    dms_cursor = db[COLLECTIONS["dms"]].find({
        "user_id": str(current_user.id),
        "is_read": False
    }).sort("created_at", -1)
    
    # Group by platform
    platform_dms = {}
    async for dm in dms_cursor:
        platform = dm["platform"]
        if platform not in platform_dms:
            platform_dms[platform] = []
        platform_dms[platform].append(dm)
    
    # Create summaries
    summaries = []
    for platform, dms in platform_dms.items():
        important = [
            {
                "from": dm["sender"],
                "preview": dm["message"][:50] + "..." if len(dm["message"]) > 50 else dm["message"],
                "timestamp": dm["created_at"].isoformat()
            }
            for dm in dms[:5]  # Top 5 important
        ]
        
        summaries.append(DMSummary(
            platform=platform,
            unread_count=len(dms),
            important_messages=important,
            summary=f"{len(dms)} unread messages on {platform}"
        ))
    
    # If no DMs in DB, return mock data
    if not summaries:
        return [
            DMSummary(
                platform = Platform.INSTAGRAM,
                unread_count = 3,
                important_messages = [
                    {
                        "from": "Sarah",
                        "preview": "Hey! Did you see my post",
                        "timestamp": "2 hours ago"
                    }
                ],
                summary = "3 unread messages on Instagram"
            )
        ]
    
    return summaries
    
@router.get("/activity", response_model = ActivityFeed)
async def get_activity_feed(
    hours: int = 24,
    current_user: User = Depends(get_current_user)
):
    db = get_db()
    
    # Calculate time range
    time_cutoff = datetime.utcnow()
    from datetime import timedelta
    time_cutoff = time_cutoff - timedelta(hours=hours)
    
    # Fetch activities from MongoDB
    activities_cursor = db[COLLECTIONS["activities"]].find({
        "user_id": str(current_user.id),
        "created_at": {"$gte": time_cutoff}
    }).sort("created_at", -1).limit(50)
    
    activities = []
    priority_items = []
    unread_count = 0
    
    async for activity in activities_cursor:
        activity_item = {
            "id": str(activity["_id"]),
            "platform": activity["platform"],
            "type": activity["activity_type"],
            "content": activity.get("content", {}),
            "timestamp": activity["created_at"].isoformat(),
            "is_read": activity["is_read"]
        }
        activities.append(activity_item)
        
        if not activity["is_read"]:
            unread_count += 1
        
        if activity.get("priority", 0) > 0:
            priority_items.append(activity_item)
    
    # If no activities, return mock data
    if not activities:
        activities = [
            {
                "id": "1",
                "platform": "instagram",
                "type": "like",
                "content": "Jake liked your photo",
                "timestamp": "1 hour ago",
                "is_read": False
            }
        ]
        unread_count = 1
        priority_items = [activities[0]]
    
    return ActivityFeed(
        activities = activities,
        unread_count = unread_count,
        priority_items = priority_items
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
    
@router.get("/search")
async def search_content(
    query: str,
    platform: List[Platform] = None,
    current_user: User = Depends(get_current_user)
):
    
    return{
        "query": query,
        "results": [
            {
                "platform": "instagram",
                "type": "post",
                "user":"Sarah",
                "content":"Beach Day !",
                "url": "hhtps://instagram.com/p/123"
            }
        ]
    }