# 🏗️ Sarah - AI Support Agent Architecture

## System Overview

This diagram shows the complete architecture of Sarah, the AI customer support agent for Aven, including text chat, voice interactions, meeting scheduling, and knowledge management.

```mermaid
graph TB
    %% User Interface Layer
    subgraph "Frontend Layer"
        UI[React Frontend<br/>localhost:3000]
        subgraph "UI Components"
            ChatUI[Chat Interface]
            VoiceUI[Voice Button]
            TypingUI[Typing Indicator<br/>"Sarah is typing..."]
            WelcomeUI[Welcome Screen<br/>"Welcome! I'm Sarah 👋"]
        end
    end

    %% API Gateway Layer
    subgraph "API Gateway"
        Express[Express.js Server<br/>localhost:5001]
        subgraph "API Routes"
            ChatAPI[/api/chat]
            VapiAPI[/api/vapi]
            MeetingAPI[/api/meetings]
            AdminAPI[/api/admin]
            EvalAPI[/api/evaluation]
        end
    end

    %% Core Services Layer
    subgraph "Core Services"
        subgraph "AI & Knowledge"
            ChatService[Chat Service<br/>Message Processing]
            KnowledgeService[Knowledge Service<br/>RAG System]
            OpenAIService[OpenAI Service<br/>GPT-4 + Embeddings]
        end
        
        subgraph "Specialized Services"
            MeetingService[Meeting Service<br/>Slot Management]
            VapiService[Vapi Service<br/>Voice Integration]
            GuardrailsService[Guardrails Service<br/>Safety Checks]
        end
    end

    %% External Services
    subgraph "External APIs"
        OpenAI[OpenAI API<br/>GPT-4 + ada-002]
        Vapi[Vapi API<br/>Voice Assistant]
        Pinecone[Pinecone Vector DB<br/>Knowledge Base]
    end

    %% Data Layer
    subgraph "Data Sources"
        subgraph "Aven Knowledge"
            FAQData[FAQ Data<br/>JSON Files]
            ProductData[Product Data<br/>Scraped Content]
            EnhancedData[Enhanced Data<br/>Detailed Info]
        end
        
        subgraph "Meeting Data"
            Slots[Available Slots<br/>30 Days Ahead]
            Bookings[Meeting Bookings<br/>In-Memory Storage]
        end
    end

    %% Connections - Frontend to API
    UI --> Express
    ChatUI --> ChatAPI
    VoiceUI --> VapiAPI

    %% Connections - API to Services
    ChatAPI --> ChatService
    VapiAPI --> VapiService
    MeetingAPI --> MeetingService

    %% Connections - Services to External APIs
    OpenAIService --> OpenAI
    VapiService --> Vapi
    KnowledgeService --> Pinecone

    %% Connections - Services to Data
    KnowledgeService --> FAQData
    KnowledgeService --> ProductData
    KnowledgeService --> EnhancedData
    MeetingService --> Slots
    MeetingService --> Bookings

    %% Internal Service Connections
    ChatService --> KnowledgeService
    ChatService --> GuardrailsService
    KnowledgeService --> OpenAIService
    VapiService --> GuardrailsService

    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef api fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
    classDef service fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px
    classDef external fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef data fill:#fce4ec,stroke:#880e4f,stroke-width:2px

    class UI,ChatUI,VoiceUI,TypingUI,WelcomeUI frontend
    class Express,ChatAPI,VapiAPI,MeetingAPI,AdminAPI,EvalAPI api
    class ChatService,KnowledgeService,OpenAIService,MeetingService,VapiService,GuardrailsService service
    class OpenAI,Vapi,Pinecone external
    class FAQData,ProductData,EnhancedData,Slots,Bookings data
```

## Detailed Component Architecture

