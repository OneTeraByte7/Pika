"""Tests for dating backend functionality."""
import pytest
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock
from bson import ObjectId

from server.models.dating import (
    DatingProfileCreate, UserPreferenceCreate, SwipeAction,
    GenderEnum, InterestCategory
)
from server.services.dating_utils import (
    validate_profile_data, validate_email, sanitize_bio,
    calculate_distance_km, calculate_compatibility_score,
    is_profile_complete, generate_profile_quality_score
)


class TestDatingUtils:
    """Test utility functions."""

    def test_validate_profile_data_valid(self):
        """Test validation of valid profile data."""
        bio = "I love traveling and meeting new people. Very into tech and hiking!"
        age = 28
        location = {"latitude": 40.7128, "longitude": -74.0060, "city": "New York"}
        
        is_valid, error = validate_profile_data(bio, age, location)
        assert is_valid is True
        assert error is None

    def test_validate_profile_data_short_bio(self):
        """Test validation rejects short bio."""
        is_valid, error = validate_profile_data("Too short", 28, {"latitude": 40.7128, "longitude": -74.0060})
        assert is_valid is False
        assert "10 characters" in error

    def test_validate_profile_data_invalid_age(self):
        """Test validation rejects invalid age."""
        is_valid, error = validate_profile_data("Valid bio here!", 150, {"latitude": 40.7128, "longitude": -74.0060})
        assert is_valid is False
        assert "Age" in error

    def test_validate_email_valid(self):
        """Test email validation with valid email."""
        assert validate_email("user@example.com") is True
        assert validate_email("test.email+tag@domain.co.uk") is True

    def test_validate_email_invalid(self):
        """Test email validation with invalid email."""
        assert validate_email("invalid.email") is False

    def test_sanitize_bio(self):
        """Test bio sanitization."""
        bio = '<script>alert("XSS")</script> Normal text'
        sanitized = sanitize_bio(bio)
        assert "<script>" not in sanitized
        assert "&lt;script&gt;" in sanitized

    def test_calculate_distance_km(self):
        """Test distance calculation."""
        # NYC to London (approx 5585 km)
        distance = calculate_distance_km(40.7128, -74.0060, 51.5074, -0.1278)
        assert 5500 < distance < 5700

    def test_calculate_compatibility_score(self):
        """Test compatibility score calculation."""
        score = calculate_compatibility_score(0, 2, 4)
        assert score == 50

    def test_is_profile_complete_valid(self):
        """Test profile completeness check."""
        profile = {
            "bio": "I love hiking",
            "age": 28,
            "gender": "male",
            "location": {"latitude": 40.7128, "longitude": -74.0060},
            "photos": [{"url": "https://example.com/photo.jpg"}]
        }
        is_complete, missing = is_profile_complete(profile)
        assert is_complete is True

    def test_generate_profile_quality_score(self):
        """Test profile quality scoring."""
        profile = {
            "bio": "A" * 150,
            "photos": [{"url": "1"}, {"url": "2"}, {"url": "3"}],
            "interests": ["travel", "sports", "music", "art", "food"],
            "verified": True
        }
        score = generate_profile_quality_score(profile)
        assert score == 100
