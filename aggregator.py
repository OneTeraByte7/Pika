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
                
    