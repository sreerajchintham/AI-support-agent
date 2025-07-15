const { VapiClient } = require('@vapi-ai/server-sdk');
const config = require('../../config');
const knowledgeService = require('./knowledgeService');

class VapiService {
  constructor() {
    this.client = new VapiClient({
      token: config.VAPI_API_KEY
    });
    this.defaultAssistantId = null;
  }

  /**
   * Initialize the service and create default assistant if needed
   */
  async initialize() {
    try {
      console.log('🎙️ Initializing Vapi service...');
      
      if (config.VAPI_ASSISTANT_ID) {
        this.defaultAssistantId = config.VAPI_ASSISTANT_ID;
        console.log(`✅ Using existing assistant: ${this.defaultAssistantId}`);
      } else {
        this.defaultAssistantId = await this.createDefaultAssistant();
        console.log(`✅ Created new assistant: ${this.defaultAssistantId}`);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Vapi service:', error);
      throw error;
    }
  }

  /**
   * Create a default assistant for Aven support
   */
  async createDefaultAssistant() {
    try {
      const assistantConfig = {
        name: 'Aven HELOC Assistant',
        firstMessage: "Hi! I'm your Aven AI assistant. I can help you with questions about Home Equity Lines of Credit, our credit card products, and how Aven can help you access your home's equity. How can I assist you today?",
        model: {
          provider: 'openai',
          model: config.VAPI_MODEL,
          temperature: 0.7,
          messages: [{
            role: 'system',
            content: `You are Aven's AI voice assistant, helping customers understand Home Equity Lines of Credit (HELOC) and Aven's unique credit card solution.

CORE KNOWLEDGE:
- Aven offers HELOC-backed credit cards that let homeowners access home equity through everyday spending
- Our rates start at 8.9% APR, typically much lower than traditional credit cards
- No monthly payments required - just pay interest on what you use
- Funds are available instantly through your credit card
- Tax benefits may apply since it's secured by home equity
- Credit limits up to $500,000 based on home value and equity

COMMUNICATION STYLE:
- Keep responses under 50 words for voice conversations
- Be conversational and helpful
- Ask clarifying questions when needed
- Direct complex questions to human agents when appropriate
- Focus on benefits and practical applications

Remember: You're speaking, not typing, so keep it natural and concise.`
          }]
        },
        voice: {
          provider: '11labs',
          voiceId: config.VAPI_VOICE_ID
        },
        endCallMessage: "Thanks for chatting with Aven! If you have more questions, feel free to start another conversation or visit our website.",
        recordingEnabled: false,
        hipaaEnabled: false,
        silenceTimeoutSeconds: 30,
        maxDurationSeconds: 600, // 10 minutes max call duration
        backgroundSound: 'office',
        backchannelingEnabled: true,
        backgroundDenoisingEnabled: true
      };

      // Only add serverUrl and functions in production (HTTPS)
      if (config.NODE_ENV === 'production' || process.env.WEBHOOK_URL) {
        const webhookUrl = process.env.WEBHOOK_URL || `${config.CORS_ORIGIN.replace('3000', '5001')}/api/vapi/webhook`;
        
        assistantConfig.serverUrl = webhookUrl;
        assistantConfig.functions = [
          {
            name: 'search_knowledge',
            description: 'Search the Aven knowledge base for specific information about HELOC, products, rates, and services',
            parameters: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'The search query to find relevant information'
                },
                category: {
                  type: 'string',
                  enum: ['heloc_basics', 'rates_terms', 'products', 'eligibility', 'application', 'general'],
                  description: 'Category to help focus the search'
                }
              },
              required: ['query']
            }
          }
        ];
      }

      const assistant = await this.client.assistants.create(assistantConfig);
      return assistant.id;
    } catch (error) {
      console.error('Failed to create assistant:', error);
      throw error;
    }
  }

  /**
   * Get assistant configuration
   */
  async getAssistant(assistantId = null) {
    try {
      const id = assistantId || this.defaultAssistantId;
      if (!id) {
        throw new Error('No assistant ID available');
      }
      
      return await this.client.assistants.get(id);
    } catch (error) {
      console.error('Failed to get assistant:', error);
      throw error;
    }
  }

  /**
   * Update assistant configuration
   */
  async updateAssistant(updates, assistantId = null) {
    try {
      const id = assistantId || this.defaultAssistantId;
      if (!id) {
        throw new Error('No assistant ID available');
      }
      
      return await this.client.assistants.update(id, updates);
    } catch (error) {
      console.error('Failed to update assistant:', error);
      throw error;
    }
  }

  /**
   * Handle function calls from Vapi webhooks
   */
  async handleFunctionCall(functionCall) {
    try {
      console.log('🔧 Handling function call:', functionCall.name);
      
      switch (functionCall.name) {
        case 'search_knowledge':
          return await this.searchKnowledge(functionCall.parameters);
        
        default:
          console.warn('Unknown function call:', functionCall.name);
          return {
            error: 'Unknown function',
            message: 'I apologize, but I encountered an error processing your request. Could you please rephrase your question?'
          };
      }
    } catch (error) {
      console.error('Function call error:', error);
      return {
        error: 'Function execution failed',
        message: 'I apologize, but I encountered an error while searching for information. Could you please try asking your question differently?'
      };
    }
  }

  /**
   * Search knowledge base function
   */
  async searchKnowledge(parameters) {
    try {
      const { query, category } = parameters;
      
      // Use existing knowledge service to search
      const results = await knowledgeService.searchKnowledge(query);
      
      if (!results || results.length === 0) {
        return {
          summary: "I don't have specific information about that topic in my knowledge base. Let me connect you with a human agent who can provide more detailed assistance.",
          confidence: 0,
          sources: []
        };
      }

      // Format results for voice response (shorter and more conversational)
      const topResult = results[0];
      let summary = topResult.content;
      
      // Shorten for voice if it's too long
      if (summary.length > 200) {
        summary = summary.substring(0, 197) + '...';
      }
      
      // Make it more conversational for voice
      summary = summary.replace(/\n/g, ' ').trim();
      
      return {
        summary,
        confidence: topResult.score || 0.8,
        sources: results.slice(0, 3).map(r => r.metadata?.source || 'Aven Knowledge Base'),
        category: category || 'general'
      };
      
    } catch (error) {
      console.error('Knowledge search error:', error);
      return {
        summary: "I apologize, but I'm having trouble accessing our knowledge base right now. Could you please try asking your question again, or would you like me to connect you with a human agent?",
        confidence: 0,
        sources: []
      };
    }
  }

  /**
   * Create an outbound call (for future use)
   */
  async createCall(phoneNumber, assistantId = null) {
    try {
      const id = assistantId || this.defaultAssistantId;
      if (!id) {
        throw new Error('No assistant ID available');
      }
      
      return await this.client.calls.create({
        assistantId: id,
        customer: {
          number: phoneNumber
        }
      });
    } catch (error) {
      console.error('Failed to create call:', error);
      throw error;
    }
  }

  /**
   * Get public configuration for frontend
   */
  getPublicConfig() {
    return {
      publicKey: config.VAPI_PUBLIC_KEY,
      defaultAssistantId: this.defaultAssistantId,
      isConfigured: !!(config.VAPI_API_KEY && config.VAPI_PUBLIC_KEY)
    };
  }
}

module.exports = new VapiService(); 