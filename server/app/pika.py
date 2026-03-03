from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from datetime import datetime
from server.models.schemas import VoiceQuery, VoiceResponse, BriefingRequest, BriefingResponse
from server.models.database import User, Briefing, Comment
from server.models.database import VoiceQuery as VoiceQueryModel
from server.app.auth import get_current_user
from server.services.ai.pika_agent import PikaAI
from server.services.voice.voice_service import VoiceService
from server.services.social_media.aggregator import SocialMediaAggregator
from server.models.mongodb import get_db, COLLECTIONS

router = APIRouter(prefix = "/pika", tags = ["pika"])

pika_ai = PikaAI()
voice_service = VoiceService()

@router.post("/query", response_model = VoiceResponse)
async def process_query(
    query: VoiceQuery,
    current_user: User = Depends(get_current_user)
):
    db = get_db()
    
    user_input = query.text if query.text else ""
    
    if not user_input:
        raise HTTPException(status_code = 400, detail = "No input provided")
    
    context =  {
        "recent_activities":[
            {
                "platform": "instagram",
                "type": "post",
                "summary": "Your friend Sarah posted a photo",
                "timestamp": "2 hours ago"
            }
        ],
        
        "unread_dms": 5
    }
    
    ai_response = pika_ai.process_query(user_input, context)
    
    audio_url = None
    if voice_service.api_key:
        audio_url = await voice_service.get_audio_url(ai_response["response"])
    
    # Store voice query in MongoDB
    voice_query_doc = VoiceQueryModel(
        user_id=str(current_user.id),
        session_id=query.session_id,
        audio_data=query.audio_data,
        text_input=user_input,
        text_response=ai_response['response'],
        audio_url=audio_url,
        actions=ai_response.get("actions", []),
        created_at=datetime.utcnow()
    )
    
    await db[COLLECTIONS["voice_queries"]].insert_one(
        voice_query_doc.dict(by_alias=True, exclude={"id"})
    )
        
    return VoiceResponse(
        text = ai_response['response'],
        audio_url = audio_url,
        actions = ai_response.get("actions", [])
    )
    
@router.post("/briefing", response_model = BriefingResponse)
async def get_briefing(
    request: BriefingRequest,
    current_user: User = Depends(get_current_user)    
):
    db = get_db()
    
    mock_accounts = []
    aggregator = SocialMediaAggregator(mock_accounts)
    
    briefing = await aggregator.get_morning_briefing()
    
    if not briefing["top_posts"]:
        briefing = {
            "summary": "Your friend Sarah posted engaged! You have 5 unread DMs",
            "highlights":[
                {
                    "type": "engagement",
                    "user": "Sarah",
                    "platform": "instagram",
                    "description": "Posted engagement photo with ring"
                }
            ],
            
            "unread_dms": 5,
            "top_posts": [
                {
                    "platform": "instgram",
                    "user": "Sarah",
                    "type": "image",
                    "caption": "He said yes!",
                    "likes": 47,
                    "comments": 13
                }
            ],
            "notifications": [
                {
                    "type": "like",
                    "user": "Jake",
                    "platform": "twitter",
                    "content": "liked your tweet"
                }
            ]
        }
    
    # Store briefing in MongoDB
    briefing_doc = Briefing(
        user_id=str(current_user.id),
        time_range=request.time_range,
        summary=briefing["summary"],
        highlights=briefing["highlights"],
        unread_dms=briefing["unread_dms"],
        top_posts=briefing["top_posts"],
        notifications=briefing["notifications"],
        created_at=datetime.utcnow()
    )
    
    await db[COLLECTIONS["briefings"]].insert_one(
        briefing_doc.dict(by_alias=True, exclude={"id"})
    )
        
    return BriefingResponse(**briefing)

@router.post("/comment/generate")
async def generate_comment(
    context: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    db = get_db()
    
    comment_text = pika_ai.generate_comment(
        context.get("post_content", ""),
        context.get("tone", "friendly")
    )
    
    # Store comment in MongoDB
    comment_doc = Comment(
        user_id=str(current_user.id),
        post_content=context.get("post_content", ""),
        tone=context.get("tone", "friendly"),
        generated_comment=comment_text,
        platform=context.get("platform"),
        was_posted=False,
        created_at=datetime.utcnow()
    )
    
    await db[COLLECTIONS["comments"]].insert_one(
        comment_doc.dict(by_alias=True, exclude={"id"})
    )
    
    return{
        "comment": comment_text,
        "suggestions": [
            "This is amazing",
            "Love this"
        ]
    }
    
    
@router.get("/status")
async def get_pika_status(current_user: User = Depends(get_current_user)):
    
    return {
        "status": "active",
        "connected_platform": [],
        "voice_enabled": voice_service.api_key is not None,
        "features": {
            "briefing": True,
            "cross_posting": True,
            "dm_aggregation": True,
            "voice_input": True,
            "voice_input": voice_service.api_key is not None
        } 
    }