from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional

from server.models.schemas import UserCreate, UserLogin, UserResponse, Token
from server.models.database import User
from server.config.settings import settings
from server.models.mongodb import get_db, COLLECTIONS
router = APIRouter(prefix = "/auth", tags = ["authentication"])

pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl = "/auth/login", auto_error=False)

# Demo user (used when DEBUG and no token provided). Create once so the id is stable across requests.
from bson import ObjectId
_DEMO_USER = None

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
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm = settings.ALGORITHM)
    
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # If no token provided (or token is empty/invalid string) and we're in DEBUG,
    # return a demo user for local testing
    if (not token or token in ("null", "undefined", "")) and settings.DEBUG:
        global _DEMO_USER
        if _DEMO_USER is None:
            _DEMO_USER = User(
                _id=ObjectId('000000000000000000000000'),
                email='user@example.com',
                username='demo',
                hashed_password='demo_hash',
                full_name='Demo User'
            )
        return _DEMO_USER

    credentials_exception = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Could not validate credentials",
        headers = {"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms = [settings.ALGORITHM])
        user_id: str = payload.get("sub")
        
        if user_id is None:
            raise credentials_exception
        
        # Fetch user from MongoDB
        db = get_db()
        user_doc = await db[COLLECTIONS["users"]].find_one({"_id": user_id})
        
        if user_doc is None:
            raise credentials_exception
            
        return User(**user_doc)
        
    except JWTError:
        raise credentials_exception
    
@router.post("/register", response_model = UserResponse, status_code = status.HTTP_201_CREATED)
async def register(user: UserCreate):
    db = get_db()
    
    # Check if user already exists
    existing_user = await db[COLLECTIONS["users"]].find_one({
        "$or": [
            {"email": user.email},
            {"username": user.username}
        ]
    })
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email or username already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        full_name=user.fullname,
        is_premium=False,
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    
    # Insert into MongoDB
    user_dict = new_user.dict(by_alias=True, exclude={"id"})
    result = await db[COLLECTIONS["users"]].insert_one(user_dict)
    new_user.id = result.inserted_id
    
    return UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        username=new_user.username,
        full_name=new_user.full_name,
        is_premiun=new_user.is_premium,
        created_at=new_user.created_at
    )
    
@router.post("/login", response_model = Token)
async def login(user: UserLogin):
    db = get_db()
    
    # Find user by email
    user_doc = await db[COLLECTIONS["users"]].find_one({"email": user.email})
    
    if not user_doc or not verify_password(user.password, user_doc["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data = {"sub": str(user_doc["_id"])},
        expires_delta = access_token_expires
    )

    return Token(access_token = access_token)

@router.get("/me", response_model = UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    
    return UserResponse(
        id = str(current_user.id),
        email = current_user.email,
        username = current_user.username,
        full_name = current_user.full_name,
        is_premiun = current_user.is_premium,
        created_at = current_user.created_at
    )