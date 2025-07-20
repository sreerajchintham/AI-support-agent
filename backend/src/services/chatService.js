const knowledgeService = require('./knowledgeService');
const openaiService = require('./openaiService');
const pineconeService = require('./pineconeService');
const guardrailsService = require('./guardrailsService');
const { v4: uuidv4 } = require('uuid');

class ChatService {
  constructor() {
    this.conversations = new Map(); // In-memory storage for demo (use Redis/DB in production)
    this.initialized = false;
    this.agentName = 'Sarah'; // Agent name
  }

  async initialize() {
    if (this.initialized) return;
    
    await knowledgeService.initialize();
    await guardrailsService.initialize();
    this.initialized = true;
    
    console.log('✅ Chat service initialized');
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  // Use comprehensive guardrails service
  async performSafetyChecks(message, context = {}) {
    return await guardrailsService.performSafetyChecks(message, context);
  }

  // Get or create a conversation session
  getConversation(sessionId) {
    if (!sessionId) {
      sessionId = uuidv4();
    }
    
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, {
        id: sessionId,
        messages: [],
        createdAt: new Date(),
        lastActivity: new Date()
      });
    }
    
    return this.conversations.get(sessionId);
  }

  // Add message to conversation history
  addToConversation(sessionId, role, content, metadata = {}) {
    const conversation = this.getConversation(sessionId);
    
    conversation.messages.push({
      role,
      content,
      timestamp: new Date(),
      ...metadata
    });
    
    conversation.lastActivity = new Date();
    
    // Keep only last 10 messages to prevent context length issues
    if (conversation.messages.length > 10) {
      conversation.messages = conversation.messages.slice(-10);
    }
    
    return conversation;
  }

  // Get conversation history formatted for OpenAI
  getFormattedHistory(sessionId, excludeSystem = true) {
    const conversation = this.getConversation(sessionId);
    
    return conversation.messages
      .filter(msg => !excludeSystem || msg.role !== 'system')
      .map(msg => ({
        role: msg.role,
        content: msg.content
      }));
  }

  // Process incoming message and generate response
  async processMessage(message, sessionId = null) {
    await this.ensureInitialized();
    
    try {
      // Enhanced safety checks with comprehensive guardrails
      const safetyChecks = await this.performSafetyChecks(message, { sessionId });
      if (!safetyChecks.overallSafe) {
        // Log safety violations for monitoring
        guardrailsService.logSafetyViolation(safetyChecks.issues, message, sessionId || 'unknown');
        
        // Generate appropriate response
        const safetyResponse = guardrailsService.generateSafetyResponse(safetyChecks.issues, this.agentName);
        
        return {
          message: safetyResponse,
          sessionId: sessionId || uuidv4(),
          sources: [],
          safety: safetyChecks,
          agentName: this.agentName
        };
      }

      // Get or create conversation
      const conversation = this.getConversation(sessionId);
      sessionId = conversation.id;

      // Add user message to history
      this.addToConversation(sessionId, 'user', message);

      // Get conversation history
      const conversationHistory = this.getFormattedHistory(sessionId);

      // Get AI response with RAG
      const ragResponse = await knowledgeService.getAIResponse(message, conversationHistory, this.agentName);

      // Add assistant response to history
      this.addToConversation(sessionId, 'assistant', ragResponse.message, {
        sources: ragResponse.sources
      });

      console.log(`💬 ${this.agentName} processed message for session ${sessionId}`);

      return {
        message: ragResponse.message,
        sessionId,
        sources: ragResponse.sources,
        safety: safetyChecks,
        agentName: this.agentName
      };

    } catch (error) {
      console.error('❌ Failed to process message:', error);
      
      // Fallback response
      return {
        message: `Hi, I'm ${this.agentName}! I'm sorry, I'm experiencing technical difficulties right now. Please try again in a moment, or contact Aven support directly at (888) 966-4655 or support@aven.com.`,
        sessionId: sessionId || uuidv4(),
        sources: [],
        error: error.message,
        agentName: this.agentName
      };
    }
  }

  // Get chat history for a session
  async getChatHistory(sessionId) {
    if (!this.conversations.has(sessionId)) {
      return [];
    }

    const conversation = this.conversations.get(sessionId);
    return conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
      sources: msg.sources || []
    }));
  }

  // Clear chat history for a session
  async clearChatHistory(sessionId) {
    if (this.conversations.has(sessionId)) {
      const conversation = this.conversations.get(sessionId);
      conversation.messages = [];
      conversation.lastActivity = new Date();
    }
  }

  // Get suggested questions
  async getSuggestedQuestions() {
    return await openaiService.generateSuggestedQuestions();
  }

  // Get conversation statistics
  getConversationStats(sessionId) {
    if (!this.conversations.has(sessionId)) {
      return null;
    }

    const conversation = this.conversations.get(sessionId);
    const userMessages = conversation.messages.filter(m => m.role === 'user');
    const assistantMessages = conversation.messages.filter(m => m.role === 'assistant');

    return {
      sessionId,
      totalMessages: conversation.messages.length,
      userMessages: userMessages.length,
      assistantMessages: assistantMessages.length,
      createdAt: conversation.createdAt,
      lastActivity: conversation.lastActivity,
      duration: new Date() - conversation.createdAt
    };
  }

  // Clean up old conversations (call periodically)
  cleanupOldConversations(maxAgeHours = 24) {
    const cutoffTime = new Date(Date.now() - (maxAgeHours * 60 * 60 * 1000));
    let cleaned = 0;

    for (const [sessionId, conversation] of this.conversations.entries()) {
      if (conversation.lastActivity < cutoffTime) {
        this.conversations.delete(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      console.log(`🧹 Cleaned up ${cleaned} old conversations`);
    }

    return cleaned;
  }

  // Get service health status
  async getHealthStatus() {
    try {
      await this.ensureInitialized();
      
      return {
        status: 'healthy',
        activeConversations: this.conversations.size,
        services: {
          chat: true,
          knowledge: knowledgeService.initialized,
          openai: openaiService.initialized,
          pinecone: pineconeService.initialized
        },
        timestamp: new Date()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date()
      };
    }
  }
}

module.exports = new ChatService(); 