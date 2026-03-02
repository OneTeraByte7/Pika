"""
Webhook Handler - Process incoming webhooks from social media platforms
"""

from typing import Dict, List, Any, Optional, Callable
from datetime import datetime
from enum import Enum
import hmac
import hashlib
import json


class WebhookEvent(Enum):
    POST_CREATED = "post_created"
    POST_UPDATED = "post_updated"
    POST_DELETED = "post_deleted"
    COMMENT_ADDED = "comment_added"
    LIKE_RECEIVED = "like_received"
    FOLLOWER_GAINED = "follower_gained"
    FOLLOWER_LOST = "follower_lost"
    MESSAGE_RECEIVED = "message_received"
    MENTION = "mention"


class WebhookHandler:
    """Handle and process webhooks from social platforms"""
    
    def __init__(self):
        self.event_handlers: Dict[WebhookEvent, List[Callable]] = {}
        self.webhook_secrets: Dict[str, str] = {}
        self.webhook_history: List[Dict[str, Any]] = []
    
    def register_handler(
        self,
        event: WebhookEvent,
        handler: Callable
    ):
        """Register a handler for specific webhook event"""
        if event not in self.event_handlers:
            self.event_handlers[event] = []
        
        self.event_handlers[event].append(handler)
    
    def set_webhook_secret(
        self,
        platform: str,
        secret: str
    ):
        """Set webhook verification secret for a platform"""
        self.webhook_secrets[platform] = secret
    
    def verify_signature(
        self,
        platform: str,
        payload: str,
        signature: str
    ) -> bool:
        """Verify webhook signature"""
        if platform not in self.webhook_secrets:
            return False
        
        secret = self.webhook_secrets[platform]
        
        expected_signature = hmac.new(
            secret.encode(),
            payload.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(signature, expected_signature)
    
    async def process_webhook(
        self,
        platform: str,
        event_type: str,
        payload: Dict[str, Any],
        signature: Optional[str] = None
    ) -> Dict[str, Any]:
        """Process incoming webhook"""
        webhook_id = f"webhook_{datetime.now().timestamp()}"
        
        if signature:
            is_valid = self.verify_signature(
                platform,
                json.dumps(payload),
                signature
            )
            
            if not is_valid:
                return {
                    "webhook_id": webhook_id,
                    "status": "rejected",
                    "reason": "Invalid signature"
                }
        
        try:
            event = WebhookEvent(event_type)
        except ValueError:
            return {
                "webhook_id": webhook_id,
                "status": "rejected",
                "reason": f"Unknown event type: {event_type}"
            }
        
        self.webhook_history.append({
            "webhook_id": webhook_id,
            "platform": platform,
            "event_type": event_type,
            "timestamp": datetime.now().isoformat(),
            "payload_size": len(json.dumps(payload))
        })
        
        if event in self.event_handlers:
            results = []
            for handler in self.event_handlers[event]:
                try:
                    result = await handler(platform, payload)
                    results.append(result)
                except Exception as e:
                    results.append({"error": str(e)})
            
            return {
                "webhook_id": webhook_id,
                "status": "processed",
                "event": event.value,
                "handlers_executed": len(results),
                "results": results
            }
        
        return {
            "webhook_id": webhook_id,
            "status": "no_handlers",
            "event": event.value
        }
    
    def get_webhook_stats(self) -> Dict[str, Any]:
        """Get webhook statistics"""
        total_webhooks = len(self.webhook_history)
        
        by_platform = {}
        by_event = {}
        
        for webhook in self.webhook_history:
            platform = webhook['platform']
            event = webhook['event_type']
            
            by_platform[platform] = by_platform.get(platform, 0) + 1
            by_event[event] = by_event.get(event, 0) + 1
        
        return {
            "total_webhooks": total_webhooks,
            "by_platform": by_platform,
            "by_event": by_event,
            "registered_handlers": {
                event.value: len(handlers)
                for event, handlers in self.event_handlers.items()
            }
        }


class InstagramWebhookProcessor:
    """Specialized processor for Instagram webhooks"""
    
    async def process_comment(
        self,
        platform: str,
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process new comment webhook"""
        comment_id = payload.get('comment_id')
        post_id = payload.get('post_id')
        text = payload.get('text')
        author = payload.get('from', {}).get('username')
        
        return {
            "action": "comment_processed",
            "comment_id": comment_id,
            "post_id": post_id,
            "author": author,
            "requires_moderation": self._check_moderation(text)
        }
    
    def _check_moderation(self, text: str) -> bool:
        """Check if comment requires moderation"""
        spam_keywords = ['free', 'click here', 'buy now', 'limited offer']
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in spam_keywords)
    
    async def process_mention(
        self,
        platform: str,
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process mention webhook"""
        media_id = payload.get('media_id')
        mentioned_by = payload.get('mentioned_by')
        
        return {
            "action": "mention_detected",
            "media_id": media_id,
            "mentioned_by": mentioned_by,
            "notification_sent": True
        }


class TwitterWebhookProcessor:
    """Specialized processor for Twitter/X webhooks"""
    
    async def process_tweet_engagement(
        self,
        platform: str,
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process tweet engagement webhook"""
        tweet_id = payload.get('tweet_id')
        engagement_type = payload.get('type')
        user = payload.get('user', {}).get('screen_name')
        
        return {
            "action": "engagement_recorded",
            "tweet_id": tweet_id,
            "type": engagement_type,
            "user": user
        }
    
    async def process_direct_message(
        self,
        platform: str,
        payload: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Process direct message webhook"""
        message_id = payload.get('message_id')
        sender = payload.get('sender', {}).get('screen_name')
        text = payload.get('text')
        
        return {
            "action": "dm_received",
            "message_id": message_id,
            "sender": sender,
            "auto_response": self._should_auto_respond(text)
        }
    
    def _should_auto_respond(self, text: str) -> bool:
        """Determine if auto-response is appropriate"""
        auto_respond_triggers = ['hello', 'hi', 'help', 'support']
        text_lower = text.lower()
        return any(trigger in text_lower for trigger in auto_respond_triggers)


class WebhookRetryManager:
    """Manage webhook delivery retries"""
    
    def __init__(self):
        self.failed_webhooks: List[Dict[str, Any]] = []
        self.retry_attempts: Dict[str, int] = {}
        self.max_retries = 3
    
    def add_failed_webhook(
        self,
        webhook_id: str,
        platform: str,
        payload: Dict[str, Any],
        error: str
    ):
        """Add failed webhook for retry"""
        self.failed_webhooks.append({
            "webhook_id": webhook_id,
            "platform": platform,
            "payload": payload,
            "error": error,
            "failed_at": datetime.now().isoformat(),
            "retry_count": 0
        })
    
    async def retry_failed_webhooks(
        self,
        webhook_handler: WebhookHandler
    ) -> Dict[str, Any]:
        """Retry processing failed webhooks"""
        retry_results = {
            "attempted": 0,
            "succeeded": 0,
            "failed": 0
        }
        
        webhooks_to_remove = []
        
        for webhook in self.failed_webhooks:
            webhook_id = webhook['webhook_id']
            
            if webhook['retry_count'] >= self.max_retries:
                webhooks_to_remove.append(webhook)
                continue
            
            webhook['retry_count'] += 1
            retry_results['attempted'] += 1
            
            try:
                result = await webhook_handler.process_webhook(
                    platform=webhook['platform'],
                    event_type=webhook['payload'].get('event'),
                    payload=webhook['payload']
                )
                
                if result['status'] == 'processed':
                    webhooks_to_remove.append(webhook)
                    retry_results['succeeded'] += 1
                else:
                    retry_results['failed'] += 1
                    
            except Exception as e:
                retry_results['failed'] += 1
        
        for webhook in webhooks_to_remove:
            self.failed_webhooks.remove(webhook)
        
        return retry_results
