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