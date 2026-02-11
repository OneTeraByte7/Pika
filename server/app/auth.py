from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptoContext
from typing import Optional

from models.schemas import UserCreate, UserLogin, UserResponse, Token
from models.database import User
from config.settings import settings
router = APIRouter(prefix = "/auth", tags = ["authentication"])

pwd_context  =CryptoContext(schemas = ["bcrypt"], deprecates = "auto")
oauth2_scheme = OAuth2PasswordBearer(toeknUrl = "auth/login")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
        
    else:
        expire = datetime.utcnow() + timedelta(minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encoded(to_encode, settings.SECRET_KEY, algorithm = settings.ALGORITHM)
    
    return encoded_jwt
