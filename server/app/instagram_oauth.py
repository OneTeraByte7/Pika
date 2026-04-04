from fastapi import APIRouter, HTTPException, Depends
import httpx
from urllib.parse import urlencode
import secrets
from datetime import datetime
from typing import Optional

from server.models.database import User, SocialAccount
from server.app.auth import get_current_user
from server.config.settings import settings
from server.models.mongodb import get_db, COLLECTIONS

router = APIRouter(prefix="/instagram", tags=["instagram-oauth"])

# Temporary in-memory state store (use Redis in production)
instagram_oauth_states = {}


@router.get("/auth/url")
async def get_instagram_auth_url(current_user: User = Depends(get_current_user)):
    if not settings.INSTAGRAM_CLIENT_ID or not settings.INSTAGRAM_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Instagram credentials not configured")

    state = secrets.token_urlsafe(32)
    instagram_oauth_states[state] = str(current_user.id)

    base_url = "https://api.instagram.com/oauth/authorize"
    params = {
        "client_id": settings.INSTAGRAM_CLIENT_ID,
        "redirect_uri": f"{settings.FRONTEND_URL}/instagram-callback",
        "scope": "user_profile,user_media",
        "response_type": "code",
        "state": state
    }

    auth_url = f"{base_url}?{urlencode(params)}"
    return {"auth_url": auth_url, "state": state}


@router.post("/auth/callback")
async def instagram_callback(code: str, state: str, current_user: User = Depends(get_current_user)):
    # Verify state
    if state not in instagram_oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state parameter")

    user_id = instagram_oauth_states.pop(state)
    if user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="User mismatch")

    token_url = "https://api.instagram.com/oauth/access_token"
    data = {
        "client_id": settings.INSTAGRAM_CLIENT_ID,
        "client_secret": settings.INSTAGRAM_CLIENT_SECRET,
        "grant_type": "authorization_code",
        "redirect_uri": f"{settings.FRONTEND_URL}/instagram-callback",
        "code": code
    }

    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(token_url, data=data, timeout=15.0)
            if resp.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Failed to exchange code: {resp.text}")

            token_data = resp.json()
            access_token = token_data.get("access_token")
            refresh_token = token_data.get("refresh_token")

            # Fetch basic profile from Graph API
            profile_url = f"https://graph.instagram.com/me"
            profile_params = {"fields": "id,username", "access_token": access_token}
            profile_resp = await client.get(profile_url, params=profile_params, timeout=10.0)
            if profile_resp.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Failed to get Instagram profile: {profile_resp.text}")

            profile = profile_resp.json()

            db = get_db()

            existing = await db[COLLECTIONS["social_accounts"]].find_one({
                "user_id": str(current_user.id),
                "platform": "instagram"
            })

            if existing:
                await db[COLLECTIONS["social_accounts"]].update_one(
                    {"_id": existing["_id"]},
                    {
                        "$set": {
                            "access_token": access_token,
                            "refresh_token": refresh_token,
                            "platform_user_id": profile.get("id"),
                            "username": profile.get("username"),
                            "is_active": True,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
            else:
                social_account = SocialAccount(
                    user_id=str(current_user.id),
                    platform="instagram",
                    platform_user_id=profile.get("id"),
                    username=profile.get("username"),
                    access_token=access_token,
                    refresh_token=refresh_token,
                    is_active=True,
                    created_at=datetime.utcnow(),
                    updated_at=datetime.utcnow()
                )

                await db[COLLECTIONS["social_accounts"]].insert_one(
                    social_account.dict(by_alias=True, exclude={"id"})
                )

            return {
                "success": True,
                "platform": "instagram",
                "username": profile.get("username"),
                "user_id": profile.get("id"),
                "message": "Successfully connected Instagram account"
            }

    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"HTTP error occurred: {str(e)}")
