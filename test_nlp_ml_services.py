"""
Comprehensive tests for NLP and ML services.
Tests all core functionality and edge cases.
"""

import pytest
from server.content_classifier import ContentClassifier, ContentCategory
from server.smart_reply_suggestion import SmartReplySuggester, ReplyTone
from server.hashtag_optimizer import HashtagOptimizer
from server.toxicity_detector import ToxicityDetector, ToxicityLevel
from server.trend_predictor import TrendPredictor
from server.user_behavior_segmenter import UserBehaviorSegmenter, UserSegment, UserBehavior


# ==================== Content Classifier Tests ====================

class TestContentClassifier:
    """Test suite for content classifier."""
    
    @pytest.fixture
    def classifier(self):
        return ContentClassifier()
    
    def test_classify_tech_content(self, classifier):
        """Test classification of tech content."""
        text = "Just built an amazing Python API using FastAPI and MongoDB!"
        result = classifier.classify(text)
        
        assert result.primary_category in [c.value for c in ContentCategory]
        assert 0 <= result.confidence <= 1
        assert 'python' in result.keywords or 'api' in result.keywords
    
    def test_classify_empty_text(self, classifier):
        """Test classification with empty text."""
        result = classifier.classify("")
        
        assert result.primary_category == ContentCategory.OTHER.value
        assert result.confidence == 0.0
    
    def test_classify_short_text(self, classifier):
        """Test classification with very short text."""
        result = classifier.classify("Hi")
        
        assert result.primary_category == ContentCategory.OTHER.value
        assert result.confidence == 0.0
    
    def test_extract_hashtags(self, classifier):
        """Test hashtag extraction."""
        text = "Check this out #coding #python #ai"
        result = classifier.classify(text)
        
        assert len(result.tags) > 0
        assert 'coding' in result.tags or 'python' in result.tags
    
    def test_batch_classify(self, classifier):
        """Test batch classification."""
        texts = [
            "Python programming tutorial",
            "Fashion tips for summer",
            "Breaking news about tech industry"
        ]
        results = classifier.batch_classify(texts)
        
        assert len(results) == 3
        assert all(r.confidence >= 0 for r in results)
    
    def test_get_category_confidence(self, classifier):
        """Test getting confidence for specific category."""
        text = "Stock market trends and business growth"
        confidence = classifier.get_category_confidence(text, ContentCategory.BUSINESS.value)
        
        assert 0 <= confidence <= 1


# ==================== Smart Reply Suggestion Tests ====================

class TestSmartReplySuggester:
    """Test suite for reply suggester."""
    
    @pytest.fixture
    def suggester(self):
        return SmartReplySuggester()
    
    def test_suggest_replies(self, suggester):
        """Test basic reply suggestion."""
        comment = "This is amazing content!"
        suggestions = suggester.suggest_replies(comment, num_suggestions=3)
        
        assert len(suggestions) <= 3
        assert all(len(s.text) > 0 for s in suggestions)
        assert all(0 <= s.confidence <= 1 for s in suggestions)
    
    def test_suggest_replies_empty_comment(self, suggester):
        """Test with empty comment."""
        suggestions = suggester.suggest_replies("")
        
        assert len(suggestions) == 0
    
    def test_get_quick_reply(self, suggester):
        """Test quick reply generation."""
        comment = "I love your work!"
        reply = suggester.get_quick_reply(comment)
        
        assert len(reply) > 0
        assert isinstance(reply, str)
    
    def test_tone_selection(self, suggester):
        """Test tone-specific suggestions."""
        comment = "This is interesting"
        suggestions = suggester.suggest_replies(
            comment, 
            num_suggestions=3,
            tones=[ReplyTone.THOUGHTFUL.value, ReplyTone.PROFESSIONAL.value]
        )
        
        assert all(s.tone in [ReplyTone.THOUGHTFUL.value, ReplyTone.PROFESSIONAL.value] for s in suggestions)
    
    def test_batch_suggest_replies(self, suggester):
        """Test batch reply suggestions."""
        comments = ["Great job!", "I disagree", "Very informative"]
        results = suggester.batch_suggest_replies(comments, num_suggestions=2)
        
        assert len(results) == 3
        assert all(isinstance(r, list) for r in results)


# ==================== Hashtag Optimizer Tests ====================

