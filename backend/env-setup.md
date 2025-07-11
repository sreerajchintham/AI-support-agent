# Environment Setup Instructions

## Required API Keys

To run the backend, you need to create a `.env` file in the `backend/` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# OpenAI API Key - Get from https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here

# Pinecone Configuration - Get from https://app.pinecone.io/
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
PINECONE_INDEX_NAME=aven-knowledge-base

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Getting API Keys

### 1. OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy the key and replace `your_openai_api_key_here`

### 2. Pinecone Account
1. Go to https://app.pinecone.io/
2. Sign up for a free account
3. Create a new index (if you don't have one)
4. Get your API key from the dashboard
5. Get your environment name (usually something like `us-east1-aws`)

## Quick Setup Command

Run this in the `backend/` directory:

```bash
# Create .env file (you'll need to edit it with your actual keys)
echo "PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
PINECONE_API_KEY=your_pinecone_api_key_here
PINECONE_ENVIRONMENT=your_pinecone_environment_here
PINECONE_INDEX_NAME=aven-knowledge-base
CORS_ORIGIN=http://localhost:3000" > .env

# Then edit the file and add your real API keys
nano .env
``` 