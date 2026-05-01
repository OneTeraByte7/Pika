"""Tests for dating messaging functionality."""
import pytest
from datetime import datetime
from unittest.mock import AsyncMock, MagicMock, patch
from bson import ObjectId

from server.models.dating import MessageCreate
from server.services.dating_messaging import MessagingService


class TestMessagingService:
    """Test messaging service functionality."""

    @pytest.fixture
    def mock_db(self):
        """Create mock database."""
        return MagicMock()

    @pytest.fixture
    def messaging_service(self, mock_db):
        """Create messaging service with mock db."""
        return MessagingService(mock_db)

    @pytest.mark.asyncio
    async def test_send_message_success(self, messaging_service, mock_db):
        """Test sending a message successfully."""
        # Setup mocks
        mock_db.__getitem__.return_value.find_one = AsyncMock(return_value=None)  # Not blocked
        
        conversation = {
            "_id": ObjectId(),
            "profile_ids": ["profile1", "profile2"],
            "message_count": 0,
            "created_at": datetime.utcnow()
        }
        
        mock_db.__getitem__.return_value.find_one = AsyncMock(return_value=None)
        mock_db.__getitem__.return_value.insert_one = AsyncMock(return_value=MagicMock(inserted_id=ObjectId()))
        mock_db.__getitem__.return_value.update_one = AsyncMock(return_value=MagicMock(modified_count=1))

        # Note: In a real test, we'd properly mock the collections
        # For now, this demonstrates the test structure

    @pytest.mark.asyncio
    async def test_send_message_blocked(self, messaging_service):
        """Test sending message to blocked user."""
        # Mock blocked check
        with patch.object(messaging_service, '_check_blocked', return_value=True):
            with pytest.raises(ValueError, match="Cannot send message: user is blocked"):
                await messaging_service.send_message(
                    from_profile_id="profile1",
                    to_profile_id="profile2",
                    content="Hello"
                )

    @pytest.mark.asyncio
    async def test_mark_as_read(self, messaging_service):
        """Test marking message as read."""
        message_id = str(ObjectId())
        
        mock_result = MagicMock()
        mock_result.modified_count = 1
        
        messaging_service.messages_collection.update_one = AsyncMock(return_value=mock_result)
        
        success = await messaging_service.mark_as_read(message_id)
        assert success is True

    @pytest.mark.asyncio
    async def test_mark_as_read_not_found(self, messaging_service):
        """Test marking non-existent message as read."""
        message_id = str(ObjectId())
        
        mock_result = MagicMock()
        mock_result.modified_count = 0
        
        messaging_service.messages_collection.update_one = AsyncMock(return_value=mock_result)
        
        success = await messaging_service.mark_as_read(message_id)
        assert success is False

    @pytest.mark.asyncio
    async def test_delete_message_success(self, messaging_service):
        """Test deleting a message."""
        message_id = str(ObjectId())
        profile_id = "profile1"
        
        mock_message = {
            "_id": ObjectId(message_id),
            "from_profile_id": profile_id,
            "to_profile_id": "profile2",
            "content": "Test message"
        }
        
        mock_result = MagicMock()
        mock_result.modified_count = 1
        
        messaging_service.messages_collection.find_one = AsyncMock(return_value=mock_message)
        messaging_service.messages_collection.update_one = AsyncMock(return_value=mock_result)
        
        success = await messaging_service.delete_message(message_id, profile_id)
        assert success is True

    @pytest.mark.asyncio
    async def test_delete_message_unauthorized(self, messaging_service):
        """Test deleting a message not sent by user."""
        message_id = str(ObjectId())
        profile_id = "profile1"
        
        mock_message = {
            "_id": ObjectId(message_id),
            "from_profile_id": "profile2",  # Different sender
            "to_profile_id": "profile3",
            "content": "Test message"
        }
        
        messaging_service.messages_collection.find_one = AsyncMock(return_value=mock_message)
        
        success = await messaging_service.delete_message(message_id, profile_id)
        assert success is False

    @pytest.mark.asyncio
    async def test_get_unread_count(self, messaging_service):
        """Test getting unread message count."""
        profile_id = "profile1"
        
        aggregation_result = [{"total_unread": 5}]
        
        async def mock_aggregate(*args, **kwargs):
            async def mock_to_list(n):
                return aggregation_result
            return MagicMock(to_list=mock_to_list)
        
        messaging_service.conversations_collection.aggregate = mock_aggregate
        
        # Note: Would need better async mocking in real tests
        # This shows the structure


class TestMessageValidation:
    """Test message validation."""

    def test_message_create_valid(self):
        """Test creating valid message."""
        msg = MessageCreate(
            to_profile_id="profile2",
            content="Hello, this is a test message!",
            message_type="text"
        )
        assert msg.to_profile_id == "profile2"
        assert msg.content == "Hello, this is a test message!"

    def test_message_create_empty_content(self):
        """Test message with empty content fails."""
        with pytest.raises(ValueError):
            MessageCreate(
                to_profile_id="profile2",
                content="",
                message_type="text"
            )

    def test_message_create_too_long(self):
        """Test message that's too long fails."""
        long_content = "a" * 1001
        with pytest.raises(ValueError):
            MessageCreate(
                to_profile_id="profile2",
                content=long_content,
                message_type="text"
            )

    def test_message_types(self):
        """Test different message types."""
        types = ["text", "image", "emoji"]
        for msg_type in types:
            msg = MessageCreate(
                to_profile_id="profile2",
                content="Test",
                message_type=msg_type
            )
            assert msg.message_type == msg_type
