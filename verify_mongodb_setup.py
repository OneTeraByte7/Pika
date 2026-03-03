"""
MongoDB Atlas Setup Verification Script
Run this after setup to verify everything is configured correctly
"""

import sys
from pathlib import Path

# Add server to path
server_path = Path(__file__).parent / "server"
sys.path.insert(0, str(server_path.parent))

def check_dependencies():
    """Check if required packages are installed"""
    print("📦 Checking dependencies...")
    try:
        import motor
        print("  ✅ motor installed")
    except ImportError:
        print("  ❌ motor not installed - run: pip install motor")
        return False
    
    try:
        import pymongo
        print("  ✅ pymongo installed")
    except ImportError:
        print("  ❌ pymongo not installed - run: pip install pymongo")
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
    
    env_file = Path(__file__).parent / "server" / ".env"
    if not env_file.exists():
        print("  ❌ .env file not found")
        return False
    
    with open(env_file, 'r') as f:
        content = f.read()
    
    if "DATABASE_URL=mongodb" in content:
        print("  ✅ MongoDB Atlas URL configured")
        return True
    else:
        print("  ❌ MongoDB URL not configured in .env")
        return False

def test_connection():
    """Test MongoDB connection"""
    print("\n🔌 Testing MongoDB connection...")
    
    try:
        from server.config.settings import settings
        from pymongo import MongoClient
        
        # Quick sync test
        client = MongoClient(settings.DATABASE_URL, serverSelectionTimeoutMS=5000)
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
