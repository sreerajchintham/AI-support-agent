# Project Structure Documentation

## Project Overview
This document provides a comprehensive overview of the AI Customer Support Agent project structure. The project is organized into distinct directories for backend services, frontend interface, data management, and configuration.

## Directory Tree Structure

```
AI-support-agent/
├── .git/                           # Git version control
├── .gitignore                      # Git ignore patterns
├── package.json                    # Root project configuration
├── package-lock.json               # Root dependency lock file
├── README.md                       # Project documentation
├── node_modules/                   # Root dependencies
│
├── backend/                        # Backend server and services
│   ├── package.json                # Backend dependencies and scripts
│   ├── package-lock.json           # Backend dependency lock file
│   ├── config.js                   # Backend configuration file
│   ├── init-knowledge-base.js      # Knowledge base initialization script
│   ├── env-setup.md                # Environment setup instructions
│   ├── node_modules/               # Backend dependencies
│   ├── scripts/
│   │   └── setup.js                # Project setup automation script
│   └── src/
│       ├── app.js                  # Main Express application entry point
│       ├── routes/
│       │   ├── chat.js             # Chat API endpoints
│       │   └── admin.js            # Admin API endpoints
│       ├── services/
│       │   ├── openaiService.js    # OpenAI API integration service
│       │   ├── pineconeService.js  # Pinecone vector database service
│       │   ├── knowledgeService.js # Knowledge base management service
│       │   └── chatService.js      # Chat logic and RAG orchestration
│       ├── middleware/             # Express middleware (empty)
│       └── utils/                  # Utility functions (empty)
│
├── frontend/                       # React frontend application
│   ├── package.json                # Frontend dependencies and scripts
│   ├── package-lock.json           # Frontend dependency lock file
│   ├── .gitignore                  # Frontend-specific git ignore
│   ├── README.md                   # Frontend documentation
│   ├── node_modules/               # Frontend dependencies
│   ├── public/
│   │   ├── index.html              # Main HTML template
│   │   ├── manifest.json           # PWA manifest
│   │   ├── robots.txt              # Search engine robots file
│   │   ├── favicon.ico             # Website favicon
│   │   ├── logo192.png             # App logo (192px)
│   │   └── logo512.png             # App logo (512px)
│   └── src/
│       ├── index.js                # React application entry point
│       ├── index.css               # Global styles
│       ├── App.js                  # Main React application component
│       ├── App.css                 # Main application styles
│       ├── App.test.js             # App component tests
│       ├── logo.svg                # React logo SVG
│       ├── reportWebVitals.js      # Performance monitoring
│       ├── setupTests.js           # Test configuration
│       ├── components/
│       │   ├── ChatInterface.js    # Main chat interface component
│       │   ├── ChatInput.js        # Chat input component
│       │   ├── MessageBubble.js    # Message display component
│       │   ├── Sidebar.js          # Navigation sidebar component
│       │   ├── TypingIndicator.js  # Typing animation component
│       │   └── WelcomeScreen.js    # Welcome/landing screen
│       ├── context/
│       │   └── ChatContext.js      # React context for chat state
│       └── services/
│           └── api.js              # Frontend API service layer
│
└── data/                           # Data files and knowledge base
    ├── scraped/
    │   ├── aven-detailed-faq.json  # Detailed FAQ data from Aven
    │   └── aven-support-data.json  # Support information data
    └── processed/                  # Processed data directory (empty)
```

## Comprehensive File Mapping Table

