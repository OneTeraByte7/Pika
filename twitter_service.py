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
                response = await client.get(url, params = params, header = self._get_headers(),timeout = 10.0)
                
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
                response = await client.get(url, params = params, header = self._get_header(), timeout = 10.0)
                
                if response.status_code == 200:
                    return response.json().get("data", [])
            return []
        
        except Exception as e:
            print(f"Error fetching tweets: {e}")    
            return []