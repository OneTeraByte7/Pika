"""WebSocket connection manager for real-time dating app features."""
from typing import Dict, Set, List
from fastapi import WebSocket
import json
from datetime import datetime
import asyncio


class ConnectionManager:
    """Manages WebSocket connections for real-time features."""

    def __init__(self):
        # Format: {profile_id: {conversation_with_id: websocket}}
        self.active_connections: Dict[str, Dict[str, WebSocket]] = {}
        # Format: {conversation_key: {profile_id: typing_status}}
        self.typing_indicators: Dict[str, Dict[str, bool]] = {}

    async def connect(self, profile_id: str, conversation_id: str, websocket: WebSocket):
        """Register a new WebSocket connection."""
        await websocket.accept()
        
        if profile_id not in self.active_connections:
            self.active_connections[profile_id] = {}
        
        self.active_connections[profile_id][conversation_id] = websocket

    def disconnect(self, profile_id: str, conversation_id: str):
        """Remove a WebSocket connection."""
        if profile_id in self.active_connections:
            if conversation_id in self.active_connections[profile_id]:
                del self.active_connections[profile_id][conversation_id]
            
            if not self.active_connections[profile_id]:
                del self.active_connections[profile_id]

    async def broadcast_message(
        self,
        profile_id: str,
        other_profile_id: str,
        message: dict
    ):
        """Broadcast a message to both users in a conversation."""
        conversation_key = tuple(sorted([profile_id, other_profile_id]))
        
        # Send to recipient if connected
        if other_profile_id in self.active_connections:
            for conv_id, websocket in self.active_connections[other_profile_id].items():
                try:
                    await websocket.send_json({
                        "type": "message",
                        "from_profile_id": profile_id,
                        "data": message
                    })
                except Exception:
                    pass

    async def broadcast_typing(
        self,
        profile_id: str,
        other_profile_id: str,
        is_typing: bool
    ):
        """Broadcast typing indicator."""
        conversation_key = tuple(sorted([profile_id, other_profile_id]))
        
        if conversation_key not in self.typing_indicators:
            self.typing_indicators[conversation_key] = {}
        
        self.typing_indicators[conversation_key][profile_id] = is_typing
        
        # Notify recipient
        if other_profile_id in self.active_connections:
            for conv_id, websocket in self.active_connections[other_profile_id].items():
                try:
                    await websocket.send_json({
                        "type": "typing",
                        "from_profile_id": profile_id,
                        "is_typing": is_typing
                    })
                except Exception:
                    pass

    async def broadcast_read_receipt(
        self,
        profile_id: str,
        other_profile_id: str,
        message_id: str
    ):
        """Broadcast read receipt to sender."""
        if other_profile_id in self.active_connections:
            for conv_id, websocket in self.active_connections[other_profile_id].items():
                try:
                    await websocket.send_json({
                        "type": "read_receipt",
                        "from_profile_id": profile_id,
                        "message_id": message_id,
                        "read_at": datetime.utcnow().isoformat()
                    })
                except Exception:
                    pass

    def get_active_users(self, conversation_key: str) -> List[str]:
        """Get list of active users in a conversation."""
        active = []
        for profile_id, conversations in self.active_connections.items():
            if conversation_key in conversations:
                active.append(profile_id)
        return active

    async def broadcast_user_online(
        self,
        profile_id: str,
        other_profile_id: str,
        is_online: bool
    ):
        """Notify of user online/offline status."""
        if other_profile_id in self.active_connections:
            for conv_id, websocket in self.active_connections[other_profile_id].items():
                try:
                    await websocket.send_json({
                        "type": "user_status",
                        "profile_id": profile_id,
                        "is_online": is_online,
                        "timestamp": datetime.utcnow().isoformat()
                    })
                except Exception:
                    pass


# Global connection manager instance
manager = ConnectionManager()
