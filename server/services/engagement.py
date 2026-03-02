"""
User Engagement Tracker - Track and analyze user engagement patterns
"""

from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from collections import defaultdict
from enum import Enum


class EngagementType(Enum):
    VIEW = "view"
    CLICK = "click"
    LIKE = "like"
    COMMENT = "comment"
    SHARE = "share"
    FOLLOW = "follow"
    SAVE = "save"


class EngagementTracker:
    """Track user engagement across platforms"""
    
    def __init__(self):
        self.engagement_data: Dict[int, List[Dict[str, Any]]] = defaultdict(list)
        self.platform_stats: Dict[str, Dict[str, int]] = defaultdict(lambda: defaultdict(int))
    
    def track_engagement(
        self,
        user_id: int,
        platform: str,
        engagement_type: EngagementType,
        content_id: str,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Track a single engagement event"""
        engagement = {
            'user_id': user_id,
            'platform': platform,
            'type': engagement_type.value,
            'content_id': content_id,
            'timestamp': datetime.now().isoformat(),
            'metadata': metadata or {}
        }
        
        self.engagement_data[user_id].append(engagement)
        self.platform_stats[platform][engagement_type.value] += 1
    
    def get_user_engagement_history(
        self,
        user_id: int,
        days: int = 30
    ) -> List[Dict[str, Any]]:
        """Get user's engagement history"""
        cutoff = datetime.now() - timedelta(days=days)
        
        user_engagements = self.engagement_data.get(user_id, [])
        
        recent = [
            e for e in user_engagements
            if datetime.fromisoformat(e['timestamp']) >= cutoff
        ]
        
        return sorted(recent, key=lambda x: x['timestamp'], reverse=True)
    
    def calculate_engagement_score(
        self,
        user_id: int,
        period_days: int = 30
    ) -> Dict[str, Any]:
        """Calculate user's engagement score"""
        engagements = self.get_user_engagement_history(user_id, period_days)
        
        if not engagements:
            return {
                'score': 0,
                'level': 'inactive',
                'breakdown': {}
            }
        
        weights = {
            EngagementType.VIEW: 1,
            EngagementType.CLICK: 2,
            EngagementType.LIKE: 3,
            EngagementType.COMMENT: 5,
            EngagementType.SHARE: 7,
            EngagementType.FOLLOW: 8,
            EngagementType.SAVE: 4
        }
        
        type_counts = defaultdict(int)
        total_score = 0
        
        for engagement in engagements:
            eng_type = EngagementType(engagement['type'])
            type_counts[eng_type.value] += 1
            total_score += weights.get(eng_type, 1)
        
        avg_score = total_score / period_days
        
        if avg_score > 50:
            level = 'highly_active'
        elif avg_score > 20:
            level = 'active'
        elif avg_score > 5:
            level = 'moderate'
        else:
            level = 'low'
        
        return {
            'score': total_score,
            'average_daily': round(avg_score, 2),
            'level': level,
            'breakdown': dict(type_counts),
            'total_interactions': len(engagements)
        }
    
    def get_engagement_trends(
        self,
        user_id: int,
        days: int = 30
    ) -> Dict[str, Any]:
        """Analyze engagement trends"""
        engagements = self.get_user_engagement_history(user_id, days)
        
        daily_counts = defaultdict(int)
        platform_breakdown = defaultdict(int)
        
        for engagement in engagements:
            timestamp = datetime.fromisoformat(engagement['timestamp'])
            date_key = timestamp.date().isoformat()
            daily_counts[date_key] += 1
            platform_breakdown[engagement['platform']] += 1
        
        sorted_days = sorted(daily_counts.items())
        
        if len(sorted_days) >= 7:
            recent_week = sum(count for date, count in sorted_days[-7:])
            previous_week = sum(count for date, count in sorted_days[-14:-7])
            
            if previous_week > 0:
                growth_rate = ((recent_week - previous_week) / previous_week) * 100
            else:
                growth_rate = 100 if recent_week > 0 else 0
        else:
            growth_rate = 0
        
        return {
            'daily_engagements': dict(sorted_days),
            'platform_breakdown': dict(platform_breakdown),
            'weekly_growth_rate': round(growth_rate, 2),
            'most_active_platform': max(platform_breakdown.items(), key=lambda x: x[1])[0] if platform_breakdown else None
        }
    
    def get_best_engagement_times(
        self,
        user_id: int
    ) -> List[Dict[str, Any]]:
        """Find when user is most engaged"""
        engagements = self.get_user_engagement_history(user_id, 90)
        
        hour_counts = defaultdict(int)
        day_counts = defaultdict(int)
        
        for engagement in engagements:
            timestamp = datetime.fromisoformat(engagement['timestamp'])
            hour_counts[timestamp.hour] += 1
            day_counts[timestamp.weekday()] += 1
        
        top_hours = sorted(hour_counts.items(), key=lambda x: x[1], reverse=True)[:3]
        top_days = sorted(day_counts.items(), key=lambda x: x[1], reverse=True)[:3]
        
        day_names = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        
        return {
            'best_hours': [
                {'hour': f'{h:02d}:00', 'engagement_count': count}
                for h, count in top_hours
            ],
            'best_days': [
                {'day': day_names[d], 'engagement_count': count}
                for d, count in top_days
            ]
        }
    
    def compare_platform_engagement(
        self,
        user_id: int
    ) -> Dict[str, Any]:
        """Compare engagement across platforms"""
        engagements = self.get_user_engagement_history(user_id, 30)
        
        platform_metrics = defaultdict(lambda: {
            'total': 0,
            'types': defaultdict(int),
            'avg_per_day': 0
        })
        
        for engagement in engagements:
            platform = engagement['platform']
            eng_type = engagement['type']
            
            platform_metrics[platform]['total'] += 1
            platform_metrics[platform]['types'][eng_type] += 1
        
        for platform, metrics in platform_metrics.items():
            metrics['avg_per_day'] = round(metrics['total'] / 30, 2)
            metrics['types'] = dict(metrics['types'])
        
        return dict(platform_metrics)
    
    def get_content_performance(
        self,
        content_id: str
    ) -> Dict[str, Any]:
        """Get engagement metrics for specific content"""
        all_engagements = []
        for user_engagements in self.engagement_data.values():
            all_engagements.extend(user_engagements)
        
        content_engagements = [
            e for e in all_engagements
            if e.get('content_id') == content_id
        ]
        
        if not content_engagements:
            return {
                'content_id': content_id,
                'total_engagements': 0,
                'unique_users': 0
            }
        
        type_breakdown = defaultdict(int)
        unique_users = set()
        
        for engagement in content_engagements:
            type_breakdown[engagement['type']] += 1
            unique_users.add(engagement['user_id'])
        
        return {
            'content_id': content_id,
            'total_engagements': len(content_engagements),
            'unique_users': len(unique_users),
            'engagement_breakdown': dict(type_breakdown),
            'engagement_rate': round(len(content_engagements) / len(unique_users), 2) if unique_users else 0
        }
    
    def get_platform_stats(self) -> Dict[str, Any]:
        """Get overall platform statistics"""
        total_engagements = sum(
            len(engagements) 
            for engagements in self.engagement_data.values()
        )
        
        return {
            'total_users': len(self.engagement_data),
            'total_engagements': total_engagements,
            'platform_breakdown': dict(self.platform_stats),
            'average_engagements_per_user': round(
                total_engagements / len(self.engagement_data), 2
            ) if self.engagement_data else 0
        }


class RetentionAnalyzer:
    """Analyze user retention and churn"""
    
    def __init__(self, engagement_tracker: EngagementTracker):
        self.tracker = engagement_tracker
    
    def calculate_retention_rate(
        self,
        user_ids: List[int],
        period_days: int = 30
    ) -> Dict[str, Any]:
        """Calculate user retention rate"""
        retained_users = 0
        churned_users = 0
        
        cutoff = datetime.now() - timedelta(days=period_days)
        
        for user_id in user_ids:
            recent_engagements = self.tracker.get_user_engagement_history(
                user_id, 
                period_days
            )
            
            if recent_engagements:
                last_engagement = datetime.fromisoformat(
                    recent_engagements[0]['timestamp']
                )
                
                if last_engagement >= cutoff:
                    retained_users += 1
                else:
                    churned_users += 1
            else:
                churned_users += 1
        
        total_users = len(user_ids)
        retention_rate = (retained_users / total_users * 100) if total_users > 0 else 0
        
        return {
            'total_users': total_users,
            'retained_users': retained_users,
            'churned_users': churned_users,
            'retention_rate': round(retention_rate, 2),
            'churn_rate': round(100 - retention_rate, 2)
        }
    
    def identify_at_risk_users(
        self,
        user_ids: List[int],
        inactivity_days: int = 7
    ) -> List[Dict[str, Any]]:
        """Identify users at risk of churning"""
        at_risk = []
        cutoff = datetime.now() - timedelta(days=inactivity_days)
        
        for user_id in user_ids:
            recent = self.tracker.get_user_engagement_history(user_id, inactivity_days)
            
            if not recent:
                at_risk.append({
                    'user_id': user_id,
                    'days_inactive': inactivity_days,
                    'risk_level': 'high'
                })
            elif len(recent) < 3:
                at_risk.append({
                    'user_id': user_id,
                    'engagement_count': len(recent),
                    'risk_level': 'medium'
                })
        
        return at_risk
