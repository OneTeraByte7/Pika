"""Messaging service for dating app conversations."""
from typing import List, Dict, Optional, Tuple
from datetime import datetime, timedelta
from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorDatabase

from server.models.dating import (
    MessageCreate, MessageResponse,
    ConversationResponse, ConversationDetailResponse,
    MessageBatchResponse, ConversationListResponse
)


class MessagingService:
    """Handles direct messaging between matched profiles."""

    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.conversations_collection = db["dating_conversations"]
        self.messages_collection = db["dating_messages"]
        self.blocked_collection = db["blocked_users"]

    async def send_message(
        self,
        from_profile_id: str,
        to_profile_id: str,
        content: str,
        message_type: str = "text"
    ) -> MessageResponse:
        """Send a message to another profile."""
        # Check if blocked
        is_blocked = await self._check_blocked(from_profile_id, to_profile_id)
        if is_blocked:
            raise ValueError("Cannot send message: user is blocked or has blocked you")

        # Get or create conversation
        conversation = await self._get_or_create_conversation(from_profile_id, to_profile_id)

        # Create message document
        message_doc = {
            "_id": ObjectId(),
            "conversation_id": conversation["_id"],
            "from_profile_id": from_profile_id,
            "to_profile_id": to_profile_id,
            "content": content,
            "message_type": message_type,
            "is_read": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        result = await self.messages_collection.insert_one(message_doc)

        # Update conversation last message
        await self.conversations_collection.update_one(
            {"_id": conversation["_id"]},
            {
                "$set": {
                    "last_message": content[:100],  # Preview
                    "last_message_timestamp": datetime.utcnow(),
                    "updated_at": datetime.utcnow()
                },
                "$inc": {"message_count": 1, "unread_count_from_" + to_profile_id: 1}
            }
        )

        return MessageResponse(
            id=str(result.inserted_id),
            from_profile_id=from_profile_id,
            to_profile_id=to_profile_id,
            content=content,
            message_type=message_type,
            is_read=False,
            created_at=message_doc["created_at"],
            updated_at=message_doc["updated_at"]
        )

    async def get_messages(
        self,
        profile_id: str,
        other_profile_id: str,
        limit: int = 50,
        skip: int = 0
    ) -> List[MessageResponse]:
        """Get messages between two profiles."""
        query = {
            "$or": [
                {"from_profile_id": profile_id, "to_profile_id": other_profile_id},
                {"from_profile_id": other_profile_id, "to_profile_id": profile_id}
            ]
        }

        messages = await self.messages_collection.find(query) \
            .sort("created_at", -1) \
            .skip(skip) \
            .limit(limit) \
            .to_list(limit)

        # Reverse to get chronological order
        messages.reverse()

        return [
            MessageResponse(
                id=str(msg["_id"]),
                from_profile_id=msg["from_profile_id"],
                to_profile_id=msg["to_profile_id"],
                content=msg["content"],
                message_type=msg.get("message_type", "text"),
                is_read=msg.get("is_read", False),
                created_at=msg["created_at"],
                updated_at=msg.get("updated_at", msg["created_at"])
            )
            for msg in messages
        ]

    async def mark_as_read(self, message_id: str) -> bool:
        """Mark a message as read."""
        try:
            result = await self.messages_collection.update_one(
                {"_id": ObjectId(message_id)},
                {
                    "$set": {
                        "is_read": True,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return result.modified_count > 0
        except Exception:
            return False

    async def mark_conversation_as_read(self, profile_id: str, other_profile_id: str) -> bool:
        """Mark all messages in a conversation as read for a profile."""
        try:
            await self.messages_collection.update_many(
                {
                    "from_profile_id": other_profile_id,
                    "to_profile_id": profile_id,
                    "is_read": False
                },
                {"$set": {"is_read": True, "updated_at": datetime.utcnow()}}
            )

            # Reset unread count in conversation
            await self.conversations_collection.update_one(
                {
                    "profile_ids": {"$all": [profile_id, other_profile_id]}
                },
                {
                    "$set": {
                        f"unread_count_from_{profile_id}": 0,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return True
        except Exception:
            return False

    async def get_conversation(self, profile_id: str, other_profile_id: str) -> Optional[ConversationResponse]:
        """Get a specific conversation between two profiles."""
        conversation = await self.conversations_collection.find_one({
            "profile_ids": {"$all": [profile_id, other_profile_id]}
        })

        if not conversation:
            return None

        unread = conversation.get(f"unread_count_from_{profile_id}", 0)
        return ConversationResponse(
            id=str(conversation["_id"]),
            profile_ids=conversation["profile_ids"],
            last_message=conversation.get("last_message"),
            last_message_timestamp=conversation.get("last_message_timestamp"),
            unread_count=unread,
            message_count=conversation.get("message_count", 0),
            created_at=conversation["created_at"],
            updated_at=conversation.get("updated_at", conversation["created_at"])
        )

    async def get_conversations(self, profile_id: str, limit: int = 50) -> ConversationListResponse:
        """Get all conversations for a profile, sorted by recency."""
        conversations = await self.conversations_collection.find({
            "profile_ids": profile_id
        }).sort("updated_at", -1).limit(limit).to_list(limit)

        total_unread = 0
        conversation_responses = []

        for conv in conversations:
            unread = conv.get(f"unread_count_from_{profile_id}", 0)
            total_unread += unread

            conversation_responses.append(ConversationResponse(
                id=str(conv["_id"]),
                profile_ids=conv["profile_ids"],
                last_message=conv.get("last_message"),
                last_message_timestamp=conv.get("last_message_timestamp"),
                unread_count=unread,
                message_count=conv.get("message_count", 0),
                created_at=conv["created_at"],
                updated_at=conv.get("updated_at", conv["created_at"])
            ))

        return ConversationListResponse(
            total_conversations=len(conversation_responses),
            total_unread=total_unread,
            conversations=conversation_responses
        )

    async def get_unread_count(self, profile_id: str) -> int:
        """Get total unread message count for a profile."""
        result = await self.conversations_collection.aggregate([
            {"$match": {"profile_ids": profile_id}},
            {
                "$group": {
                    "_id": None,
                    "total_unread": {"$sum": f"$unread_count_from_{profile_id}"}
                }
            }
        ]).to_list(1)

        return result[0]["total_unread"] if result else 0

    async def delete_message(self, message_id: str, profile_id: str) -> bool:
        """Soft delete a message (only for sender)."""
        try:
            message = await self.messages_collection.find_one({"_id": ObjectId(message_id)})
            if not message or message["from_profile_id"] != profile_id:
                return False

            # Soft delete
            result = await self.messages_collection.update_one(
                {"_id": ObjectId(message_id)},
                {
                    "$set": {
                        "content": "[Message deleted]",
                        "is_deleted": True,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return result.modified_count > 0
        except Exception:
            return False

    async def search_conversations(
        self,
        profile_id: str,
        query: str,
        limit: int = 20
    ) -> List[ConversationResponse]:
        """Search messages in conversations."""
        # Find messages matching query
        messages = await self.messages_collection.find({
            "$or": [
                {"from_profile_id": profile_id},
                {"to_profile_id": profile_id}
            ],
            "content": {"$regex": query, "$options": "i"}
        }).to_list(100)

        # Get unique conversation pairs
        conversation_ids = set()
        for msg in messages:
            other_id = msg["to_profile_id"] if msg["from_profile_id"] == profile_id else msg["from_profile_id"]
            pair = tuple(sorted([profile_id, other_id]))
            conversation_ids.add(pair)

        # Fetch conversations
        results = []
        for profile1_id, profile2_id in list(conversation_ids)[:limit]:
            conv = await self.get_conversation(profile_id, profile2_id)
            if conv:
                results.append(conv)

        return results

    async def delete_conversation(self, profile_id: str, other_profile_id: str) -> bool:
        """Delete an entire conversation for a profile."""
        try:
            result = await self.conversations_collection.update_one(
                {"profile_ids": {"$all": [profile_id, other_profile_id]}},
                {
                    "$set": {
                        "is_deleted_by": [profile_id] if "is_deleted_by" not in await self.conversations_collection.find_one({"profile_ids": {"$all": [profile_id, other_profile_id]}}) else await self.conversations_collection.find_one({"profile_ids": {"$all": [profile_id, other_profile_id]}})["is_deleted_by"] + [profile_id],
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return result.modified_count > 0
        except Exception:
            return False

    async def get_conversation_preview(
        self,
        profile_id: str,
        message_count: int = 3
    ) -> Dict[str, any]:
        """Get preview of all conversations with latest messages."""
        conversations = await self.conversations_collection.find({
            "profile_ids": profile_id
        }).sort("updated_at", -1).to_list(None)

        previews = []
        for conv in conversations:
            other_id = conv["profile_ids"][0] if conv["profile_ids"][1] == profile_id else conv["profile_ids"][1]

            recent_messages = await self.messages_collection.find({
                "conversation_id": conv["_id"]
            }).sort("created_at", -1).limit(message_count).to_list(message_count)

            recent_messages.reverse()

            previews.append({
                "conversation_id": str(conv["_id"]),
                "other_profile_id": other_id,
                "last_message": conv.get("last_message"),
                "unread_count": conv.get(f"unread_count_from_{profile_id}", 0),
                "message_count": conv.get("message_count", 0),
                "recent_messages": [
                    {
                        "from_id": msg["from_profile_id"],
                        "content": msg["content"],
                        "created_at": msg["created_at"]
                    }
                    for msg in recent_messages
                ],
                "updated_at": conv.get("updated_at")
            })

        return {
            "total": len(previews),
            "previews": previews
        }

    async def export_conversation(self, profile_id: str, other_profile_id: str) -> str:
        """Export a conversation as a formatted string."""
        messages = await self.get_messages(profile_id, other_profile_id, limit=1000)

        export_lines = [
            f"Conversation between {profile_id} and {other_profile_id}",
            f"Exported at {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}",
            "=" * 60,
            ""
        ]

        for msg in messages:
            sender = "You" if msg.from_profile_id == profile_id else "Them"
            export_lines.append(f"{sender} ({msg.created_at.strftime('%H:%M')}): {msg.content}")

        return "\n".join(export_lines)

    # Private helper methods

    async def _get_or_create_conversation(
        self,
        profile1_id: str,
        profile2_id: str
    ) -> Dict:
        """Get existing conversation or create a new one."""
        conversation = await self.conversations_collection.find_one({
            "profile_ids": {"$all": [profile1_id, profile2_id]}
        })

        if conversation:
            return conversation

        # Create new conversation
        conversation_doc = {
            "_id": ObjectId(),
            "profile_ids": sorted([profile1_id, profile2_id]),
            "last_message": None,
            "last_message_timestamp": None,
            "message_count": 0,
            f"unread_count_from_{profile1_id}": 0,
            f"unread_count_from_{profile2_id}": 0,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

        await self.conversations_collection.insert_one(conversation_doc)
        return conversation_doc

    async def _check_blocked(self, from_profile_id: str, to_profile_id: str) -> bool:
        """Check if one user is blocked by another."""
        blocked = await self.blocked_collection.find_one({
            "$or": [
                {"blocker_profile_id": to_profile_id, "blocked_profile_id": from_profile_id},
                {"blocker_profile_id": from_profile_id, "blocked_profile_id": to_profile_id}
            ]
        })
        return blocked is not None
