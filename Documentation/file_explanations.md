# Detailed File Explanations

This document provides comprehensive explanations for every file in the AI Customer Support Agent project, organized by directory structure.

## Root Level Files

### package.json
- **File Type**: JSON Configuration
- **Purpose**: Root-level package management and script coordination for the monorepo
- **Detailed Explanation**:
  - **Line 2**: `"name": "ai-support-agent"` - Project identifier for npm registry
  - **Line 3**: `"version": "1.0.0"` - Semantic versioning for the complete application
  - **Line 4**: `"description"` - Describes the project as an AI Customer Support Agent for Aven using RAG with Pinecone
  - **Line 6**: `"scripts"` object contains npm scripts for development workflow:
    - `"dev"` - Runs both backend and frontend concurrently using the `concurrently` package
    - `"backend:dev"` and `"frontend:dev"` - Individual development scripts for each service
    - `"install:all"` - Installs dependencies for root, backend, and frontend
    - `"build"` and `"start"` - Production build and start scripts
  - **Lines 15-21**: Keywords for npm discoverability (ai, customer-support, rag, pinecone, aven, chatbot)
  - **Lines 24-27**: Development dependencies including `concurrently` for running multiple processes
  - **Lines 28-31**: Production dependencies for Pinecone client and Axios HTTP client

### package-lock.json
- **File Type**: JSON Lock File
- **Purpose**: Ensures consistent dependency versions across all environments
- **Detailed Explanation**: Auto-generated lock file that contains exact dependency versions and their dependency trees

### README.md
- **File Type**: Markdown Documentation
- **Purpose**: Project overview, setup instructions, and feature documentation
- **Detailed Explanation**: Comprehensive documentation covering architecture, features, tech stack, and setup instructions

## Backend Files

### backend/package.json
- **File Type**: JSON Configuration
- **Purpose**: Backend-specific dependencies and scripts
- **Detailed Explanation**:
  - **Dependencies**: Express.js, CORS, security middleware (helmet), rate limiting, OpenAI, Pinecone, UUID generation
  - **Scripts**: Development server with nodemon, production start, and testing commands
  - **Version management**: Specific to backend API versioning

### backend/config.js
- **File Type**: JavaScript Configuration Module
- **Purpose**: Centralized configuration management for environment variables and API settings
- **Detailed Explanation**:
  - **Lines 4-7**: Server configuration with port and environment settings
  - **Line 9**: OpenAI API key configuration with environment variable fallback
  - **Lines 11-13**: Pinecone database configuration including API key, environment, and index name
  - **Line 16**: Vapi API key for future voice chat integration
  - **Lines 18-20**: Rate limiting configuration (15-minute window, 100 requests max)
  - **Line 23**: CORS origin configuration for frontend access

### backend/init-knowledge-base.js
- **File Type**: JavaScript Initialization Script
- **Purpose**: Script to initialize and populate the Pinecone vector database with Aven knowledge
- **Detailed Explanation**:
  - Imports knowledge service and configuration
  - Executes knowledge base loading process
  - Handles errors and provides console feedback
  - One-time setup script for vector database population

### backend/env-setup.md
- **File Type**: Markdown Documentation
- **Purpose**: Environment setup instructions for developers
- **Detailed Explanation**: Step-by-step guide for configuring API keys, environment variables, and development environment

### backend/scripts/setup.js
- **File Type**: JavaScript Automation Script
- **Purpose**: Automated project setup and configuration
- **Detailed Explanation** (200 lines):
  - **Lines 1-10**: Import statements for file system, path utilities, and child process execution
  - **Lines 15-30**: Configuration object with default values for OpenAI, Pinecone, and server settings
  - **Lines 35-60**: `checkEnvironment()` function - Validates Node.js version and required tools
  - **Lines 65-90**: `createConfigFile()` function - Generates backend configuration file
  - **Lines 95-120**: `installDependencies()` function - Runs npm install for backend and frontend
  - **Lines 125-150**: `initializeDatabase()` function - Sets up Pinecone index and loads knowledge base
  - **Lines 155-180**: `validateSetup()` function - Tests API connections and configuration
  - **Lines 185-200**: Main execution flow with error handling and progress reporting

