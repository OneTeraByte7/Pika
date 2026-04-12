from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
from server.config.settings import settings

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    
    @classmethod
    async def connect_db(cls):
        """Connect to MongoDB"""
        print("Attempting to connect to MongoDB...")
        if not settings.DATABASE_URL or settings.DATABASE_URL.strip() == "":
            raise Exception("DATABASE_URL is not set in environment variables")

        # Avoid printing the raw DATABASE_URL to logs
        cls.client = AsyncIOMotorClient(settings.DATABASE_URL)
        # Test the connection
        await cls.client.admin.command('ping')
        print("✅ Connected to MongoDB")
        
    @classmethod
    async def close_db(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            print("Closed MongoDB connection")
    
    @classmethod
    def get_database(cls):
        """Get database instance"""
        if cls.client is None:
            raise Exception("Database not connected")
        return cls.client.pika_db

# Database instance
def get_db():
    return MongoDB.get_database()

def is_db_connected():
    try:
        if MongoDB.client is None:
            return False
        # perform a lightweight ping
        MongoDB.client.admin.command('ping')
        return True
    except Exception:
        return False

# Collection names
COLLECTIONS = {
    "users": "users",
    "social_accounts": "social_accounts",
    "conversations": "conversations",
    "activities": "activities",
    "api_requests": "api_requests",
    "posts": "posts",
    "dms": "dms",
    "briefings": "briefings",
    "voice_queries": "voice_queries",
    "comments": "comments"
}