class TestHashtagOptimizer:
    """Test suite for hashtag optimizer."""
    
    @pytest.fixture
    def optimizer(self):
        return HashtagOptimizer()
    
    def test_analyze_content(self, optimizer):
        """Test hashtag analysis."""
        content = "Just launched my new AI startup! Excited about the journey #tech #startup #ai"
        analysis = optimizer.analyze_content(content)
        
        assert len(analysis.recommended_hashtags) > 0
        assert analysis.total_reach > 0
        assert analysis.optimal_count > 0
    
    def test_hashtag_extraction(self, optimizer):
        """Test existing hashtag extraction."""
        content = "My post #coding #python #api"
        analysis = optimizer.analyze_content(content)
        
        assert len(analysis.hashtags_in_content) > 0
        assert 'coding' in analysis.hashtags_in_content
    
    def test_get_hashtag_stats(self, optimizer):
        """Test hashtag statistics."""
        stats = optimizer.get_hashtag_stats("python")
        
        assert 'estimated_reach' in stats
        assert 'engagement_rate' in stats
        assert 'competition' in stats
    
    def test_hashtag_strategy(self, optimizer):
        """Test complete hashtag strategy."""
        content = "Building a scalable web application with modern tech stack"
        strategy = optimizer.suggest_hashtag_strategy(content)
        
        assert 'strategy' in strategy
        assert 'recommended_hashtags' in strategy
        assert 'optimal_count' in strategy
        assert isinstance(strategy['recommended_hashtags'], list)
    
    def test_batch_analyze(self, optimizer):
        """Test batch hashtag analysis."""
        contents = [
            "Python programming",
            "Travel tips",
            "Business growth"
        ]
        results = optimizer.batch_analyze(contents)
        
        assert len(results) == 3
        assert all(len(r.recommended_hashtags) > 0 for r in results)


# ==================== Toxicity Detector Tests ====================

class TestToxicityDetector:
    """Test suite for toxicity detector."""
    
    @pytest.fixture
    def detector(self):
        return ToxicityDetector()
    
    def test_clean_content(self, detector):
        """Test analysis of clean content."""
        text = "I love this product! Amazing quality and great service."
        analysis = detector.analyze(text)
        
        assert analysis.is_toxic == False
        assert analysis.toxicity_score < 0.3
        assert analysis.recommended_action == 'approve'
    
    def test_toxic_content(self, detector):
        """Test detection of toxic content."""
        text = "This is stupid and I hate it"
        analysis = detector.analyze(text)
        
        assert analysis.is_toxic == True
        assert analysis.toxicity_score > 0.3
    
    def test_spam_detection(self, detector):
        """Test spam detection."""
        text = "Click here for FREE MONEY!!! bit.ly/scam"
        analysis = detector.analyze(text)
        
        assert analysis.is_spam == True
        assert analysis.recommended_action in ['flag', 'review']
    
    def test_empty_text(self, detector):
        """Test with empty text."""
        analysis = detector.analyze("")
        
        assert analysis.is_toxic == False
        assert analysis.is_spam == False
        assert analysis.recommended_action == 'approve'
    
    def test_batch_analyze(self, detector):
        """Test batch analysis."""
        texts = [
            "Great content!",
            "I hate this",
            "Buy now at bit.ly"
        ]
        analyses = detector.batch_analyze(texts)
        
        assert len(analyses) == 3
        assert isinstance(analyses[0].toxicity_level, str)
    
    def test_moderation_report(self, detector):
        """Test moderation report generation."""
        texts = [
            "Good content",
            "Bad content",
            "Spam link",
            "Nice post"
        ]
        report = detector.get_content_moderation_report(texts)
        
        assert report['total_items'] == 4
        assert 'clean_rate' in report
        assert 'issues_rate' in report


# ==================== Trend Predictor Tests ====================

class TestTrendPredictor:
    """Test suite for trend predictor."""
    
    @pytest.fixture
    def predictor(self):
        return TrendPredictor()
    
    def test_predict_trends(self, predictor):
        """Test trend prediction."""
        predictions = predictor.predict_trends(5)
        
        assert len(predictions) <= 5
        assert all(p.trend_score >= 0 for p in predictions)
        assert all(p.predicted_volume_24h > 0 for p in predictions)
    
    def test_prediction_ordering(self, predictor):
        """Test that trends are ordered by score."""
        predictions = predictor.predict_trends(5)
        
        scores = [p.trend_score for p in predictions]
        assert scores == sorted(scores, reverse=True)
    
    def test_predict_keyword_trend(self, predictor):
        """Test single keyword prediction."""
        prediction = predictor.predict_keyword_trend("python")
        
        assert prediction.keyword == "python"
        assert 0 <= prediction.trend_score <= 1
        assert prediction.likelihood in ['low', 'medium', 'high', 'very_high']
    
    def test_trending_hashtags(self, predictor):
        """Test trending hashtags."""
        hashtags = predictor.get_trending_hashtags(10)
        
        assert len(hashtags) > 0
        assert all(h.startswith('#') for h in hashtags)
    
    def test_trend_report(self, predictor):
        """Test trend report generation."""
        report = predictor.get_trend_report()
        
        assert 'hot_trends' in report
        assert 'emerging_trends' in report
        assert 'declining_trends' in report
        assert 'forecast_24h' in report
        assert 'forecast_48h' in report


# ==================== User Behavior Segmenter Tests ====================

