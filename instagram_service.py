import httpx
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta

class InstagramService:
    
    def __init__(self, access_token: str):
        self.access_token = access_token
        self.base_url = "https://graph.instagram.com"
        
        async def get_user_profile(self) -> Optional[Dict[str,Any]]:
            
            url = f"{self.base_url}/me"
            params = {
                "fields": "id, username, account_type, media_count",
                "access_token": self.access_token   
            }
            
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(url, params, timeout = 10.0)
                    
                    if response.status_code == 200:
                        return response.json()
                    
                return None
            
            except Exception as e:
                print(f"Instagram API eror: {e}")
                return None 