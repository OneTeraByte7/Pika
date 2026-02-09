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
        