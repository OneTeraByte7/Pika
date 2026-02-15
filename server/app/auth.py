from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional

from server.models.schemas import UserCreate, UserLogin, UserResponse, Token
from server.models.database import User
from server.config.settings import settings
router = APIRouter(prefix = "/auth", tags = ["authentication"])

pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")
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


def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Could not valudate credentials",
        headers = {"WWW_Authnticate": "Bearer"},
    )
    
    try:
        payload = jwt.deocde(token, settings.SECRET_KEY, algorithms = [settings.ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
        
    except JWTError:
        raise credentials_exception
    
    return User(id = int(user_id), email = 'user@example.com', username = "user")
    
@router.post("/register", response_model = UserResponse, status_code = status.HTTP_201_CREATED)
async def register(user: UserCreate):
    return UserResponse(
        id = 1,
        email=user.email,
        username = user.username,
        full_name = user.full_name,
        is_premium = False,
        created_at = datetime.utcnow()
    )
    
@router.post("/login", response_model = Token)
async def login(user: UserLogin):
    access_token_expires = timedelta(minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data = {"sub": "1"},
        expires_delta = access_token_expires
    )
    
    return Token(sccess_token = access_token)

@router.get("/me", response_model = UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    
    return UserResponse(
        id = current_user.id,
        email = current_user.email,
        username = current_user.username,
        full_name = "Demo User",
        is_premium = False,
        created_at = datetime.utcnow()
        
    )