"""
Sentiment Analysis Service - Analyze emotions and sentiment in social media content
"""

from typing import Dict, List, Any, Optional
from enum import Enum
from collections import Counter
import re


class SentimentLabel(Enum):
    VERY_POSITIVE = "very_positive"
    POSITIVE = "positive"
    NEUTRAL = "neutral"
    NEGATIVE = "negative"
    VERY_NEGATIVE = "very_negative"


class SentimentAnalyzer:
    """Analyze sentiment in text content"""
    
    def __init__(self):
        self.positive_words = {
            'love', 'amazing', 'awesome', 'great', 'excellent', 'wonderful', 'fantastic',
            'perfect', 'best', 'beautiful', 'brilliant', 'superb', 'outstanding', 'incredible',
            'happy', 'joy', 'delighted', 'pleased', 'thrilled', 'excited', 'grateful',
            'thankful', 'blessed', 'lucky', 'proud', 'inspiring', 'motivating', 'success',
            'win', 'victory', 'achievement', 'milestone', 'celebrate', 'congrats', 'kudos',
            '❤️', '😍', '🥰', '😊', '🎉', '✨', '🔥', '💯', '👏', '🙌'
        }
        
        self.negative_words = {
            'hate', 'terrible', 'awful', 'horrible', 'worst', 'bad', 'poor', 'disappointing',
            'sad', 'angry', 'frustrating', 'annoying', 'upset', 'disgusting', 'pathetic',
            'useless', 'fail', 'failed', 'disaster', 'mistake', 'wrong', 'error', 'problem',
            'issue', 'concern', 'worried', 'afraid', 'scared', 'nervous', 'stressed',
            'difficult', 'hard', 'struggle', 'suffer', 'pain', 'hurt', 'damage', 'broken',
            '😢', '😭', '😡', '😤', '😠', '💔', '😞', '😔', '😟', '😕'
        }
        
        self.intensifiers = {
            'very', 'extremely', 'really', 'so', 'absolutely', 'completely',
            'totally', 'incredibly', 'highly', 'exceptionally'
        }
        
        self.negations = {
            'not', 'no', 'never', "don't", "doesn't", "didn't", "won't", 
            "wouldn't", "can't", "cannot", "nothing", "nowhere", "nobody"
        }
    
    def analyze_text(self, text: str) -> Dict[str, Any]:
        """Analyze sentiment of a single text"""
        if not text:
            return {
                "sentiment": SentimentLabel.NEUTRAL.value,
                "score": 0.0,
                "confidence": 0.0
            }
        
        text_lower = text.lower()
        words = re.findall(r'\b\w+\b|[😀-🙏💀-🙌]', text_lower)
        
        positive_count = 0
        negative_count = 0
        intensity_multiplier = 1.0
        negation_active = False
        
        for i, word in enumerate(words):
            if word in self.intensifiers:
                intensity_multiplier = 1.5
                continue
            
            if word in self.negations:
                negation_active = True
                continue
            
            if word in self.positive_words:
                if negation_active:
                    negative_count += intensity_multiplier
                else:
                    positive_count += intensity_multiplier
                intensity_multiplier = 1.0
                negation_active = False
            
            elif word in self.negative_words:
                if negation_active:
                    positive_count += intensity_multiplier
                else:
                    negative_count += intensity_multiplier
                intensity_multiplier = 1.0
                negation_active = False
            else:
                intensity_multiplier = 1.0
                negation_active = False
        
        total = positive_count + negative_count
        if total == 0:
            sentiment_score = 0.0
            sentiment_label = SentimentLabel.NEUTRAL
            confidence = 0.5
        else:
            sentiment_score = (positive_count - negative_count) / total
            confidence = min(total / len(words) * 2, 1.0)
            
            if sentiment_score >= 0.5:
                sentiment_label = SentimentLabel.VERY_POSITIVE
            elif sentiment_score >= 0.2:
                sentiment_label = SentimentLabel.POSITIVE
            elif sentiment_score <= -0.5:
                sentiment_label = SentimentLabel.VERY_NEGATIVE
            elif sentiment_score <= -0.2:
                sentiment_label = SentimentLabel.NEGATIVE
            else:
                sentiment_label = SentimentLabel.NEUTRAL
        
        return {
            "sentiment": sentiment_label.value,
            "score": round(sentiment_score, 3),
            "confidence": round(confidence, 3),
            "positive_indicators": int(positive_count),
            "negative_indicators": int(negative_count)
        }
    
    def analyze_comments(
        self,
        comments: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Analyze sentiment across multiple comments"""
        if not comments:
            return {
                "overall_sentiment": SentimentLabel.NEUTRAL.value,
                "sentiment_breakdown": {},
                "average_score": 0.0
            }
        
        sentiment_counts = Counter()
        scores = []
        analyzed_comments = []
        
        for comment in comments:
            text = comment.get('text', '')
            analysis = self.analyze_text(text)
            
            sentiment_counts[analysis['sentiment']] += 1
            scores.append(analysis['score'])
            
            analyzed_comments.append({
                **comment,
                'sentiment_analysis': analysis
            })
        
        avg_score = sum(scores) / len(scores) if scores else 0.0
        
        if avg_score >= 0.3:
            overall = SentimentLabel.POSITIVE.value
        elif avg_score <= -0.3:
            overall = SentimentLabel.NEGATIVE.value
        else:
            overall = SentimentLabel.NEUTRAL.value
        
        total_comments = len(comments)
        sentiment_breakdown = {
            sentiment: {
                "count": count,
                "percentage": round(count / total_comments * 100, 2)
            }
            for sentiment, count in sentiment_counts.items()
        }
        
        return {
            "overall_sentiment": overall,
            "average_score": round(avg_score, 3),
            "total_comments": total_comments,
            "sentiment_breakdown": sentiment_breakdown,
            "analyzed_comments": analyzed_comments[:10]
        }
    
    def detect_toxic_content(self, text: str) -> Dict[str, Any]:
        """Detect potentially toxic or harmful content"""
        toxic_patterns = {
            'hate_speech': ['hate', 'disgusting', 'pathetic'],
            'harassment': ['stupid', 'idiot', 'loser', 'ugly'],
            'profanity': ['damn', 'hell', 'crap'],
            'threats': ['kill', 'die', 'hurt', 'destroy']
        }
        
        text_lower = text.lower()
        detected_categories = []
        toxic_score = 0.0
        
        for category, keywords in toxic_patterns.items():
            matches = sum(1 for keyword in keywords if keyword in text_lower)
            if matches > 0:
                detected_categories.append(category)
                toxic_score += matches * 0.2
        
        is_toxic = toxic_score > 0.5
        
        return {
            "is_toxic": is_toxic,
            "toxicity_score": min(round(toxic_score, 2), 1.0),
            "categories": detected_categories,
            "severity": "high" if toxic_score > 0.7 else "medium" if toxic_score > 0.4 else "low"
        }
    
    def analyze_engagement_sentiment(
        self,
        post: Dict[str, Any],
        comments: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Comprehensive sentiment analysis for a post and its engagement"""
        post_analysis = self.analyze_text(post.get('content', ''))
        
        comments_analysis = self.analyze_comments(comments)
        
        positive_comments = len([
            c for c in comments_analysis.get('analyzed_comments', [])
            if c.get('sentiment_analysis', {}).get('sentiment') in ['positive', 'very_positive']
        ])
        
        negative_comments = len([
            c for c in comments_analysis.get('analyzed_comments', [])
            if c.get('sentiment_analysis', {}).get('sentiment') in ['negative', 'very_negative']
        ])
        
        engagement_quality = "excellent" if positive_comments > negative_comments * 3 else \
                            "good" if positive_comments > negative_comments else \
                            "concerning" if negative_comments > positive_comments else "mixed"
        
        return {
            "post_sentiment": post_analysis,
            "comments_sentiment": comments_analysis,
            "engagement_quality": engagement_quality,
            "positive_engagement": positive_comments,
            "negative_engagement": negative_comments,
            "recommendation": self._generate_recommendation(post_analysis, comments_analysis)
        }
    
    def _generate_recommendation(
        self,
        post_analysis: Dict[str, Any],
        comments_analysis: Dict[str, Any]
    ) -> str:
        """Generate recommendations based on sentiment analysis"""
        post_sentiment = post_analysis.get('sentiment', '')
        overall_comments = comments_analysis.get('overall_sentiment', '')
        
        if post_sentiment in ['positive', 'very_positive'] and overall_comments in ['positive', 'very_positive']:
            return "Great engagement! Consider creating similar content."
        elif post_sentiment in ['positive', 'very_positive'] and overall_comments in ['negative', 'very_negative']:
            return "Your post is positive but receiving negative feedback. Monitor comments closely."
        elif overall_comments in ['negative', 'very_negative']:
            return "Negative sentiment detected. Consider addressing concerns in comments."
        else:
            return "Monitor engagement and respond to maintain positive sentiment."
    
    def get_emotion_breakdown(self, text: str) -> Dict[str, int]:
        """Detect specific emotions in text"""
        emotions = {
            'joy': ['happy', 'joy', 'excited', 'thrilled', '😊', '😃', '🎉'],
            'love': ['love', 'adore', 'cherish', '❤️', '😍', '🥰'],
            'surprise': ['wow', 'amazing', 'incredible', 'omg', '😮', '😲'],
            'sadness': ['sad', 'depressed', 'unhappy', '😢', '😭'],
            'anger': ['angry', 'furious', 'mad', '😡', '😠'],
            'fear': ['scared', 'afraid', 'worried', '😨', '😰']
        }
        
        text_lower = text.lower()
        emotion_counts = {}
        
        for emotion, keywords in emotions.items():
            count = sum(1 for keyword in keywords if keyword in text_lower)
            if count > 0:
                emotion_counts[emotion] = count
        
        return emotion_counts
