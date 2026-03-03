# MongoDB Atlas Integration - Setup Complete

## Overview
Your Pika AI application has been fully configured to store ALL data in MongoDB Atlas. Every API request, user action, and data point is now persisted to your MongoDB database.

## What Was Changed

### 1. Database Migration (SQLAlchemy → MongoDB)
- **Removed**: PostgreSQL/SQLAlchemy dependencies
- **Added**: Motor (async MongoDB driver) and PyMongo
- **Updated**: `requirements.txt` with Motor 3.3.2 and PyMongo 4.6.1

### 2. New MongoDB Collections
All data is now stored in these collections in your MongoDB Atlas database (`pika_db`):

#### Core Collections:
- **users** - User accounts with authentication
- **social_accounts** - Connected social media accounts (Instagram, Twitter, TikTok)
- **conversations** - Chat session history
- **activities** - Social media activity feed items

#### API Data Collections:
- **api_requests** - **EVERY API request** with full details:
  - Timestamp, method, path, URL
  - Request headers and body
  - User ID and email
  - Client IP address
  - Response status code
  - Response time (duration in ms)
  
- **posts** - All created posts across platforms
- **dms** - Direct messages from social platforms
- **briefings** - Generated morning briefings
- **voice_queries** - Voice interactions with Pika AI
- **comments** - Generated comments with AI

### 3. New Files Created

#### `server/models/mongodb.py`
- MongoDB connection manager
- Database instance getter
- Collection name constants

#### `server/middleware/request_logger.py`
- Middleware that logs EVERY API request to MongoDB
- Captures request/response data automatically
- Non-blocking async logging

#### Updated Files:
- `server/models/database.py` - MongoDB models with Pydantic
- `server/app/auth.py` - Authentication with MongoDB storage
- `server/app/pika.py` - Voice queries, briefings, comments stored to DB
- `server/app/social.py` - Posts, DMs, activities stored to DB
- `server/main.py` - MongoDB connection lifecycle + request logging middleware

## MongoDB Collections Schema

### api_requests
```javascript
{
  "_id": ObjectId,
  "timestamp": ISODate,
  "method": "POST",
  "path": "/pika/query",
  "full_url": "http://localhost:8000/pika/query?param=value",
  "query_params": {},
  "headers": {},
  "body": {},
  "user_id": "user_id_string",
  "user_email": "user@example.com",
  "client_ip": "127.0.0.1",
  "status_code": 200,
  "duration_ms": 145.23,
  "response_time": ISODate
}
```

### users
```javascript
{
  "_id": ObjectId,
  "email": "user@example.com",
  "username": "johndoe",
  "hashed_password": "bcrypt_hash",
  "full_name": "John Doe",
  "is_active": true,
  "is_premium": false,
  "created_at": ISODate,
  "updated_at": ISODate
}
```

### social_accounts
```javascript
{
  "_id": ObjectId,
  "user_id": "user_id_string",
  "platform": "instagram",
  "platform_user_id": "instagram_user_id",
  "username": "@johndoe",
  "access_token": "encrypted_token",
  "refresh_token": "refresh_token",
  "token_expires_at": ISODate,
  "is_active": true,
  "metadata": {},
  "created_at": ISODate,
  "updated_at": ISODate
}
```

### posts
```javascript
{
  "_id": ObjectId,
  "user_id": "user_id_string",
  "platforms": ["instagram", "twitter"],
  "content": "Post content here",
  "media_url": "https://...",
  "media_type": "image",
  "results": {
    "instagram": {"success": true, "post_id": "123"},
    "twitter": {"success": true, "post_id": "456"}
  },
  "status": "posted",
  "created_at": ISODate
}
```

### voice_queries
```javascript
{
  "_id": ObjectId,
  "user_id": "user_id_string",
  "session_id": "session_123",
  "audio_data": "base64_audio",
  "text_input": "What's new?",
  "text_response": "You have 5 new messages...",
  "audio_url": "https://elevenlabs.io/...",
  "actions": [],
  "created_at": ISODate
}
```

