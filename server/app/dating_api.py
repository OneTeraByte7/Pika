from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from server.models.dating import (
    DatingProfileCreate, DatingProfileResponse,
    UserPreferenceCreate, UserPreferenceResponse,
    SwipeCreate, SwipeResponse,
    MatchResponse, LikeResponse,
    RecommendationResponse, BlockedUserResponse,
    ReportCreate, ReportResponse,
    MessageCreate, MessageResponse,
    ConversationResponse, ConversationDetailResponse,
    ConversationListResponse
)
from server.models.mongodb import get_db
from server.services.dating_services import (
    ProfileService, MatchingService, InteractionService
)
from server.services.dating_recommendations import RecommendationEngine
from server.services.dating_messaging import MessagingService
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/api/dating", tags=["dating"])


async def get_profile_service(db=Depends(get_db)):
    return ProfileService(db)


async def get_matching_service(db=Depends(get_db)):
    return MatchingService(db)


async def get_interaction_service(db=Depends(get_db)):
    return InteractionService(db)


async def get_recommendation_engine(db=Depends(get_db)):
    return RecommendationEngine(db)


async def get_messaging_service(db=Depends(get_db)):
    return MessagingService(db)


# Profile Management Endpoints
@router.post("/profiles", response_model=DatingProfileResponse)
async def create_dating_profile(
    profile_data: DatingProfileCreate,
    user_id: str,
    profile_service: ProfileService = Depends(get_profile_service)
):
    """Create a new dating profile."""
    try:
        return await profile_service.create_profile(profile_data, user_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/profiles/{profile_id}", response_model=DatingProfileResponse)
async def get_dating_profile(
    profile_id: str,
    profile_service: ProfileService = Depends(get_profile_service)
):
    """Get a dating profile by ID."""
    profile = await profile_service.get_profile(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    await profile_service.increment_profile_views(profile_id)
    return profile


@router.get("/profiles/user/{user_id}", response_model=DatingProfileResponse)
async def get_user_dating_profile(
    user_id: str,
    profile_service: ProfileService = Depends(get_profile_service)
):
    """Get dating profile for a Pika user."""
    profile = await profile_service.get_user_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Dating profile not found")
    return profile


@router.put("/profiles/{profile_id}", response_model=DatingProfileResponse)
async def update_dating_profile(
    profile_id: str,
    updates: dict,
    profile_service: ProfileService = Depends(get_profile_service)
):
    """Update a dating profile."""
    profile = await profile_service.update_profile(profile_id, updates)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.delete("/profiles/{profile_id}")
async def delete_dating_profile(
    profile_id: str,
    profile_service: ProfileService = Depends(get_profile_service)
):
    """Delete a dating profile."""
    success = await profile_service.delete_profile(profile_id)
    if not success:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {"message": "Profile deleted successfully"}


@router.post("/profiles/{profile_id}/link-pika")
async def link_pika_user(
    profile_id: str,
    pika_user_id: str,
    profile_service: ProfileService = Depends(get_profile_service)
):
    """Link a dating profile to a Pika user account."""
    profile = await profile_service.link_pika_user(profile_id, pika_user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.post("/profiles/{profile_id}/photos")
async def upload_photo(
    profile_id: str,
    photo_url: str,
    caption: Optional[str] = None,
    is_primary: bool = False,
    profile_service: ProfileService = Depends(get_profile_service)
):
    """Upload a photo to a dating profile."""
    profile = await profile_service.upload_photo(profile_id, photo_url, caption, is_primary)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


# User Preferences Endpoints
@router.post("/preferences", response_model=UserPreferenceResponse)
async def set_user_preference(
    user_id: str,
    preference_data: UserPreferenceCreate,
    profile_service: ProfileService = Depends(get_profile_service)
):
    """Set or update user dating preferences."""
    try:
        return await profile_service.set_user_preference(user_id, preference_data)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/preferences/{user_id}", response_model=UserPreferenceResponse)
async def get_user_preference(
    user_id: str,
    profile_service: ProfileService = Depends(get_profile_service)
):
    """Get user's dating preferences."""
    pref = await profile_service.get_user_preference(user_id)
    if not pref:
        raise HTTPException(status_code=404, detail="Preferences not found")
    return pref


# Matching Endpoints
@router.get("/matches/preference-based/{profile_id}", response_model=List[str])
async def get_preference_based_matches(
    profile_id: str,
    matching_service: MatchingService = Depends(get_matching_service)
):
    """Get preference-based matching results."""
    try:
        return await matching_service.preference_based_matching(profile_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/matches/vector-based/{profile_id}")
async def get_vector_based_matches(
    profile_id: str,
    limit: int = 20,
    matching_service: MatchingService = Depends(get_matching_service)
):
    """Get vector-based (interest similarity) matches."""
    try:
        return await matching_service.vector_based_matching(profile_id, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/matches/real-time/{profile_id}")
async def get_real_time_matches(
    profile_id: str,
    limit: int = 10,
    matching_service: MatchingService = Depends(get_matching_service)
):
    """Get real-time active profile matches."""
    try:
        return await matching_service.real_time_matching(profile_id, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Swipe/Interaction Endpoints
@router.post("/swipes/right", response_model=SwipeResponse)
async def swipe_right(
    from_profile_id: str,
    to_profile_id: str,
    interaction_service: InteractionService = Depends(get_interaction_service)
):
    """Swipe right (like) a profile."""
    try:
        is_blocked = await interaction_service.is_blocked(from_profile_id, to_profile_id)
        if is_blocked:
            raise HTTPException(status_code=403, detail="Cannot interact with this profile")
        return await interaction_service.swipe_right(from_profile_id, to_profile_id)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/swipes/left", response_model=SwipeResponse)
async def swipe_left(
    from_profile_id: str,
    to_profile_id: str,
    interaction_service: InteractionService = Depends(get_interaction_service)
):
    """Swipe left (pass) a profile."""
    try:
        return await interaction_service.swipe_left(from_profile_id, to_profile_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/matches/{profile_id}", response_model=List[MatchResponse])
async def get_user_matches(
    profile_id: str,
    interaction_service: InteractionService = Depends(get_interaction_service)
):
    """Get all matches for a profile."""
    try:
        return await interaction_service.get_matches(profile_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/matches/{profile_id}/{other_profile_id}", response_model=MatchResponse)
async def get_specific_match(
    profile_id: str,
    other_profile_id: str,
    interaction_service: InteractionService = Depends(get_interaction_service)
):
    """Get match between two specific profiles."""
    try:
        match = await interaction_service.get_match_with_profile(profile_id, other_profile_id)
        if not match:
            raise HTTPException(status_code=404, detail="Match not found")
        return match
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Block/Report Endpoints
@router.post("/blocks", response_model=BlockedUserResponse)
async def block_user(
    from_profile_id: str,
    to_profile_id: str,
    interaction_service: InteractionService = Depends(get_interaction_service)
):
    """Block a user."""
    try:
        return await interaction_service.block_user(from_profile_id, to_profile_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/reports", response_model=ReportResponse)
async def report_profile(
    report_data: ReportCreate,
    reporter_profile_id: str,
    db=Depends(get_db)
):
    """Report a profile for violation."""
    try:
        report_doc = {
            "_id": ObjectId(),
            "reporter_profile_id": reporter_profile_id,
            "reported_profile_id": report_data.reported_profile_id,
            "reason": report_data.reason,
            "description": report_data.description,
            "status": "pending",
            "created_at": datetime.utcnow()
        }
        result = await db["reports"].insert_one(report_doc)
        report_doc["id"] = str(result.inserted_id)
        return ReportResponse(**report_doc)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Recommendation Endpoints
@router.get("/recommendations/top/{profile_id}", response_model=List[RecommendationResponse])
async def get_top_recommendations(
    profile_id: str,
    limit: int = 10,
    recommendation_engine: RecommendationEngine = Depends(get_recommendation_engine)
):
    """Get top matched profile recommendations."""
    try:
        return await recommendation_engine.get_top_matches(profile_id, limit=limit)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/recommendations/suggestions/{profile_id}", response_model=List[RecommendationResponse])
async def get_suggestions(
    profile_id: str,
    suggestion_type: str = "daily",
    recommendation_engine: RecommendationEngine = Depends(get_recommendation_engine)
):
    """Get personalized suggestions (daily, discover, nearby)."""
    try:
        return await recommendation_engine.get_suggestions(profile_id, suggestion_type)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/recommendations/compatibility/{profile_id}/{other_profile_id}")
async def get_compatibility(
    profile_id: str,
    other_profile_id: str,
    recommendation_engine: RecommendationEngine = Depends(get_recommendation_engine)
):
    """Calculate compatibility score between two profiles."""
    try:
        score = await recommendation_engine.calculate_compatibility(profile_id, other_profile_id)
        return {"profile_id": profile_id, "other_profile_id": other_profile_id, "compatibility_score": score}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/recommendations/mutual-interests/{profile_id}/{other_profile_id}")
async def get_mutual_interests(
    profile_id: str,
    other_profile_id: str,
    recommendation_engine: RecommendationEngine = Depends(get_recommendation_engine)
):
    """Get shared interests between two profiles."""
    try:
        interests = await recommendation_engine.detect_mutual_interests(profile_id, other_profile_id)
        return {"profile_id": profile_id, "other_profile_id": other_profile_id, "shared_interests": interests}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