### backend/src/app.js
- **File Type**: JavaScript Express Application
- **Purpose**: Main Express.js server entry point with middleware and routing
- **Detailed Explanation**:
  - **Lines 1-7**: Import statements for Express, security middleware, logging, and configuration
  - **Line 10**: Creates Express application instance
  - **Lines 12-13**: Applies Helmet security middleware for HTTP header protection
  - **Lines 15-22**: Rate limiting configuration using express-rate-limit middleware
  - **Lines 24-28**: CORS configuration allowing frontend origin with credentials
  - **Line 31**: Morgan logging middleware in 'combined' format for request logging
  - **Lines 33-35**: Body parsing middleware with 10MB limit for JSON and URL-encoded data
  - **Lines 37-42**: Health check endpoint returning service status and timestamp
  - **Lines 44-46**: API route mounting for chat, admin, and Vapi endpoints
  - **Lines 48-54**: Global error handling middleware with development/production error messaging
  - **Lines 56-84**: **UPDATED - Non-Blocking Service Initialization**:
    - **Lines 58-84**: `initializeServices()` function with enhanced error handling and logging
    - **Lines 70-78**: Vapi initialization with 30-second timeout protection using `Promise.race()`
    - **Lines 86-92**: **UPDATED - Non-Blocking Server Startup**:
      - Server starts immediately without waiting for service initialization
      - Services initialize asynchronously in background
      - Added comprehensive debug logging for startup process
      - Improved error handling that doesn't crash the server

### backend/src/routes/chat.js
- **File Type**: JavaScript Express Router
- **Purpose**: API endpoints for chat functionality and message handling
- **Detailed Explanation** (107 lines):
  - **Lines 1-5**: Import statements for Express router, chat service, and validation middleware
  - **Lines 10-25**: `POST /` route - Main chat endpoint that processes user messages
    - Validates input message and session ID
    - Calls chat service to generate AI response
    - Returns formatted response with conversation data
  - **Lines 30-45**: `GET /suggestions` route - Returns suggested questions for users
  - **Lines 50-65**: `GET /sessions/:sessionId` route - Retrieves conversation history
  - **Lines 70-85**: `DELETE /sessions/:sessionId` route - Clears conversation session
  - **Lines 90-107**: Error handling and input validation helpers

### backend/src/routes/admin.js
- **File Type**: JavaScript Express Router
- **Purpose**: Administrative API endpoints and knowledge base management
- **Detailed Explanation** (138 lines):
  - **Lines 1-8**: Import statements for Express, file system, path utilities, and services
  - **Lines 15-35**: `POST /load-knowledge` route - Loads knowledge base from data files
    - Reads JSON files from data directory
    - Processes and embeds documents
    - Updates Pinecone vector database
  - **Lines 40-60**: `GET /knowledge/stats` route - Returns knowledge base statistics
  - **Lines 65-85**: `POST /knowledge/search` route - Direct search endpoint for testing
  - **Lines 90-110**: `DELETE /knowledge/clear` route - Clears entire knowledge base
  - **Lines 115-138**: Utility functions for file processing and validation

### backend/src/services/chatService.js
- **File Type**: JavaScript Service Class
- **Purpose**: Main chat service coordinating RAG pipeline and response generation
- **Detailed Explanation** (229 lines):
  - **Lines 1-5**: Import statements for knowledge service, OpenAI service, Pinecone service, and UUID
  - **Lines 7-16**: Constructor and initialization methods
    - **Line 8**: In-memory conversation storage (Map structure)
    - **Lines 13-16**: Service initialization and dependency setup
  - **Lines 25-38**: `getConversation()` method - Session management
    - Creates new session with UUID if none provided
    - Initializes conversation object with metadata
    - Returns existing or new conversation
  - **Lines 40-52**: `addToConversation()` method - Message history management
    - Adds messages to conversation with role (user/assistant)
    - Tracks timestamps and metadata
    - Updates last activity time
  - **Lines 55-120**: `generateResponse()` method - Main RAG pipeline
    - **Lines 60-70**: Context retrieval using Pinecone semantic search
    - **Lines 75-95**: Prompt construction with system message and context
    - **Lines 100-115**: OpenAI API call for response generation
    - **Lines 116-120**: Response formatting and conversation update
  - **Lines 125-180**: Helper methods for context processing and fallback responses
  - **Lines 185-229**: Session management, cleanup, and statistics methods

