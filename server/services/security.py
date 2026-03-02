"""
Advanced Security & Validation Utilities
"""

from typing import Dict, List, Any, Optional
import re
import hashlib
import secrets
from datetime import datetime, timedelta
from enum import Enum


class SecurityLevel(Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class InputValidator:
    """Comprehensive input validation"""
    
    @staticmethod
    def validate_email(email: str) -> Dict[str, Any]:
        """Validate email address"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        is_valid = bool(re.match(pattern, email))
        
        return {
            "is_valid": is_valid,
            "email": email.lower() if is_valid else None,
            "errors": [] if is_valid else ["Invalid email format"]
        }
    
    @staticmethod
    def validate_username(username: str) -> Dict[str, Any]:
        """Validate username"""
        errors = []
        
        if len(username) < 3:
            errors.append("Username must be at least 3 characters")
        if len(username) > 30:
            errors.append("Username must be less than 30 characters")
        if not re.match(r'^[a-zA-Z0-9_]+$', username):
            errors.append("Username can only contain letters, numbers, and underscores")
        if username.startswith('_') or username.endswith('_'):
            errors.append("Username cannot start or end with underscore")
        
        return {
            "is_valid": len(errors) == 0,
            "username": username,
            "errors": errors
        }
    
    @staticmethod
    def validate_password(password: str) -> Dict[str, Any]:
        """Validate password strength"""
        errors = []
        strength_score = 0
        
        if len(password) < 8:
            errors.append("Password must be at least 8 characters")
        else:
            strength_score += 1
        
        if len(password) >= 12:
            strength_score += 1
        
        if re.search(r'[A-Z]', password):
            strength_score += 1
        else:
            errors.append("Password should contain uppercase letters")
        
        if re.search(r'[a-z]', password):
            strength_score += 1
        else:
            errors.append("Password should contain lowercase letters")
        
        if re.search(r'\d', password):
            strength_score += 1
        else:
            errors.append("Password should contain numbers")
        
        if re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            strength_score += 1
        else:
            errors.append("Password should contain special characters")
        
        strength = "weak"
        if strength_score >= 5:
            strength = "strong"
        elif strength_score >= 3:
            strength = "medium"
        
        return {
            "is_valid": len(errors) == 0,
            "strength": strength,
            "score": strength_score,
            "errors": errors
        }
    
    @staticmethod
    def validate_url(url: str) -> Dict[str, Any]:
        """Validate URL"""
        pattern = r'^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$'
        is_valid = bool(re.match(pattern, url))
        
        return {
            "is_valid": is_valid,
            "url": url,
            "errors": [] if is_valid else ["Invalid URL format"]
        }
    
    @staticmethod
    def sanitize_input(text: str, max_length: int = 1000) -> str:
        """Sanitize user input"""
        text = text.strip()
        text = text[:max_length]
        
        dangerous_patterns = [
            r'<script[^>]*>.*?</script>',
            r'javascript:',
            r'on\w+\s*=',
            r'<iframe[^>]*>.*?</iframe>'
        ]
        
        for pattern in dangerous_patterns:
            text = re.sub(pattern, '', text, flags=re.IGNORECASE)
        
        return text


class PasswordManager:
    """Password hashing and verification"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password with salt"""
        salt = secrets.token_hex(16)
        pwd_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return f"{salt}${pwd_hash.hex()}"
    
    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify password against hash"""
        try:
            salt, pwd_hash = hashed.split('$')
            new_hash = hashlib.pbkdf2_hmac(
                'sha256',
                password.encode('utf-8'),
                salt.encode('utf-8'),
                100000
            )
            return new_hash.hex() == pwd_hash
        except:
            return False
    
    @staticmethod
    def generate_temporary_password(length: int = 12) -> str:
        """Generate secure temporary password"""
        alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
        return ''.join(secrets.choice(alphabet) for _ in range(length))


class TokenManager:
    """Manage authentication and API tokens"""
    
    def __init__(self):
        self.tokens: Dict[str, Dict[str, Any]] = {}
    
    def generate_token(
        self,
        user_id: int,
        token_type: str = "access",
        expiry_hours: int = 24
    ) -> str:
        """Generate secure token"""
        token = secrets.token_urlsafe(32)
        expiry = datetime.now() + timedelta(hours=expiry_hours)
        
        self.tokens[token] = {
            "user_id": user_id,
            "type": token_type,
            "created_at": datetime.now(),
            "expires_at": expiry
        }
        
        return token
    
    def validate_token(self, token: str) -> Optional[Dict[str, Any]]:
        """Validate token and return user info"""
        if token not in self.tokens:
            return None
        
        token_data = self.tokens[token]
        
        if datetime.now() > token_data["expires_at"]:
            del self.tokens[token]
            return None
        
        return token_data
    
    def revoke_token(self, token: str) -> bool:
        """Revoke a token"""
        if token in self.tokens:
            del self.tokens[token]
            return True
        return False
    
    def cleanup_expired_tokens(self) -> int:
        """Remove expired tokens"""
        now = datetime.now()
        expired = [
            token for token, data in self.tokens.items()
            if data["expires_at"] < now
        ]
        
        for token in expired:
            del self.tokens[token]
        
        return len(expired)


class RateLimitChecker:
    """Advanced rate limiting"""
    
    def __init__(self):
        self.requests: Dict[str, List[datetime]] = {}
    
    def check_rate_limit(
        self,
        identifier: str,
        max_requests: int,
        window_seconds: int
    ) -> Dict[str, Any]:
        """Check if request is within rate limit"""
        now = datetime.now()
        cutoff = now - timedelta(seconds=window_seconds)
        
        if identifier not in self.requests:
            self.requests[identifier] = []
        
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if req_time > cutoff
        ]
        
        current_count = len(self.requests[identifier])
        
        if current_count >= max_requests:
            oldest_request = min(self.requests[identifier])
            reset_time = oldest_request + timedelta(seconds=window_seconds)
            retry_after = int((reset_time - now).total_seconds())
            
            return {
                "allowed": False,
                "limit": max_requests,
                "remaining": 0,
                "reset_in_seconds": max(retry_after, 0)
            }
        
        self.requests[identifier].append(now)
        
        return {
            "allowed": True,
            "limit": max_requests,
            "remaining": max_requests - current_count - 1,
            "reset_in_seconds": window_seconds
        }


class AccessControlManager:
    """Role-based access control"""
    
    def __init__(self):
        self.roles: Dict[str, List[str]] = {
            "admin": ["*"],
            "moderator": ["read", "write", "delete", "moderate"],
            "premium_user": ["read", "write", "export", "analytics"],
            "user": ["read", "write"],
            "guest": ["read"]
        }
        
        self.user_roles: Dict[int, List[str]] = {}
    
    def assign_role(self, user_id: int, role: str):
        """Assign role to user"""
        if role in self.roles:
            if user_id not in self.user_roles:
                self.user_roles[user_id] = []
            if role not in self.user_roles[user_id]:
                self.user_roles[user_id].append(role)
    
    def check_permission(
        self,
        user_id: int,
        required_permission: str
    ) -> bool:
        """Check if user has permission"""
        user_roles = self.user_roles.get(user_id, ["guest"])
        
        for role in user_roles:
            permissions = self.roles.get(role, [])
            if "*" in permissions or required_permission in permissions:
                return True
        
        return False
    
    def get_user_permissions(self, user_id: int) -> List[str]:
        """Get all permissions for user"""
        user_roles = self.user_roles.get(user_id, ["guest"])
        
        permissions = set()
        for role in user_roles:
            permissions.update(self.roles.get(role, []))
        
        return list(permissions)


class AuditLogger:
    """Security audit logging"""
    
    def __init__(self):
        self.logs: List[Dict[str, Any]] = []
    
    def log_event(
        self,
        event_type: str,
        user_id: Optional[int],
        action: str,
        resource: str,
        status: str,
        ip_address: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        """Log security event"""
        log_entry = {
            "timestamp": datetime.now().isoformat(),
            "event_type": event_type,
            "user_id": user_id,
            "action": action,
            "resource": resource,
            "status": status,
            "ip_address": ip_address,
            "metadata": metadata or {}
        }
        
        self.logs.append(log_entry)
    
    def get_logs(
        self,
        user_id: Optional[int] = None,
        event_type: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Retrieve audit logs"""
        filtered_logs = self.logs
        
        if user_id:
            filtered_logs = [
                log for log in filtered_logs
                if log["user_id"] == user_id
            ]
        
        if event_type:
            filtered_logs = [
                log for log in filtered_logs
                if log["event_type"] == event_type
            ]
        
        return filtered_logs[-limit:]
    
    def get_security_summary(self) -> Dict[str, Any]:
        """Get security summary"""
        failed_logins = len([
            log for log in self.logs
            if log["event_type"] == "authentication" and log["status"] == "failed"
        ])
        
        suspicious_activities = len([
            log for log in self.logs
            if log["event_type"] == "suspicious"
        ])
        
        return {
            "total_events": len(self.logs),
            "failed_login_attempts": failed_logins,
            "suspicious_activities": suspicious_activities,
            "recent_events": self.logs[-10:]
        }


class IPBlocklist:
    """Manage blocked IP addresses"""
    
    def __init__(self):
        self.blocked_ips: Dict[str, Dict[str, Any]] = {}
    
    def block_ip(
        self,
        ip_address: str,
        reason: str,
        duration_hours: Optional[int] = None
    ):
        """Block an IP address"""
        expiry = None
        if duration_hours:
            expiry = datetime.now() + timedelta(hours=duration_hours)
        
        self.blocked_ips[ip_address] = {
            "reason": reason,
            "blocked_at": datetime.now(),
            "expires_at": expiry
        }
    
    def is_blocked(self, ip_address: str) -> bool:
        """Check if IP is blocked"""
        if ip_address not in self.blocked_ips:
            return False
        
        block_data = self.blocked_ips[ip_address]
        
        if block_data["expires_at"]:
            if datetime.now() > block_data["expires_at"]:
                del self.blocked_ips[ip_address]
                return False
        
        return True
    
    def unblock_ip(self, ip_address: str) -> bool:
        """Unblock an IP address"""
        if ip_address in self.blocked_ips:
            del self.blocked_ips[ip_address]
            return True
        return False
