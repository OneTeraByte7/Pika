from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, Any
from models.schemas import VoiceQuery, VoiceResponse, BriefingRequest, BriefingResponse
from models.database import User
from app.auth import get_current_user
from services.ai.pika_agent import PikaAI
from services.voice.voice_service import VoiceService
from services.social_media.aggregator import SocialMediaAggregator

router = APIRouter(prefix = "/pika", tags = ["pika"])

pika_ai = PikaAI()
voice_service = VoiceService()

@router.post("/query", response_model = VoiceResponse)
async def process_query(
    query: VoiceQuery,
    current_user: User = Depends(get_current_user)
):
    
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
        
    return VoiceResponse(
        text = ai_response['response'],
        audio_url = audio_url,
        actions = ai_response.get("actions", [])
    )
    
@router.post("/briefing", reponse_model = BriefingResponse)
async def get_briefing(
    request: BriefingRequest,
    current_user: User = Depends(get_current_user)    
):
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
        
    return BriefingResponse(**briefing)

@router.post("/comment/generate")
async def generate_comment(
    context: Dict[str, Any],
    current_user: User = Depends(get_current_user)
):
    comment_text = pika_ai.generate_comment(
        context.get("post_content", ""),
        context.get("tone", "friendly")
    )
    
    return{
        "comment": comment_text,
        "suggestions": [
            "This is amazing",
            "Love this"
        ]
    }
    