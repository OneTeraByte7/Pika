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
            
        async def get_recent_media(self, limit: int = 10) -> List[Dict[str, Any]]:
            url = f"{self.base_url}/me/media"
            params = {
                "fields": "id, caption, media_type, media_url, thumbnail_url, permalink, timestamp, like_count, comments_count",
                "limit": limit,
                "access_token": self.access_token
            }
            
            try:
                async with httpx.AsyncClient() as client:
                    response = await client.get(url, params = params, timeout = 10.0)
                    
                    if response.status_code == 200:
                        data = response.json()
                        return data.get("data", [])
                    return []
                
            except Exception as e:
                print(f"Error fetching recent media: {e}")
                return []
            
    async def post_media(self, image_url: str, caption: str) -> Optional[Dict[str, Any]]:
        
        create_url = f"{self.base_url}/me/media"
        create_params = {
            "image_url": image_url,
            "caption": caption,
            "access_token": self.access_token
        }
        
        try:
            async with httpx.AsyncClient() as client:
                create_response = await client.post(create_url, params = create_params,timeout = 15.0)
                
                if create_response.status_code != 200:
                    return None

                container_id = create_response.json().get("id")
                
                publish_url = f"{self.base_url}/me/media_publish"
                publish_params = {
                    "creation_id": container_id,
                    "access_token": self.access_token
                }
                
                publish_response = await client.post(publish_url, param = publish_params, timeout = 15.0)
                
                if publish_response.status_code == 200:
                    return publish_response.json()
                return None
            
        except Exception as e:
            print(f"Error posting to Instagram: {e}")
            return None
        
    async def get_comments(self, media_id: str) -> List[Dict[str, Any]]:
        url = f"{self.base_url}/{media_id}/comments"
        params = {
            "fileds": "id text, username, timestamp",
            "access_token": self.access_token 
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(url, params = params, timeout = 10.0)
                
                if response.status_code == 200:
                    data = response.json()
                    return data.get("data", [])
                return []
            
        except Exception as e:
            print(f"Error fetching comments: {e}")
            return []
        
    
    async def post_comment(self, media_id: str, text: str) -> Optional[Dict[str,Any]]:
        
        url = f"{self.base_url}/{media_id}/comments"
        
        params = {
            "message": text,
            "access_token": self.access_token 
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, params = params, timeout = 10.0)
                
                if response.status_code == 200:
                    return response.json()
                return None
        except Exception as e:
            print(f"Error posting comment: {e}")
            return None