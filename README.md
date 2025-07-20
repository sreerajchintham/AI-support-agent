# 🤖 Sarah - AI Customer Support Agent for Aven

A full-stack AI-powered customer support agent named Sarah that uses RAG (Retrieval-Augmented Generation) with Pinecone vector database to answer questions about Aven's financial products and services. Sarah features enhanced guardrails, comprehensive evaluation, and meeting scheduling capabilities.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  React Frontend │────│  Express API    │────│  Pinecone DB    │
│                 │    │                 │    │                 │
│ • Chat Interface│    │ • RAG System    │    │ • Vector Search │
│ • Voice Support │    │ • OpenAI GPT-4  │    │ • Embeddings    │
│ • Material-UI   │    │ • Knowledge Mgmt│    │ • Aven Data     │
│ • Sarah Agent   │    │ • Guardrails    │    │ • Evaluation    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Features

### ✅ Core Features
- **💬 Text Chat**: Natural language conversations with Sarah about Aven products
- **🧠 RAG System**: Retrieval-Augmented Generation for accurate responses
- **🔍 Vector Search**: Semantic search through Aven's knowledge base
- **🛡️ Enhanced Safety Guards**: Content filtering, PII detection, and input validation
- **📱 Responsive UI**: Modern React interface with Material-UI
- **🎙️ Voice Chat**: Integration with Vapi for voice conversations

### 🎯 Advanced Features
- **📊 Evaluation System**: 50+ test questions for accuracy, helpfulness, and citation quality assessment
- **🔒 Advanced Guardrails**: PII detection, legal/financial advice filtering, and toxicity detection
- **📅 Meeting Scheduler**: Tool calls for booking appointments with Aven representatives
- **🤖 Sarah Agent**: Personalized AI assistant with consistent personality and responses

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **OpenAI GPT-4** for chat completions
- **Pinecone** for vector database
- **Text embeddings** (ada-002) for semantic search
- **Vapi** for voice chat capabilities
- **Enhanced scraping** with Puppeteer and Cheerio

### Frontend
- **React** with Create React App
- **Material-UI** for components
- **Axios** for API calls
- **React Markdown** for rich text rendering
- **Vapi Web SDK** for voice features

## 📋 Prerequisites

