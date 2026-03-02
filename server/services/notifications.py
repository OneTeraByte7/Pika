"""
Smart Notification Manager - Filter and prioritize notifications
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from enum import Enum
from dataclasses import dataclass, asdict
import uuid


class NotificationPriority(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class NotificationType(Enum):
    MENTION = "mention"
    COMMENT = "comment"
    LIKE = "like"
    FOLLOW = "follow"
    DM = "dm"
    SHARE = "share"
    TAG = "tag"
    MILESTONE = "milestone"


@dataclass
class Notification:
    id: str
    user_id: int
    type: NotificationType
    priority: NotificationPriority
    platform: str
    content: str
    actor: str
    post_id: Optional[str]
    timestamp: datetime
    is_read: bool = False
    is_actionable: bool = False
    metadata: Optional[Dict[str, Any]] = None
    
    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        data['type'] = self.type.value
        data['priority'] = self.priority.value
        data['timestamp'] = self.timestamp.isoformat()
        return data


class NotificationManager:
    """Intelligent notification filtering and prioritization"""
    
    def __init__(self):
        self.notifications: Dict[str, Notification] = {}
        self.user_preferences: Dict[int, Dict[str, Any]] = {}
        self.muted_users: Dict[int, List[str]] = {}
        
        self.priority_rules = {
            NotificationType.DM: NotificationPriority.HIGH,
            NotificationType.MENTION: NotificationPriority.HIGH,
            NotificationType.TAG: NotificationPriority.HIGH,
            NotificationType.COMMENT: NotificationPriority.MEDIUM,
            NotificationType.FOLLOW: NotificationPriority.MEDIUM,
            NotificationType.SHARE: NotificationPriority.MEDIUM,
            NotificationType.LIKE: NotificationPriority.LOW,
            NotificationType.MILESTONE: NotificationPriority.CRITICAL
        }
    
    def create_notification(
        self,
        user_id: int,
        notification_type: NotificationType,
        platform: str,
        content: str,
        actor: str,
        post_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Notification:
        """Create a new notification"""
        notif_id = str(uuid.uuid4())
        
        priority = self._calculate_priority(
            user_id=user_id,
            notification_type=notification_type,
            actor=actor,
            metadata=metadata
        )
        
        is_actionable = notification_type in [
            NotificationType.DM,
            NotificationType.COMMENT,
            NotificationType.MENTION
        ]
        
        notification = Notification(
            id=notif_id,
            user_id=user_id,
            type=notification_type,
            priority=priority,
            platform=platform,
            content=content,
            actor=actor,
            post_id=post_id,
            timestamp=datetime.now(),
            is_actionable=is_actionable,
            metadata=metadata
        )
        
        if not self._is_muted(user_id, actor):
            self.notifications[notif_id] = notification
        
        return notification
    
    def _calculate_priority(
        self,
        user_id: int,
        notification_type: NotificationType,
        actor: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> NotificationPriority:
        """Calculate notification priority based on various factors"""
        base_priority = self.priority_rules.get(notification_type, NotificationPriority.MEDIUM)
        
        prefs = self.user_preferences.get(user_id, {})
        vip_users = prefs.get('vip_users', [])
        
        if actor in vip_users:
            if base_priority == NotificationPriority.MEDIUM:
                return NotificationPriority.HIGH
            elif base_priority == NotificationPriority.LOW:
                return NotificationPriority.MEDIUM
        
        if metadata:
            engagement_count = metadata.get('engagement_count', 0)
            if engagement_count > 100:
                if base_priority == NotificationPriority.LOW:
                    return NotificationPriority.MEDIUM
        
        return base_priority
    
    def get_notifications(
        self,
        user_id: int,
        unread_only: bool = False,
        priority_filter: Optional[List[NotificationPriority]] = None,
        limit: int = 50
    ) -> List[Notification]:
        """Get notifications for a user"""
        user_notifications = [
            n for n in self.notifications.values()
            if n.user_id == user_id
        ]
        
        if unread_only:
            user_notifications = [n for n in user_notifications if not n.is_read]
        
        if priority_filter:
            priority_values = [p.value for p in priority_filter]
            user_notifications = [
                n for n in user_notifications
                if n.priority.value in priority_values
            ]
        
        sorted_notifications = sorted(
            user_notifications,
            key=lambda x: (
                ['critical', 'high', 'medium', 'low'].index(x.priority.value),
                x.timestamp
            ),
            reverse=True
        )
        
        return sorted_notifications[:limit]
    
    def get_smart_digest(
        self,
        user_id: int,
        time_range_hours: int = 24
    ) -> Dict[str, Any]:
        """Generate a smart digest of notifications"""
        cutoff_time = datetime.now() - timedelta(hours=time_range_hours)
        
        recent_notifications = [
            n for n in self.notifications.values()
            if n.user_id == user_id and n.timestamp >= cutoff_time
        ]
        
        critical_notifications = [
            n for n in recent_notifications
            if n.priority == NotificationPriority.CRITICAL
        ]
        
        high_priority = [
            n for n in recent_notifications
            if n.priority == NotificationPriority.HIGH
        ]
        
        by_type = {}
        for n in recent_notifications:
            type_key = n.type.value
            by_type[type_key] = by_type.get(type_key, 0) + 1
        
        by_platform = {}
        for n in recent_notifications:
            by_platform[n.platform] = by_platform.get(n.platform, 0) + 1
        
        actionable = [n for n in recent_notifications if n.is_actionable and not n.is_read]
        
        top_actors = {}
        for n in recent_notifications:
            top_actors[n.actor] = top_actors.get(n.actor, 0) + 1
        
        sorted_actors = sorted(top_actors.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return {
            "time_range_hours": time_range_hours,
            "total_notifications": len(recent_notifications),
            "unread_count": len([n for n in recent_notifications if not n.is_read]),
            "critical_alerts": [n.to_dict() for n in critical_notifications],
            "high_priority": [n.to_dict() for n in high_priority[:5]],
            "actionable_items": [n.to_dict() for n in actionable[:10]],
            "breakdown_by_type": by_type,
            "breakdown_by_platform": by_platform,
            "most_active_users": [{"user": actor, "count": count} for actor, count in sorted_actors]
        }
    
    def mark_as_read(
        self,
        notification_ids: List[str]
    ) -> Dict[str, Any]:
        """Mark notifications as read"""
        marked = 0
        not_found = []
        
        for notif_id in notification_ids:
            if notif_id in self.notifications:
                self.notifications[notif_id].is_read = True
                marked += 1
            else:
                not_found.append(notif_id)
        
        return {
            "marked_read": marked,
            "not_found": not_found
        }
    
    def set_user_preferences(
        self,
        user_id: int,
        preferences: Dict[str, Any]
    ):
        """Set notification preferences for a user"""
        self.user_preferences[user_id] = preferences
    
    def mute_user(
        self,
        user_id: int,
        actor_to_mute: str,
        duration_hours: Optional[int] = None
    ):
        """Mute notifications from a specific user"""
        if user_id not in self.muted_users:
            self.muted_users[user_id] = []
        
        self.muted_users[user_id].append(actor_to_mute)
    
    def unmute_user(
        self,
        user_id: int,
        actor_to_unmute: str
    ):
        """Unmute notifications from a user"""
        if user_id in self.muted_users:
            if actor_to_unmute in self.muted_users[user_id]:
                self.muted_users[user_id].remove(actor_to_unmute)
    
    def _is_muted(
        self,
        user_id: int,
        actor: str
    ) -> bool:
        """Check if notifications from an actor are muted"""
        return actor in self.muted_users.get(user_id, [])
    
    def batch_create_notifications(
        self,
        notifications_data: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Create multiple notifications at once"""
        created = []
        failed = []
        
        for data in notifications_data:
            try:
                notif = self.create_notification(
                    user_id=data['user_id'],
                    notification_type=NotificationType(data['type']),
                    platform=data['platform'],
                    content=data['content'],
                    actor=data['actor'],
                    post_id=data.get('post_id'),
                    metadata=data.get('metadata')
                )
                created.append(notif.id)
            except Exception as e:
                failed.append({
                    "data": data,
                    "error": str(e)
                })
        
        return {
            "created": len(created),
            "failed": len(failed),
            "notification_ids": created,
            "errors": failed
        }
    
    def get_notification_stats(
        self,
        user_id: int,
        days: int = 7
    ) -> Dict[str, Any]:
        """Get notification statistics"""
        cutoff = datetime.now() - timedelta(days=days)
        
        user_notifs = [
            n for n in self.notifications.values()
            if n.user_id == user_id and n.timestamp >= cutoff
        ]
        
        daily_counts = {}
        for n in user_notifs:
            date_key = n.timestamp.date().isoformat()
            daily_counts[date_key] = daily_counts.get(date_key, 0) + 1
        
        read_rate = len([n for n in user_notifs if n.is_read]) / len(user_notifs) * 100 if user_notifs else 0
        
        return {
            "total_notifications": len(user_notifs),
            "read_rate": round(read_rate, 2),
            "daily_average": round(len(user_notifs) / days, 2),
            "daily_breakdown": daily_counts,
            "most_common_type": max(
                [(n.type.value, len([x for x in user_notifs if x.type == n.type]))
                 for n in user_notifs],
                key=lambda x: x[1]
            )[0] if user_notifs else None
        }
