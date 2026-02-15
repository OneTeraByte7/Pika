from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from server.config.settings import settings
from server.app import auth, pika, social

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Pike AI Backend Starting")
    print(f"API Version: {settings.APP_VERSION}")
    print(f"Debug Mode: {settings.DEBUG}")
    yield
    print("Pika AI Backend Shutting Down")
    
app = FastAPI(
    title = settings.APP_NAME,
    version = settings.APP_VERSION,
    description = "Voice-first social media AI agent for GenZ",
    lifespan = lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins = settings.CORS_ORIGINS,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

app.include_router(auth.router)
app.include_router(pika.router)
app.include_router(social.router)

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
    return{
        "status": "healthy",
        "timestamp": "2024-01-20T12:00:00Z"
    }
    
if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host = "0.0.0.0",
        port = 8000,
        reload = settings.DEBUG
    )