Enhancements applied to backend (summary)

1. Health check improvements
- `/health` now returns a dynamic `timestamp` and `db_connected` boolean.

2. CORS
- CORS middleware was already present; configuration preserved and ensured to read origins from settings.

3. Improved request logging
- `RequestLoggerMiddleware` now emits structured JSON logs to console and logs to MongoDB as before.

4. Centralized error handlers
- Added `server.app.error_handlers.register_error_handlers(app)` to register handlers for HTTP, validation, and generic exceptions.

5. Secure config loading
- Masked printing of `DATABASE_URL` and `SECRET_KEY` presence; avoid leaking secrets in logs.

6. MongoDB safety
- Removed verbose printing of DB URL and added a safe connectivity helper (`is_db_connected` in `mongodb.py`).

Files changed:
- `server/main.py`
- `server/config/settings.py`
- `server/models/mongodb.py`
- `server/middleware/request_logger.py`
- `server/app/error_handlers.py` (new)
- `server/ENHANCEMENTS.md` (new)
