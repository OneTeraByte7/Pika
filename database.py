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
    updates_at = Column(DateTime, defult = datetime.utcnow, onupdate = datetime.utcnow)
    
    social_accounts = relationship("SocialAccount", back_populates = "user")
    conversations = relationship("Conversation", back_populates = "user")
    
    