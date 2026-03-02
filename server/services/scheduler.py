"""
Content Scheduler - Schedule and manage social media posts
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from enum import Enum
import json
from dataclasses import dataclass, asdict
import uuid


class ScheduleStatus(Enum):
    PENDING = "pending"
    SCHEDULED = "scheduled"
    PUBLISHED = "published"
    FAILED = "failed"
    CANCELLED = "cancelled"


class PostFrequency(Enum):
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    CUSTOM = "custom"


@dataclass
class ScheduledPost:
    id: str
    user_id: int
    platforms: List[str]
    content: str
    media_url: Optional[str]
    scheduled_time: datetime
    status: ScheduleStatus
    created_at: datetime
    attempts: int = 0
    error_message: Optional[str] = None
    
    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        data['scheduled_time'] = self.scheduled_time.isoformat()
        data['created_at'] = self.created_at.isoformat()
        data['status'] = self.status.value
        return data


class ContentScheduler:
    """Advanced content scheduling system"""
    
    def __init__(self):
        self.scheduled_posts: Dict[str, ScheduledPost] = {}
        self.recurring_schedules: Dict[str, Dict[str, Any]] = {}
    
    def schedule_post(
        self,
        user_id: int,
        platforms: List[str],
        content: str,
        scheduled_time: datetime,
        media_url: Optional[str] = None
    ) -> ScheduledPost:
        """Schedule a single post"""
        post_id = str(uuid.uuid4())
        
        post = ScheduledPost(
            id=post_id,
            user_id=user_id,
            platforms=platforms,
            content=content,
            media_url=media_url,
            scheduled_time=scheduled_time,
            status=ScheduleStatus.SCHEDULED,
            created_at=datetime.now()
        )
        
        self.scheduled_posts[post_id] = post
        return post
    
    def schedule_recurring_posts(
        self,
        user_id: int,
        platforms: List[str],
        content_templates: List[str],
        frequency: PostFrequency,
        start_date: datetime,
        end_date: Optional[datetime] = None,
        time_of_day: str = "09:00"
    ) -> List[ScheduledPost]:
        """Schedule recurring posts"""
        scheduled_posts = []
        current_date = start_date
        template_index = 0
        
        while True:
            if end_date and current_date > end_date:
                break
            
            if current_date > datetime.now():
                hour, minute = map(int, time_of_day.split(':'))
                post_time = current_date.replace(hour=hour, minute=minute)
                
                content = content_templates[template_index % len(content_templates)]
                
                post = self.schedule_post(
                    user_id=user_id,
                    platforms=platforms,
                    content=content,
                    scheduled_time=post_time
                )
                scheduled_posts.append(post)
                
                template_index += 1
            
            if frequency == PostFrequency.DAILY:
                current_date += timedelta(days=1)
            elif frequency == PostFrequency.WEEKLY:
                current_date += timedelta(weeks=1)
            elif frequency == PostFrequency.MONTHLY:
                month = current_date.month + 1
                year = current_date.year
                if month > 12:
                    month = 1
                    year += 1
                current_date = current_date.replace(year=year, month=month)
            
            if not end_date and len(scheduled_posts) >= 30:
                break
        
        return scheduled_posts
    
    def get_upcoming_posts(
        self,
        user_id: int,
        days: int = 7
    ) -> List[ScheduledPost]:
        """Get upcoming posts for a user"""
        end_time = datetime.now() + timedelta(days=days)
        
        upcoming = [
            post for post in self.scheduled_posts.values()
            if post.user_id == user_id 
            and post.status == ScheduleStatus.SCHEDULED
            and datetime.now() <= post.scheduled_time <= end_time
        ]
        
        return sorted(upcoming, key=lambda x: x.scheduled_time)
    
    def cancel_post(self, post_id: str) -> bool:
        """Cancel a scheduled post"""
        if post_id in self.scheduled_posts:
            post = self.scheduled_posts[post_id]
            if post.status == ScheduleStatus.SCHEDULED:
                post.status = ScheduleStatus.CANCELLED
                return True
        return False
    
    def reschedule_post(
        self,
        post_id: str,
        new_time: datetime
    ) -> Optional[ScheduledPost]:
        """Reschedule a post to a new time"""
        if post_id in self.scheduled_posts:
            post = self.scheduled_posts[post_id]
            if post.status == ScheduleStatus.SCHEDULED:
                post.scheduled_time = new_time
                return post
        return None
    
    def get_posts_ready_to_publish(self) -> List[ScheduledPost]:
        """Get posts that are ready to be published"""
        now = datetime.now()
        
        ready_posts = [
            post for post in self.scheduled_posts.values()
            if post.status == ScheduleStatus.SCHEDULED
            and post.scheduled_time <= now
        ]
        
        return sorted(ready_posts, key=lambda x: x.scheduled_time)
    
    def mark_as_published(
        self,
        post_id: str,
        success: bool = True,
        error_message: Optional[str] = None
    ):
        """Mark a post as published or failed"""
        if post_id in self.scheduled_posts:
            post = self.scheduled_posts[post_id]
            if success:
                post.status = ScheduleStatus.PUBLISHED
            else:
                post.attempts += 1
                post.error_message = error_message
                if post.attempts >= 3:
                    post.status = ScheduleStatus.FAILED
    
    def get_schedule_analytics(
        self,
        user_id: int
    ) -> Dict[str, Any]:
        """Get analytics about scheduled posts"""
        user_posts = [
            post for post in self.scheduled_posts.values()
            if post.user_id == user_id
        ]
        
        total = len(user_posts)
        published = len([p for p in user_posts if p.status == ScheduleStatus.PUBLISHED])
        scheduled = len([p for p in user_posts if p.status == ScheduleStatus.SCHEDULED])
        failed = len([p for p in user_posts if p.status == ScheduleStatus.FAILED])
        cancelled = len([p for p in user_posts if p.status == ScheduleStatus.CANCELLED])
        
        platform_distribution = {}
        for post in user_posts:
            for platform in post.platforms:
                platform_distribution[platform] = platform_distribution.get(platform, 0) + 1
        
        return {
            "total_posts": total,
            "published": published,
            "scheduled": scheduled,
            "failed": failed,
            "cancelled": cancelled,
            "success_rate": round((published / total * 100) if total > 0 else 0, 2),
            "platform_distribution": platform_distribution
        }
    
    def optimize_posting_schedule(
        self,
        user_id: int,
        best_times: List[Dict[str, Any]]
    ) -> List[datetime]:
        """Suggest optimal posting times based on analytics"""
        suggested_times = []
        
        for day_offset in range(7):
            target_date = datetime.now() + timedelta(days=day_offset)
            
            for time_slot in best_times[:3]:
                hour = int(time_slot['hour'].split(':')[0])
                posting_time = target_date.replace(hour=hour, minute=0, second=0)
                
                if posting_time > datetime.now():
                    suggested_times.append(posting_time)
        
        return suggested_times[:21]
    
    def bulk_schedule(
        self,
        user_id: int,
        posts: List[Dict[str, Any]],
        auto_optimize: bool = False
    ) -> Dict[str, Any]:
        """Schedule multiple posts at once"""
        scheduled = []
        failed = []
        
        for post_data in posts:
            try:
                scheduled_time = datetime.fromisoformat(post_data['scheduled_time'])
                
                post = self.schedule_post(
                    user_id=user_id,
                    platforms=post_data['platforms'],
                    content=post_data['content'],
                    scheduled_time=scheduled_time,
                    media_url=post_data.get('media_url')
                )
                scheduled.append(post.to_dict())
            except Exception as e:
                failed.append({
                    "post": post_data,
                    "error": str(e)
                })
        
        return {
            "scheduled": len(scheduled),
            "failed": len(failed),
            "posts": scheduled,
            "errors": failed
        }
