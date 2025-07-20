const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const config = require('../config');
const vapiService = require('./services/vapiService');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: config.CORS_ORIGIN,
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'AI Support Agent API'
  });
});

// API routes
app.use('/api/chat', require('./routes/chat'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/vapi', require('./routes/vapi'));
app.use('/api/meetings', require('./routes/meetings'));
app.use('/api/evaluation', require('./routes/evaluation'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Initialize Vapi service when server starts
async function initializeServices() {
  try {
    console.log('🔧 Starting service initialization...');
    if (config.VAPI_API_KEY) {
      console.log('🔧 About to initialize Vapi service...');
      
      // Add timeout to prevent hanging
      const initWithTimeout = Promise.race([
        vapiService.initialize(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Vapi initialization timeout')), 30000)
        )
      ]);
      
      await initWithTimeout;
      console.log('✅ Vapi service initialization completed');
    } else {
      console.log('⚠️ Vapi not configured - voice features will be unavailable');
    }
    console.log('✅ All services initialized successfully');
  } catch (error) {
    console.error('⚠️ Failed to initialize Vapi service:', error.message);
    console.log('💡 Voice features will be unavailable until Vapi is properly configured');
  }
}

const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // Initialize services asynchronously without blocking server startup
  initializeServices().catch(error => {
    console.error('Service initialization failed:', error);
  });
});

module.exports = app; 