# 🤖 AI Customer Support Agent for Aven

A full-stack AI-powered customer support agent that uses RAG (Retrieval-Augmented Generation) with Pinecone vector database to answer questions about Aven's financial products and services.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  React Frontend │────│  Express API    │────│  Pinecone DB    │
│                 │    │                 │    │                 │
│ • Chat Interface│    │ • RAG System    │    │ • Vector Search │
│ • Voice Support │    │ • OpenAI GPT-4  │    │ • Embeddings    │
│ • Material-UI   │    │ • Knowledge Mgmt│    │ • Aven Data     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Features

### ✅ Core Features
- **💬 Text Chat**: Natural language conversations about Aven products
- **🧠 RAG System**: Retrieval-Augmented Generation for accurate responses
- **🔍 Vector Search**: Semantic search through Aven's knowledge base
- **🛡️ Safety Guards**: Content filtering and input validation
- **📱 Responsive UI**: Modern React interface with Material-UI

### 🎯 Upcoming Features
- **🎙️ Voice Chat**: Integration with Vapi for voice conversations
- **📊 Evaluation**: 50+ test questions for accuracy assessment
- **🔒 Advanced Guards**: PII detection and financial advice filtering
- **📅 Meeting Scheduler**: Tool calls for booking appointments

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **OpenAI GPT-4** for chat completions
- **Pinecone** for vector database
- **Text embeddings** (ada-002) for semantic search

### Frontend
- **React** with Create React App
- **Material-UI** for components
- **Axios** for API calls
- **React Markdown** for rich text rendering

## 📋 Prerequisites

1. **Node.js** (v18+)
2. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/)
3. **Pinecone Account** - Sign up at [Pinecone](https://www.pinecone.io/)

## ⚡ Quick Setup

### 1. Clone and Install
```bash
git clone <your-repo>
cd AI-support-agent
npm run install:all
```

### 2. Configure Environment
Create `backend/.env` file:
```env
# OpenAI
OPENAI_API_KEY=your_openai_api_key_here

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=aven-knowledge-base

# Server
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Initialize Knowledge Base
```bash
cd backend
npm run setup
```

This will:
- ✅ Verify API connections
- 🏗️ Create Pinecone index
- 📚 Load Aven knowledge base
- 🧪 Test RAG system

### 4. Start Development Servers
```bash
# From project root - starts both frontend and backend
npm run dev

# Or start individually:
npm run backend:dev
npm run frontend:dev
```

## 🎮 Usage

### Chat Interface
1. Open http://localhost:3000
2. Type questions about Aven:
   - "What is the Aven Card?"
   - "How do I apply?"
   - "What are the fees?"
   - "How does interest work?"

### API Endpoints

#### Chat
```bash
# Send a message
POST /api/chat/message
{
  "message": "What is the Aven Card?",
  "sessionId": "optional-session-id"
}

# Get chat history
GET /api/chat/history/:sessionId

# Get suggestions
GET /api/chat/suggestions
```

#### Admin
```bash
# Get knowledge base stats
GET /api/admin/stats

# Reindex knowledge base
POST /api/admin/reindex

# Test retrieval
POST /api/admin/test-retrieval
{
  "query": "test question",
  "topK": 5
}
```

## 📊 Knowledge Base

The system includes comprehensive Aven data:

- **Company Overview**: Product descriptions, contact info
- **Features & Benefits**: Credit lines, rates, cashback
- **FAQ Categories**: 20+ detailed Q&As covering:
  - Application process
  - Rates and fees
  - Account management
  - Payments
  - Eligibility requirements

## 🔧 Development

### Adding New Knowledge
1. Add data to `/data/scraped/` directory
2. Update `knowledgeService.loadAvenData()`
3. Run `npm run setup` to reindex

### Testing RAG System
```bash
# Test individual components
cd backend

# Test knowledge search
node -e "
const ks = require('./src/services/knowledgeService');
ks.searchKnowledge('What is Aven?', 3).then(console.log);
"

# Test chat completion
node -e "
const cs = require('./src/services/chatService');
cs.processMessage('How do I apply?').then(console.log);
"
```

### Monitoring
- **Health Check**: GET `/health`
- **Knowledge Stats**: GET `/api/admin/stats`
- **Chat Analytics**: Session management included

## 🚢 Deployment

### Backend (Railway/Heroku)
```bash
# Set environment variables
railway variables set OPENAI_API_KEY=your_key
railway variables set PINECONE_API_KEY=your_key
# ... set all required vars

# Deploy
railway up
```

### Frontend (Vercel/Netlify)
```bash
# Build
cd frontend
npm run build

# Deploy to Vercel
vercel deploy --prod
```

## 🧪 Testing

### Manual Testing
1. Start development servers
2. Test various question types:
   - Product information
   - Application process
   - Account management
   - Rate calculations

### API Testing
```bash
# Test chat endpoint
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is the Aven Card?"}'

# Test admin stats
curl http://localhost:5000/api/admin/stats
```

## 📁 Project Structure

```
AI-support-agent/
├── backend/
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   │   ├── chat.js      # Chat functionality
│   │   │   └── admin.js     # Admin & knowledge mgmt
│   │   ├── services/        # Core business logic
│   │   │   ├── chatService.js      # Chat orchestration
│   │   │   ├── knowledgeService.js # RAG & document processing
│   │   │   ├── openaiService.js    # OpenAI integration
│   │   │   └── pineconeService.js  # Vector database
│   │   └── app.js           # Express server
│   ├── scripts/
│   │   └── setup.js         # Knowledge base initialization
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API integration
│   │   └── App.js
│   └── package.json
├── data/
│   └── scraped/             # Aven knowledge base
│       ├── aven-support-data.json
│       └── aven-detailed-faq.json
└── README.md
```

## 🔮 Next Steps

1. **🎙️ Voice Integration**: Add Vapi for voice conversations
2. **📊 Evaluation System**: Create test suite with accuracy metrics
3. **🔒 Enhanced Guards**: Advanced PII and content filtering
4. **📅 Tool Integration**: Meeting scheduling and form submissions
5. **📈 Analytics**: User interaction tracking and insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

---

**Built with ❤️ by [Sreeraj Chintham]**

*Powered by OpenAI GPT-4, Pinecone, and React* 

🧠 RAG System Architecture:
├── 🔧 PineconeService     → Vector database operations
├── 🤖 OpenAIService       → Embeddings & chat completions  
├── 📚 KnowledgeService    → Document processing & RAG logic
├── 💬 ChatService         → Conversation management
└── 🛠️ Setup Script        → Automated initialization

📊 Knowledge Base:
├── 📄 Basic Aven info (company, features, contact)
├── 🔍 Detailed FAQ (20+ Q&As across categories)
├── 🧩 Smart chunking & overlap for better retrieval
└── 🔮 Vector embeddings ready for semantic search 