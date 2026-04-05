from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import RedirectResponse
from typing import Optional
import httpx
from urllib.parse import urlencode
import secrets
import hashlib
import base64
from datetime import datetime

from server.models.database import User, SocialAccount
from server.app.auth import get_current_user
from server.config.settings import settings
from server.models.mongodb import get_db, COLLECTIONS

router = APIRouter(prefix="/twitter", tags=["twitter-oauth"])

# Store state tokens temporarily (use Redis in production)
oauth_states = {}

@router.get("/auth/url")
async def get_twitter_auth_url(current_user: User = Depends(get_current_user)):
    """Generate Twitter OAuth 2.0 authorization URL"""
    
    if not settings.TWITTER_CLIENT_ID or not settings.TWITTER_CLIENT_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Twitter OAuth client credentials not configured"
        )
    
    # Generate state for CSRF protection and PKCE code_verifier
    state = secrets.token_urlsafe(32)
    # PKCE code_verifier (high-entropy random string)
    code_verifier = secrets.token_urlsafe(64)

    # Create code_challenge using S256 (base64url of sha256)
    digest = hashlib.sha256(code_verifier.encode('utf-8')).digest()
    code_challenge = base64.urlsafe_b64encode(digest).rstrip(b"=").decode('utf-8')

    # Store both user id and verifier for this state
    oauth_states[state] = {
        'user_id': str(current_user.id),
        'code_verifier': code_verifier
    }
    
    # Twitter OAuth 2.0 authorization URL
    base_url = "https://twitter.com/i/oauth2/authorize"
    
    # Scopes needed for posting tweets, reading profile, etc.
    scopes = [
        "tweet.read",
        "tweet.write",
        "users.read",
        "offline.access"  # For refresh token
    ]
    
    params = {
        "response_type": "code",
        "client_id": settings.TWITTER_CLIENT_ID,
        "redirect_uri": f"{settings.FRONTEND_URL}/twitter-callback",
        "scope": " ".join(scopes),
        "state": state,
        "code_challenge": code_challenge,
        "code_challenge_method": "S256"
    }
    
    auth_url = f"{base_url}?{urlencode(params)}"
    
    return {
        "auth_url": auth_url,
        "state": state
    }

@router.post("/auth/callback")
async def twitter_callback(
    code: str,
    state: str,
    current_user: User = Depends(get_current_user)
):
    """Handle Twitter OAuth callback and exchange code for tokens"""
    
    # Verify state
    if state not in oauth_states:
        raise HTTPException(status_code=400, detail="Invalid state parameter")
    
    user_id = oauth_states.pop(state)
    if user_id != str(current_user.id):
        raise HTTPException(status_code=403, detail="User mismatch")
    
    # Exchange code for access token
    token_url = "https://api.twitter.com/2/oauth2/token"
    
    # Retrieve stored PKCE verifier for this state
    stored = oauth_states.get(state)
    code_verifier = None
    if isinstance(stored, dict):
        code_verifier = stored.get('code_verifier')

    data = {
        "code": code,
        "grant_type": "authorization_code",
        "client_id": settings.TWITTER_CLIENT_ID,
        "redirect_uri": f"{settings.FRONTEND_URL}/twitter-callback",
        "code_verifier": code_verifier or ""
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                token_url,
                data=data,
                auth=(settings.TWITTER_CLIENT_ID, settings.TWITTER_CLIENT_SECRET)
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to get access token: {response.text}"
                )
            
            token_data = response.json()
            access_token = token_data.get("access_token")
            refresh_token = token_data.get("refresh_token")
            
            # Get user profile
            user_profile = await get_twitter_user_profile(access_token)
            
            if not user_profile:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to get Twitter user profile"
                )
            
            # Store in database
            db = get_db()
            
            # Check if account already exists
            existing = await db[COLLECTIONS["social_accounts"]].find_one({
                "user_id": str(current_user.id),
                "platform": "twitter"
            })
            
            if existing:
                # Update existing account
                await db[COLLECTIONS["social_accounts"]].update_one(
                    {"_id": existing["_id"]},
                    {
                        "$set": {
                            "access_token": access_token,
                            "refresh_token": refresh_token,
                            "platform_user_id": user_profile["id"],
                            "username": user_profile["username"],
                            "is_active": True,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
            else:
                # Create new account
                social_account = SocialAccount(
                    user_id=str(current_user.id),
                    platform="twitter",
                    platform_user_id=user_profile["id"],
                    username=user_profile["username"],
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
                "platform": "twitter",
                "username": user_profile["username"],
                "user_id": user_profile["id"],
                "message": "Successfully connected Twitter account"
            }
            
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=500,
            detail=f"HTTP error occurred: {str(e)}"
        )

async def get_twitter_user_profile(access_token: str) -> Optional[dict]:
    """Get Twitter user profile using access token"""
    url = "https://api.twitter.com/2/users/me"
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            
            if response.status_code == 200:
                return response.json().get("data")
            return None
    except Exception as e:
        print(f"Error getting Twitter profile: {e}")
        return None

@router.post("/refresh-token")
async def refresh_twitter_token(current_user: User = Depends(get_current_user)):
    """Refresh Twitter access token using refresh token"""
    
    db = get_db()
    
    account = await db[COLLECTIONS["social_accounts"]].find_one({
        "user_id": str(current_user.id),
        "platform": "twitter",
        "is_active": True
    })
    
    if not account or not account.get("refresh_token"):
        raise HTTPException(
            status_code=404,
            detail="Twitter account not found or no refresh token available"
        )
    
    token_url = "https://api.twitter.com/2/oauth2/token"
    
    data = {
        "grant_type": "refresh_token",
        "refresh_token": account["refresh_token"],
        "client_id": settings.TWITTER_CLIENT_ID
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                token_url,
                data=data,
                auth=(settings.TWITTER_CLIENT_ID, settings.TWITTER_CLIENT_SECRET)
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=400,
                    detail="Failed to refresh token"
                )
            
            token_data = response.json()
            new_access_token = token_data.get("access_token")
            new_refresh_token = token_data.get("refresh_token")
            
            # Update in database
            await db[COLLECTIONS["social_accounts"]].update_one(
                {"_id": account["_id"]},
                {
                    "$set": {
                        "access_token": new_access_token,
                        "refresh_token": new_refresh_token,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            return {
                "success": True,
                "message": "Token refreshed successfully"
            }
            
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=500,
            detail=f"HTTP error: {str(e)}"
        )
