"""
Machine Learning Utilities for Content Analysis and Predictions
"""

from typing import Dict, List, Any, Optional, Tuple
from collections import Counter, defaultdict
from datetime import datetime, timedelta
import statistics
import math


class ContentClassifier:
    """Classify and categorize content"""
    
    def __init__(self):
        self.categories = {
            'tech': ['technology', 'software', 'code', 'AI', 'programming', 'developer'],
            'lifestyle': ['life', 'daily', 'routine', 'wellness', 'balance'],
            'fitness': ['workout', 'gym', 'fitness', 'exercise', 'health', 'training'],
            'food': ['food', 'recipe', 'cooking', 'restaurant', 'meal', 'delicious'],
            'travel': ['travel', 'trip', 'vacation', 'explore', 'destination'],
            'business': ['business', 'startup', 'entrepreneur', 'marketing', 'sales'],
            'entertainment': ['movie', 'music', 'game', 'show', 'entertainment'],
            'fashion': ['fashion', 'style', 'outfit', 'clothing', 'trend']
        }
    
    def classify_content(self, text: str) -> Dict[str, Any]:
        """Classify content into categories"""
        text_lower = text.lower()
        scores = {}
        
        for category, keywords in self.categories.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            if score > 0:
                scores[category] = score
        
        if not scores:
            return {
                "primary_category": "general",
                "confidence": 0.5,
                "all_categories": {}
            }
        
        primary = max(scores.items(), key=lambda x: x[1])
        total_score = sum(scores.values())
        confidence = primary[1] / total_score if total_score > 0 else 0
        
        return {
            "primary_category": primary[0],
            "confidence": round(confidence, 2),
            "all_categories": scores
        }
    
    def extract_keywords(
        self,
        text: str,
        top_n: int = 10
    ) -> List[Dict[str, Any]]:
        """Extract important keywords from text"""
        stop_words = {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'is', 'was', 'are', 'been', 'be', 'have', 'has', 'had',
            'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might'
        }
        
        words = text.lower().split()
        filtered_words = [
            word for word in words
            if len(word) > 3 and word not in stop_words and word.isalnum()
        ]
        
        word_freq = Counter(filtered_words)
        
        keywords = []
        for word, freq in word_freq.most_common(top_n):
            keywords.append({
                "keyword": word,
                "frequency": freq,
                "relevance": round(freq / len(filtered_words), 3) if filtered_words else 0
            })
        
        return keywords


class TrendPredictor:
    """Predict trending content and topics"""
    
    def __init__(self):
        self.historical_data: List[Dict[str, Any]] = []
    
    def add_historical_data(self, posts: List[Dict[str, Any]]):
        """Add historical post data"""
        self.historical_data.extend(posts)
    
    def predict_trending_topics(
        self,
        time_window_days: int = 7
    ) -> List[Dict[str, Any]]:
        """Predict trending topics based on historical data"""
        cutoff = datetime.now() - timedelta(days=time_window_days)
        
        recent_posts = [
            post for post in self.historical_data
            if 'created_at' in post and 
            datetime.fromisoformat(post['created_at'].replace('Z', '+00:00')) >= cutoff
        ]
        
        topic_engagement = defaultdict(lambda: {'count': 0, 'total_engagement': 0})
        
        for post in recent_posts:
            content = post.get('content', '')
            hashtags = [word for word in content.split() if word.startswith('#')]
            engagement = post.get('likes', 0) + post.get('comments', 0) * 2
            
            for hashtag in hashtags:
                topic_engagement[hashtag]['count'] += 1
                topic_engagement[hashtag]['total_engagement'] += engagement
        
        trending = []
        for topic, data in topic_engagement.items():
            if data['count'] >= 3:
                avg_engagement = data['total_engagement'] / data['count']
                trending_score = data['count'] * avg_engagement / 100
                
                trending.append({
                    'topic': topic,
                    'mentions': data['count'],
                    'avg_engagement': round(avg_engagement, 2),
                    'trending_score': round(trending_score, 2),
                    'velocity': 'high' if trending_score > 10 else 'medium' if trending_score > 5 else 'low'
                })
        
        return sorted(trending, key=lambda x: x['trending_score'], reverse=True)[:10]
    
    def predict_best_hashtags(
        self,
        content: str,
        historical_posts: List[Dict[str, Any]]
    ) -> List[str]:
        """Predict best hashtags for content"""
        content_keywords = set(content.lower().split())
        
        hashtag_performance = defaultdict(lambda: {'count': 0, 'engagement': 0})
        
        for post in historical_posts:
            post_content = post.get('content', '')
            hashtags = [word for word in post_content.split() if word.startswith('#')]
            engagement = post.get('likes', 0) + post.get('comments', 0)
            
            for hashtag in hashtags:
                hashtag_performance[hashtag]['count'] += 1
                hashtag_performance[hashtag]['engagement'] += engagement
        
        scored_hashtags = []
        for hashtag, data in hashtag_performance.items():
            if data['count'] >= 2:
                avg_engagement = data['engagement'] / data['count']
                
                relevance = 0
                hashtag_words = hashtag.lower().replace('#', '').split()
                for word in hashtag_words:
                    if word in content_keywords:
                        relevance += 1
                
                score = (avg_engagement * 0.7) + (relevance * 100 * 0.3)
                scored_hashtags.append((hashtag, score))
        
        scored_hashtags.sort(key=lambda x: x[1], reverse=True)
        return [hashtag for hashtag, score in scored_hashtags[:5]]


