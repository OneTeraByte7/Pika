"""Test runner for NLP/ML services - inline verification."""

import sys
import os
sys.path.insert(0, r'F:\Pika')
os.chdir(r'F:\Pika')

def test_imports():
    """Test that all modules import correctly."""
    try:
        from server.content_classifier import ContentClassifier
        from server.smart_reply_suggestion import SmartReplySuggester
        from server.hashtag_optimizer import HashtagOptimizer
        from server.toxicity_detector import ToxicityDetector
        from server.trend_predictor import TrendPredictor
        from server.user_behavior_segmenter import UserBehaviorSegmenter
        from server.nlp_ml_api import router
        print("✅ All imports successful")
        return True
    except Exception as e:
        print(f"❌ Import failed: {e}")
        return False

def test_services():
    """Test basic functionality of all services."""
    try:
        from server.content_classifier import ContentClassifier
        
        classifier = ContentClassifier()
        result = classifier.classify("Python programming is awesome!")
        
        assert result.primary_category is not None
        assert 0 <= result.confidence <= 1
        print(f"✅ Content Classifier: {result.primary_category} ({result.confidence:.1%})")
        
        from server.smart_reply_suggestion import SmartReplySuggester
        suggester = SmartReplySuggester()
        suggestions = suggester.suggest_replies("Great post!")
        assert len(suggestions) > 0
        print(f"✅ Smart Reply Suggester: {len(suggestions)} suggestions generated")
        
        from server.hashtag_optimizer import HashtagOptimizer
        optimizer = HashtagOptimizer()
        analysis = optimizer.analyze_content("Tech startup launch!")
        assert analysis.total_reach > 0
        print(f"✅ Hashtag Optimizer: {len(analysis.recommended_hashtags)} tags, {analysis.total_reach:,} reach")
        
        from server.toxicity_detector import ToxicityDetector
        detector = ToxicityDetector()
        analysis = detector.analyze("I love this!")
        assert not analysis.is_toxic
        print(f"✅ Toxicity Detector: {analysis.toxicity_level} ({analysis.recommended_action})")
        
        from server.trend_predictor import TrendPredictor
        predictor = TrendPredictor()
        predictions = predictor.predict_trends(3)
        assert len(predictions) > 0
        print(f"✅ Trend Predictor: {len(predictions)} trends, top: {predictions[0].keyword}")
        
        from server.user_behavior_segmenter import UserBehaviorSegmenter, UserBehavior
        segmenter = UserBehaviorSegmenter()
        behavior = UserBehavior(
            user_id="test", post_frequency=2.0, engagement_rate=0.1,
            comment_count=100, like_count=300, share_count=50,
            follower_count=3000, following_count=400,
            avg_post_length=120, sentiment_score=0.7
        )
        profile = segmenter.segment_user(behavior)
        assert profile.segment is not None
        print(f"✅ User Segmenter: {profile.segment} ({profile.value_score:.2f} value)")
        
        print("\n✅ All services working correctly!")
        return True
    except Exception as e:
        print(f"❌ Service test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("Testing NLP/ML Services...\n")
    
    if test_imports() and test_services():
        print("\n" + "="*60)
        print("🎉 SUCCESS! All NLP/ML services are operational!")
        print("="*60)
        print("\nTo start the server:")
        print("  cd F:\\Pika")
        print("  python -m server.main")
        print("\nAPI Documentation:")
        print("  http://localhost:8000/docs")
        print("  http://localhost:8000/nlp-ml/info")
    else:
        print("\n❌ Some tests failed")
        sys.exit(1)
