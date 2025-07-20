const { VapiClient } = require('@vapi-ai/server-sdk');
const config = require('../../config');
const knowledgeService = require('./knowledgeService');
const meetingService = require('./meetingService');
const guardrailsService = require('./guardrailsService');

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
      
      // Initialize guardrails service
      await guardrailsService.initialize();
      
      if (config.VAPI_ASSISTANT_ID) {
        this.defaultAssistantId = config.VAPI_ASSISTANT_ID;
        console.log(`✅ Using existing assistant: ${this.defaultAssistantId}`);
      } else {
        console.log('🔧 Creating new assistant...');
        this.defaultAssistantId = await this.createDefaultAssistant();
        console.log(`✅ Created new assistant: ${this.defaultAssistantId}`);
      }
      
      console.log('🔧 Vapi service initialization complete, returning...');
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
      console.log('🔧 Building assistant configuration...');
      const assistantConfig = {
        name: 'Sarah - Aven AI Assistant',
        firstMessage: "Hi! I am Sarah, I am here to answer all the questions about Aven. How can I help you?",
        model: {
          provider: 'openai',
          model: config.VAPI_MODEL,
          temperature: 0.7,
          messages: [{
            role: 'system',
            content: `You are Sarah, Aven's AI voice assistant, helping customers understand Home Equity Lines of Credit (HELOC) and Aven's unique credit card solution.

IMPORTANT: You have already introduced yourself in the first message. Do NOT introduce yourself again in subsequent responses - focus on being helpful without mentioning your name.

CORE KNOWLEDGE:
- Aven offers HELOC-backed credit cards that let homeowners access home equity through everyday spending
- Our rates start at 8.9% APR, typically much lower than traditional credit cards
- No monthly payments required - just pay interest on what you use
- Funds are available instantly through your credit card
- Tax benefits may apply since it's secured by home equity
- Credit limits up to $500,000 based on home value and equity

SAFETY GUIDELINES:
- NEVER provide personal financial advice or investment recommendations
- NEVER handle personal data like SSN, credit card numbers, or account details
- NEVER provide legal advice - direct to qualified attorneys
- NEVER discuss political topics or controversial subjects
- NEVER respond to toxic, offensive, or inappropriate content
- For account-specific questions, direct to Aven support at (888) 966-4655
- For sensitive information, always redirect to human support

COMMUNICATION STYLE:
- Keep responses under 50 words for voice conversations
- Be conversational and helpful
- Ask clarifying questions when needed
- Direct complex questions to human agents when appropriate
- Focus on benefits and practical applications
- If you detect safety violations, politely redirect to appropriate resources

Remember: You're speaking, not typing, so keep it natural and concise while maintaining safety standards.`
          }]
        },
        voice: {
          provider: '11labs',
          voiceId: config.VAPI_VOICE_ID
        },
        endCallMessage: "Thanks for chatting with Sarah! If you have more questions, feel free to start another conversation or visit our website.",
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
          },
          {
            name: 'schedule_meeting',
            description: 'Schedule a meeting with an Aven representative for consultation, application assistance, or support',
            parameters: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Customer name for the meeting'
                },
                email: {
                  type: 'string',
                  description: 'Customer email address'
                },
                phone: {
                  type: 'string',
                  description: 'Customer phone number'
                },
                meetingType: {
                  type: 'string',
                  enum: ['consultation', 'application', 'support'],
                  description: 'Type of meeting to schedule'
                },
                notes: {
                  type: 'string',
                  description: 'Additional notes or reason for the meeting'
                }
              },
              required: ['name', 'email', 'phone']
            }
          },
          {
            name: 'get_available_slots',
            description: 'Get available meeting slots for scheduling',
            parameters: {
              type: 'object',
              properties: {
                date: {
                  type: 'string',
                  description: 'Specific date to check (YYYY-MM-DD format) or leave empty for next available slots'
                }
              },
              required: []
            }
          }
        ];
      }

      console.log('🔧 Calling Vapi API to create assistant...');
      const assistant = await this.client.assistants.create(assistantConfig);
      console.log('🔧 Assistant created successfully, returning ID...');
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
        
        case 'schedule_meeting':
          return await this.scheduleMeeting(functionCall.parameters);
        
        case 'get_available_slots':
          return await this.getAvailableSlots(functionCall.parameters);
        
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
   * Schedule a meeting function
   */
  async scheduleMeeting(parameters) {
    try {
      const { name, email, phone, meetingType = 'consultation', notes } = parameters;
      
      // Get next available slot
      const nextSlot = meetingService.getNextAvailableSlot();
      
      if (!nextSlot) {
        return {
          success: false,
          message: "I'm sorry, but there are no available meeting slots at the moment. Please try again later or contact us directly at (888) 966-4655.",
          availableSlots: []
        };
      }

      // Schedule the meeting
      const userInfo = {
        name,
        email,
        phone,
        notes
      };

      const result = await meetingService.scheduleMeeting(userInfo, nextSlot.id, meetingType);
      
      if (result.success) {
        return {
          success: true,
          message: result.confirmationMessage,
          meeting: {
            date: result.meeting.scheduledDate,
            time: result.meeting.scheduledTime,
            confirmationCode: result.meeting.confirmationCode
          }
        };
      } else {
        return {
          success: false,
          message: "I'm sorry, but I couldn't schedule the meeting. Please try again or contact us directly at (888) 966-4655.",
          error: result.error
        };
      }
    } catch (error) {
      console.error('Meeting scheduling error:', error);
      return {
        success: false,
        message: "I'm sorry, but I encountered an error while scheduling your meeting. Please contact us directly at (888) 966-4655.",
        error: error.message
      };
    }
  }

  /**
   * Get available slots function
   */
  async getAvailableSlots(parameters) {
    try {
      const { date } = parameters;
      const slots = meetingService.getAvailableSlots(date);
      
      if (slots.length === 0) {
        return {
          success: false,
          message: "I'm sorry, but there are no available slots for that date. Would you like me to check for other available times?",
          availableSlots: []
        };
      }

      // Format slots for voice response
      const formattedSlots = slots.slice(0, 5).map(slot => ({
        date: slot.date,
        time: slot.time,
        available: slot.available
      }));

      return {
        success: true,
        message: `I found ${slots.length} available slots. The next available times are: ${formattedSlots.map(s => `${s.date} at ${s.time}`).join(', ')}. Would you like me to schedule a meeting for you?`,
        availableSlots: formattedSlots
      };
    } catch (error) {
      console.error('Get available slots error:', error);
      return {
        success: false,
        message: "I'm sorry, but I couldn't retrieve the available slots. Please try again or contact us directly at (888) 966-4655.",
        error: error.message
      };
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