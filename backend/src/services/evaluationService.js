const chatService = require('./chatService');
const knowledgeService = require('./knowledgeService');

class EvaluationService {
  constructor() {
    this.testQuestions = this.generateTestQuestions();
    this.evaluationResults = new Map();
  }

  // Generate comprehensive test questions
  generateTestQuestions() {
    return [
      // Basic Product Questions
      {
        id: 1,
        category: 'product_basics',
        question: "What is the Aven Card?",
        expectedKeywords: ['credit card', 'home equity', 'HELOC', 'VISA'],
        difficulty: 'easy',
        type: 'factual'
      },
      {
        id: 2,
        category: 'product_basics',
        question: "How does the Aven Card work?",
        expectedKeywords: ['credit line', 'home equity', 'borrow', 'spend'],
        difficulty: 'easy',
        type: 'explanatory'
      },
      {
        id: 3,
        category: 'product_basics',
        question: "What is the maximum credit limit for the Aven Card?",
        expectedKeywords: ['250000', '250,000', 'maximum', 'credit line'],
        difficulty: 'easy',
        type: 'factual'
      },

      // Application Process
      {
        id: 4,
        category: 'application',
        question: "How do I apply for an Aven Card?",
        expectedKeywords: ['apply', 'application', 'online', 'process'],
        difficulty: 'medium',
        type: 'procedural'
      },
      {
        id: 5,
        category: 'application',
        question: "What are the eligibility requirements?",
        expectedKeywords: ['eligibility', 'requirements', 'qualify', 'income', 'equity'],
        difficulty: 'medium',
        type: 'factual'
      },
      {
        id: 6,
        category: 'application',
        question: "Does applying affect my credit score?",
        expectedKeywords: ['soft pull', 'credit score', 'no affect', 'hard pull'],
        difficulty: 'medium',
        type: 'factual'
      },

      // Rates and Fees
      {
        id: 7,
        category: 'rates_fees',
        question: "What are the interest rates on the Aven Card?",
        expectedKeywords: ['variable rate', 'prime rate', 'APR', '18%'],
        difficulty: 'medium',
        type: 'factual'
      },
      {
        id: 8,
        category: 'rates_fees',
        question: "Are there any annual fees?",
        expectedKeywords: ['no annual fee', 'no fee', 'free'],
        difficulty: 'easy',
        type: 'factual'
      },
      {
        id: 9,
        category: 'rates_fees',
        question: "What fees are associated with the Aven Card?",
        expectedKeywords: ['no application fee', 'no annual fee', 'no closing fee'],
        difficulty: 'medium',
        type: 'factual'
      },

      // Usage and Features
      {
        id: 10,
        category: 'usage',
        question: "Where can I use my Aven Card?",
        expectedKeywords: ['VISA', 'accepted', 'purchases', 'restrictions'],
        difficulty: 'easy',
        type: 'factual'
      },
      {
        id: 11,
        category: 'usage',
        question: "Can I get cash advances with my Aven Card?",
        expectedKeywords: ['no cash advances', 'no ATM', 'restrictions'],
        difficulty: 'medium',
        type: 'factual'
      },
      {
        id: 12,
        category: 'usage',
        question: "How do I make payments on my Aven Card?",
        expectedKeywords: ['autopay', 'payment', 'online', 'bank account'],
        difficulty: 'medium',
        type: 'procedural'
      },

      // Rewards and Benefits
      {
        id: 13,
        category: 'rewards',
        question: "Do I earn cashback with the Aven Card?",
        expectedKeywords: ['2% cashback', 'autopay', 'eligible purchases'],
        difficulty: 'medium',
        type: 'factual'
      },
      {
        id: 14,
        category: 'rewards',
        question: "How do I earn cashback rewards?",
        expectedKeywords: ['autopay', 'enabled', '2%', 'eligible'],
        difficulty: 'medium',
        type: 'explanatory'
      },

      // Account Management
      {
        id: 15,
        category: 'account_management',
        question: "How do I check my balance?",
        expectedKeywords: ['online', 'account', 'balance', 'login'],
        difficulty: 'easy',
        type: 'procedural'
      },
      {
        id: 16,
        category: 'account_management',
        question: "Can I view my transactions online?",
        expectedKeywords: ['online', 'transactions', 'account', 'view'],
        difficulty: 'easy',
        type: 'factual'
      },

      // Contact and Support
      {
        id: 17,
        category: 'support',
        question: "How do I contact Aven support?",
        expectedKeywords: ['888-966-4655', 'support@aven.com', 'phone', 'email'],
        difficulty: 'easy',
        type: 'factual'
      },
      {
        id: 18,
        category: 'support',
        question: "What is Aven's customer service phone number?",
        expectedKeywords: ['888-966-4655', 'phone', 'support'],
        difficulty: 'easy',
        type: 'factual'
      },

      // Advanced Questions
      {
        id: 19,
        category: 'advanced',
        question: "How does the variable rate work?",
        expectedKeywords: ['prime rate', 'federal funds', 'variable', 'adjust'],
        difficulty: 'hard',
        type: 'explanatory'
      },
      {
        id: 20,
        category: 'advanced',
        question: "What happens if I miss a payment?",
        expectedKeywords: ['late payment', 'fees', 'credit score', 'consequences'],
        difficulty: 'hard',
        type: 'factual'
      },

      // Edge Cases
      {
        id: 21,
        category: 'edge_cases',
        question: "Can I use my Aven Card internationally?",
        expectedKeywords: ['foreign countries', 'restrictions', 'sanctions', 'no'],
        difficulty: 'medium',
        type: 'factual'
      },
      {
        id: 22,
        category: 'edge_cases',
        question: "What if I want to close my account?",
        expectedKeywords: ['close account', 'no fee', 'process'],
        difficulty: 'medium',
        type: 'procedural'
      },

      // Comparison Questions
      {
        id: 23,
        category: 'comparison',
        question: "How is the Aven Card different from a traditional credit card?",
        expectedKeywords: ['home equity', 'HELOC', 'different', 'traditional'],
        difficulty: 'hard',
        type: 'explanatory'
      },
      {
        id: 24,
        category: 'comparison',
        question: "What are the advantages of the Aven Card?",
        expectedKeywords: ['advantages', 'benefits', 'cashback', 'no fees'],
        difficulty: 'medium',
        type: 'explanatory'
      },

      // Troubleshooting
      {
        id: 25,
        category: 'troubleshooting',
        question: "What should I do if my card is declined?",
        expectedKeywords: ['declined', 'contact support', 'check balance', 'limits'],
        difficulty: 'medium',
        type: 'procedural'
      },
      {
        id: 26,
        category: 'troubleshooting',
        question: "How do I report a lost or stolen card?",
        expectedKeywords: ['lost card', 'stolen', 'report', 'contact support'],
        difficulty: 'medium',
        type: 'procedural'
      },

      // Additional Product Questions
      {
        id: 27,
        category: 'product_basics',
        question: "Is the Aven Card a secured or unsecured credit card?",
        expectedKeywords: ['home equity', 'secured', 'HELOC', 'collateral'],
        difficulty: 'medium',
        type: 'factual'
      },
      {
        id: 28,
        category: 'product_basics',
        question: "What type of credit card is the Aven Card?",
        expectedKeywords: ['VISA', 'credit card', 'home equity', 'HELOC'],
        difficulty: 'easy',
        type: 'factual'
      },
      {
        id: 29,
        category: 'rates_fees',
        question: "Are there any hidden fees with the Aven Card?",
        expectedKeywords: ['no hidden fees', 'transparent', 'no surprise fees'],
        difficulty: 'medium',
        type: 'factual'
      },
      {
        id: 30,
        category: 'rates_fees',
        question: "What is the minimum payment requirement?",
        expectedKeywords: ['minimum payment', 'autopay', 'requirements'],
        difficulty: 'medium',
        type: 'factual'
      },

      // Usage Restrictions
      {
        id: 31,
        category: 'usage',
        question: "Can I use my Aven Card at casinos?",
        expectedKeywords: ['no casinos', 'restrictions', 'prohibited'],
        difficulty: 'medium',
        type: 'factual'
      },
      {
        id: 32,
        category: 'usage',
        question: "Are there any spending restrictions?",
        expectedKeywords: ['restrictions', 'casinos', 'ATMs', 'cryptocurrency'],
        difficulty: 'medium',
        type: 'factual'
      },

      // Application Details
      {
        id: 33,
        category: 'application',
        question: "How long does the application process take?",
        expectedKeywords: ['application time', 'process', 'duration'],
        difficulty: 'medium',
        type: 'factual'
      },
      {
        id: 34,
        category: 'application',
        question: "What documents do I need to apply?",
        expectedKeywords: ['documents', 'required', 'application'],
        difficulty: 'medium',
        type: 'factual'
      },

      // Account Features
      {
        id: 35,
        category: 'account_management',
        question: "Can I set up automatic payments?",
        expectedKeywords: ['autopay', 'automatic payments', 'set up'],
        difficulty: 'easy',
        type: 'factual'
      },
      {
        id: 36,
        category: 'account_management',
        question: "How do I update my contact information?",
        expectedKeywords: ['update information', 'contact details', 'account settings'],
        difficulty: 'medium',
        type: 'procedural'
      },

      // Security
      {
        id: 37,
        category: 'security',
        question: "Is the Aven Card secure?",
        expectedKeywords: ['secure', 'security', 'VISA', 'protection'],
        difficulty: 'easy',
        type: 'factual'
      },
      {
        id: 38,
        category: 'security',
        question: "What security features does the card have?",
        expectedKeywords: ['security features', 'fraud protection', 'VISA'],
        difficulty: 'medium',
        type: 'factual'
      },

      // Business Use
      {
        id: 39,
        category: 'business',
        question: "Can I use the Aven Card for business expenses?",
        expectedKeywords: ['business use', 'personal use', 'restrictions'],
        difficulty: 'medium',
        type: 'factual'
      },
      {
        id: 40,
        category: 'business',
        question: "Is the Aven Card suitable for business owners?",
        expectedKeywords: ['business owners', 'personal use', 'restrictions'],
        difficulty: 'medium',
        type: 'factual'
      },

      // Credit Impact
      {
        id: 41,
        category: 'credit_impact',
        question: "How does the Aven Card affect my credit score?",
        expectedKeywords: ['credit score', 'impact', 'reporting', 'credit bureaus'],
        difficulty: 'hard',
        type: 'explanatory'
      },
      {
        id: 42,
        category: 'credit_impact',
        question: "Does Aven report to credit bureaus?",
        expectedKeywords: ['credit bureaus', 'reporting', 'credit score'],
        difficulty: 'medium',
        type: 'factual'
      },

      // Emergency Situations
      {
        id: 43,
        category: 'emergency',
        question: "What should I do in case of fraud?",
        expectedKeywords: ['fraud', 'report', 'contact support', 'immediately'],
        difficulty: 'medium',
        type: 'procedural'
      },
      {
        id: 44,
        category: 'emergency',
        question: "How do I get emergency card replacement?",
        expectedKeywords: ['emergency', 'replacement', 'lost card', 'urgent'],
        difficulty: 'medium',
        type: 'procedural'
      },

      // Technical Questions
      {
        id: 45,
        category: 'technical',
        question: "What happens if the website is down?",
        expectedKeywords: ['website down', 'contact support', 'phone', 'alternative'],
        difficulty: 'medium',
        type: 'procedural'
      },
      {
        id: 46,
        category: 'technical',
        question: "How do I reset my online account password?",
        expectedKeywords: ['reset password', 'forgot password', 'online account'],
        difficulty: 'medium',
        type: 'procedural'
      },

      // Policy Questions
      {
        id: 47,
        category: 'policies',
        question: "What is Aven's privacy policy?",
        expectedKeywords: ['privacy policy', 'data protection', 'information'],
        difficulty: 'hard',
        type: 'factual'
      },
      {
        id: 48,
        category: 'policies',
        question: "What are the terms and conditions?",
        expectedKeywords: ['terms', 'conditions', 'agreement', 'policies'],
        difficulty: 'hard',
        type: 'factual'
      },

      // Future Questions
      {
        id: 49,
        category: 'future',
        question: "Will Aven offer additional products in the future?",
        expectedKeywords: ['future products', 'additional offerings', 'expansion'],
        difficulty: 'hard',
        type: 'speculative'
      },
      {
        id: 50,
        category: 'future',
        question: "Can I upgrade my credit limit later?",
        expectedKeywords: ['upgrade', 'increase limit', 'credit line', 'future'],
        difficulty: 'medium',
        type: 'factual'
      }
    ];
  }