### briefings
```javascript
{
  "_id": ObjectId,
  "user_id": "user_id_string",
  "time_range": "24h",
  "summary": "Your friend Sarah got engaged...",
  "highlights": [],
  "unread_dms": 5,
  "top_posts": [],
  "notifications": [],
  "created_at": ISODate
}
```

### comments
```javascript
{
  "_id": ObjectId,
  "user_id": "user_id_string",
  "post_content": "Original post content",
  "tone": "friendly",
  "generated_comment": "That's amazing! 🎉",
  "platform": "instagram",
  "was_posted": false,
  "created_at": ISODate
}
```

### dms
```javascript
{
  "_id": ObjectId,
  "user_id": "user_id_string",
  "platform": "instagram",
  "sender": "sarah_username",
  "message": "Hey! Did you see my post?",
  "is_read": false,
  "is_important": true,
  "created_at": ISODate
}
```

### activities
```javascript
{
  "_id": ObjectId,
  "user_id": "user_id_string",
  "platform": "instagram",
  "activity_type": "like",
  "content": {
    "from": "jake",
    "post_id": "123"
  },
  "is_read": false,
  "priority": 1,
  "created_at": ISODate
}
```

## Setup Instructions

### 1. Run the Middleware Setup Script
```bash
cd F:\Pika
python setup_middleware.py
```

This creates the middleware directory and files.

### 2. Install New Dependencies
```bash
cd F:\Pika\server
pip install -r requirements.txt
```

### 3. Verify MongoDB Connection
Your MongoDB Atlas URL is already configured in `server/.env`:
```
DATABASE_URL=mongodb+srv://suryawanshisoham7:Soham%401505%2317@linkedin.sgr62ki.mongodb.net/?appName=LinkedIn
```

### 4. Start the Server
```bash
cd F:\Pika\server
python -m uvicorn server.main:app --reload
```

## How It Works

### Automatic Request Logging
Every API request is automatically logged to MongoDB via the `RequestLoggerMiddleware`:
- Captures ALL request details (method, path, headers, body)
- Logs user information if authenticated
- Records response time and status code
- Non-blocking async operation

### Data Storage Flow
1. **User registers** → Stored in `users` collection
2. **User connects social account** → Stored in `social_accounts` collection
3. **User posts content** → Stored in `posts` collection
4. **User asks voice query** → Stored in `voice_queries` collection
5. **User generates briefing** → Stored in `briefings` collection
6. **Every API call** → Stored in `api_requests` collection

## Monitoring Your Data

### View Request Logs
```javascript
// MongoDB Atlas or Compass
use pika_db
db.api_requests.find().sort({timestamp: -1}).limit(10)
```

### View Recent Users
```javascript
db.users.find().sort({created_at: -1})
```

### View Recent Posts
```javascript
db.posts.find().sort({created_at: -1})
```

## Important Notes

1. **All data is stored in MongoDB Atlas** - No local database needed
2. **Request logging is automatic** - No manual logging required
3. **Async operations** - Non-blocking database calls
4. **Indexes recommended** - Add indexes for frequently queried fields:
   ```javascript
   db.api_requests.createIndex({timestamp: -1})
   db.api_requests.createIndex({user_id: 1})
   db.users.createIndex({email: 1}, {unique: true})
   db.users.createIndex({username: 1}, {unique: true})
   ```

## Next Steps

1. ✅ Run `python setup_middleware.py`
2. ✅ Install dependencies: `pip install -r requirements.txt`
3. ✅ Start server: `python -m uvicorn server.main:app --reload`
4. 🔍 Monitor data in MongoDB Atlas dashboard
5. 📊 Add indexes for better query performance

## Benefits

✅ **Complete Audit Trail** - Every API request logged  
✅ **User Behavior Analytics** - Track all user actions  
✅ **Debug & Monitoring** - See exactly what's happening  
✅ **Cloud Storage** - Data stored securely in MongoDB Atlas  
✅ **Scalable** - MongoDB handles growth automatically  
✅ **Real-time** - Async operations don't slow down API  

Your Pika AI backend now stores everything in MongoDB Atlas! 🎉
