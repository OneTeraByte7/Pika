# 🚀 Quick Start Guide - Pika AI Python Backend

## Installation & Setup

### Step 1: Move Files to Proper Locations

Create the directory structure:
```bash
cd F:\Pika\server

# Create service directories
mkdir services\analytics
mkdir services\scheduler
mkdir services\sentiment
mkdir services\notifications
mkdir services\media
mkdir services\caching
mkdir services\export
mkdir services\tasks
mkdir services\webhooks
mkdir services\recommendations
mkdir services\engagement
mkdir services\security
mkdir services\ml
```

Move the Python files:
```bash
# Move services
move ..\analytics_service.py services\analytics\
move ..\content_scheduler.py services\scheduler\
move ..\sentiment_analyzer.py services\sentiment\
move ..\notification_manager.py services\notifications\
move ..\media_processor.py services\media\
move ..\cache_manager.py services\caching\
move ..\data_exporter.py services\export\
move ..\task_manager.py services\tasks\
move ..\webhook_handler.py services\webhooks\
move ..\content_recommender.py services\recommendations\
move ..\engagement_tracker.py services\engagement\
move ..\security_utils.py services\security\
move ..\ml_utils.py services\ml\

# Move API router
move ..\advanced_features_api.py app\
```

### Step 2: Create __init__.py files

```bash
# Create __init__.py in each service directory
echo. > services\analytics\__init__.py
echo. > services\scheduler\__init__.py
echo. > services\sentiment\__init__.py
echo. > services\notifications\__init__.py
echo. > services\media\__init__.py
echo. > services\caching\__init__.py
echo. > services\export\__init__.py
echo. > services\tasks\__init__.py
echo. > services\webhooks\__init__.py
echo. > services\recommendations\__init__.py
echo. > services\engagement\__init__.py
echo. > services\security\__init__.py
echo. > services\ml\__init__.py
```

### Step 3: Install Dependencies

```bash
pip install -r requirements_advanced.txt
```

Or install core dependencies only:
```bash
pip install fastapi uvicorn pydantic sqlalchemy pymongo redis python-jose passlib httpx
```

### Step 4: Update main.py

Add to `server/main.py`:

```python
# Add import
from server.app.advanced_features_api import router as advanced_router

# Add router after existing routers
app.include_router(advanced_router)
```

### Step 5: Update MongoDB Connection

Fix the MongoDB connection string in `.env`:

```bash
# Replace # with %23 in password
DATABASE_URL=mongodb+srv://suryawanshisoham7:Soham%401505%2317@linkedin.sgr62ki.mongodb.net/?appName=LinkedIn
```

### Step 6: Run the Server

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn server.main:app --reload --port 8000
```

---

## 🧪 Testing the API

### 1. Health Check
```bash
curl http://localhost:8000/advanced/health
```

### 2. Test Analytics
```bash
curl -X POST http://localhost:8000/advanced/analytics/posts \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "posts": [
      {
        "content": "Great day! #coding #python",
        "likes": 50,
        "comments": 10,
        "shares": 5,
        "followers": 1000,
        "created_at": "2024-01-15T10:00:00"
      }
    ]
  }'
```

### 3. Test Sentiment Analysis
```bash
curl -X POST http://localhost:8000/advanced/sentiment/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I love this amazing product! It is absolutely fantastic!"
  }'
```

### 4. Schedule a Post
```bash
curl -X POST http://localhost:8000/advanced/scheduler/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "platforms": ["twitter", "instagram"],
    "content": "Check out my new post! #tech",
    "scheduled_time": "2024-12-25T15:00:00"
  }'
```

### 5. Get Content Recommendations
```bash
curl -X POST http://localhost:8000/advanced/recommendations/topics \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1
  }'
```

---

## 📚 API Documentation

Once the server is running, access interactive API docs at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## 🔧 Configuration

### Environment Variables

Add to your `.env` file:

```bash
# Advanced Features Config
CACHE_MAX_SIZE=1000
DEFAULT_CACHE_TTL=3600
MAX_RETRIES=3
WORKER_POOL_SIZE=4

# Rate Limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=3600

# Security
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

---

## 🎯 Quick Feature Tour

### Analytics Service
```python
from server.services.analytics.analytics_service import AnalyticsService

analytics = AnalyticsService()
rate = analytics.calculate_engagement_rate(
    likes=100, 
    comments=20, 
    shares=10, 
    followers=1000
)
print(f"Engagement Rate: {rate}%")
```

### Content Scheduler
```python
from server.services.scheduler.content_scheduler import ContentScheduler
from datetime import datetime, timedelta

scheduler = ContentScheduler()
post = scheduler.schedule_post(
    user_id=1,
    platforms=['twitter'],
    content='Hello World!',
    scheduled_time=datetime.now() + timedelta(hours=2)
)
```

### Sentiment Analyzer
```python
from server.services.sentiment.sentiment_analyzer import SentimentAnalyzer

analyzer = SentimentAnalyzer()
result = analyzer.analyze_text("I love this product!")
print(result)
```

---

## 🐛 Troubleshooting

### Issue: Import Errors
**Solution**: Make sure all __init__.py files are created and paths are correct.

### Issue: MongoDB Connection Failed
**Solution**: Check your connection string and ensure special characters are URL-encoded.

### Issue: Module Not Found
**Solution**: Run `pip install -r requirements_advanced.txt`

### Issue: Port Already in Use
**Solution**: Change port: `uvicorn server.main:app --port 8001`

---

## 📊 Monitoring

Check service health:
```bash
# Health check
curl http://localhost:8000/health

# Advanced features health
curl http://localhost:8000/advanced/health

# Cache statistics
curl http://localhost:8000/advanced/cache/stats

# Task queue statistics
curl http://localhost:8000/advanced/tasks/queue/stats
```

---

## 🎉 You're All Set!

Your Pika AI backend is now equipped with:
- ✅ Advanced Analytics
- ✅ Content Scheduling
- ✅ AI Sentiment Analysis
- ✅ Smart Notifications
- ✅ Media Processing
- ✅ Caching System
- ✅ Data Export
- ✅ Background Tasks
- ✅ Webhook Handling
- ✅ Content Recommendations
- ✅ Engagement Tracking
- ✅ Security & Validation
- ✅ Machine Learning Utilities

**Total: 13 Major Service Modules + 30+ API Endpoints**

Happy Coding! 🚀
