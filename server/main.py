from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager

from config.settings import settings
from app import auth, pika, social

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

