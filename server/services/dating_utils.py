import re
import math
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from enum import Enum


class DatingValidationError(Exception):
    """Custom exception for dating validation errors."""
    pass


def validate_profile_data(bio: str, age: int, location: Dict) -> Tuple[bool, Optional[str]]:
    """
    Validate core profile data.
    
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not bio or len(bio) < 10:
        return False, "Bio must be at least 10 characters"
    
    if len(bio) > 500:
        return False, "Bio must be less than 500 characters"
    
    if age < 18 or age > 120:
        return False, "Age must be between 18 and 120"
    
    if not location or not isinstance(location, dict):
        return False, "Location is required"
    
    if "latitude" not in location or "longitude" not in location:
        return False, "Location must include latitude and longitude"
    
    try:
        lat = float(location["latitude"])
        lon = float(location["longitude"])
        
        if not (-90 <= lat <= 90):
            return False, "Latitude must be between -90 and 90"
        
        if not (-180 <= lon <= 180):
            return False, "Longitude must be between -180 and 180"
    except (ValueError, TypeError):
        return False, "Latitude and longitude must be valid numbers"
    
    return True, None


def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def sanitize_bio(bio: str) -> str:
    """Sanitize bio text to prevent XSS."""
    # Remove potentially dangerous characters
    bio = bio.strip()
    # Basic HTML escaping
    bio = (bio
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#x27;"))
    return bio


def calculate_age_from_dob(date_of_birth: datetime) -> int:
    """Calculate age from date of birth."""
    today = datetime.utcnow()
    age = today.year - date_of_birth.year
    
    if (today.month, today.day) < (date_of_birth.month, date_of_birth.day):
        age -= 1
    
    return age


def is_valid_location_format(location: Dict) -> bool:
    """Validate location object structure."""
    required_keys = {"latitude", "longitude"}
    if not all(key in location for key in required_keys):
        return False
    
    try:
        lat = float(location["latitude"])
        lon = float(location["longitude"])
        return -90 <= lat <= 90 and -180 <= lon <= 180
    except (ValueError, TypeError):
        return False


def calculate_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance in kilometers between two points using Haversine formula.
    
    Args:
        lat1, lon1: First point coordinates
        lat2, lon2: Second point coordinates
    
    Returns:
        Distance in kilometers
    """
    R = 6371  # Earth's radius in km
    
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c


def calculate_compatibility_score(
    age_diff: int,
    shared_interests: int,
    total_interests: int,
    height_diff_cm: Optional[int] = None,
    distance_km: Optional[float] = None
) -> float:
    """
    Calculate compatibility score between two profiles.
    
    Scoring breakdown:
    - Age: 30 points (±5 years = max points)
    - Interests: 40 points (based on overlap)
    - Height: 15 points (if available)
    - Distance: 15 points (closer = higher)
    
    Returns:
        Score between 0 and 100
    """
    score = 0.0
    
    # Age compatibility: max 30 points for ±5 years
    age_score = max(0, 30 - (age_diff * 2))
    score += age_score
    
    # Interest overlap: max 40 points
    if total_interests > 0:
        interest_score = (shared_interests / total_interests) * 40
        score += interest_score
    
    # Height compatibility: max 15 points
    if height_diff_cm is not None:
        height_score = max(0, 15 - (height_diff_cm / 5))
        score += height_score
    
    # Distance bonus: max 15 points
    if distance_km is not None:
        if distance_km < 10:
            distance_score = 15
        elif distance_km < 50:
            distance_score = 10
        else:
            distance_score = max(0, 15 - (distance_km / 50))
        score += distance_score
    
    return min(score, 100)


def get_age_group(age: int) -> str:
    """Categorize age into groups."""
    if age < 25:
        return "18-24"
    elif age < 35:
        return "25-34"
    elif age < 45:
        return "35-44"
    elif age < 55:
        return "45-54"
    else:
        return "55+"


def is_profile_complete(profile: Dict) -> Tuple[bool, List[str]]:
    """
    Check if profile is complete and return missing fields.
    
    Returns:
        Tuple of (is_complete, missing_fields)
    """
    required_fields = ["bio", "age", "gender", "location", "photos"]
    missing = []
    
    for field in required_fields:
        if field not in profile or not profile[field]:
            missing.append(field)
        elif field == "photos" and isinstance(profile[field], list) and len(profile[field]) == 0:
            missing.append("at least one photo")
    
    return len(missing) == 0, missing


def generate_profile_quality_score(profile: Dict) -> float:
    """
    Generate a profile quality score based on completeness and content.
    
    Returns:
        Score between 0 and 100
    """
    score = 0.0
    
    # Bio quality (30 points)
    if "bio" in profile and profile["bio"]:
        bio_length = len(profile["bio"])
        if bio_length >= 100:
            score += 30
        else:
            score += (bio_length / 100) * 30
    
    # Photos (30 points)
    if "photos" in profile and isinstance(profile["photos"], list):
        photo_count = len(profile["photos"])
        if photo_count >= 3:
            score += 30
        else:
            score += (photo_count / 3) * 30
    
    # Interests (20 points)
    if "interests" in profile and isinstance(profile["interests"], list):
        interest_count = len(profile["interests"])
        if interest_count >= 5:
            score += 20
        else:
            score += (interest_count / 5) * 20
    
    # Verification bonus (20 points)
    if profile.get("verified", False):
        score += 20
    
    return min(score, 100)


def format_distance_display(distance_km: float) -> str:
    """Format distance for display."""
    if distance_km < 1:
        return "< 1 km away"
    elif distance_km < 100:
        return f"{distance_km:.1f} km away"
    else:
        return f"{distance_km / 1000:.1f} hours away"


def batch_profile_update_allowed(last_update: datetime, min_interval_hours: int = 1) -> bool:
    """Check if enough time has passed since last profile update."""
    now = datetime.utcnow()
    elapsed = (now - last_update).total_seconds() / 3600
    return elapsed >= min_interval_hours


def rate_limit_check(last_action: datetime, limit_seconds: int) -> bool:
    """Check if action is within rate limit."""
    now = datetime.utcnow()
    elapsed = (now - last_action).total_seconds()
    return elapsed >= limit_seconds


def get_profile_activity_status(last_active: Optional[datetime]) -> str:
    """Get profile activity status."""
    if not last_active:
        return "never"
    
    now = datetime.utcnow()
    delta = now - last_active
    
    if delta.total_seconds() < 300:  # 5 minutes
        return "just now"
    elif delta.total_seconds() < 3600:  # 1 hour
        minutes = int(delta.total_seconds() / 60)
        return f"{minutes}m ago"
    elif delta.days < 1:
        hours = int(delta.total_seconds() / 3600)
        return f"{hours}h ago"
    elif delta.days < 7:
        return f"{delta.days}d ago"
    else:
        return "long time ago"


def get_match_reason_text(compatibility_score: float, shared_interests: List[str], distance_km: float) -> str:
    """Generate human-readable match reason."""
    reasons = []
    
    if compatibility_score >= 80:
        reasons.append("Excellent match")
    elif compatibility_score >= 60:
        reasons.append("Great match")
    
    if shared_interests:
        interests_str = ", ".join(shared_interests[:3])
        if len(shared_interests) > 3:
            interests_str += f" +{len(shared_interests) - 3} more"
        reasons.append(f"Into {interests_str}")
    
    if distance_km < 10:
        reasons.append("Very close")
    elif distance_km < 50:
        reasons.append("In your area")
    
    return " • ".join(reasons) if reasons else "Interesting match"