### backend/src/services/openaiService.js
- **File Type**: JavaScript Service Class
- **Purpose**: OpenAI API integration service for chat completions and embeddings
- **Detailed Explanation** (186 lines):
  - **Lines 1-5**: Import statements for OpenAI client and configuration
  - **Lines 10-20**: Service initialization and client setup
  - **Lines 25-60**: `createChatCompletion()` method - GPT-4 chat completions
    - **Lines 30-35**: Request parameters setup (model, messages, temperature)
    - **Lines 40-50**: API call with error handling and retry logic
    - **Lines 55-60**: Response extraction and formatting
  - **Lines 65-120**: `createEmbedding()` method - Text embedding generation
    - **Lines 70-75**: Input text validation and preprocessing
    - **Lines 80-90**: OpenAI embeddings API call using text-embedding-3-large
    - **Lines 95-110**: Dimension specification (1024) for Pinecone compatibility
    - **Lines 115-120**: Vector extraction and normalization
  - **Lines 125-150**: `batchEmbeddings()` method - Bulk embedding processing
  - **Lines 155-186**: Error handling, retry logic, and rate limiting management

### backend/src/services/pineconeService.js
- **File Type**: JavaScript Service Class
- **Purpose**: Pinecone vector database operations and semantic search
- **Detailed Explanation** (169 lines):
  - **Lines 1-5**: Import statements for Pinecone client and configuration
  - **Lines 10-25**: Service initialization and client setup
    - **Lines 15-20**: Pinecone client configuration with API key
    - **Lines 21-25**: Index reference and namespace setup
  - **Lines 30-70**: `upsertVectors()` method - Vector insertion and updates
    - **Lines 35-45**: Vector formatting and metadata attachment
    - **Lines 50-60**: Batch processing for multiple vectors
    - **Lines 65-70**: Progress tracking and error handling
  - **Lines 75-120**: `searchSimilar()` method - Semantic similarity search
    - **Lines 80-85**: Query vector preparation
    - **Lines 90-100**: Pinecone query execution with filters
    - **Lines 105-115**: Result processing and ranking
    - **Lines 116-120**: Metadata extraction and formatting
  - **Lines 125-150**: `getIndexStats()` method - Database statistics and health check
  - **Lines 155-169**: Utility methods for vector operations and cleanup

### backend/src/services/vapiService.js
- **File Type**: JavaScript Service Class
- **Purpose**: Vapi voice chat integration service for assistant management and function calls
- **Detailed Explanation** (261 lines):
  - **Lines 1-10**: Import statements for Vapi client, configuration, and knowledge service
  - **Lines 12-26**: **UPDATED - Enhanced Service Initialization**:
    - **Lines 15-25**: `initialize()` method with comprehensive debug logging
    - **Lines 22-24**: Added detailed progress logging throughout initialization process
    - **Lines 25-26**: Explicit completion logging to indicate successful initialization
  - **Lines 30-90**: **UPDATED - Assistant Creation with Debug Logging**:
    - **Lines 32-35**: Added configuration building debug log
    - **Lines 82-85**: Added Vapi API call debug logging
    - **Lines 86-88**: Added success confirmation logging before returning assistant ID
  - **Lines 40-80**: Assistant configuration object with comprehensive settings:
    - **Lines 45-50**: System prompt optimized for voice conversations (under 50 words)
    - **Lines 55-60**: Voice configuration using 11Labs with specified voice ID
    - **Lines 65-75**: Call management settings (timeout, recording, background sound)
    - **Lines 76-80**: Function definitions for knowledge base search integration
  - **Lines 95-120**: Assistant management methods (get, update, delete)
  - **Lines 125-180**: `handleFunctionCall()` method - Webhook function processing
    - **Lines 130-140**: Function routing and error handling
    - **Lines 145-160**: Knowledge search integration with voice-optimized responses
    - **Lines 165-180**: Error recovery and fallback messaging
  - **Lines 185-230**: `searchKnowledge()` method - Voice-optimized knowledge retrieval
    - **Lines 190-200**: Query processing with category filtering
    - **Lines 205-215**: Response formatting for voice delivery (shortened for speech)
    - **Lines 220-230**: Confidence scoring and source attribution
  - **Lines 235-261**: Utility methods for call management and public configuration