  // Run evaluation on a single question
  async evaluateQuestion(questionId) {
    const question = this.testQuestions.find(q => q.id === questionId);
    if (!question) {
      throw new Error(`Question with ID ${questionId} not found`);
    }

    try {
      // Get AI response
      const response = await chatService.processMessage(question.question);
      
      // Evaluate the response
      const evaluation = this.evaluateResponse(question, response);
      
      // Store result
      this.evaluationResults.set(questionId, {
        question,
        response,
        evaluation,
        timestamp: new Date()
      });

      return {
        questionId,
        question: question.question,
        response: response.message,
        evaluation,
        sources: response.sources
      };
    } catch (error) {
      console.error(`❌ Failed to evaluate question ${questionId}:`, error);
      return {
        questionId,
        question: question.question,
        error: error.message,
        evaluation: {
          accuracy: 0,
          helpfulness: 0,
          citationQuality: 0,
          overall: 0
        }
      };
    }
  }

  // Evaluate a response based on multiple criteria
  evaluateResponse(question, response) {
    const accuracy = this.evaluateAccuracy(question, response);
    const helpfulness = this.evaluateHelpfulness(question, response);
    const citationQuality = this.evaluateCitationQuality(response);

    const overall = (accuracy + helpfulness + citationQuality) / 3;

    return {
      accuracy,
      helpfulness,
      citationQuality,
      overall: Math.round(overall * 100) / 100
    };
  }

