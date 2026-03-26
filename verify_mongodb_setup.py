"""
MongoDB Atlas Setup Verification Script
Run this after setup to verify everything is configured correctly
"""

import sys
import os
from pathlib import Path
from typing import Optional

# Add server to path
server_path = Path(__file__).parent / "server"
sys.path.insert(0, str(server_path.parent))

def check_dependencies():
    """Check if required packages are installed"""
    print("📦 Checking dependencies...")
    missing = []
    try:
        import motor  # type: ignore
        print("  ✅ motor installed")
    except ImportError:
        print("  ⚠️  motor not installed")
        missing.append("motor")

    try:
        import pymongo  # type: ignore
        print("  ✅ pymongo installed")
    except ImportError:
        print("  ⚠️  pymongo not installed")
        missing.append("pymongo")

    if missing:
        print("\nInstall missing packages: pip install " + " ".join(missing))
        return False

    return True

def check_files():
    """Check if all required files exist"""
    print("\n📁 Checking files...")
    
    files_to_check = [
        "server/models/mongodb.py",
        "server/middleware/__init__.py",
        "server/middleware/request_logger.py",
        "MONGODB_SETUP.md"
    ]
    
    all_exist = True
    for file in files_to_check:
        file_path = Path(__file__).parent / file
        if file_path.exists():
            print(f"  ✅ {file}")
        else:
            print(f"  ❌ {file} not found")
            all_exist = False
    
    return all_exist

def check_env():
    """Check environment configuration"""
    print("\n🔐 Checking environment...")
    # Prefer environment variable first (useful in CI / containers)
    env_db = os.environ.get("DATABASE_URL") or os.environ.get("MONGODB_URI")
    if env_db:
        print("  ✅ DATABASE_URL found in environment")
        return True

    # Fall back to reading server/.env if present
    env_file = Path(__file__).parent / "server" / ".env"
    if not env_file.exists():
        print("  ⚠️  .env file not found; ensure DATABASE_URL is set in environment or server/.env")
        return False

    content = env_file.read_text()
    # look for common keys
    for key in ("DATABASE_URL", "MONGODB_URI", "MONGO_URI"):
        if f"{key}=" in content:
            print(f"  ✅ {key} configured in server/.env")
            return True

    print("  ❌ No MongoDB URI found in server/.env; add DATABASE_URL or MONGODB_URI")
    return False

def test_connection():
    """Test MongoDB connection"""
    print("\n🔌 Testing MongoDB connection...")
    
    try:
        from server.config.settings import settings
        from pymongo import MongoClient

        mongodb_url = getattr(settings, "DATABASE_URL", None) or os.environ.get("DATABASE_URL") or os.environ.get("MONGODB_URI")
        if not mongodb_url:
            print("  ❌ No DATABASE_URL found (in settings or environment)")
            return False

        # Quick sync test
        client = MongoClient(mongodb_url, serverSelectionTimeoutMS=5000)
        client.admin.command('ping')
        print("  ✅ Successfully connected to MongoDB Atlas!")
        
        # Show database info
        db_name = client.get_database().name
        print(f"  📊 Database: {db_name}")
        
        client.close()
        return True
        
    except Exception as e:
        print(f"  ❌ Connection failed: {str(e)}")
        return False

def check_collections_defined():
    """Check if collections are properly defined"""
    print("\n📋 Checking collection definitions...")
    
    try:
        from server.models.mongodb import COLLECTIONS
        
        expected_collections = [
            "users", "social_accounts", "conversations", "activities",
            "api_requests", "posts", "dms", "briefings", 
            "voice_queries", "comments"
        ]
        
        for coll in expected_collections:
            if coll in COLLECTIONS:
                print(f"  ✅ {coll}")
            else:
                print(f"  ❌ {coll} not defined")
        
        return True
    except Exception as e:
        print(f"  ❌ Error: {str(e)}")
        return False

def main():
    print("=" * 60)
    print("🚀 Pika AI - MongoDB Atlas Setup Verification")
    print("=" * 60)
    
    results = []
    
    results.append(("Dependencies", check_dependencies()))
    results.append(("Files", check_files()))
    results.append(("Environment", check_env()))
    results.append(("MongoDB Connection", test_connection()))
    results.append(("Collections", check_collections_defined()))
    
    print("\n" + "=" * 60)
    print("📊 VERIFICATION SUMMARY")
    print("=" * 60)
    
    all_passed = True
    for name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {name}")
        if not passed:
            all_passed = False
    
    print("=" * 60)
    
    if all_passed:
        print("\n🎉 All checks passed! Your MongoDB Atlas setup is complete.")
        print("\n📝 Next steps:")
        print("   1. Start the server: python -m uvicorn server.main:app --reload")
        print("   2. Test API endpoints")
        print("   3. Check MongoDB Atlas dashboard for stored data")
    else:
        print("\n⚠️  Some checks failed. Please review the errors above.")
        print("   See MONGODB_SETUP.md for detailed setup instructions.")
    
    print()

if __name__ == "__main__":
    main()
