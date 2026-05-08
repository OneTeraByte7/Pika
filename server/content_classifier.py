"""
Advanced Content Classifier using transformers and zero-shot classification.
Categorizes content into multiple topics with confidence scores.
"""

from typing import Dict, List
import re
from dataclasses import dataclass
from enum import Enum

try:
    from transformers import pipeline
except ImportError:
    pipeline = None


class ContentCategory(str, Enum):
    TECH = "technology"
    LIFESTYLE = "lifestyle"
    NEWS = "news"
    ENTERTAINMENT = "entertainment"
    BUSINESS = "business"
    HEALTH = "health"
    SPORTS = "sports"
    EDUCATION = "education"
    PERSONAL = "personal"
    OTHER = "other"


@dataclass
class ClassificationResult:
    text: str
    primary_category: str
    confidence: float
    categories: Dict[str, float]
    tags: List[str]
    keywords: List[str]


class ContentClassifier:
    """Classify content into predefined categories using ML."""
    
    def __init__(self):
        self.categories = [cat.value for cat in ContentCategory]
        try:
            self.classifier = pipeline(
                "zero-shot-classification",
                model="facebook/bart-large-mnli"
            )
            self.has_ml = True
        except Exception:
            self.has_ml = False
            print("Warning: Transformers model not loaded. Using fallback classifier.")
    
    def classify(self, text: str, top_k: int = 5) -> ClassificationResult:
        """Classify content into categories."""
        if not text or len(text.strip()) < 5:
            return ClassificationResult(
                text=text,
                primary_category=ContentCategory.OTHER.value,
                confidence=0.0,
                categories={cat: 0.0 for cat in self.categories},
                tags=[],
                keywords=[]
            )
        
        if self.has_ml:
            return self._classify_with_ml(text, top_k)
        else:
            return self._classify_with_fallback(text, top_k)
    
    def _classify_with_ml(self, text: str, top_k: int) -> ClassificationResult:
        """Use transformer model for classification."""
        try:
            result = self.classifier(text, self.categories, multi_class=True)
            
            categories_dict = dict(zip(result['labels'], result['scores']))
            primary_cat = result['labels'][0]
            confidence = result['scores'][0]
            
            tags = self._extract_tags(text)
            keywords = self._extract_keywords(text)
            
            return ClassificationResult(
                text=text,
                primary_category=primary_cat,
                confidence=float(confidence),
                categories={k: float(v) for k, v in categories_dict.items()},
                tags=tags,
                keywords=keywords
            )
        except Exception as e:
            print(f"ML classification error: {e}. Using fallback.")
            return self._classify_with_fallback(text, top_k)
    
    def _classify_with_fallback(self, text: str, top_k: int) -> ClassificationResult:
        """Fallback keyword-based classification."""
        keywords_map = {
            ContentCategory.TECH.value: ['code', 'python', 'api', 'software', 'tech', 'ai', 'ml', 'data'],
            ContentCategory.LIFESTYLE.value: ['lifestyle', 'fashion', 'home', 'living', 'style'],
            ContentCategory.NEWS.value: ['breaking', 'news', 'update', 'report', 'announce'],
            ContentCategory.ENTERTAINMENT.value: ['movie', 'music', 'show', 'actor', 'video'],
            ContentCategory.BUSINESS.value: ['business', 'company', 'startup', 'investor', 'market'],
            ContentCategory.HEALTH.value: ['health', 'fitness', 'workout', 'diet', 'exercise'],
            ContentCategory.SPORTS.value: ['sports', 'game', 'team', 'player', 'match'],
            ContentCategory.EDUCATION.value: ['learn', 'school', 'university', 'course', 'education'],
        }
        
        text_lower = text.lower()
        scores = {}
        
        for category, keywords in keywords_map.items():
            score = sum(1 for kw in keywords if kw in text_lower)
            scores[category] = score
        
        scores[ContentCategory.OTHER.value] = 0
        
        sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        categories_dict = {cat: (score / max(5, sorted_scores[0][1]) if sorted_scores[0][1] > 0 else 0.1) 
                          for cat, score in sorted_scores[:top_k]}
        
        primary_cat = sorted_scores[0][0] if sorted_scores[0][1] > 0 else ContentCategory.OTHER.value
        confidence = categories_dict.get(primary_cat, 0.1)
        
        tags = self._extract_tags(text)
        keywords = self._extract_keywords(text)
        
        return ClassificationResult(
            text=text,
            primary_category=primary_cat,
            confidence=float(confidence),
            categories=categories_dict,
            tags=tags,
            keywords=keywords
        )
    
    def _extract_tags(self, text: str) -> List[str]:
        """Extract hashtags from text."""
        hashtags = re.findall(r'#(\w+)', text)
        return list(set(hashtags))[:10]
    
    def _extract_keywords(self, text: str) -> List[str]:
        """Extract important keywords from text."""
        words = re.findall(r'\b\w{4,}\b', text.lower())
        common_words = {'this', 'that', 'with', 'from', 'have', 'been', 'were', 'their'}
        keywords = [w for w in words if w not in common_words]
        return list(set(keywords))[:8]
    
    def get_category_confidence(self, text: str, category: str) -> float:
        """Get confidence score for a specific category."""
        result = self.classify(text)
        return result.categories.get(category, 0.0)
    
    def batch_classify(self, texts: List[str]) -> List[ClassificationResult]:
        """Classify multiple texts."""
        return [self.classify(text) for text in texts]
