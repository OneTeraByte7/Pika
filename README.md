# 🎤 Pika - Voice-First Social Media AI Agent

A voice-first AI agent that aggregates all your social media platforms into one conversational interface, designed for GenZ users to eliminate app-switching fatigue.

## 📁 Project Structure

```
pika-ai/
├── backend/                 # Python FastAPI backend (70%)
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/  # API route handlers
│   │   │   └── deps/       # Dependencies & auth
│   │   └── core/           # Core configurations
│   ├── models/             # Database models
│   ├── services/
│   │   ├── social_media/   # Social platform integrations
│   │   ├── ai/             # LLM & AI logic
│   │   └── voice/          # Voice processing
│   ├── utils/              # Utility functions
│   └── config/             # Configuration files
├── frontend/               # React PWA (30%)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   └── styles/        # CSS/Tailwind styles
│   └── public/            # Static assets
├── deployment/            # Render deployment configs
└── tests/                 # Test files

```

## 🚀 Features

- **Voice-First Interface**: Natural conversations with Pika
- **Cross-Platform Aggregation**: Instagram, Twitter/X, TikTok in one place
- **Twitter OAuth Integration**: Connect and manage Twitter accounts (✨ NEW!)
- **Smart DM Management**: Never miss important messages
- **One-Command Posting**: Post to multiple platforms simultaneously
- **Morning Briefings**: Daily social media digest
- **PWA Support**: Works on mobile and desktop

## 🛠️ Tech Stack

### Backend (Python)
- FastAPI
- PostgreSQL
- Redis
- Llama 3 / Mistral 7B (fine-tuned)
- Social Media APIs

### Frontend (React)
- Next.js / React
- Tailwind CSS
- ElevenLabs API (voice)
- Web Speech API
- WebSockets

## 📦 Installation

### Quick Start (Twitter Integration)

```bash
# 1. Verify Twitter setup
python setup_twitter.py

# 2. Install dependencies
cd server
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env with your Twitter API credentials

# 4. Run tests
python ../test_twitter_integration.py

# 5. Start server
python main.py
```

For detailed Twitter integration setup, see [TWITTER_INTEGRATION.md](TWITTER_INTEGRATION.md)

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Configure your .env file
python main.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 🔧 Environment Variables

Create `.env` files in both backend and frontend directories:

### Backend .env
```
DATABASE_URL=mongodb://localhost:27017/pika_db
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
FRONTEND_URL=http://localhost:3000

# Twitter OAuth 2.0 (required for Twitter integration)
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret
TWITTER_BEARER_TOKEN=your-twitter-bearer-token
TWITTER_CALLBACK_URL=http://localhost:8000/twitter/callback

# Other social platforms
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
TIKTOK_CLIENT_KEY=your-tiktok-client-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
OPENAI_API_KEY=your-openai-api-key
```

See [.env.example](server/.env.example) for complete configuration template.

### Frontend .env
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
NEXT_PUBLIC_ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

## 🚢 Deployment

Deploy to Render:

```bash
cd deployment
# Follow instructions in deploy.md
```

## 📱 PWA Installation

- **Mobile**: Open in browser and select "Add to Home Screen"
- **Desktop**: Click install icon in address bar

## 🧪 Testing

```bash
# Twitter integration tests
python test_twitter_integration.py

# Twitter setup verification
python setup_twitter.py

# Backend tests
cd server
pytest

# Frontend tests
cd frontend
npm test
```

## 📈 Success Metrics

- 50% reduction in app-switching time
- 90% DM capture rate
- Daily active engagement
- User satisfaction scores

## 📄 License

MIT License

## 📚 Documentation

- [Twitter Integration Guide](TWITTER_INTEGRATION.md) - Complete Twitter OAuth setup
- [Implementation Summary](TWITTER_IMPLEMENTATION_SUMMARY.md) - Technical details
- [MongoDB Setup](MONGODB_SETUP.md) - Database configuration
- [Services Documentation](SERVICES_README.md) - Service architecture

## 👥 Contact

For questions and support, please open an issue on GitHub.