"""
Redis Caching Utilities - Caching layer for improved performance
"""

from typing import Dict, List, Any, Optional, Callable
from datetime import datetime, timedelta
from enum import Enum
import json
import hashlib
from functools import wraps


class CacheStrategy(Enum):
    LRU = "lru"  # Least Recently Used
    LFU = "lfu"  # Least Frequently Used
    TTL = "ttl"  # Time To Live


class CacheManager:
    """Advanced caching with multiple strategies"""
    
    def __init__(self, max_size: int = 1000, default_ttl: int = 3600):
        self.cache: Dict[str, Any] = {}
        self.access_count: Dict[str, int] = {}
        self.access_time: Dict[str, datetime] = {}
        self.expiry: Dict[str, datetime] = {}
        self.max_size = max_size
        self.default_ttl = default_ttl
        self.hits = 0
        self.misses = 0
    
    def _generate_key(self, prefix: str, *args, **kwargs) -> str:
        """Generate cache key from arguments"""
        key_data = f"{prefix}:{args}:{sorted(kwargs.items())}"
        return hashlib.md5(key_data.encode()).hexdigest()
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if key in self.cache:
            if key in self.expiry and datetime.now() > self.expiry[key]:
                del self.cache[key]
                del self.expiry[key]
                self.misses += 1
                return None
            
            self.access_count[key] = self.access_count.get(key, 0) + 1
            self.access_time[key] = datetime.now()
            self.hits += 1
            return self.cache[key]
        
        self.misses += 1
        return None
    
    def set(
        self,
        key: str,
        value: Any,
        ttl: Optional[int] = None
    ) -> bool:
        """Set value in cache"""
        if len(self.cache) >= self.max_size:
            self._evict()
        
        self.cache[key] = value
        self.access_count[key] = 1
        self.access_time[key] = datetime.now()
        
        ttl_seconds = ttl if ttl is not None else self.default_ttl
        self.expiry[key] = datetime.now() + timedelta(seconds=ttl_seconds)
        
        return True
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if key in self.cache:
            del self.cache[key]
            if key in self.access_count:
                del self.access_count[key]
            if key in self.access_time:
                del self.access_time[key]
            if key in self.expiry:
                del self.expiry[key]
            return True
        return False
    
    def _evict(self):
        """Evict items based on LRU strategy"""
        if not self.access_time:
            return
        
        oldest_key = min(self.access_time.items(), key=lambda x: x[1])[0]
        self.delete(oldest_key)
    
    def clear(self):
        """Clear all cache"""
        self.cache.clear()
        self.access_count.clear()
        self.access_time.clear()
        self.expiry.clear()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        total_requests = self.hits + self.misses
        hit_rate = (self.hits / total_requests * 100) if total_requests > 0 else 0
        
        return {
            "total_items": len(self.cache),
            "max_size": self.max_size,
            "hits": self.hits,
            "misses": self.misses,
            "hit_rate": round(hit_rate, 2),
            "memory_usage_estimate": sum(
                len(str(k)) + len(str(v)) for k, v in self.cache.items()
            )
        }
    
    def get_or_set(
        self,
        key: str,
        fetch_func: Callable,
        ttl: Optional[int] = None
    ) -> Any:
        """Get from cache or fetch and set"""
        value = self.get(key)
        if value is not None:
            return value
        
        value = fetch_func()
        self.set(key, value, ttl)
        return value
    
    def invalidate_pattern(self, pattern: str):
        """Invalidate all keys matching a pattern"""
        keys_to_delete = [
            key for key in self.cache.keys()
            if pattern in key
        ]
        
        for key in keys_to_delete:
            self.delete(key)
        
        return len(keys_to_delete)
    
    def get_top_accessed(self, n: int = 10) -> List[Dict[str, Any]]:
        """Get most frequently accessed cache keys"""
        sorted_items = sorted(
            self.access_count.items(),
            key=lambda x: x[1],
            reverse=True
        )[:n]
        
        return [
            {
                "key": key,
                "access_count": count,
                "last_accessed": self.access_time.get(key).isoformat() if key in self.access_time else None
            }
            for key, count in sorted_items
        ]


def cache_result(ttl: int = 3600, key_prefix: str = ""):
    """Decorator to cache function results"""
    def decorator(func: Callable) -> Callable:
        cache = CacheManager()
        
        @wraps(func)
        def wrapper(*args, **kwargs):
            cache_key = cache._generate_key(
                key_prefix or func.__name__,
                *args,
                **kwargs
            )
            
            result = cache.get(cache_key)
            if result is not None:
                return result
            
            result = func(*args, **kwargs)
            cache.set(cache_key, result, ttl)
            return result
        
        wrapper.cache = cache
        return wrapper
    
    return decorator


