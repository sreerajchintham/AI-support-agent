// Copy this file to config.js and fill in your actual values
// Or create a .env file with these variables

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // OpenAI API
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || 'your_openai_api_key_here',

  // Pinecone Configuration
  PINECONE_API_KEY: process.env.PINECONE_API_KEY || 'your_pinecone_api_key_here',
  PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT || 'your_pinecone_environment',
  PINECONE_INDEX_NAME: process.env.PINECONE_INDEX_NAME || 'aven-knowledge-base',

  // Vapi Configuration (for voice chat)
  VAPI_API_KEY: process.env.VAPI_API_KEY || 'your_vapi_api_key_here',

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS || 900000,
  RATE_LIMIT_MAX_REQUESTS: process.env.RATE_LIMIT_MAX_REQUESTS || 100,

  // Security
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000'
}; 