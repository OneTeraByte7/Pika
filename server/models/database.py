from sqlalchemy import Column, Integer, String, DateTime, Boolean, JSON, ForeignKey  # type: ignore[import]
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key = True, index = True)
    email = Column(String, unique = True, index = True, nullable = False)
    username = Column(String, unique = True, index = True, nullable = False)
    hashed_password = Column(String, nullable = False)
    full_name = Column(String)
    is_active = Column(Boolean, default = True)
    is_premium = Column(Boolean, default = False)
    created_at = Column(DateTime, default = datetime.utcnow)
    updates_at = Column(DateTime, default = datetime.utcnow, onupdate = datetime.utcnow)
    
    social_accounts = relationship("SocialAccount", back_populates="user")
    conversations = relationship("Conversation", back_populates="user")
    
    
class SocialAccount(Base):
    __tablename__ = "social_accounts"
    
    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    platform = Column(String, nullable = False)
    platform_user_id = Column(String, nullable = False)
    username = Column(String)
    access_token = Column(String, nullable = False)
    refresh_token = Column(String)
    token_expires_at = Column(DateTime)
    is_active = Column(Boolean, default = True)
    meta_data = Column("metadata", JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updates_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="social_accounts")
    
    
class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(String, unique=True, index=True)
    messages = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="conversations")
    
class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    platform = Column(String, nullable=False)
    activity_type = Column(String, nullable=False)
    content = Column(JSON)
    is_read = Column(Boolean, default=False)
    priority = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    