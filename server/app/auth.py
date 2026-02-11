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

def