### backend/src/services/knowledgeService.js
- **File Type**: JavaScript Service Class
- **Purpose**: Knowledge base processing, embedding, and retrieval logic
- **Detailed Explanation** (397 lines):
  - **Lines 1-10**: Import statements for file system, path utilities, and other services
  - **Lines 15-25**: Service initialization and dependency management
  - **Lines 30-80**: `chunkText()` method - Text segmentation for optimal embeddings
    - **Lines 35-45**: Sentence-based text splitting with regex patterns
    - **Lines 50-65**: Chunk size management (1000 chars max with 200 char overlap)
    - **Lines 70-80**: Overlap handling to maintain context continuity
  - **Lines 85-150**: `processDocument()` method - Document processing pipeline
    - **Lines 90-100**: Document validation and metadata extraction
    - **Lines 105-120**: Text cleaning and normalization
    - **Lines 125-140**: Chunk generation and embedding creation
    - **Lines 145-150**: Vector preparation for database insertion
  - **Lines 155-220**: `loadFromDataFiles()` method - Bulk knowledge base loading
    - **Lines 160-175**: File discovery and reading from data directory
    - **Lines 180-200**: JSON parsing and validation
    - **Lines 205-220**: Batch processing and progress tracking
  - **Lines 225-280**: `searchKnowledge()` method - Knowledge retrieval for RAG
    - **Lines 230-240**: Query processing and embedding generation
    - **Lines 245-260**: Pinecone search execution with relevance filtering
    - **Lines 265-280**: Result ranking and context assembly
  - **Lines 285-340**: `generateContext()` method - Context compilation for prompts
  - **Lines 345-397**: Utility methods for document management and statistics

## Frontend Files

### frontend/package.json
- **File Type**: JSON Configuration
- **Purpose**: React application dependencies and build scripts
- **Detailed Explanation**:
  - **Dependencies**: React, Material-UI, Axios, React Router, UUID generation
  - **Scripts**: Development server, production build, testing, and ejection
  - **Browser support**: Modern browsers with ES6+ support

### frontend/.gitignore
- **File Type**: Git Ignore Configuration
- **Purpose**: Specifies files and directories to exclude from version control
- **Detailed Explanation**: Standard React .gitignore patterns for node_modules, build artifacts, and environment files

### frontend/README.md
- **File Type**: Markdown Documentation
- **Purpose**: Frontend-specific setup and development instructions
- **Detailed Explanation**: Create React App documentation with custom additions for the chat interface

### frontend/public/index.html
- **File Type**: HTML Template
- **Purpose**: Main HTML template for the React application
- **Detailed Explanation** (44 lines):
  - **Lines 1-10**: Standard HTML5 doctype and head section setup
  - **Lines 15-25**: Meta tags for viewport, theme color, and SEO
  - **Lines 30-35**: Link tags for icons and manifest
  - **Lines 40-44**: Root div element where React application mounts

### frontend/public/manifest.json
- **File Type**: PWA Manifest
- **Purpose**: Progressive Web App configuration
- **Detailed Explanation**:
  - App name and branding information
  - Icon specifications for different sizes
  - Display mode and theme color settings
  - Start URL and scope configuration

### frontend/public/robots.txt
- **File Type**: SEO Configuration
- **Purpose**: Search engine crawler instructions
- **Detailed Explanation**: Allows all robots to access all content (User-agent: *, Allow: /)

### frontend/public/favicon.ico, logo192.png, logo512.png
- **File Type**: Image Assets (ICO/PNG)
- **Purpose**: Application icons for browser tabs, bookmarks, and PWA
- **Detailed Explanation**: Standard React logo icons in various sizes for different display contexts

### frontend/src/index.js
- **File Type**: JavaScript React Entry Point
- **Purpose**: Main React application bootstrap and rendering
- **Detailed Explanation** (18 lines):
  - **Lines 1-6**: Import statements for React, ReactDOM, and application components
  - **Lines 10-15**: React 18 createRoot API for rendering the application
  - **Lines 16-18**: Performance monitoring setup with reportWebVitals

### frontend/src/index.css
- **File Type**: CSS Global Styles
- **Purpose**: Application-wide styling and theme variables
- **Detailed Explanation** (14 lines):
  - **Lines 1-5**: Body font family and margin reset
  - **Lines 8-14**: Code font family for syntax highlighting

