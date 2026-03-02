"""
Advanced Analytics Service for Social Media Insights
Provides engagement metrics, trend analysis, and performance tracking
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from collections import Counter
import statistics
from enum import Enum


class MetricType(Enum):
    ENGAGEMENT = "engagement"
    REACH = "reach"
    IMPRESSIONS = "impressions"
    GROWTH = "growth"
    SENTIMENT = "sentiment"


class AnalyticsService:
    """Comprehensive analytics for social media performance"""
    
    def __init__(self):
        self.metrics_cache = {}
        
    def calculate_engagement_rate(
        self, 
        likes: int, 
        comments: int, 
        shares: int, 
        followers: int
    ) -> float:
        """Calculate engagement rate percentage"""
        if followers == 0:
            return 0.0
        total_engagement = likes + comments + (shares * 2)
        return round((total_engagement / followers) * 100, 2)
    
    def analyze_post_performance(
        self, 
        posts: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze performance metrics across multiple posts"""
        if not posts:
            return {
                "total_posts": 0,
                "avg_engagement": 0,
                "best_performing": None,
                "worst_performing": None
            }
        
        engagement_rates = []
        for post in posts:
            likes = post.get('likes', 0)
            comments = post.get('comments', 0)
            shares = post.get('shares', 0)
            followers = post.get('followers', 1000)
            
            rate = self.calculate_engagement_rate(likes, comments, shares, followers)
            post['engagement_rate'] = rate
            engagement_rates.append(rate)
        
        sorted_posts = sorted(posts, key=lambda x: x['engagement_rate'], reverse=True)
        
        return {
            "total_posts": len(posts),
            "avg_engagement": round(statistics.mean(engagement_rates), 2),
            "median_engagement": round(statistics.median(engagement_rates), 2),
            "best_performing": sorted_posts[0] if sorted_posts else None,
            "worst_performing": sorted_posts[-1] if sorted_posts else None,
            "engagement_distribution": {
                "high": len([r for r in engagement_rates if r > 5]),
                "medium": len([r for r in engagement_rates if 2 <= r <= 5]),
                "low": len([r for r in engagement_rates if r < 2])
            }
        }
    
    def detect_trending_hashtags(
        self, 
        posts: List[Dict[str, Any]], 
        top_n: int = 10
    ) -> List[Dict[str, Any]]:
        """Identify trending hashtags from posts"""
        hashtag_counter = Counter()
        hashtag_engagement = {}
        
        for post in posts:
            content = post.get('content', '')
            hashtags = [word for word in content.split() if word.startswith('#')]
            
            engagement = post.get('likes', 0) + post.get('comments', 0)
            
            for tag in hashtags:
                hashtag_counter[tag] += 1
                if tag in hashtag_engagement:
                    hashtag_engagement[tag] += engagement
                else:
                    hashtag_engagement[tag] = engagement
        
        trending = []
        for tag, count in hashtag_counter.most_common(top_n):
            trending.append({
                "hashtag": tag,
                "usage_count": count,
                "total_engagement": hashtag_engagement[tag],
                "avg_engagement": round(hashtag_engagement[tag] / count, 2)
            })
        
        return trending
    
    def analyze_posting_schedule(
        self, 
        posts: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Determine best times to post based on historical data"""
        hour_engagement = {i: [] for i in range(24)}
        day_engagement = {i: [] for i in range(7)}
        
        for post in posts:
            timestamp = post.get('created_at')
            if isinstance(timestamp, str):
                timestamp = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
            
            if isinstance(timestamp, datetime):
                hour = timestamp.hour
                day = timestamp.weekday()
                
                engagement = post.get('likes', 0) + post.get('comments', 0)
                hour_engagement[hour].append(engagement)
                day_engagement[day].append(engagement)
        
        best_hours = sorted(
            [(h, statistics.mean(eng) if eng else 0) for h, eng in hour_engagement.items()],
            key=lambda x: x[1],
            reverse=True
        )[:3]
        
        best_days = sorted(
            [(d, statistics.mean(eng) if eng else 0) for d, eng in day_engagement.items()],
            key=lambda x: x[1],
            reverse=True
        )[:3]
        
        day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        return {
            "best_hours": [
                {"hour": f"{h:02d}:00", "avg_engagement": round(eng, 2)}
                for h, eng in best_hours
            ],
            "best_days": [
                {"day": day_names[d], "avg_engagement": round(eng, 2)}
                for d, eng in best_days
            ]
        }
    
    def calculate_growth_rate(
        self, 
        current_followers: int, 
        previous_followers: int,
        days: int = 30
    ) -> Dict[str, Any]:
        """Calculate follower growth metrics"""
        growth = current_followers - previous_followers
        growth_rate = (growth / previous_followers * 100) if previous_followers > 0 else 0
        daily_avg = growth / days if days > 0 else 0
        
        projected_30day = current_followers + (daily_avg * 30)
        projected_90day = current_followers + (daily_avg * 90)
        
        return {
            "current_followers": current_followers,
            "growth": growth,
            "growth_rate": round(growth_rate, 2),
            "daily_average": round(daily_avg, 2),
            "projections": {
                "30_days": int(projected_30day),
                "90_days": int(projected_90day)
            }
        }
    
    def generate_competitor_comparison(
        self,
        user_metrics: Dict[str, Any],
        competitor_metrics: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Compare user metrics with competitors"""
        if not competitor_metrics:
            return {"error": "No competitor data available"}
        
        user_engagement = user_metrics.get('engagement_rate', 0)
        competitor_engagements = [c.get('engagement_rate', 0) for c in competitor_metrics]
        
        avg_competitor_engagement = statistics.mean(competitor_engagements)
        percentile = sum(1 for e in competitor_engagements if user_engagement > e) / len(competitor_engagements) * 100
        
        return {
            "user_engagement": user_engagement,
            "competitor_average": round(avg_competitor_engagement, 2),
            "percentile": round(percentile, 2),
            "comparison": "above" if user_engagement > avg_competitor_engagement else "below",
            "difference": round(user_engagement - avg_competitor_engagement, 2)
        }
    
    def get_audience_insights(
        self,
        interactions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze audience behavior and preferences"""
        active_hours = Counter()
        content_types = Counter()
        engagement_types = Counter()
        
        for interaction in interactions:
            if 'timestamp' in interaction:
                ts = interaction['timestamp']
                if isinstance(ts, str):
                    ts = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                if isinstance(ts, datetime):
                    active_hours[ts.hour] += 1
            
            content_types[interaction.get('content_type', 'unknown')] += 1
            engagement_types[interaction.get('type', 'unknown')] += 1
        
        return {
            "most_active_hours": [
                {"hour": f"{h:02d}:00", "interactions": count}
                for h, count in active_hours.most_common(5)
            ],
            "preferred_content": [
                {"type": ct, "count": count}
                for ct, count in content_types.most_common(5)
            ],
            "engagement_breakdown": dict(engagement_types)
        }
    
    def calculate_virality_score(
        self,
        post: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Calculate virality score based on engagement velocity"""
        likes = post.get('likes', 0)
        comments = post.get('comments', 0)
        shares = post.get('shares', 0)
        
        created_at = post.get('created_at')
        if isinstance(created_at, str):
            created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
        
        hours_since_post = (datetime.now() - created_at).total_seconds() / 3600 if created_at else 1
        
        engagement_velocity = (likes + comments * 2 + shares * 3) / max(hours_since_post, 1)
        
        virality_score = min(engagement_velocity / 10, 100)
        
        if virality_score > 80:
            category = "viral"
        elif virality_score > 50:
            category = "trending"
        elif virality_score > 20:
            category = "performing_well"
        else:
            category = "normal"
        
        return {
            "score": round(virality_score, 2),
            "category": category,
            "engagement_velocity": round(engagement_velocity, 2),
            "hours_active": round(hours_since_post, 2)
        }