class TestUserBehaviorSegmenter:
    """Test suite for user segmenter."""
    
    @pytest.fixture
    def segmenter(self):
        return UserBehaviorSegmenter()
    
    def test_segment_power_user(self, segmenter):
        """Test segmentation of power user."""
        behavior = UserBehavior(
            user_id="user1",
            post_frequency=3.0,
            engagement_rate=0.15,
            comment_count=200,
            like_count=500,
            share_count=100,
            follower_count=5000,
            following_count=500,
            avg_post_length=150,
            sentiment_score=0.8
        )
        profile = segmenter.segment_user(behavior)
        
        assert profile.segment == UserSegment.POWER_USER.value
        assert profile.value_score > 0.5
    
    def test_segment_casual_user(self, segmenter):
        """Test segmentation of casual user."""
        behavior = UserBehavior(
            user_id="user2",
            post_frequency=0.2,
            engagement_rate=0.02,
            comment_count=5,
            like_count=20,
            share_count=2,
            follower_count=50,
            following_count=100,
            avg_post_length=50,
            sentiment_score=0.2
        )
        profile = segmenter.segment_user(behavior)
        
        assert profile.segment == UserSegment.CASUAL_USER.value
        assert profile.engagement_level == "low"
    
    def test_segment_lurker(self, segmenter):
        """Test segmentation of lurker."""
        behavior = UserBehavior(
            user_id="user3",
            post_frequency=0.0,
            engagement_rate=0.05,
            comment_count=0,
            like_count=30,
            share_count=0,
            follower_count=100,
            following_count=200,
            avg_post_length=0,
            sentiment_score=0.3
        )
        profile = segmenter.segment_user(behavior)
        
        assert profile.segment == UserSegment.LURKER.value
    
    def test_segment_brand_advocate(self, segmenter):
        """Test segmentation of brand advocate."""
        behavior = UserBehavior(
            user_id="user4",
            post_frequency=1.5,
            engagement_rate=0.12,
            comment_count=80,
            like_count=150,
            share_count=50,
            follower_count=1000,
            following_count=300,
            avg_post_length=120,
            sentiment_score=0.9
        )
        profile = segmenter.segment_user(behavior)
        
        assert profile.segment in [UserSegment.BRAND_ADVOCATE.value, UserSegment.POWER_USER.value]
        assert profile.value_score > 0.4
    
    def test_batch_segment(self, segmenter):
        """Test batch segmentation."""
        behaviors = [
            UserBehavior(
                user_id="user1", post_frequency=2.0, engagement_rate=0.1,
                comment_count=100, like_count=300, share_count=50,
                follower_count=3000, following_count=400,
                avg_post_length=120, sentiment_score=0.7
            ),
            UserBehavior(
                user_id="user2", post_frequency=0.1, engagement_rate=0.02,
                comment_count=5, like_count=15, share_count=1,
                follower_count=50, following_count=100,
                avg_post_length=30, sentiment_score=0.1
            )
        ]
        profiles = segmenter.batch_segment_users(behaviors)
        
        assert len(profiles) == 2
        assert profiles[0].segment != profiles[1].segment  # Different segments
    
    def test_segment_summary(self, segmenter):
        """Test segment summary generation."""
        behaviors = [
            UserBehavior(
                user_id="u1", post_frequency=2.0, engagement_rate=0.1,
                comment_count=100, like_count=300, share_count=50,
                follower_count=3000, following_count=400,
                avg_post_length=120, sentiment_score=0.7
            ),
            UserBehavior(
                user_id="u2", post_frequency=0.1, engagement_rate=0.02,
                comment_count=5, like_count=15, share_count=1,
                follower_count=50, following_count=100,
                avg_post_length=30, sentiment_score=0.1
            )
        ]
        profiles = segmenter.batch_segment_users(behaviors)
        summary = segmenter.get_segment_summary(profiles)
        
        assert summary['total_users'] == 2
        assert 'average_user_value' in summary
        assert 'high_engagement_users' in summary


# ==================== Integration Tests ====================

class TestIntegration:
    """Integration tests across services."""
    
    def test_full_content_analysis_pipeline(self):
        """Test complete content analysis pipeline."""
        content = "Just launched my AI startup! #tech #ai #startup"
        
        classifier = ContentClassifier()
        suggester = SmartReplySuggester()
        hashtag_opt = HashtagOptimizer()
        detector = ToxicityDetector()
        
        # Classify
        classification = classifier.classify(content)
        assert classification.primary_category != ContentCategory.OTHER.value
        
        # Check toxicity
        toxicity = detector.analyze(content)
        assert toxicity.is_toxic == False
        
        # Optimize hashtags
        hashtags = hashtag_opt.analyze_content(content)
        assert len(hashtags.recommended_hashtags) > 0
        
        # Get reply suggestions
        comment = "This is cool!"
        suggestions = suggester.suggest_replies(comment)
        assert len(suggestions) > 0
