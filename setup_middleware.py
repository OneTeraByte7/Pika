import os

# Create middleware directory if it doesn't exist
middleware_dir = r"F:\Pika\server\middleware"
if not os.path.exists(middleware_dir):
    os.makedirs(middleware_dir)
    print(f"Created directory: {middleware_dir}")

# Create __init__.py
init_file = os.path.join(middleware_dir, "__init__.py")
with open(init_file, "w") as f:
    f.write("")
print(f"Created: {init_file}")

# Create request_logger.py
request_logger_file = os.path.join(middleware_dir, "request_logger.py")
content = '''from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime
import json
from typing import Callable
from server.models.mongodb import get_db, COLLECTIONS

class RequestLoggerMiddleware(BaseHTTPMiddleware):
    """Middleware to log all API requests to MongoDB"""
    
    async def dispatch(self, request: Request, call_next: Callable):
        # Capture request details
        request_time = datetime.utcnow()
        
        # Get request body if present
        body = None
        if request.method in ["POST", "PUT", "PATCH"]:
            try:
                body_bytes = await request.body()
                if body_bytes:
                    body = body_bytes.decode('utf-8')
                    try:
                        body = json.loads(body)
                    except:
                        pass
                # Re-create request body for downstream handlers
                async def receive():
                    return {"type": "http.request", "body": body_bytes}
                request._receive = receive
            except:
                body = None
        
        # Get user info if available
        user_id = None
        user_email = None
        if hasattr(request.state, "user"):
            user_id = getattr(request.state.user, "id", None)
            user_email = getattr(request.state.user, "email", None)
        
        # Process request
        response = await call_next(request)
        
        # Calculate response time
        response_time = datetime.utcnow()
        duration_ms = (response_time - request_time).total_seconds() * 1000
        
        # Log to MongoDB
        try:
            db = get_db()
            await db[COLLECTIONS["api_requests"]].insert_one({
                "timestamp": request_time,
                "method": request.method,
                "path": request.url.path,
                "full_url": str(request.url),
                "query_params": dict(request.query_params),
                "headers": dict(request.headers),
                "body": body,
                "user_id": user_id,
                "user_email": user_email,
                "client_ip": request.client.host if request.client else None,
                "status_code": response.status_code,
                "duration_ms": duration_ms,
                "response_time": response_time
            })
        except Exception as e:
            print(f"Error logging request: {e}")
        
        return response
'''

with open(request_logger_file, "w") as f:
    f.write(content)
print(f"Created: {request_logger_file}")

print("\nMiddleware setup complete!")
