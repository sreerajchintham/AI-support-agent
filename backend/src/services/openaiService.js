const OpenAI = require('openai');
const config = require('../../config');

class OpenAIService {
  constructor() {
    this.client = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      console.log('🤖 Initializing OpenAI...');
      
      this.client = new OpenAI({
        apiKey: config.OPENAI_API_KEY
      });
      
      this.initialized = true;
      console.log('✅ OpenAI initialized successfully');
    } catch (error) {
      console.error('❌ OpenAI initialization failed:', error);
      throw new Error(`Failed to initialize OpenAI: ${error.message}`);
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  async createEmbedding(text, model = 'text-embedding-3-large') {
    await this.ensureInitialized();
    
    try {
      const response = await this.client.embeddings.create({
        model: model,
        input: text,
        dimensions: 1024 // Match Pinecone index dimensions
      });
      
      return response.data[0].embedding;
    } catch (error) {
      console.error('❌ Failed to create embedding:', error);
      throw new Error(`Failed to create embedding: ${error.message}`);
    }
  }

  async createEmbeddings(texts, model = 'text-embedding-3-large') {
    await this.ensureInitialized();
    
    try {
      console.log(`🔮 Creating embeddings for ${texts.length} texts...`);
      
      const batchSize = 100;
      const allEmbeddings = [];
      
      for (let i = 0; i < texts.length; i += batchSize) {
        const batch = texts.slice(i, i + batchSize);
        
        const response = await this.client.embeddings.create({
          model: model,
          input: batch,
          dimensions: 1024 // Match Pinecone index dimensions
        });
        
        const embeddings = response.data.map(item => item.embedding);
        allEmbeddings.push(...embeddings);
        
        // Small delay to respect rate limits
        if (i + batchSize < texts.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      console.log('✅ Embeddings created successfully');
      return allEmbeddings;
    } catch (error) {
      console.error('❌ Failed to create embeddings:', error);
      throw new Error(`Failed to create embeddings: ${error.message}`);
    }
  }

  async createChatCompletion(messages, options = {}) {
    await this.ensureInitialized();
    
    try {
      // Extract options that need to be transformed
      const { maxTokens, topP, frequencyPenalty, presencePenalty, ...otherOptions } = options;
      
      const response = await this.client.chat.completions.create({
        model: options.model || 'gpt-4',
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: maxTokens || 1000,
        top_p: topP || 1,
        frequency_penalty: frequencyPenalty || 0,
        presence_penalty: presencePenalty || 0,
        ...otherOptions
      });
      
      return response.choices[0].message;
    } catch (error) {
      console.error('❌ Failed to create chat completion:', error);
      throw new Error(`Failed to create chat completion: ${error.message}`);
    }
  }

  async generateRAGResponse(query, context, conversationHistory = [], agentName = 'Sarah', isFirstMessage = false) {
    let systemPrompt = `You are ${agentName}, an AI customer support agent for Aven, a fintech company that offers the Aven Card - a credit card backed by home equity (HELOC).

IMPORTANT GUIDELINES:`;

    // Add introduction instruction only for first message
    if (isFirstMessage) {
      systemPrompt += `
- This is the first message in the conversation. Introduce yourself as ${agentName} with: "Hi! I am ${agentName}, I am here to answer all the questions about Aven. How can I help you?"`;
    } else {
      systemPrompt += `
- This is not the first message. Do NOT introduce yourself again - focus on being helpful without mentioning your name`;
    }

    systemPrompt += `
- Only answer questions about Aven, their products, and services
- Use the provided context to answer questions accurately
- If you don't know something, say so - don't make up information
- Be helpful, professional, and concise
- If a question is about legal/financial advice, direct them to speak with a qualified professional
- For account-specific issues, direct them to contact Aven support at (888) 966-4655 or support@aven.com
- Always maintain a friendly, professional tone

MEETING SCHEDULING:
- When users ask to schedule a meeting, use the get_available_slots function to check availability
- When users provide their information and select a slot, use the schedule_meeting function
- Always confirm meeting details and provide the confirmation code

Context about Aven:
${context}

Remember: You are representing Aven, so maintain their professional tone and always prioritize accuracy over completeness.`;

    // Define available functions for meeting scheduling
    const functions = [
      {
        name: "get_available_slots",
        description: "Get available meeting slots for scheduling",
        parameters: {
          type: "object",
          properties: {
            date: {
              type: "string",
              description: "Optional date filter (YYYY-MM-DD format). If not provided, returns slots for next 30 days"
            }
          }
        }
      },
      {
        name: "schedule_meeting",
        description: "Schedule a meeting with Aven representative",
        parameters: {
          type: "object",
          properties: {
            slotId: {
              type: "string",
              description: "The ID of the selected meeting slot"
            },
            name: {
              type: "string",
              description: "User's full name"
            },
            email: {
              type: "string",
              description: "User's email address"
            },
            phone: {
              type: "string",
              description: "User's phone number"
            },
            meetingType: {
              type: "string",
              enum: ["consultation", "application", "support"],
              description: "Type of meeting: consultation (general questions), application (help with application), support (technical/account issues)"
            },
            notes: {
              type: "string",
              description: "Optional notes about the meeting purpose"
            }
          },
          required: ["slotId", "name", "email", "phone"]
        }
      }
    ];

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: query }
    ];

    try {
      const response = await this.client.chat.completions.create({
        model: 'gpt-4',
        temperature: 0.7,
        max_tokens: 1000,
        functions: functions,
        function_call: 'auto',
        messages: messages
      });

      return response;
    } catch (error) {
      console.error('❌ Failed to generate RAG response:', error);
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  async checkMessageSafety(message) {
    try {
      // Basic content filtering - you can enhance this with OpenAI's moderation API
      const lowerMessage = message.toLowerCase();
      
      const prohibitedPatterns = [
        /personal.*data|ssn|social.*security/i,
        /account.*number|routing.*number/i,
        /password|pin.*number/i,
        /legal.*advice|financial.*advice/i
      ];

      for (const pattern of prohibitedPatterns) {
        if (pattern.test(message)) {
          return {
            safe: false,
            reason: 'Message contains sensitive information or requests advice outside our scope'
          };
        }
      }

      return { safe: true };
    } catch (error) {
      console.error('❌ Failed to check message safety:', error);
      return { safe: true }; // Default to safe if check fails
    }
  }

  async generateSuggestedQuestions() {
    const suggestions = [
      "What is the Aven Card and how does it work?",
      "What are the eligibility requirements for the Aven Card?",
      "How does the interest rate work on my Aven Card?",
      "Can I use my Aven Card for cash advances?",
      "How do I make payments on my Aven Card?",
      "What is the maximum credit line available?",
      "How do I apply for an Aven Card?",
      "What fees are associated with the Aven Card?",
      "How do balance transfers work?",
      "Can I get cashback rewards with the Aven Card?"
    ];

    return suggestions;
  }
}

module.exports = new OpenAIService(); 