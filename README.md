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
DATABASE_URL=postgresql://user:password@localhost/pika_db
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret
TWITTER_API_KEY=your-twitter-api-key
TWITTER_API_SECRET=your-twitter-api-secret
TIKTOK_CLIENT_KEY=your-tiktok-client-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

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
# Backend tests
cd backend
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

## 👥 Contact

For questions and support, please open an issue on GitHub.