import httpx
from typing import Optional, List, Dict, Any
class TwitterService:
    
    def __init__(self, bearer_token: str):
        self.bearer_token = bearer_token
        self.base_url = "https://api.twitter.com/2"
        
    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.bearer_token}",
            "Content-Type": "application/json"
        }
        
    async def get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        url = f"{self.base_url}/users/{user_id}"
        params = {
            "user.fields": "created_at, description, public_metrics, profile_image_url"
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, headers=self._get_headers(), timeout=10.0)
                
                if response.status_code == 200:
                    return response.json().get("data")
            return None
        
        except Exception as e:
            print(f"Twitter API eroor: {e}")
            return None
        
    async def get_user_tweets(self, user_id: str, max_results: int = 10) -> List[Dict[str, Any]]:
        
        url = f"{self.base_url}/users/{user_id}/tweets"
        params = {
            "max_results": max_results,
            "tweets.fields": "created_at, public_metrics, entities",
            "expansions": "attachments.media_keys",
            "media.fields": "url,preview_image_url"
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, headers=self._get_headers(), timeout=10.0)
                
                if response.status_code == 200:
                    return response.json().get("data", [])
            return []
        
        except Exception as e:
            print(f"Error fetching tweets: {e}")    
            return []
        
    async def get_dms(self, user_id: str) -> List[Dict[str, Any]]:
        
        url = f"{self.base_url}/dm_conversations/with/{user_id}/dm_events"
        params = {
            "dm_events.fields": "created_at, text, sender_id",
            "max_results": 20
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params=params, headers=self._get_headers(), timeout=10.0)
                
                if response.status_code == 200:
                    return response.json().get("data", [])
                return []
        except Exception as e:
            print(f"Error fetching DMs: {e}")
            return []

    async def post_tweet(self, text: str) -> Optional[Dict[str, Any]]:
        """Create a new Tweet with the given text. Note: requires user-scoped token with write permissions."""
        url = f"{self.base_url}/tweets"
        payload = {"text": text}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload, headers=self._get_headers(), timeout=10.0)
                if response.status_code in (200, 201):
                    return response.json()
                print(f"Twitter post error: {response.status_code} {response.text}")
                return None
        except Exception as e:
            print(f"Error posting tweet: {e}")
            return None