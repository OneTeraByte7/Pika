"""
Advanced Features API Router
Integrates all new Python services: analytics, scheduler, sentiment, etc.
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from typing import Dict, List, Any, Optional
from datetime import datetime
from pydantic import BaseModel

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from services.analytics import AnalyticsService, MetricType
from services.scheduler import ContentScheduler, ScheduleStatus, PostFrequency
from services.sentiment import SentimentAnalyzer, SentimentLabel
from services.notifications import NotificationManager, NotificationPriority, NotificationType
from services.media import MediaProcessor, MediaType
from services.caching import CacheManager, SocialMediaCache
from services.export import DataExporter, ExportFormat
from services.tasks import TaskQueue, TaskPriority, ScheduledTaskManager
from services.webhooks import WebhookHandler, WebhookEvent
from services.recommendations import ContentRecommender
from services.engagement import EngagementTracker, EngagementType, RetentionAnalyzer


router = APIRouter(prefix="/advanced", tags=["advanced_features"])

analytics_service = AnalyticsService()
scheduler = ContentScheduler()
sentiment_analyzer = SentimentAnalyzer()
notification_manager = NotificationManager()
media_processor = MediaProcessor()
cache_manager = SocialMediaCache()
data_exporter = DataExporter()
task_queue = TaskQueue()
scheduled_task_manager = ScheduledTaskManager(task_queue)
webhook_handler = WebhookHandler()
content_recommender = ContentRecommender()
engagement_tracker = EngagementTracker()
retention_analyzer = RetentionAnalyzer(engagement_tracker)


class AnalyticsRequest(BaseModel):
    posts: List[Dict[str, Any]]
    user_id: int


class SchedulePostRequest(BaseModel):
    user_id: int
    platforms: List[str]
    content: str
    scheduled_time: str
    media_url: Optional[str] = None


class SentimentAnalysisRequest(BaseModel):
    text: Optional[str] = None
    comments: Optional[List[Dict[str, Any]]] = None


class NotificationRequest(BaseModel):
    user_id: int
    type: str
    platform: str
    content: str
    actor: str


class ExportRequest(BaseModel):
    format: str
    data_type: str


class ContentRecommendationRequest(BaseModel):
    user_id: int
    category: Optional[str] = None


@router.post("/analytics/posts")
async def analyze_posts(request: AnalyticsRequest):
    """Analyze post performance and engagement"""
    analysis = analytics_service.analyze_post_performance(request.posts)
    trending_hashtags = analytics_service.detect_trending_hashtags(request.posts)
    posting_schedule = analytics_service.analyze_posting_schedule(request.posts)
    
    return {
        "performance": analysis,
        "trending_hashtags": trending_hashtags,
        "optimal_schedule": posting_schedule
    }


@router.get("/analytics/engagement-rate")
async def calculate_engagement_rate(
    likes: int,
    comments: int,
    shares: int,
    followers: int
):
    """Calculate engagement rate"""
    rate = analytics_service.calculate_engagement_rate(likes, comments, shares, followers)
    
    return {
        "engagement_rate": rate,
        "category": "high" if rate > 5 else "medium" if rate > 2 else "low"
    }


@router.get("/analytics/virality/{post_id}")
async def check_virality(post_id: str, post_data: Dict[str, Any]):
    """Calculate virality score for a post"""
    virality = analytics_service.calculate_virality_score(post_data)
    
    return virality


@router.post("/scheduler/schedule")
async def schedule_post(request: SchedulePostRequest):
    """Schedule a post for future publishing"""
    scheduled_time = datetime.fromisoformat(request.scheduled_time)
    
    post = scheduler.schedule_post(
        user_id=request.user_id,
        platforms=request.platforms,
        content=request.content,
        scheduled_time=scheduled_time,
        media_url=request.media_url
    )
    
    return {
        "status": "scheduled",
        "post_id": post.id,
        "scheduled_time": post.scheduled_time.isoformat()
    }


@router.get("/scheduler/upcoming/{user_id}")
async def get_upcoming_posts(user_id: int, days: int = 7):
    """Get upcoming scheduled posts"""
    posts = scheduler.get_upcoming_posts(user_id, days)
    
    return {
        "upcoming_posts": [post.to_dict() for post in posts],
        "count": len(posts)
    }


@router.delete("/scheduler/cancel/{post_id}")
async def cancel_scheduled_post(post_id: str):
    """Cancel a scheduled post"""
    success = scheduler.cancel_post(post_id)
    
    if success:
        return {"status": "cancelled", "post_id": post_id}
    else:
        raise HTTPException(status_code=404, detail="Post not found or already published")


@router.get("/scheduler/analytics/{user_id}")
async def get_schedule_analytics(user_id: int):
    """Get scheduling analytics"""
    analytics = scheduler.get_schedule_analytics(user_id)
    
    return analytics


@router.post("/sentiment/analyze")
async def analyze_sentiment(request: SentimentAnalysisRequest):
    """Analyze sentiment of text or comments"""
    if request.text:
        result = sentiment_analyzer.analyze_text(request.text)
        return {"text_analysis": result}
    elif request.comments:
        result = sentiment_analyzer.analyze_comments(request.comments)
        return {"comments_analysis": result}
    else:
        raise HTTPException(status_code=400, detail="Provide either text or comments")


@router.post("/sentiment/toxicity")
async def detect_toxicity(text: str):
    """Detect toxic content in text"""
    result = sentiment_analyzer.detect_toxic_content(text)
    
    return result


@router.get("/sentiment/emotions")
async def analyze_emotions(text: str):
    """Detect emotions in text"""
    emotions = sentiment_analyzer.get_emotion_breakdown(text)
    
    return {"emotions": emotions}


@router.post("/notifications/create")
async def create_notification(request: NotificationRequest):
    """Create a new notification"""
    notification = notification_manager.create_notification(
        user_id=request.user_id,
        notification_type=NotificationType(request.type),
        platform=request.platform,
        content=request.content,
        actor=request.actor
    )
    
    return notification.to_dict()


@router.get("/notifications/{user_id}")
async def get_notifications(
    user_id: int,
    unread_only: bool = False,
    limit: int = 50
):
    """Get user notifications"""
    notifications = notification_manager.get_notifications(
        user_id=user_id,
        unread_only=unread_only,
        limit=limit
    )
    
    return {
        "notifications": [n.to_dict() for n in notifications],
        "count": len(notifications)
    }


@router.get("/notifications/digest/{user_id}")
async def get_notification_digest(user_id: int, hours: int = 24):
    """Get smart notification digest"""
    digest = notification_manager.get_smart_digest(user_id, hours)
    
    return digest


@router.post("/notifications/mark-read")
async def mark_notifications_read(notification_ids: List[str]):
    """Mark notifications as read"""
    result = notification_manager.mark_as_read(notification_ids)
    
    return result


@router.post("/media/validate")
async def validate_media(file_name: str, file_size: int):
    """Validate media file"""
    file_data = b'0' * file_size
    validation = media_processor.validate_media(file_data, file_name)
    
    return validation


@router.get("/media/platform-specs")
async def get_platform_specs(platform: str, media_type: str):
    """Get optimal media specs for platform"""
    specs = media_processor.optimize_for_platform(
        MediaType(media_type),
        platform
    )
    
    return specs


@router.post("/media/upload-url")
async def generate_upload_url(file_name: str, media_type: str):
    """Generate presigned upload URL"""
    url_data = media_processor.generate_upload_url(
        file_name,
        MediaType(media_type)
    )
    
    return url_data


@router.post("/export/posts")
async def export_posts(posts: List[Dict[str, Any]], format_type: str):
    """Export posts in specified format"""
    try:
        export_format = ExportFormat(format_type)
        exported_data = data_exporter.export_posts(posts, export_format)
        
        return {
            "format": format_type,
            "data": exported_data,
            "size_bytes": len(exported_data)
        }
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid format: {format_type}")


@router.post("/export/user-data")
async def export_user_data(
    user_id: int,
    user_data: Dict[str, Any],
    posts: List[Dict[str, Any]],
    format_type: str
):
    """Export complete user data"""
    try:
        export_format = ExportFormat(format_type)
        exported_data = data_exporter.export_user_data(
            user_id,
            user_data,
            posts,
            export_format
        )
        
        return {
            "format": format_type,
            "data": exported_data
        }
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid format: {format_type}")


@router.get("/export/gdpr/{user_id}")
async def export_gdpr_data(user_id: int, all_data: Dict[str, Any]):
    """Generate GDPR-compliant data export"""
    gdpr_export = data_exporter.generate_gdpr_export(user_id, all_data)
    
    return {
        "format": "json",
        "data": gdpr_export,
        "compliance": "GDPR Article 15"
    }


@router.post("/tasks/create")
async def create_background_task(
    name: str,
    function: str,
    priority: str = "medium"
):
    """Create a background task"""
    from task_manager import TaskPriority
    
    task = task_queue.create_task(
        name=name,
        function=function,
        priority=TaskPriority[priority.upper()]
    )
    
    return task.to_dict()


@router.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    """Get task status"""
    task = task_queue.get_task(task_id)
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return task.to_dict()


@router.get("/tasks/queue/stats")
async def get_queue_stats():
    """Get task queue statistics"""
    stats = task_queue.get_queue_stats()
    
    return stats


@router.post("/recommendations/topics")
async def recommend_content_topics(request: ContentRecommendationRequest):
    """Get content topic recommendations"""
    recommendations = content_recommender.recommend_content_topics(
        user_id=request.user_id,
        count=5
    )
    
    return {"recommendations": recommendations}


@router.post("/recommendations/posting-time")
async def suggest_posting_time(user_id: int):
    """Suggest optimal posting time"""
    suggestion = content_recommender.suggest_posting_time(user_id)
    
    return suggestion


@router.post("/recommendations/content-ideas")
async def generate_content_ideas(request: ContentRecommendationRequest):
    """Generate content ideas"""
    ideas = content_recommender.generate_content_ideas(
        user_id=request.user_id,
        category=request.category
    )
    
    return {"ideas": ideas}


@router.post("/recommendations/predict-engagement")
async def predict_engagement(
    content: str,
    posting_time: str,
    followers: int
):
    """Predict engagement for content"""
    post_time = datetime.fromisoformat(posting_time)
    prediction = content_recommender.predict_engagement(
        content,
        post_time,
        followers
    )
    
    return prediction


@router.post("/engagement/track")
async def track_engagement(
    user_id: int,
    platform: str,
    engagement_type: str,
    content_id: str
):
    """Track user engagement"""
    engagement_tracker.track_engagement(
        user_id=user_id,
        platform=platform,
        engagement_type=EngagementType(engagement_type),
        content_id=content_id
    )
    
    return {"status": "tracked"}


@router.get("/engagement/score/{user_id}")
async def get_engagement_score(user_id: int, days: int = 30):
    """Calculate user engagement score"""
    score = engagement_tracker.calculate_engagement_score(user_id, days)
    
    return score


@router.get("/engagement/trends/{user_id}")
async def get_engagement_trends(user_id: int, days: int = 30):
    """Get engagement trends"""
    trends = engagement_tracker.get_engagement_trends(user_id, days)
    
    return trends


@router.get("/cache/stats")
async def get_cache_stats():
    """Get cache statistics"""
    stats = cache_manager.get_overall_stats()
    
    return stats


@router.post("/cache/invalidate/{user_id}")
async def invalidate_user_cache(user_id: int, platform: Optional[str] = None):
    """Invalidate cached data for user"""
    count = cache_manager.invalidate_user_data(user_id, platform)
    
    return {
        "invalidated_entries": count,
        "user_id": user_id
    }


@router.get("/health")
async def health_check():
    """Health check for advanced features"""
    return {
        "status": "healthy",
        "services": {
            "analytics": "operational",
            "scheduler": "operational",
            "sentiment": "operational",
            "notifications": "operational",
            "media": "operational",
            "cache": "operational",
            "tasks": "operational",
            "recommendations": "operational",
            "engagement": "operational"
        },
        "timestamp": datetime.now().isoformat()
    }