class AudienceSegmenter:
    """Segment and analyze audience"""
    
    def __init__(self):
        self.segments: Dict[str, List[int]] = {}
    
    def segment_by_engagement(
        self,
        user_engagements: Dict[int, List[Dict[str, Any]]]
    ) -> Dict[str, List[int]]:
        """Segment users by engagement level"""
        segments = {
            'highly_engaged': [],
            'moderately_engaged': [],
            'low_engaged': [],
            'inactive': []
        }
        
        for user_id, engagements in user_engagements.items():
            engagement_count = len(engagements)
            
            if engagement_count >= 20:
                segments['highly_engaged'].append(user_id)
            elif engagement_count >= 10:
                segments['moderately_engaged'].append(user_id)
            elif engagement_count >= 3:
                segments['low_engaged'].append(user_id)
            else:
                segments['inactive'].append(user_id)
        
        self.segments = segments
        return segments
    
    def get_segment_insights(self) -> Dict[str, Any]:
        """Get insights about audience segments"""
        total_users = sum(len(users) for users in self.segments.values())
        
        return {
            'total_users': total_users,
            'segment_distribution': {
                segment: {
                    'count': len(users),
                    'percentage': round(len(users) / total_users * 100, 2) if total_users > 0 else 0
                }
                for segment, users in self.segments.items()
            }
        }