1. **Node.js** (v18+)
2. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/)
3. **Pinecone Account** - Sign up at [Pinecone](https://www.pinecone.io/)
4. **Vapi Account** (Optional) - For voice features from [Vapi](https://vapi.ai/)

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

# Vapi (Optional - for voice features)
VAPI_API_KEY=your_vapi_private_key_here
VAPI_PUBLIC_KEY=your_vapi_public_key_here

# Server
PORT=5001
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
- 🤖 Initialize Sarah agent

### 4. Start Development Servers
```bash
# From project root - starts both frontend and backend
npm run dev

# Or start individually:
npm run backend:dev
npm run frontend:dev
```

### 5. Expected Startup Logs
You should see these logs indicating successful startup:
```
🚀 Server running on port 5001
🔧 Starting service initialization...
🎙️ Initializing Vapi service... (if configured)
✅ Created new assistant: [assistant-id] (if Vapi configured)
✅ All services initialized successfully
🤖 Sarah agent ready to help!
```

## 🎮 Usage

### Chat Interface
1. Open http://localhost:3000
2. Meet Sarah, your AI assistant
3. Type questions about Aven:
   - "What is the Aven Card?"
   - "How do I apply?"
   - "What are the fees?"
   - "How does interest work?"
   - "Can you schedule a meeting for me?"

### Voice Chat
1. Click the voice button in the header
2. Allow microphone access
3. Speak naturally with Sarah
4. Use voice commands like "Schedule a meeting" or "What are the rates?"

## 🔧 API Endpoints

### Chat
```bash
# Send a message to Sarah
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

### Meetings (New!)
```bash
# Get available meeting slots
GET /api/meetings/slots?date=2024-01-15

# Schedule a meeting
POST /api/meetings/schedule
{
  "slotId": "slot-id",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "555-123-4567",
  "meetingType": "consultation",
  "notes": "Interested in applying"
}

# Cancel a meeting
POST /api/meetings/cancel/:meetingId

# Get meeting details
GET /api/meetings/:meetingId
```

### Evaluation (New!)
```bash
# Get all test questions
GET /api/evaluation/questions

# Run evaluation on single question
POST /api/evaluation/evaluate/1

# Run full evaluation (50 questions)
POST /api/evaluation/run-full

# Get evaluation results
GET /api/evaluation/results

# Get evaluation statistics
GET /api/evaluation/stats
```

### Admin
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

### Vapi (Voice Chat)
```bash
# Get public Vapi configuration
GET /api/vapi/config

# Webhook endpoint for Vapi function calls
POST /api/vapi/webhook
```

## 🛡️ Enhanced Guardrails

Sarah includes comprehensive safety features:

### Content Filtering
- **Toxicity Detection**: Filters inappropriate or offensive content
- **Personal Data Protection**: Detects requests for SSN, credit card numbers, passwords
- **Legal Advice Filtering**: Redirects legal questions to qualified attorneys
- **Financial Advice Filtering**: Redirects personalized financial advice requests
- **Account-Specific Protection**: Redirects personal account inquiries

### Response Quality
- **Accuracy Scoring**: Evaluates response accuracy against expected keywords
- **Helpfulness Assessment**: Measures response usefulness and actionability
- **Citation Quality**: Tracks source attribution and relevance
- **Overall Performance**: Combined scoring for comprehensive evaluation

## 📊 Evaluation System

The system includes 50+ realistic test questions across categories:

### Question Categories
- **Product Basics** (8 questions): What is the Aven Card, how it works
- **Application Process** (6 questions): How to apply, eligibility requirements
- **Rates and Fees** (6 questions): Interest rates, fees, costs
- **Usage and Features** (6 questions): Where to use, restrictions
- **Rewards and Benefits** (4 questions): Cashback, rewards programs
- **Account Management** (4 questions): Balance checking, transactions
- **Contact and Support** (4 questions): How to contact, support numbers
- **Advanced Topics** (4 questions): Variable rates, payment consequences
- **Edge Cases** (4 questions): International use, account closure
- **Technical Issues** (4 questions): Website problems, password reset

### Evaluation Metrics
- **Accuracy**: Keyword matching and content relevance (0-1 scale)
- **Helpfulness**: Response usefulness and actionability (0-1 scale)
- **Citation Quality**: Source attribution and relevance (0-1 scale)
- **Overall Score**: Combined performance metric

## 📅 Meeting Scheduling

Sarah can schedule meetings through voice or text:

### Meeting Types
- **Consultation**: General questions about Aven products
- **Application**: Help with the application process
- **Support**: Technical or account support

### Scheduling Process
1. User requests meeting scheduling
2. Sarah checks available slots
3. Collects user information (name, email, phone)
4. Books the meeting automatically
5. Provides confirmation with details

### Available Slots
- **Business Hours**: Monday-Friday, 9 AM - 5 PM
- **Duration**: 30 days in advance
- **Confirmation**: Email and calendar invitation

## 📚 Knowledge Base

The system includes comprehensive Aven data:

- **Company Overview**: Product descriptions, contact info
- **Features & Benefits**: Credit lines, rates, cashback
- **FAQ Categories**: 20+ detailed Q&As covering:
  - Application process
  - Rates and fees
  - Account management
  - Payments
  - Eligibility requirements
- **Enhanced Data**: Scraped from multiple sources
- **Synthetic Data**: Generated for comprehensive coverage

## 🔧 Development

### Adding New Knowledge
1. Add data to `/data/scraped/` directory
2. Update `knowledgeService.loadAvenData()`
3. Run `npm run setup` to reindex

### Running Evaluations
```bash
# Test individual components
cd backend

# Run full evaluation
curl -X POST http://localhost:5001/api/evaluation/run-full

# Test specific question
curl -X POST http://localhost:5001/api/evaluation/evaluate/1

# Get evaluation stats
curl http://localhost:5001/api/evaluation/stats
```

### Testing Meeting Scheduling
```bash
# Get available slots
curl http://localhost:5001/api/meetings/slots

# Schedule a meeting
curl -X POST http://localhost:5001/api/meetings/schedule \
  -H "Content-Type: application/json" \
  -d '{
    "slotId": "slot-id",
    "name": "Test User",
    "email": "test@example.com",
    "phone": "555-123-4567"
  }'
```

### Monitoring
- **Health Check**: GET `/health`
- **Knowledge Stats**: GET `/api/admin/stats`
- **Meeting Stats**: GET `/api/meetings/stats/overview`
- **Evaluation Stats**: GET `/api/evaluation/stats`
- **Chat Analytics**: Session management included

## 🔧 Troubleshooting

### Backend Hanging Issues
If the backend appears to hang during startup:

#### Symptoms:
```
🚀 Server running on port 5001
🎙️ Initializing Vapi service...
✅ Created new assistant: [assistant-id]
[Process appears stuck here]
```

#### Solutions:
1. **Check if server is responsive**:
   ```bash
   curl -s http://localhost:5001/health
   ```
   If this returns a health status, the server is working properly.

2. **Recent Fix Applied**: The backend now uses non-blocking service initialization
   - Services initialize asynchronously after server startup
   - Server responds immediately even during Vapi initialization
   - Added 30-second timeout protection for Vapi initialization

3. **If still experiencing issues**:
   ```bash
   # Kill any processes on ports
   lsof -ti:5001 -ti:3000 | xargs kill -9
   
   # Restart the servers
   npm run dev
   ```

4. **Disable Vapi temporarily** (if needed):
   - Remove or comment out `VAPI_API_KEY` in your configuration
   - Server will start without voice features

### Evaluation Issues
If evaluations are failing:

1. **Check OpenAI API limits**:
   ```bash
   curl -X POST http://localhost:5001/api/evaluation/evaluate/1
   ```

2. **Run smaller batches**:
   ```bash
   curl -X POST http://localhost:5001/api/evaluation/evaluate-batch \
     -H "Content-Type: application/json" \
     -d '{"questionIds": [1,2,3,4,5]}'
   ```

### Meeting Scheduling Issues
If meeting scheduling fails:

1. **Check slot availability**:
   ```bash
   curl http://localhost:5001/api/meetings/slots
   ```

2. **Verify meeting service**:
   ```bash
   curl http://localhost:5001/api/meetings/stats/overview
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Run the evaluation suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Aven** for providing the product information
- **OpenAI** for GPT-4 and embeddings
- **Pinecone** for vector database
- **Vapi** for voice capabilities
- **Material-UI** for the beautiful interface

---

**Sarah is ready to help!** 🚀

For support or questions about this implementation, please contact the development team. 