### frontend/src/App.js
- **File Type**: JavaScript React Component (JSX)
- **Purpose**: Root React component with routing and layout
- **Detailed Explanation** (135 lines):
  - **Lines 1-11**: Import statements for React, Material-UI, and custom components
  - **Lines 13-45**: Theme configuration with Aven brand colors
    - **Lines 16-20**: Primary color palette (black/white theme)
    - **Lines 25-30**: Background colors for different surfaces
    - **Lines 35-40**: Typography settings with custom font family
  - **Lines 50-75**: Component styling overrides for scrollbars and inputs
  - **Lines 80-100**: App component with responsive sidebar management
  - **Lines 105-130**: Layout structure with ChatProvider context wrapper
  - **Lines 131-135**: Component export and theme provider setup

### frontend/src/App.css
- **File Type**: CSS Stylesheet
- **Purpose**: Styles specific to the main App component
- **Detailed Explanation** (91 lines):
  - **Lines 1-20**: Global animations and transitions
  - **Lines 25-50**: Scrollbar customization for webkit browsers
  - **Lines 55-75**: Message animation keyframes and timing
  - **Lines 80-91**: Responsive design breakpoints and mobile optimizations

### frontend/src/App.test.js
- **File Type**: JavaScript Test File
- **Purpose**: Unit tests for the main App component
- **Detailed Explanation**: Basic Jest test checking if App component renders without crashing

### frontend/src/logo.svg, reportWebVitals.js, setupTests.js
- **File Type**: Default React Files
- **Purpose**: Standard Create React App utilities
- **Detailed Explanation**: Default React logo and performance monitoring utilities

### frontend/src/components/ChatInterface.js
- **File Type**: JavaScript React Component (JSX)
- **Purpose**: Main chat interface with message display and input
- **Detailed Explanation** (234 lines):
  - **Lines 1-15**: Import statements for React hooks, Material-UI, and custom components
  - **Lines 20-35**: Component initialization with chat context and refs
  - **Lines 40-55**: Auto-scroll functionality for new messages
  - **Lines 60-80**: Scroll behavior management and user interaction handling
  - **Lines 85-120**: Welcome screen rendering when no messages exist
  - **Lines 125-160**: Message list rendering with fade animations
  - **Lines 165-190**: Typing indicator display during AI response generation
  - **Lines 195-220**: Error handling and retry functionality
  - **Lines 225-234**: Input component integration and submission handling

### frontend/src/components/ChatInput.js
- **File Type**: JavaScript React Component (JSX)
- **Purpose**: User input field with send functionality
- **Detailed Explanation** (156 lines):
  - **Lines 1-10**: Import statements for React hooks and Material-UI components
  - **Lines 15-25**: State management for input value and submission
  - **Lines 30-50**: Input validation and character limit handling
  - **Lines 55-80**: Submit functionality with Enter key support
  - **Lines 85-120**: Material-UI TextField configuration with custom styling
  - **Lines 125-140**: Send button with loading state and icon
  - **Lines 145-156**: Accessibility features and keyboard navigation

### frontend/src/components/MessageBubble.js
- **File Type**: JavaScript React Component (JSX)
- **Purpose**: Individual message rendering with animations
- **Detailed Explanation** (290 lines):
  - **Lines 1-15**: Import statements for React, Material-UI, and markdown rendering
  - **Lines 20-40**: Component props handling and animation setup
  - **Lines 45-80**: Message content processing and markdown rendering
  - **Lines 85-120**: User vs assistant message styling differentiation
  - **Lines 125-160**: Avatar and timestamp display
  - **Lines 165-200**: Code syntax highlighting for technical responses
  - **Lines 205-240**: Copy to clipboard functionality
  - **Lines 245-270**: Slide-up animation implementation
  - **Lines 275-290**: Error state handling and retry options

### frontend/src/components/Sidebar.js
- **File Type**: JavaScript React Component (JSX)
- **Purpose**: Navigation sidebar with chat history and controls
- **Detailed Explanation** (250 lines):
  - **Lines 1-15**: Import statements for React hooks and Material-UI components
  - **Lines 20-40**: Component state management and chat context integration
  - **Lines 45-80**: New chat session creation and management
  - **Lines 85-120**: Chat history display with session selection
  - **Lines 125-160**: Session management (rename, delete, clear)
  - **Lines 165-200**: Settings and preferences panel
  - **Lines 205-230**: User profile and account information
  - **Lines 235-250**: Responsive design and mobile optimization