class SocialMediaCache:
    """Specialized cache for social media data"""
    
    def __init__(self):
        self.user_cache = CacheManager(max_size=1000, default_ttl=3600)
        self.post_cache = CacheManager(max_size=5000, default_ttl=1800)
        self.feed_cache = CacheManager(max_size=500, default_ttl=600)
        self.analytics_cache = CacheManager(max_size=1000, default_ttl=7200)
    
    def cache_user_profile(
        self,
        user_id: int,
        platform: str,
        profile_data: Dict[str, Any]
    ):
        """Cache user profile"""
        key = f"user:{platform}:{user_id}"
        self.user_cache.set(key, profile_data)
    
    def get_user_profile(
        self,
        user_id: int,
        platform: str
    ) -> Optional[Dict[str, Any]]:
        """Get cached user profile"""
        key = f"user:{platform}:{user_id}"
        return self.user_cache.get(key)
    
    def cache_post(
        self,
        post_id: str,
        platform: str,
        post_data: Dict[str, Any]
    ):
        """Cache post data"""
        key = f"post:{platform}:{post_id}"
        self.post_cache.set(key, post_data)
    
    def get_post(
        self,
        post_id: str,
        platform: str
    ) -> Optional[Dict[str, Any]]:
        """Get cached post"""
        key = f"post:{platform}:{post_id}"
        return self.post_cache.get(key)
    
    def cache_feed(
        self,
        user_id: int,
        platform: str,
        feed_data: List[Dict[str, Any]]
    ):
        """Cache user feed"""
        key = f"feed:{platform}:{user_id}"
        self.feed_cache.set(key, feed_data, ttl=600)
    
    def get_feed(
        self,
        user_id: int,
        platform: str
    ) -> Optional[List[Dict[str, Any]]]:
        """Get cached feed"""
        key = f"feed:{platform}:{user_id}"
        return self.feed_cache.get(key)
    
    def cache_analytics(
        self,
        user_id: int,
        metric_type: str,
        analytics_data: Dict[str, Any]
    ):
        """Cache analytics data"""
        key = f"analytics:{metric_type}:{user_id}"
        self.analytics_cache.set(key, analytics_data, ttl=7200)
    
    def get_analytics(
        self,
        user_id: int,
        metric_type: str
    ) -> Optional[Dict[str, Any]]:
        """Get cached analytics"""
        key = f"analytics:{metric_type}:{user_id}"
        return self.analytics_cache.get(key)
    
    def invalidate_user_data(
        self,
        user_id: int,
        platform: Optional[str] = None
    ):
        """Invalidate all cached data for a user"""
        if platform:
            pattern = f":{platform}:{user_id}"
        else:
            pattern = f":{user_id}"
        
        count = 0
        count += self.user_cache.invalidate_pattern(pattern)
        count += self.post_cache.invalidate_pattern(pattern)
        count += self.feed_cache.invalidate_pattern(pattern)
        count += self.analytics_cache.invalidate_pattern(pattern)
        
        return count
    
    def get_overall_stats(self) -> Dict[str, Any]:
        """Get statistics for all caches"""
        return {
            "user_cache": self.user_cache.get_stats(),
            "post_cache": self.post_cache.get_stats(),
            "feed_cache": self.feed_cache.get_stats(),
            "analytics_cache": self.analytics_cache.get_stats()
        }


class RateLimiter:
    """Rate limiting using cache"""
    
    def __init__(self, cache: CacheManager):
        self.cache = cache
    
    def is_allowed(
        self,
        identifier: str,
        max_requests: int,
        window_seconds: int
    ) -> Dict[str, Any]:
        """Check if request is allowed"""
        key = f"ratelimit:{identifier}"
        
        request_count = self.cache.get(key)
        
        if request_count is None:
            self.cache.set(key, 1, ttl=window_seconds)
            return {
                "allowed": True,
                "requests_remaining": max_requests - 1,
                "reset_in_seconds": window_seconds
            }
        
        if request_count >= max_requests:
            return {
                "allowed": False,
                "requests_remaining": 0,
                "reset_in_seconds": window_seconds
            }
        
        self.cache.set(key, request_count + 1, ttl=window_seconds)
        
        return {
            "allowed": True,
            "requests_remaining": max_requests - request_count - 1,
            "reset_in_seconds": window_seconds
        }