| File Path | Purpose | Language/Type | Detailed Description |
|-----------|---------|---------------|---------------------|
| **🏠 Root Level Files** |
| `package.json` | Monorepo Configuration | JSON | **Master package configuration file** that orchestrates the entire full-stack application. Contains scripts for concurrent development (`npm run dev` runs both frontend and backend simultaneously), dependency management across all modules, and production build commands. Includes metadata for the AI Support Agent project with keywords for npm discoverability (ai, customer-support, rag, pinecone, aven, chatbot). Manages shared dependencies like Pinecone client and Axios for cross-module usage. |
| `package-lock.json` | Dependency Lock File | JSON | **Critical security and consistency file** that locks exact versions of all dependencies and their sub-dependencies across the entire project tree. Prevents version drift between development environments and ensures reproducible builds. Contains over 23KB of dependency tree information for both root and nested package dependencies. Essential for production deployment consistency. |
| `README.md` | Project Documentation | Markdown | **Comprehensive 299-line documentation hub** covering complete project architecture, setup instructions, feature specifications, and technical requirements. Includes ASCII architecture diagrams, tech stack details, installation guides for OpenAI and Pinecone APIs, development workflow instructions, and future feature roadmap. Primary resource for developer onboarding and system understanding. |
| **⚙️ Backend Service Files** |
| `backend/package.json` | Backend Dependencies | JSON | **Backend-specific dependency management** with 47 lines of configuration including Express.js web framework, security middleware (helmet, CORS), rate limiting (express-rate-limit), AI integrations (OpenAI SDK), vector database client (Pinecone), UUID generation, and development tools (nodemon). Defines backend-specific scripts for development server, production start, and testing commands with specific Node.js version requirements. |
| `backend/config.js` | Environment Configuration | JavaScript | **Centralized configuration hub** managing all environment variables, API keys, and system settings. Handles OpenAI API key authentication, Pinecone database configuration (API key, environment, index name), server port settings, rate limiting parameters (15-minute windows, 100 requests max), CORS origins for frontend access, and future Vapi voice integration settings. Provides fallback values for development environments. |
| `backend/init-knowledge-base.js` | Database Initialization | JavaScript | **One-time setup script** for populating the Pinecone vector database with Aven's knowledge base. Orchestrates the complete data pipeline: reads JSON files from data directory, processes documents through knowledge service, generates embeddings using OpenAI, uploads vectors to Pinecone, and provides detailed console feedback on loading progress. Critical for initial system deployment and knowledge base updates. |
| `backend/env-setup.md` | Setup Instructions | Markdown | **Developer onboarding documentation** with 59 lines of step-by-step environment configuration. Covers API key acquisition from OpenAI and Pinecone, environment variable setup, database index creation, and troubleshooting common configuration issues. Includes security best practices for credential management and development vs production environment differences. |
| `backend/scripts/setup.js` | Automation Script | JavaScript | **200-line automated setup system** that streamlines project initialization. Validates Node.js version compatibility, creates configuration files from templates, installs all project dependencies (backend, frontend, root), initializes Pinecone database indexes, loads knowledge base data, and performs end-to-end system validation. Reduces setup time from hours to minutes for new developers. |
| `backend/src/app.js` | Express Server Core | JavaScript | **Main Express.js application** (67 lines) serving as the backbone of the AI support system. Implements comprehensive security middleware (Helmet for HTTP headers), rate limiting protection, CORS configuration for frontend access, request logging with Morgan, JSON body parsing with 10MB limits, health check endpoints, API route mounting, global error handling, and 404 management. Runs on configurable port with startup logging. |
| `backend/src/routes/chat.js` | Chat API Endpoints | JavaScript | **Primary chat functionality router** (107 lines) handling all user interactions. Provides POST endpoint for message processing with input validation and session management, GET endpoint for suggested questions, session retrieval for conversation history, and session deletion for privacy. Integrates with chat service for RAG pipeline orchestration and includes comprehensive error handling and response formatting. |
| `backend/src/routes/admin.js` | Admin API Routes | JavaScript | **Administrative interface** (138 lines) for knowledge base management and system control. Provides endpoints for loading new knowledge base content, retrieving system statistics, performing direct search queries for testing, clearing database content, and file processing utilities. Includes authentication middleware and validation for administrative operations. Essential for content management and system maintenance. |
| `backend/src/services/openaiService.js` | OpenAI Integration | JavaScript | **AI service layer** (186 lines) managing all OpenAI API interactions. Handles GPT-4 chat completions with temperature control and context management, text-embedding-3-large vector generation with 1024 dimensions for Pinecone compatibility, batch processing for multiple embeddings, retry logic for API failures, rate limiting compliance, and response formatting. Core component of the RAG system's generation capabilities. |
| `backend/src/services/pineconeService.js` | Vector Database Service | JavaScript | **Vector database operations** (169 lines) managing all Pinecone interactions. Provides vector insertion and updates with metadata attachment, semantic similarity search with configurable filters, batch processing for bulk operations, index statistics and health monitoring, vector cleanup utilities, and namespace management. Critical for the retrieval component of the RAG architecture. |
| `backend/src/services/knowledgeService.js` | Knowledge Processing | JavaScript | **Comprehensive knowledge management system** (397 lines) handling the complete document processing pipeline. Implements intelligent text chunking with overlap for context preservation, document processing with metadata extraction, bulk loading from JSON files, semantic search coordination, context generation for prompts, and document statistics tracking. Central orchestrator of the RAG system's knowledge base operations. |
| `backend/src/services/chatService.js` | RAG Orchestration | JavaScript | **Core chat intelligence** (229 lines) coordinating the complete RAG pipeline. Manages conversation sessions with in-memory storage, orchestrates context retrieval from Pinecone, constructs prompts with system messages and relevant context, calls OpenAI for response generation, handles conversation history, provides fallback responses when services are unavailable, and manages session cleanup and statistics. The brain of the AI support system. |
| **🎨 Frontend Application Files** |
| `frontend/package.json` | React Configuration | JSON | **Frontend dependency management** (49 lines) for the React-based chat interface. Includes React 18 with hooks, Material-UI component library for professional styling, Axios for API communication, React Router for navigation, UUID for session management, and testing utilities (Jest, React Testing Library). Defines build scripts for development server, production builds, and optimization. Supports modern browsers with ES6+ features. |
| `frontend/.gitignore` | Version Control Rules | Text | **Git exclusion patterns** (24 lines) specifically configured for React applications. Excludes build artifacts (build/, dist/), dependency directories (node_modules/), environment files (.env variants), IDE configurations, logs, and temporary files. Prevents sensitive configuration and large binary files from being committed to version control while maintaining clean repository structure. |
| `frontend/README.md` | Frontend Documentation | Markdown | **Create React App documentation** (71 lines) enhanced with project-specific setup instructions. Covers development server startup, build processes, testing procedures, deployment guidelines, and React-specific development practices. Includes custom modifications for the AI chat interface, Material-UI integration notes, and API connection configuration for the backend services. |
| `frontend/public/index.html` | HTML Template | HTML | **Single-page application foundation** (44 lines) serving as the mounting point for the React application. Includes responsive viewport meta tags, theme color configuration for Aven branding, Progressive Web App manifest links, favicon references, and accessibility features. Contains the root div element where the entire React component tree renders. Optimized for mobile and desktop viewing. |
| `frontend/public/manifest.json` | PWA Configuration | JSON | **Progressive Web App metadata** (26 lines) enabling mobile app-like functionality. Defines app name and branding for Aven support agent, icon specifications for various screen densities (192px, 512px), display mode settings, theme colors matching Aven's white/black branding, start URL configuration, and scope definitions. Allows users to install the chat interface as a native-like mobile app. |
| `frontend/public/robots.txt` | SEO Configuration | Text | **Search engine crawler instructions** (4 lines) controlling how search engines index the application. Currently allows all robots to access all content, appropriate for a customer support interface that should be discoverable. Can be modified to restrict certain paths or crawler behaviors based on business requirements and privacy considerations. |
| `frontend/public/favicon.ico` | Browser Icon | ICO | **Website identification icon** (3.8KB) displayed in browser tabs, bookmarks, and browser favorites. Multi-resolution ICO format supporting various display contexts from 16x16px to 64x64px. Provides visual brand recognition when users have multiple tabs open or save the application as a bookmark. Currently uses React default logo but should be updated with Aven branding. |
| `frontend/public/logo192.png` | PWA Icon | PNG | **Progressive Web App icon** (5.2KB) for medium-density displays and Android home screens. 192x192 pixel PNG format optimized for mobile devices when users install the chat interface as a web app. Part of the PWA icon set that provides consistent branding across different platforms and display densities. Should reflect Aven's visual identity. |
| `frontend/public/logo512.png` | PWA Icon | PNG | **High-resolution PWA icon** (9.4KB) for high-density displays and splash screens. 512x512 pixel PNG format used by iOS, Android, and desktop PWA installations. Provides crisp branding for users who install the support chat as a native-like application. Essential for professional appearance in app launchers and operating system integrations. |
| `frontend/src/index.js` | React Bootstrap | JavaScript | **Application entry point** (18 lines) initializing the React application using React 18's createRoot API. Imports global styles, wraps the App component in StrictMode for development warnings, mounts the application to the DOM, and configures performance monitoring with reportWebVitals. Foundation for the entire frontend application lifecycle and rendering pipeline. |
| `frontend/src/index.css` | Global Styles | CSS | **Application-wide styling** (14 lines) defining base typography and layout resets. Sets font family hierarchy prioritizing modern system fonts, removes default margins for consistent cross-browser appearance, and establishes baseline styles for code elements. Foundation for the custom Aven white/black theme implemented in component-level styles. |
| `frontend/src/App.js` | Main Component | JavaScript (JSX) | **Root React component** (135 lines) orchestrating the entire chat interface. Implements Aven-inspired Material-UI theme with white/black color palette, manages responsive sidebar behavior for mobile and desktop, provides ChatProvider context wrapper for global state, handles responsive design with breakpoint detection, and coordinates between ChatInterface and Sidebar components. Central hub for application layout and theming. |
| `frontend/src/App.css` | Component Styles | CSS | **Application-specific styling** (91 lines) implementing custom animations, scrollbar designs, and responsive behaviors. Defines slide-up animations for messages, webkit scrollbar customization for consistent appearance across browsers, mobile optimization breakpoints, and transition effects for smooth user interactions. Complements Material-UI theme with Aven-specific visual enhancements. |
| `frontend/src/App.test.js` | Application Tests | JavaScript | **Basic React testing** (9 lines) using Jest and React Testing Library. Verifies that the main App component renders without errors and provides foundation for expanding test coverage. Includes testing utilities setup and serves as template for additional component and integration tests. Important for maintaining code quality and preventing regressions. |
| `frontend/src/logo.svg` | React Logo | SVG | **Default React branding** (2.6KB vector graphic) used during development and as placeholder for custom branding. Scalable vector format suitable for various display sizes and resolutions. Should be replaced with Aven-specific logomark to maintain consistent brand identity throughout the application interface. |
| `frontend/src/reportWebVitals.js` | Performance Monitoring | JavaScript | **Web performance tracking** (14 lines) measuring Core Web Vitals metrics including First Contentful Paint, Largest Contentful Paint, First Input Delay, and Cumulative Layout Shift. Provides insights into user experience quality and application performance for optimization purposes. Can be configured to send metrics to analytics services. |
| `frontend/src/setupTests.js` | Test Configuration | JavaScript | **Jest testing framework setup** (6 lines) configuring React Testing Library for component testing. Extends Jest matchers with DOM-specific assertions, sets up testing utilities, and provides foundation for comprehensive test suites. Essential for maintaining code quality and ensuring component reliability across updates. |
| `frontend/src/components/ChatInterface.js` | Main Chat UI | JavaScript (JSX) | **Primary chat interface component** (234 lines) providing the core user experience. Manages message display with auto-scrolling, integrates typing indicators during AI responses, handles error states with retry functionality, implements smooth fade animations for message appearance, coordinates with ChatInput for message submission, and manages responsive design for mobile and desktop. Central component users interact with for AI conversations. |
| `frontend/src/components/ChatInput.js` | Message Input | JavaScript (JSX) | **User input component** (156 lines) handling message composition and submission. Features real-time character counting, Enter key submission with Shift+Enter for line breaks, input validation and sanitization, loading state management during message processing, Material-UI TextField integration with custom styling, and accessibility features for keyboard navigation. Critical for user interaction and message quality. |
| `frontend/src/components/MessageBubble.js` | Message Display | JavaScript (JSX) | **Individual message rendering** (290 lines) with sophisticated presentation features. Implements ChatGPT-style message bubbles with user/assistant differentiation, markdown rendering for rich text formatting, syntax highlighting for code blocks, copy-to-clipboard functionality, slide-up animations for message entrance, timestamp display, and avatar integration. Provides professional chat experience matching modern AI interfaces. |
| `frontend/src/components/Sidebar.js` | Navigation Panel | JavaScript (JSX) | **Responsive navigation sidebar** (250 lines) providing chat session management and application controls. Features chat history with session selection, new conversation creation, session renaming and deletion, settings and preferences access, responsive drawer behavior (temporary overlay on mobile, persistent on desktop), and smooth transition animations. Essential for multi-conversation management and user workflow. |
| `frontend/src/components/TypingIndicator.js` | Loading Animation | JavaScript (JSX) | **AI response animation** (128 lines) providing visual feedback during message processing. Implements animated bouncing dots with staggered timing, professional styling matching Aven theme, configurable minimum display duration (800ms) for smooth transitions, accessibility support for screen readers, and cleanup on component unmount. Enhances user experience by indicating system activity and response preparation. |
| `frontend/src/components/WelcomeScreen.js` | Landing Interface | JavaScript (JSX) | **Initial user experience** (206 lines) providing application introduction and onboarding. Features Aven branding and company information, interactive suggested question cards with hover effects, capability highlights and feature overview, getting started instructions and usage tips, fade-in animations for professional appearance, and responsive grid layout. Creates positive first impression and guides user engagement. |
| `frontend/src/context/ChatContext.js` | State Management | JavaScript (JSX) | **Global state orchestration** (266 lines) managing entire application state and actions. Implements React Context pattern with useReducer for complex state management, handles message history and session persistence, coordinates API calls through service layer, manages loading states and error handling, provides action creators for all UI interactions, and maintains conversation continuity across components. Foundation for application data flow and user experience consistency. |
| `frontend/src/services/api.js` | API Communication | JavaScript | **Frontend service layer** (140 lines) abstracting all backend communication. Implements Axios HTTP client with configurable timeouts and headers, provides request/response interceptors for error handling and logging, defines typed API methods for chat and admin operations, handles authentication and session management, implements retry logic for failed requests, and formats responses for frontend consumption. Critical bridge between UI and backend services. |
| **📊 Knowledge Base Data Files** |
| `data/scraped/aven-detailed-faq.json` | Core Knowledge Base | JSON | **Comprehensive Aven FAQ dataset** (102 lines, 8.7KB) containing structured question-answer pairs covering all aspects of Aven's financial products. Organized by categories including "About Aven Card", "Rates and Fees", "Application Process", and "Payments". Contains detailed explanations of HELOC functionality, variable rate mechanics, underwriting processes, payment calculations, and customer policies. Primary source for AI responses about Aven services and the foundation of the RAG system's knowledge retrieval. |
| `data/scraped/aven-support-data.json` | Support Policies | JSON | **Customer support operational data** (45 lines, 1.7KB) defining support channels, business hours, escalation procedures, and customer service policies. Includes contact information for various support methods (phone, email, chat), availability schedules, response time expectations, and issue resolution workflows. Essential for AI responses about customer service procedures and support availability. Ensures consistent information delivery matching actual Aven support practices. |

## Directory Purposes

### `/backend`
Contains the Node.js/Express server that handles:
- API endpoints for chat functionality
- RAG (Retrieval-Augmented Generation) system
- Integration with OpenAI GPT-4 and Pinecone vector database
- Knowledge base management and embedding processing

### `/frontend` 
Contains the React application providing:
- Modern chat interface with Material-UI components
- Real-time messaging with typing indicators
- Responsive design with Aven branding
- Chat history and session management

### `/data`
Contains knowledge base data:
- Raw scraped data from Aven sources
- Processed data ready for vector embedding
- FAQ and support information in JSON format

### Root Level
Project configuration and documentation:
- Package management for the entire monorepo
- Project documentation and setup instructions
- Git configuration and version control 