class PerformanceOptimizer:
    """Optimize content performance"""
    
    def analyze_optimal_content_length(
        self,
        posts: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Determine optimal content length"""
        length_engagement = []
        
        for post in posts:
            content = post.get('content', '')
            length = len(content)
            engagement = post.get('likes', 0) + post.get('comments', 0)
            
            if length > 0:
                length_engagement.append((length, engagement))
        
        if not length_engagement:
            return {"optimal_length": 150, "confidence": 0}
        
        length_buckets = {
            'short': [],
            'medium': [],
            'long': []
        }
        
        for length, engagement in length_engagement:
            if length < 100:
                length_buckets['short'].append(engagement)
            elif length < 250:
                length_buckets['medium'].append(engagement)
            else:
                length_buckets['long'].append(engagement)
        
        avg_engagement = {}
        for bucket, engagements in length_buckets.items():
            if engagements:
                avg_engagement[bucket] = statistics.mean(engagements)
            else:
                avg_engagement[bucket] = 0
        
        best_bucket = max(avg_engagement.items(), key=lambda x: x[1])
        
        optimal_ranges = {
            'short': (50, 100),
            'medium': (100, 250),
            'long': (250, 500)
        }
        
        return {
            'optimal_length_range': optimal_ranges[best_bucket[0]],
            'avg_engagement': round(best_bucket[1], 2),
            'bucket_performance': {
                k: round(v, 2) for k, v in avg_engagement.items()
            }
        }
    
    def suggest_content_improvements(
        self,
        post: Dict[str, Any],
        similar_posts: List[Dict[str, Any]]
    ) -> List[str]:
        """Suggest improvements based on similar content"""
        suggestions = []
        
        content = post.get('content', '')
        engagement = post.get('likes', 0) + post.get('comments', 0)
        
        if not similar_posts:
            return ["No similar posts found for comparison"]
        
        avg_engagement = statistics.mean([
            p.get('likes', 0) + p.get('comments', 0)
            for p in similar_posts
        ])
        
        if engagement < avg_engagement * 0.7:
            suggestions.append(f"Your post is underperforming. Average engagement for similar content is {avg_engagement:.0f}")
        
        hashtag_count = len([w for w in content.split() if w.startswith('#')])
        avg_hashtags = statistics.mean([
            len([w for w in p.get('content', '').split() if w.startswith('#')])
            for p in similar_posts
        ])
        
        if hashtag_count < avg_hashtags * 0.5:
            suggestions.append(f"Consider adding more hashtags. Similar posts use an average of {avg_hashtags:.0f} hashtags")
        
        has_media = bool(post.get('media_url'))
        media_posts = [p for p in similar_posts if p.get('media_url')]
        
        if not has_media and len(media_posts) > len(similar_posts) * 0.6:
            suggestions.append("Consider adding media. 60% of similar high-performing posts include images or videos")
        
        return suggestions


class ABTestAnalyzer:
    """Analyze A/B test results"""
    
    def analyze_test(
        self,
        variant_a: List[Dict[str, Any]],
        variant_b: List[Dict[str, Any]],
        metric: str = 'engagement'
    ) -> Dict[str, Any]:
        """Analyze A/B test results"""
        def calculate_metric(posts: List[Dict[str, Any]]) -> float:
            if not posts:
                return 0
            if metric == 'engagement':
                return sum(p.get('likes', 0) + p.get('comments', 0) for p in posts) / len(posts)
            elif metric == 'likes':
                return sum(p.get('likes', 0) for p in posts) / len(posts)
            elif metric == 'comments':
                return sum(p.get('comments', 0) for p in posts) / len(posts)
            return 0
        
        metric_a = calculate_metric(variant_a)
        metric_b = calculate_metric(variant_b)
        
        improvement = ((metric_b - metric_a) / metric_a * 100) if metric_a > 0 else 0
        
        if abs(improvement) < 5:
            winner = "no_significant_difference"
            confidence = "low"
        elif improvement > 15:
            winner = "variant_b"
            confidence = "high"
        elif improvement < -15:
            winner = "variant_a"
            confidence = "high"
        else:
            winner = "variant_b" if improvement > 0 else "variant_a"
            confidence = "medium"
        
        return {
            "winner": winner,
            "confidence": confidence,
            "variant_a_metric": round(metric_a, 2),
            "variant_b_metric": round(metric_b, 2),
            "improvement_percentage": round(improvement, 2),
            "sample_size_a": len(variant_a),
            "sample_size_b": len(variant_b)
        }


class ContentSimilarityAnalyzer:
    """Analyze content similarity"""
    
    def calculate_similarity(
        self,
        text1: str,
        text2: str
    ) -> float:
        """Calculate similarity between two texts"""
        words1 = set(text1.lower().split())
        words2 = set(text2.lower().split())
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        
        if not union:
            return 0.0
        
        return len(intersection) / len(union)
    
    def find_similar_content(
        self,
        target_post: Dict[str, Any],
        all_posts: List[Dict[str, Any]],
        threshold: float = 0.3
    ) -> List[Dict[str, Any]]:
        """Find similar posts"""
        target_content = target_post.get('content', '')
        similar_posts = []
        
        for post in all_posts:
            if post.get('id') == target_post.get('id'):
                continue
            
            similarity = self.calculate_similarity(
                target_content,
                post.get('content', '')
            )
            
            if similarity >= threshold:
                similar_posts.append({
                    **post,
                    'similarity_score': round(similarity, 2)
                })
        
        return sorted(similar_posts, key=lambda x: x['similarity_score'], reverse=True)


class ChurnPredictor:
    """Predict user churn probability"""
    
    def predict_churn_probability(
        self,
        user_id: int,
        engagement_history: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Predict probability of user churning"""
        if not engagement_history:
            return {
                "churn_probability": 1.0,
                "risk_level": "critical",
                "factors": ["No engagement history"]
            }
        
        days_since_last_activity = (
            datetime.now() - 
            datetime.fromisoformat(engagement_history[0]['timestamp'])
        ).days
        
        engagement_trend = len(engagement_history[-7:]) if len(engagement_history) >= 7 else len(engagement_history)
        
        churn_score = 0
        factors = []
        
        if days_since_last_activity > 14:
            churn_score += 0.4
            factors.append("Inactive for over 2 weeks")
        elif days_since_last_activity > 7:
            churn_score += 0.2
            factors.append("Inactive for over a week")
        
        if engagement_trend < 3:
            churn_score += 0.3
            factors.append("Low recent engagement")
        
        if len(engagement_history) < 10:
            churn_score += 0.2
            factors.append("Limited engagement history")
        
        churn_probability = min(churn_score, 1.0)
        
        if churn_probability > 0.7:
            risk_level = "critical"
        elif churn_probability > 0.4:
            risk_level = "high"
        elif churn_probability > 0.2:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        return {
            "churn_probability": round(churn_probability, 2),
            "risk_level": risk_level,
            "factors": factors,
            "days_since_last_activity": days_since_last_activity
        }