  // Evaluate accuracy (0-1 scale)
  evaluateAccuracy(question, response) {
    const responseText = response.message.toLowerCase();
    let score = 0;
    let keywordMatches = 0;

    // Check for expected keywords
    for (const keyword of question.expectedKeywords) {
      if (responseText.includes(keyword.toLowerCase())) {
        keywordMatches++;
      }
    }

    // Calculate accuracy based on keyword matches
    const keywordAccuracy = keywordMatches / question.expectedKeywords.length;
    
    // Base score on keyword accuracy
    score = keywordAccuracy * 0.8;

    // Bonus for comprehensive answers
    if (responseText.length > 100) score += 0.1;
    if (responseText.length > 200) score += 0.1;

    // Penalty for obvious errors
    if (responseText.includes('i don\'t know') || responseText.includes('cannot help')) {
      score -= 0.3;
    }

    return Math.max(0, Math.min(1, score));
  }

  // Evaluate helpfulness (0-1 scale)
  evaluateHelpfulness(question, response) {
    const responseText = response.message.toLowerCase();
    let score = 0.5; // Base score

    // Length bonus (but not too long)
    if (responseText.length > 50 && responseText.length < 500) score += 0.2;
    if (responseText.length >= 500) score += 0.1;

    // Structure bonus
    if (responseText.includes('first') || responseText.includes('second') || responseText.includes('finally')) {
      score += 0.1; // Structured response
    }

    // Actionable information bonus
    if (responseText.includes('call') || responseText.includes('contact') || responseText.includes('visit')) {
      score += 0.1;
    }

    // Professional tone bonus
    if (responseText.includes('please') || responseText.includes('thank you')) {
      score += 0.05;
    }

    // Penalty for too short responses
    if (responseText.length < 30) score -= 0.3;

    // Penalty for generic responses
    if (responseText.includes('contact support') && responseText.length < 100) {
      score -= 0.2;
    }

    return Math.max(0, Math.min(1, score));
  }

