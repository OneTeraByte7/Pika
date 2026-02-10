from typing import List, Dict, Any
from .instagram_service import InstagramService
from .twitter_service import TwitterService
from datetime import datetime, timedelta

class SocialMediaAggregator:
    
    def __init__(self, user_accounts: List[Dict[str, Any]]):
        self.accounts = {}
        
        for account in user_accounts:
            platform = account.get("platform")
            access_token = account.get("access_token")
            
            if platform == "instagram" and access_token:
                self.accounts["instgram"] = InstagramService(access_token)
            
            elif platform == "twitter" and access_token:
                self.accounts["twitter"] = TwitterService(access_token)
                
    async def get_morning_briefing(self) -> Dict[str, Any]:
        
        briefing = {
            "summary": "",
            "highlights": [],
            "unread_dms": 0,
            "top_posts": [],
            "notifications": []
        }
        
        if "instagram" in self.accounts:
            ig_media = await self.accounts["instagram"].get_recent_media(limit = 5)
            for media in ig_media:
                briefing["top_posts"].appen({
                    "platform": "instagram",
                    "type": media.get("media_type"),
                    "caption": media.get("caption", "")[:100],
                    "likes": media.get("like_count", 0),
                    "comments": media.get("comments_count", 0),
                    "url": media.get("permalink")
                })
                
        if "twitter" in self.accounts:
            pass
        
        briefing["summary"] = self._generate_summary(briefing)
        
        return briefing
    
    async def post_to_multiple_platform(self, platforms: List[str], content:str, media_url: str = None) -> Dict[str, Any]:
        results = {}
        
        for platform in platforms:
            if platform == "instagram" and "instagram" in self.accounts:
                if media_url:
                    result = await self.accounts["instagram"].post_media(media_url, content)
                    result["instagram"] = {
                        "success": result is not None,
                        "data": result
                    }
            elif platform == "twitter" and "twitter" in self.accounts:
                result = await self.accounts["twitter"].post_tweet(content)
                results["twitter"] = {
                    "success": result is not None,
                    "data": result
                }
                
        return results
    