```mermaid
graph LR
    %% User Interaction Flow
    subgraph "User Interaction"
        User[👤 User]
        TextInput[💬 Text Chat]
        VoiceInput[🎙️ Voice Chat]
    end

    %% Frontend Processing
    subgraph "Frontend Processing"
        ReactApp[React App<br/>Material-UI]
        ChatContext[Chat Context<br/>State Management]
        VapiContext[Vapi Context<br/>Voice State]
    end

    %% Backend Processing
    subgraph "Backend Processing"
        subgraph "Request Handling"
            ExpressRouter[Express Router]
            Middleware[Security Middleware<br/>Rate Limiting, CORS]
        end
        
        subgraph "AI Processing"
            MessageProcessor[Message Processor<br/>Safety Checks]
            RAGEngine[RAG Engine<br/>Knowledge Retrieval]
            FunctionCaller[Function Caller<br/>Meeting Scheduling]
        end
        
        subgraph "Response Generation"
            ResponseBuilder[Response Builder<br/>Natural Language]
            ContextManager[Context Manager<br/>Conversation History]
        end
    end

    %% Data Flow
    subgraph "Data Flow"
        VectorDB[(Pinecone<br/>Vector Database)]
        KnowledgeBase[(Knowledge Base<br/>Aven Data)]
        MeetingDB[(Meeting Data<br/>Slots & Bookings)]
    end

    %% External Services
    subgraph "External Services"
        OpenAIAPI[OpenAI API<br/>GPT-4 + Embeddings]
        VapiAPI[Vapi API<br/>Voice Processing]
    end

    %% User Flow
    User --> TextInput
    User --> VoiceInput
    
    TextInput --> ReactApp
    VoiceInput --> ReactApp
    
    ReactApp --> ChatContext
    ReactApp --> VapiContext
    
    ChatContext --> ExpressRouter
    VapiContext --> ExpressRouter
    
    ExpressRouter --> Middleware
    Middleware --> MessageProcessor
    
    MessageProcessor --> RAGEngine
    RAGEngine --> FunctionCaller
    FunctionCaller --> ResponseBuilder
    
    ResponseBuilder --> ContextManager
    ContextManager --> ReactApp
    
    %% Data Connections
    RAGEngine --> VectorDB
    RAGEngine --> KnowledgeBase
    FunctionCaller --> MeetingDB
    
    %% External API Connections
    RAGEngine --> OpenAIAPI
    VapiContext --> VapiAPI

    %% Styling
    classDef user fill:#ffebee,stroke:#c62828,stroke-width:2px
    classDef frontend fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef backend fill:#f1f8e9,stroke:#33691e,stroke-width:2px
    classDef data fill:#fce4ec,stroke:#ad1457,stroke-width:2px
    classDef external fill:#fff8e1,stroke:#f57f17,stroke-width:2px

    class User,TextInput,VoiceInput user
    class ReactApp,ChatContext,VapiContext frontend
    class ExpressRouter,Middleware,MessageProcessor,RAGEngine,FunctionCaller,ResponseBuilder,ContextManager backend
    class VectorDB,KnowledgeBase,MeetingDB data
    class OpenAIAPI,VapiAPI external
```

## Meeting Scheduling Flow

```mermaid
sequenceDiagram
    participant U as User
    participant S as Sarah (AI)
    participant MS as Meeting Service
    participant DB as Meeting Database

    U->>S: "Can you schedule a meeting?"
    S->>S: Detect meeting intent
    S->>MS: get_available_slots()
    MS->>DB: Query available slots
    DB-->>MS: Return slots (30 days)
    MS-->>S: Available slots data
    S->>U: "I found 180 available slots. Here are the next few options..."

    U->>S: "I want tomorrow at 10 AM. My name is John Doe, email is john@example.com, phone is (555) 123-4567."
    S->>S: Extract user information
    S->>MS: schedule_meeting(slotId, name, email, phone, type)
    MS->>DB: Check slot availability
    DB-->>MS: Slot is available
    MS->>DB: Create meeting booking
    MS->>DB: Mark slot as unavailable
    DB-->>MS: Meeting created with confirmation code
    MS-->>S: Meeting confirmation data
    S->>U: "Great! I've scheduled your consultation meeting with Aven for tomorrow at 10:00 AM. Your confirmation code is ABC123..."
```

## Knowledge Base Architecture

```mermaid
graph TB
    subgraph "Knowledge Sources"
        subgraph "Aven Data"
            FAQ[FAQ Data<br/>20+ Categories]
            Products[Product Data<br/>HELOC + Card Info]
            Enhanced[Enhanced Data<br/>Detailed Content]
        end
        
        subgraph "Processing"
            Scraper[Data Scraper<br/>Web Content]
            Processor[Content Processor<br/>Chunking + Cleaning]
        end
    end

    subgraph "Vector Database"
        PineconeDB[(Pinecone<br/>Vector Database)]
        subgraph "Indexes"
            Embeddings[Text Embeddings<br/>ada-002]
            Metadata[Metadata<br/>Categories, Sources]
        end
    end

    subgraph "Retrieval System"
        RAG[RAG Engine<br/>Retrieval-Augmented Generation]
        Search[Semantic Search<br/>Vector Similarity]
        Context[Context Builder<br/>Relevant Information]
    end

    subgraph "AI Response"
        GPT4[GPT-4<br/>Response Generation]
        FunctionCall[Function Calling<br/>Meeting Scheduling]
        Safety[Safety Checks<br/>Guardrails]
    end

    %% Data Flow
    FAQ --> Processor
    Products --> Processor
    Enhanced --> Processor
    Scraper --> Enhanced
    
    Processor --> Embeddings
    Embeddings --> PineconeDB
    Metadata --> PineconeDB
    
    PineconeDB --> Search
    Search --> Context
    Context --> RAG
    RAG --> GPT4
    
    GPT4 --> FunctionCall
    GPT4 --> Safety

    %% Styling
    classDef source fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef process fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef storage fill:#fce4ec,stroke:#ad1457,stroke-width:2px
    classDef ai fill:#fff3e0,stroke:#e65100,stroke-width:2px

    class FAQ,Products,Enhanced source
    class Scraper,Processor,RAG,Search,Context process
    class PineconeDB,Embeddings,Metadata storage
    class GPT4,FunctionCall,Safety ai
```

