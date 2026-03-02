"""
Content Recommendation Engine - AI-powered content suggestions
"""

from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from collections import Counter
import random


class ContentRecommender:
    """Intelligent content recommendation system"""
    
    def __init__(self):
        self.user_preferences: Dict[int, Dict[str, Any]] = {}
        self.trending_topics: List[str] = []
        self.content_categories = [
            'lifestyle', 'tech', 'fitness', 'food', 'travel', 
            'fashion', 'business', 'entertainment', 'education'
        ]
    
    def analyze_user_interests(
        self,
        user_id: int,
        posts: List[Dict[str, Any]],
        interactions: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze user's content interests"""
        content_topics = Counter()
        hashtags_used = Counter()
        engagement_patterns = {
            'high_engagement_topics': [],
            'preferred_posting_times': [],
            'content_types': Counter()
        }
        
        for post in posts:
            content = post.get('content', '')
            engagement = post.get('likes', 0) + post.get('comments', 0)
            
            hashtags = [word for word in content.split() if word.startswith('#')]
            for tag in hashtags:
                hashtags_used[tag] += 1
                if engagement > 50:
                    content_topics[tag] += engagement
            
            content_type = post.get('type', 'text')
            engagement_patterns['content_types'][content_type] += 1
        
        for interaction in interactions:
            topic = interaction.get('topic', 'general')
            content_topics[topic] += 1
        
        interests = {
            'top_topics': [t[0] for t in content_topics.most_common(10)],
            'favorite_hashtags': [h[0] for h in hashtags_used.most_common(10)],
            'engagement_patterns': {
                'high_engagement_topics': [t[0] for t in content_topics.most_common(5)],
                'preferred_content_types': dict(engagement_patterns['content_types'])
            }
        }
        
        self.user_preferences[user_id] = interests
        return interests
    
    def recommend_content_topics(
        self,
        user_id: int,
        count: int = 5
    ) -> List[Dict[str, Any]]:
        """Recommend content topics to post about"""
        user_prefs = self.user_preferences.get(user_id, {})
        user_topics = user_prefs.get('top_topics', [])
        
        recommendations = []
        
        for topic in user_topics[:count]:
            recommendations.append({
                'topic': topic,
                'reason': 'Based on your past engagement',
                'confidence': 0.85,
                'suggested_hashtags': self._generate_hashtags(topic)
            })
        
        trending_recommendations = self._get_trending_recommendations(
            count - len(recommendations)
        )
        recommendations.extend(trending_recommendations)
        
        return recommendations[:count]
    
    def _generate_hashtags(self, topic: str) -> List[str]:
        """Generate relevant hashtags for a topic"""
        base_hashtags = {
            'fitness': ['#fitness', '#workout', '#health', '#gym'],
            'food': ['#foodie', '#cooking', '#recipes', '#delicious'],
            'travel': ['#travel', '#wanderlust', '#adventure', '#explore'],
            'tech': ['#technology', '#innovation', '#digital', '#future'],
            'fashion': ['#fashion', '#style', '#ootd', '#trendy']
        }
        
        topic_clean = topic.lower().replace('#', '')
        
        for key, tags in base_hashtags.items():
            if key in topic_clean:
                return tags[:3]
        
        return [f'#{topic_clean}', '#trending', '#daily']
    
    def _get_trending_recommendations(
        self,
        count: int
    ) -> List[Dict[str, Any]]:
        """Get trending topic recommendations"""
        trending = [
            {'topic': '#AI', 'engagement_score': 950},
            {'topic': '#Sustainability', 'engagement_score': 850},
            {'topic': '#WellnessWednesday', 'engagement_score': 780},
            {'topic': '#TechTuesday', 'engagement_score': 720},
            {'topic': '#Motivation', 'engagement_score': 680}
        ]
        
        recommendations = []
        for item in trending[:count]:
            recommendations.append({
                'topic': item['topic'],
                'reason': 'Trending topic',
                'confidence': 0.75,
                'engagement_score': item['engagement_score']
            })
        
        return recommendations
    
    def suggest_posting_time(
        self,
        user_id: int,
        timezone: str = 'UTC'
    ) -> Dict[str, Any]:
        """Suggest optimal posting time"""
        optimal_hours = [9, 12, 17, 20]
        
        current_hour = datetime.now().hour
        
        next_optimal = None
        for hour in optimal_hours:
            if hour > current_hour:
                next_optimal = hour
                break
        
        if not next_optimal:
            next_optimal = optimal_hours[0]
        
        now = datetime.now()
        suggested_time = now.replace(
            hour=next_optimal,
            minute=0,
            second=0,
            microsecond=0
        )
        
        if suggested_time <= now:
            suggested_time += timedelta(days=1)
        
        return {
            'suggested_time': suggested_time.isoformat(),
            'reason': 'Peak engagement hours',
            'expected_reach': 'High',
            'alternative_times': [
                (suggested_time + timedelta(hours=i)).isoformat()
                for i in [3, 6, 9]
            ]
        }
    
    def generate_content_ideas(
        self,
        user_id: int,
        category: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Generate content ideas based on user interests"""
        user_prefs = self.user_preferences.get(user_id, {})
        favorite_topics = user_prefs.get('top_topics', [])
        
        content_templates = {
            'question': "What's your favorite {} and why?",
            'tip': "Pro tip for {}: ...",
            'listicle': "Top 5 {} you need to try",
            'behind_scenes': "Behind the scenes of my {} journey",
            'tutorial': "How to master {} in 3 steps"
        }
        
        ideas = []
        
        if favorite_topics:
            for topic in favorite_topics[:3]:
                template_type = random.choice(list(content_templates.keys()))
                template = content_templates[template_type]
                
                ideas.append({
                    'type': template_type,
                    'idea': template.format(topic),
                    'topic': topic,
                    'estimated_engagement': random.randint(50, 200)
                })
        
        generic_ideas = [
            {
                'type': 'poll',
                'idea': "Create a poll asking your audience their preference",
                'estimated_engagement': 150
            },
            {
                'type': 'quote',
                'idea': "Share an inspirational quote relevant to your niche",
                'estimated_engagement': 100
            },
            {
                'type': 'storytelling',
                'idea': "Tell a personal story that resonates with your audience",
                'estimated_engagement': 180
            }
        ]
        
        ideas.extend(generic_ideas)
        
        return ideas[:5]
    
    def analyze_competitor_content(
        self,
        competitor_posts: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze competitor content for insights"""
        hashtags = Counter()
        content_types = Counter()
        high_performing = []
        
        for post in competitor_posts:
            content = post.get('content', '')
            engagement = post.get('likes', 0) + post.get('comments', 0)
            
            tags = [word for word in content.split() if word.startswith('#')]
            for tag in tags:
                hashtags[tag] += 1
            
            content_types[post.get('type', 'text')] += 1
            
            if engagement > 100:
                high_performing.append({
                    'content': content[:100],
                    'engagement': engagement,
                    'type': post.get('type')
                })
        
        return {
            'trending_hashtags': [h[0] for h in hashtags.most_common(10)],
            'popular_content_types': dict(content_types),
            'high_performing_posts': high_performing[:5],
            'average_engagement': sum(
                p.get('likes', 0) + p.get('comments', 0) 
                for p in competitor_posts
            ) / len(competitor_posts) if competitor_posts else 0
        }
    
    def suggest_content_improvements(
        self,
        post_content: str,
        current_engagement: int
    ) -> List[str]:
        """Suggest improvements for content"""
        suggestions = []
        
        if len(post_content) < 50:
            suggestions.append("Consider adding more detail to increase engagement")
        
        hashtag_count = len([w for w in post_content.split() if w.startswith('#')])
        if hashtag_count < 3:
            suggestions.append("Add 3-5 relevant hashtags to increase discoverability")
        elif hashtag_count > 10:
            suggestions.append("Reduce hashtag count to 5-7 for better engagement")
        
        if '?' not in post_content:
            suggestions.append("Consider adding a question to encourage comments")
        
        if not any(emoji in post_content for emoji in ['❤️', '🔥', '✨', '💯']):
            suggestions.append("Add relevant emojis to make content more engaging")
        
        if current_engagement < 50:
            suggestions.append("Try posting during peak hours (9am, 12pm, 5pm, 8pm)")
        
        return suggestions
    
    def predict_engagement(
        self,
        post_content: str,
        posting_time: datetime,
        user_followers: int
    ) -> Dict[str, Any]:
        """Predict potential engagement for a post"""
        base_engagement_rate = 0.03
        
        hashtag_count = len([w for w in post_content.split() if w.startswith('#')])
        if 3 <= hashtag_count <= 7:
            base_engagement_rate += 0.01
        
        hour = posting_time.hour
        if hour in [9, 12, 17, 20]:
            base_engagement_rate += 0.015
        
        has_question = '?' in post_content
        if has_question:
            base_engagement_rate += 0.005
        
        predicted_engagement = int(user_followers * base_engagement_rate)
        
        return {
            'predicted_likes': int(predicted_engagement * 0.7),
            'predicted_comments': int(predicted_engagement * 0.2),
            'predicted_shares': int(predicted_engagement * 0.1),
            'confidence': 0.75,
            'factors': {
                'hashtag_usage': 'optimal' if 3 <= hashtag_count <= 7 else 'suboptimal',
                'posting_time': 'peak' if hour in [9, 12, 17, 20] else 'off-peak',
                'engagement_prompt': 'yes' if has_question else 'no'
            }
        }