### frontend/src/components/TypingIndicator.js
- **File Type**: JavaScript React Component (JSX)
- **Purpose**: Animated typing indicator for AI responses
- **Detailed Explanation** (128 lines):
  - **Lines 1-10**: Import statements for React and Material-UI
  - **Lines 15-30**: Animation state management and timing control
  - **Lines 35-60**: Bounce animation implementation for dots
  - **Lines 65-90**: Styling configuration for professional appearance
  - **Lines 95-115**: Accessibility features and screen reader support
  - **Lines 120-128**: Component lifecycle and cleanup

### frontend/src/components/WelcomeScreen.js
- **File Type**: JavaScript React Component (JSX)
- **Purpose**: Initial welcome screen with Aven branding
- **Detailed Explanation** (206 lines):
  - **Lines 1-15**: Import statements for React, Material-UI, and animations
  - **Lines 20-50**: Component setup with suggestion loading
  - **Lines 55-90**: Aven branding and company information display
  - **Lines 95-130**: Suggested questions grid with interactive cards
  - **Lines 135-170**: Feature highlights and capabilities overview
  - **Lines 175-200**: Getting started instructions and tips
  - **Lines 201-206**: Fade-in animations and responsive design

### frontend/src/context/ChatContext.js
- **File Type**: JavaScript React Context (JSX)
- **Purpose**: React context for global chat state and actions
- **Detailed Explanation** (266 lines):
  - **Lines 1-10**: Import statements for React context, reducer, and API service
  - **Lines 15-25**: Initial state definition with sessions, messages, and loading states
  - **Lines 30-45**: Action types for state management (SET_SESSION, ADD_MESSAGE, etc.)
  - **Lines 50-120**: Reducer function handling all state transitions
    - **Lines 55-65**: Session management actions
    - **Lines 70-85**: Message addition and updates
    - **Lines 90-105**: Loading and error state handling
    - **Lines 110-120**: Suggestions and UI state management
  - **Lines 125-180**: Context provider component with action creators
  - **Lines 185-220**: sendMessage function with API integration
  - **Lines 225-250**: Session management functions (create, delete, clear)
  - **Lines 255-266**: Context hook and provider export

### frontend/src/services/api.js
- **File Type**: JavaScript API Service
- **Purpose**: Frontend service for backend API communication
- **Detailed Explanation** (140 lines):
  - **Lines 1-10**: Import statements for Axios HTTP client
  - **Lines 15-25**: API base configuration with timeout and headers
  - **Lines 30-60**: Request interceptors for authentication and logging
  - **Lines 65-90**: Response interceptors for error handling
  - **Lines 95-120**: Chat API methods (sendMessage, getSuggestions)
  - **Lines 125-140**: Admin API methods (loadKnowledge, getStats)

## Data Files

### data/scraped/aven-detailed-faq.json
- **File Type**: JSON Data
- **Purpose**: Comprehensive Aven FAQ data for knowledge base
- **Detailed Explanation** (102 lines):
  - **Lines 1-5**: Metadata including source URL and last updated timestamp
  - **Lines 6-102**: Array of FAQ objects with categories, questions, and detailed answers
    - **Categories**: "About Aven Card", "Rates and Fees", "Application Process", "Payments"
    - **Structure**: Each FAQ contains category, question, and comprehensive answer
    - **Content**: Covers HELOC functionality, interest rates, application process, payment calculations

### data/scraped/aven-support-data.json
- **File Type**: JSON Data
- **Purpose**: Aven customer support information and policies
- **Detailed Explanation** (45 lines):
  - **Lines 1-5**: Metadata and source information
  - **Lines 6-45**: Support policies, contact information, and operational procedures
    - **Support channels**: Phone, email, chat availability
    - **Business hours**: Customer service operating times
    - **Escalation procedures**: How complex issues are handled

### data/processed/
- **Directory Type**: Processed Data Storage
- **Purpose**: Storage for processed data ready for vector embedding
- **Detailed Explanation**: Currently empty, reserved for future processed documents and optimized embeddings

## Architecture Summary

This file structure implements a complete RAG-based AI customer support system with:

1. **Backend Services**: Modular Node.js services for AI integration, vector search, and knowledge management
2. **Frontend Interface**: Modern React application with Material-UI and smooth user experience
3. **Data Management**: JSON-based knowledge base with processing pipeline for vector embeddings
4. **Configuration**: Environment-based configuration for different deployment scenarios
5. **Documentation**: Comprehensive setup and usage documentation

The architecture follows microservices principles with clear separation of concerns, making it maintainable and scalable for production use. 