## Security & Guardrails Architecture

```mermaid
graph LR
    subgraph "Input Validation"
        RateLimit[Rate Limiting<br/>100 req/15min]
        CORS[CORS Protection<br/>localhost:3000]
        Validation[Input Validation<br/>Message Length, Format]
    end

    subgraph "Content Safety"
        Toxicity[Toxicity Detection<br/>Inappropriate Content]
        PII[PII Detection<br/>SSN, Credit Cards]
        Legal[Legal Advice Filter<br/>Financial Guidance]
        Medical[Medical Advice Filter<br/>Health Information]
        Political[Political Content Filter<br/>Sensitive Topics]
    end

    subgraph "Response Safety"
        AccountInfo[Account Info Filter<br/>Personal Data]
        Impersonation[Impersonation Detection<br/>Fake Identity]
        Spam[Spam Detection<br/>Repeated Content]
    end

    subgraph "Action Safety"
        FunctionGuard[Function Call Guard<br/>Meeting Scheduling]
        APIProtection[API Protection<br/>External Calls]
        ErrorHandling[Error Handling<br/>Graceful Failures]
    end

    %% Flow
    RateLimit --> Toxicity
    CORS --> PII
    Validation --> Legal
    
    Toxicity --> FunctionGuard
    PII --> APIProtection
    Legal --> ErrorHandling
    Medical --> FunctionGuard
    Political --> APIProtection
    AccountInfo --> ErrorHandling
    Impersonation --> FunctionGuard
    Spam --> APIProtection

    %% Styling
    classDef input fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef content fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef response fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef action fill:#fff3e0,stroke:#f57c00,stroke-width:2px

    class RateLimit,CORS,Validation input
    class Toxicity,PII,Legal,Medical,Political content
    class AccountInfo,Impersonation,Spam response
    class FunctionGuard,APIProtection,ErrorHandling action
```

## Technology Stack

```mermaid
graph TB
    subgraph "Frontend"
        React[React 18<br/>Functional Components]
        MaterialUI[Material-UI<br/>Design System]
        Context[React Context<br/>State Management]
        Hooks[Custom Hooks<br/>API Integration]
    end

    subgraph "Backend"
        NodeJS[Node.js<br/>Runtime Environment]
        Express[Express.js<br/>Web Framework]
        Middleware[Custom Middleware<br/>Security, Validation]
    end

    subgraph "AI & ML"
        OpenAI[OpenAI API<br/>GPT-4 + Embeddings]
        Pinecone[Pinecone<br/>Vector Database]
        RAG[RAG System<br/>Retrieval-Augmented Generation]
    end

    subgraph "Voice"
        Vapi[Vapi AI<br/>Voice Assistant]
        ElevenLabs[ElevenLabs<br/>Voice Synthesis]
        WebRTC[WebRTC<br/>Real-time Communication]
    end

    subgraph "Data & Storage"
        JSON[JSON Files<br/>Knowledge Base]
        Memory[In-Memory Storage<br/>Meetings, Sessions]
        VectorDB[Vector Database<br/>Semantic Search]
    end

    subgraph "Security"
        Helmet[Helmet.js<br/>Security Headers]
        RateLimit[Rate Limiting<br/>DDoS Protection]
        CORS[CORS<br/>Cross-Origin Protection]
    end

    %% Connections
    React --> MaterialUI
    MaterialUI --> Context
    Context --> Hooks
    
    NodeJS --> Express
    Express --> Middleware
    
    OpenAI --> Pinecone
    Pinecone --> RAG
    
    Vapi --> ElevenLabs
    ElevenLabs --> WebRTC
    
    JSON --> VectorDB
    Memory --> VectorDB
    
    Helmet --> RateLimit
    RateLimit --> CORS

    %% Styling
    classDef frontend fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef backend fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef ai fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    classDef voice fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    classDef data fill:#fce4ec,stroke:#ad1457,stroke-width:2px
    classDef security fill:#ffebee,stroke:#d32f2f,stroke-width:2px

    class React,MaterialUI,Context,Hooks frontend
    class NodeJS,Express,Middleware backend
    class OpenAI,Pinecone,RAG ai
    class Vapi,ElevenLabs,WebRTC voice
    class JSON,Memory,VectorDB data
    class Helmet,RateLimit,CORS security
```

## Key Features Highlighted

- **🤖 AI-Powered**: GPT-4 with RAG for accurate responses
- **🎙️ Voice Integration**: Vapi for voice conversations
- **📅 Meeting Scheduling**: Automated booking with function calling
- **🛡️ Security**: Comprehensive guardrails and safety checks
- **📱 Responsive UI**: Modern React interface with Material-UI
- **🔍 Knowledge Base**: Vector search through Aven's data
- **⚡ Real-time**: WebSocket support for live interactions
- **📊 Analytics**: Meeting statistics and conversation tracking 