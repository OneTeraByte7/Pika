import sys
from pathlib import Path
from server.app.advanced_features_api import router as advanced_router
# Ensure project root is on sys.path so `server.*` imports work
# when running this file directly from `server/`.
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from datetime import datetime

from server.config.settings import settings
from server.app import auth, pika, social, twitter_oauth, instagram_oauth
from server.app import media_api
from server.models.mongodb import MongoDB
from server.middleware.request_logger import RequestLoggerMiddleware
from server.app.error_handlers import register_error_handlers

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Pike AI Backend Starting")
    print(f"API Version: {settings.APP_VERSION}")
    print(f"Debug Mode: {settings.DEBUG}")
    await MongoDB.connect_db()
    yield
    await MongoDB.close_db()
    print("Pika AI Backend Shutting Down")
    
app = FastAPI(
    title = settings.APP_NAME,
    version = settings.APP_VERSION,
    description = "Voice-first social media AI agent for GenZ",
    lifespan = lifespan
)

# Register centralized error handlers
register_error_handlers(app)

import json

# Ensure CORS origins is a list (env may provide a JSON string)
cors_origins = settings.CORS_ORIGINS
if isinstance(cors_origins, str):
    try:
        cors_origins = json.loads(cors_origins)
    except Exception:
        cors_origins = [cors_origins]

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add request logging middleware
app.add_middleware(RequestLoggerMiddleware)

app.include_router(auth.router)
app.include_router(pika.router)
app.include_router(social.router)
app.include_router(twitter_oauth.router)
app.include_router(instagram_oauth.router)
app.include_router(advanced_router)
app.include_router(media_api.router)

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "active",
        "message": "Hey! I'm Pika, your voice-first social media AI agent"
    }
    
app.get("/health")
async def health_check():
    db_status = False
    try:
        db_status = MongoDB.client is not None
    except Exception:
        db_status = False

    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "db_connected": db_status
    }
    
if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "server.main:app",
        host = "0.0.0.0",
        port = 8000,
        reload = settings.DEBUG
    )