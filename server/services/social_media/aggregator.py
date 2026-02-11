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
    
    async def get_all_dms(self) -> List[Dict[str, Any]]:
        
        all_dms = []
        
        return all_dms
    
    async def search_across_platforms(self, query: str) -> List[Dict[str, Any]]:
        results = []
        
        return results
    
    def _generate_summary(self, briefing: Dict[str, Any]) -> str:
        
        summary_parts = []
        
        if briefing["top_posts"]:
            post_count = len(briefing["top_posts"])
            summary_parts.append(f"You have {post_count} recent posts")
            
        if briefing["unread_dms"] > 0:
            summary_parts.append(f"{briefing['unread_dms']} unread messages")
            
        if summary_parts:
            return " and ".join(summary_parts) + "!"
        
        return "All caught up! Nothing new right now"
    
    async def get_activity_feed(self, hours: int = 24) -> List[Dict[str, Any]]:
        
        activities = []
        
        if "instagram" in self.accounts:
            media = await self.accounts["instagram"].get_recent_media(limit = 10)
            for item in media:
                timestamp = item.get("timestamp")
                if self._is_recent(timestamp, hours):
                    activities.append({
                        "platform": "instagram",
                        "type": "post",
                        "summary": f"Posted to Instagram: {item.get('caption', '')[:50]}...",
                        "likes": item.get("like_count", 0),
                        "timestamp": timestamp
                    })
                    
        activities.sort(key = lambda x: x.get("timestamp", ""), reverse = True)
        
        return activities
    
    def _is_recent(self, timestamp_str: str, hours: int) -> bool:
        try:
            timestamp = datetime.fromisoformat(timestamp_str.replace("Z", "+00:00"))
            cutoff = datetime.utcnow() - timedelta(hours = hours)
            return timestamp > cutoff
        except:
            return False