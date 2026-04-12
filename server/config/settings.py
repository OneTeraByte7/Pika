from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from pathlib import Path

# Get the directory where this file is located
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

class Settings(BaseSettings):
    APP_NAME: str = "Pika AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    SECRET_KEY: str = ""
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    DATABASE_URL: str = ""
    
    REDIS_URL: str = "redis://localhost:6379"
    
    FRONTEND_URL: str = "http://localhost:3000"
    
    INSTAGRAM_CLIENT_ID: Optional[str] = None
    INSTAGRAM_CLIENT_SECRET: Optional[str] = None
    TWITTER_API_KEY: Optional[str] = None
    TWITTER_API_SECRET: Optional[str] = None
    TWITTER_BEARER_TOKEN: Optional[str] = None
    TWITTER_ACCESS_TOKEN: Optional[str] = None
    TWITTER_ACCESS_TOKEN_SECRET: Optional[str] = None
    TWITTER_CLIENT_ID: Optional[str] = None
    TWITTER_CLIENT_SECRET: Optional[str] = None
    TWITTER_CALLBACK_URL: str = "http://localhost:8000/twitter/callback"
    TIKTOK_CLIENT_KEY: Optional[str] = None
    TIKTOK_CLIENT_SECRET: Optional[str] = None
    
    ELEVENLABS_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    HUGGINGFACE_TOKEN: Optional[str] = None
    
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:3001"]
    
    model_config = SettingsConfigDict(
        env_file=str(ENV_FILE),
        env_file_encoding='utf-8',
        case_sensitive=True,
        extra='ignore'
    )

print(f"Loading settings from: {ENV_FILE}")
print(f".env file exists: {ENV_FILE.exists()}")
settings = Settings()
# Avoid printing secrets or exposing database URLs; only indicate presence
print(f"DATABASE_URL set: {'YES' if settings.DATABASE_URL else 'NO'})")
if settings.SECRET_KEY:
    print("SECRET_KEY set: YES")
else:
    print("SECRET_KEY set: NO - using insecure default")