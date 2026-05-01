"""Tests for dating backend functionality."""
import pytest
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock
from bson import ObjectId

from server.models.dating import (
    DatingProfileCreate, UserPreferenceCreate, SwipeAction,
    GenderEnum, InterestCategory, MessageCreate
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


class TestDatingProfileCreation:
    """Test dating profile creation and validation."""

    def test_create_dating_profile_valid(self):
        """Test creating a valid dating profile."""
        profile = DatingProfileCreate(
            bio="I love hiking and traveling!",
            age=28,
            gender=GenderEnum.MALE,
            location={"latitude": 40.7128, "longitude": -74.0060, "city": "New York"}
        )
        assert profile.bio == "I love hiking and traveling!"
        assert profile.age == 28
        assert profile.gender == GenderEnum.MALE

    def test_create_dating_profile_with_interests(self):
        """Test creating profile with interests."""
        profile = DatingProfileCreate(
            bio="I love hiking and traveling!",
            age=28,
            gender=GenderEnum.FEMALE,
            location={"latitude": 40.7128, "longitude": -74.0060},
            interests=[InterestCategory.TRAVEL, InterestCategory.SPORTS, InterestCategory.MUSIC]
        )
        assert len(profile.interests) == 3
        assert InterestCategory.TRAVEL in profile.interests

    def test_profile_preference_validation(self):
        """Test user preference validation."""
        pref = UserPreferenceCreate(
            min_age=25,
            max_age=35,
            preferred_genders=[GenderEnum.FEMALE],
            max_distance_km=50
        )
        assert pref.min_age == 25
        assert pref.max_age == 35
        assert pref.max_distance_km == 50

    def test_invalid_age_range(self):
        """Test that invalid age ranges are rejected."""
        with pytest.raises(ValueError):
            UserPreferenceCreate(
                min_age=17,  # Below 18
                max_age=35
            )

    def test_invalid_max_distance(self):
        """Test that invalid distance is rejected."""
        with pytest.raises(ValueError):
            UserPreferenceCreate(
                min_age=25,
                max_age=35,
                max_distance_km=0  # Must be >= 1
            )


class TestMessagingModels:
    """Test messaging related models."""

    def test_message_create_valid(self):
        """Test creating valid message."""
        msg = MessageCreate(
            to_profile_id="profile2",
            content="Hello, how are you?",
            message_type="text"
        )
        assert msg.to_profile_id == "profile2"
        assert msg.content == "Hello, how are you?"
        assert msg.message_type == "text"

    def test_message_create_min_length(self):
        """Test message with minimum length."""
        msg = MessageCreate(
            to_profile_id="profile2",
            content="Hi",
            message_type="text"
        )
        assert len(msg.content) >= 1

    def test_message_create_max_length(self):
        """Test that overly long messages are rejected."""
        long_content = "a" * 1001
        with pytest.raises(ValueError):
            MessageCreate(
                to_profile_id="profile2",
                content=long_content,
                message_type="text"
            )

    def test_message_types(self):
        """Test different message types."""
        for msg_type in ["text", "image", "emoji"]:
            msg = MessageCreate(
                to_profile_id="profile2",
                content="Test",
                message_type=msg_type
            )
            assert msg.message_type == msg_type


class TestSwipeActions:
    """Test swipe/like actions."""

    def test_swipe_right(self):
        """Test swiping right (like)."""
        action = SwipeAction.RIGHT
        assert action == SwipeAction.RIGHT
        assert action.value == "right"

    def test_swipe_left(self):
        """Test swiping left (pass)."""
        action = SwipeAction.LEFT
        assert action == SwipeAction.LEFT
        assert action.value == "left"

    def test_gender_enum(self):
        """Test gender enumeration."""
        genders = [GenderEnum.MALE, GenderEnum.FEMALE, GenderEnum.NON_BINARY, GenderEnum.PREFER_NOT_TO_SAY]
        assert len(genders) == 4

    def test_interest_categories(self):
        """Test interest categories."""
        interests = [
            InterestCategory.TRAVEL,
            InterestCategory.SPORTS,
            InterestCategory.MUSIC,
            InterestCategory.ART,
            InterestCategory.FOOD
        ]
        assert len(interests) == 5


class TestLocationValidation:
    """Test location validation."""

    def test_valid_location(self):
        """Test valid location."""
        location = {
            "latitude": 40.7128,
            "longitude": -74.0060,
            "city": "New York",
            "country": "USA"
        }
        is_valid, error = validate_profile_data("Valid bio!", 28, location)
        assert is_valid is True

    def test_invalid_latitude(self):
        """Test invalid latitude."""
        location = {"latitude": 100, "longitude": -74.0060}
        is_valid, error = validate_profile_data("Valid bio!", 28, location)
        assert is_valid is False
        assert "Latitude" in error

    def test_invalid_longitude(self):
        """Test invalid longitude."""
        location = {"latitude": 40.7128, "longitude": 200}
        is_valid, error = validate_profile_data("Valid bio!", 28, location)
        assert is_valid is False
        assert "Longitude" in error

    def test_missing_coordinates(self):
        """Test missing coordinates."""
        location = {"city": "New York"}
        is_valid, error = validate_profile_data("Valid bio!", 28, location)
        assert is_valid is False
        assert "latitude and longitude" in error