  // Evaluate citation quality (0-1 scale)
  evaluateCitationQuality(response) {
    let score = 0;

    // Check if sources are provided
    if (response.sources && response.sources.length > 0) {
      score += 0.4; // Base score for having sources

      // Quality of sources
      const sourceQuality = response.sources.reduce((total, source) => {
        let quality = 0;
        if (source.title && source.title.length > 0) quality += 0.3;
        if (source.source && source.source !== 'unknown') quality += 0.3;
        if (source.relevanceScore && source.relevanceScore > 0.7) quality += 0.4;
        return total + quality;
      }, 0) / response.sources.length;

      score += sourceQuality * 0.6;
    }

    // Bonus for mentioning specific sources in response
    const responseText = response.message.toLowerCase();
    if (responseText.includes('aven') || responseText.includes('support')) {
      score += 0.1;
    }

    return Math.max(0, Math.min(1, score));
  }

  // Run full evaluation on all questions
  async runFullEvaluation() {
    console.log('🧪 Starting full evaluation with 50 questions...');
    
    const results = [];
    const startTime = Date.now();

    for (const question of this.testQuestions) {
      console.log(`📝 Evaluating question ${question.id}: ${question.question.substring(0, 50)}...`);
      
      const result = await this.evaluateQuestion(question.id);
      results.push(result);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // Calculate overall statistics
    const stats = this.calculateEvaluationStats(results);

    return {
      results,
      stats,
      duration,
      totalQuestions: this.testQuestions.length
    };
  }

  // Calculate evaluation statistics
  calculateEvaluationStats(results) {
    const validResults = results.filter(r => !r.error);
    
    if (validResults.length === 0) {
      return {
        totalQuestions: results.length,
        validResponses: 0,
        averageAccuracy: 0,
        averageHelpfulness: 0,
        averageCitationQuality: 0,
        averageOverall: 0
      };
    }

    const totalAccuracy = validResults.reduce((sum, r) => sum + r.evaluation.accuracy, 0);
    const totalHelpfulness = validResults.reduce((sum, r) => sum + r.evaluation.helpfulness, 0);
    const totalCitationQuality = validResults.reduce((sum, r) => sum + r.evaluation.citationQuality, 0);
    const totalOverall = validResults.reduce((sum, r) => sum + r.evaluation.overall, 0);

    return {
      totalQuestions: results.length,
      validResponses: validResults.length,
      averageAccuracy: Math.round((totalAccuracy / validResults.length) * 100) / 100,
      averageHelpfulness: Math.round((totalHelpfulness / validResults.length) * 100) / 100,
      averageCitationQuality: Math.round((totalCitationQuality / validResults.length) * 100) / 100,
      averageOverall: Math.round((totalOverall / validResults.length) * 100) / 100
    };
  }

  // Get evaluation results
  getEvaluationResults() {
    return Array.from(this.evaluationResults.values());
  }

  // Get questions by category
  getQuestionsByCategory(category) {
    return this.testQuestions.filter(q => q.category === category);
  }

  // Get questions by difficulty
  getQuestionsByDifficulty(difficulty) {
    return this.testQuestions.filter(q => q.difficulty === difficulty);
  }

  // Get all test questions
  getAllQuestions() {
    return this.testQuestions;
  }
}

module.exports = new EvaluationService(); 