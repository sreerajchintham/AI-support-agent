const OpenAI = require('openai');
const config = require('../../config');

class GuardrailsService {
  constructor() {
    this.openai = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      console.log('🛡️ Initializing Guardrails service...');
      
      this.openai = new OpenAI({
        apiKey: config.OPENAI_API_KEY
      });
      
      this.initialized = true;
      console.log('✅ Guardrails service initialized');
    } catch (error) {
      console.error('❌ Guardrails initialization failed:', error);
      throw new Error(`Failed to initialize Guardrails: ${error.message}`);
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  /**
   * Comprehensive safety check for all types of problematic content
   */
  async performSafetyChecks(message, context = {}) {
    await this.ensureInitialized();

    const checks = {
      toxicity: await this.checkToxicity(message),
      personalData: await this.checkPersonalData(message),
      legalAdvice: await this.checkLegalAdvice(message),
      financialAdvice: await this.checkFinancialAdvice(message),
      accountSpecific: await this.checkAccountSpecific(message),
      medicalAdvice: await this.checkMedicalAdvice(message),
      politicalContent: await this.checkPoliticalContent(message),
      spam: await this.checkSpam(message),
      impersonation: await this.checkImpersonation(message, context)
    };

    const issues = Object.entries(checks)
      .filter(([_, result]) => !result.safe)
      .map(([type, result]) => ({ type, ...result }));

    return {
      safe: issues.length === 0,
      issues,
      overallSafe: issues.length === 0,
      confidence: this.calculateConfidence(checks)
    };
  }

  /**
   * Enhanced toxicity detection with multiple categories
   */
  async checkToxicity(message) {
    const toxicityCategories = {
      hate: ['hate', 'racist', 'sexist', 'homophobic', 'bigot', 'discrimination'],
      violence: ['kill', 'murder', 'attack', 'violence', 'weapon', 'bomb', 'terrorist'],
      harassment: ['harass', 'bully', 'stalk', 'threaten', 'intimidate'],
      profanity: ['fuck', 'shit', 'bitch', 'asshole', 'damn', 'curse', 'swear'],
      inappropriate: ['inappropriate', 'offensive', 'disgusting', 'vulgar']
    };

    const messageLower = message.toLowerCase();
    const foundCategories = [];

    for (const [category, keywords] of Object.entries(toxicityCategories)) {
      const found = keywords.some(keyword => messageLower.includes(keyword));
      if (found) foundCategories.push(category);
    }

    return {
      safe: foundCategories.length === 0,
      reason: foundCategories.length > 0 
        ? `I cannot respond to ${foundCategories.join(', ')} content. Please keep our conversation respectful and professional.`
        : null,
      categories: foundCategories
    };
  }

  /**
   * Enhanced personal data detection with more patterns
   */
  async checkPersonalData(message) {
    const personalDataPatterns = {
      ssn: /ssn|social\s*security\s*number|social\s*security/i,
      creditCard: /credit\s*card\s*number|card\s*number|cc\s*number|card\s*#/i,
      bankAccount: /bank\s*account\s*number|routing\s*number|account\s*#/i,
      password: /password|passwd|pwd/i,
      pin: /pin\s*number|pin\s*code|personal\s*identification/i,
      dob: /date\s*of\s*birth|birthday|birth\s*date|dob/i,
      license: /driver\s*license|license\s*number|dl\s*number/i,
      passport: /passport\s*number|passport\s*#/i,
      address: /home\s*address|street\s*address|mailing\s*address/i,
      phone: /phone\s*number|mobile\s*number|cell\s*number/i,
      email: /email\s*address|e-mail/i
    };

    const foundData = [];
    for (const [type, pattern] of Object.entries(personalDataPatterns)) {
      if (pattern.test(message)) {
        foundData.push(type);
      }
    }

    return {
      safe: foundData.length === 0,
      reason: foundData.length > 0 
        ? `I cannot handle ${foundData.join(', ')} information. For security reasons, please contact Aven support directly at (888) 966-4655.`
        : null,
      dataTypes: foundData
    };
  }

  /**
   * Enhanced legal advice detection
   */
  async checkLegalAdvice(message) {
    const legalPatterns = [
      /legal\s*advice|legal\s*counsel/i,
      /should\s+i\s+sue|can\s+i\s+sue|lawsuit/i,
      /legal\s*action|legal\s*proceedings/i,
      /contract\s*review|legal\s*document/i,
      /legal\s*rights|legal\s*obligations/i,
      /attorney|lawyer|legal\s*representative/i,
      /legal\s*liability|legal\s*responsibility/i,
      /legal\s*compliance|regulatory\s*requirements/i
    ];

    const foundLegal = legalPatterns.some(pattern => pattern.test(message));

    return {
      safe: !foundLegal,
      reason: foundLegal 
        ? 'I cannot provide legal advice. Please consult with a qualified attorney for legal matters.'
        : null
    };
  }

  /**
   * Enhanced financial advice detection
   */
  async checkFinancialAdvice(message) {
    const financialPatterns = [
      /should\s+i\s+(invest|buy|sell|trade|borrow)/i,
      /what\s+should\s+i\s+do\s+with\s+my\s+money/i,
      /financial\s+advice|investment\s+advice/i,
      /tax\s+advice|tax\s+planning/i,
      /financial\s+planning|retirement\s+planning/i,
      /should\s+i\s+refinance|should\s+i\s+consolidate/i,
      /what\s+is\s+the\s+best\s+(investment|strategy)/i,
      /financial\s+advisor|financial\s+planner/i
    ];

    const foundFinancial = financialPatterns.some(pattern => pattern.test(message));

    return {
      safe: !foundFinancial,
      reason: foundFinancial 
        ? 'I cannot provide personalized financial advice. Please consult with a qualified financial advisor.'
        : null
    };
  }

  /**
   * Enhanced account-specific detection
   */
  async checkAccountSpecific(message) {
    const accountPatterns = [
      /my\s+(account|balance|payment|statement|transactions)/i,
      /my\s+(credit\s*line|credit\s*limit|rate|apr)/i,
      /my\s+(card|account\s*number|account\s*details)/i,
      /check\s+my\s+(balance|account|transactions)/i,
      /what\s+is\s+my\s+(balance|payment|rate)/i,
      /my\s+(personal|private)\s+information/i
    ];

    const foundAccount = accountPatterns.some(pattern => pattern.test(message));

    return {
      safe: !foundAccount,
      reason: foundAccount 
        ? 'I cannot access your personal account information. Please log into your Aven account or contact support at (888) 966-4655.'
        : null
    };
  }

  /**
   * Medical advice detection
   */
  async checkMedicalAdvice(message) {
    const medicalPatterns = [
      /medical\s+advice|health\s+advice/i,
      /should\s+i\s+(take|use|stop)\s+(medication|medicine)/i,
      /medical\s+condition|health\s+condition/i,
      /symptoms|diagnosis|treatment/i,
      /doctor|physician|medical\s+professional/i
    ];

    const foundMedical = medicalPatterns.some(pattern => pattern.test(message));

    return {
      safe: !foundMedical,
      reason: foundMedical 
        ? 'I cannot provide medical advice. Please consult with a qualified healthcare professional.'
        : null
    };
  }

  /**
   * Political content detection
   */
  async checkPoliticalContent(message) {
    const politicalKeywords = [
      'politics', 'political', 'election', 'vote', 'candidate', 'party',
      'democrat', 'republican', 'liberal', 'conservative', 'government',
      'policy', 'legislation', 'congress', 'senate', 'president'
    ];

    const messageLower = message.toLowerCase();
    const foundPolitical = politicalKeywords.some(keyword => messageLower.includes(keyword));

    return {
      safe: !foundPolitical,
      reason: foundPolitical 
        ? 'I cannot discuss political topics. I\'m here to help with Aven-related questions only.'
        : null
    };
  }

  /**
   * Spam detection
   */
  async checkSpam(message) {
    const spamIndicators = [
      /buy\s+now|limited\s+time|act\s+now/i,
      /click\s+here|visit\s+website|free\s+offer/i,
      /make\s+money|earn\s+money|get\s+rich/i,
      /weight\s+loss|diet\s+pill|miracle\s+cure/i,
      /lottery|winner|prize|claim\s+your/i
    ];

    const foundSpam = spamIndicators.some(pattern => pattern.test(message));

    return {
      safe: !foundSpam,
      reason: foundSpam 
        ? 'I cannot process spam or promotional content. Please ask questions related to Aven products and services.'
        : null
    };
  }

  /**
   * Impersonation detection
   */
  async checkImpersonation(message, context = {}) {
    const impersonationPatterns = [
      /i\s+am\s+(sarah|aven|support|agent)/i,
      /i\s+work\s+for\s+(aven|company)/i,
      /i\s+am\s+a\s+(representative|agent|employee)/i,
      /i\s+can\s+(help|assist)\s+you\s+with\s+(anything|everything)/i
    ];

    const foundImpersonation = impersonationPatterns.some(pattern => pattern.test(message));

    return {
      safe: !foundImpersonation,
      reason: foundImpersonation 
        ? 'I cannot respond to impersonation attempts. I am Sarah, the AI assistant for Aven.'
        : null
    };
  }

  /**
   * Calculate overall confidence score for safety checks
   */
  calculateConfidence(checks) {
    const safeChecks = Object.values(checks).filter(check => check.safe).length;
    const totalChecks = Object.keys(checks).length;
    return (safeChecks / totalChecks) * 100;
  }

  /**
   * Generate appropriate response for safety violations
   */
  generateSafetyResponse(issues, agentName = 'Sarah') {
    if (issues.length === 0) return null;

    const firstIssue = issues[0];
    let response = `Hi, I'm ${agentName}! `;

    // Customize response based on issue type
    switch (firstIssue.type) {
      case 'toxicity':
        response += 'I aim to maintain a professional and respectful environment. ';
        break;
      case 'personalData':
        response += 'For security reasons, I cannot handle sensitive information. ';
        break;
      case 'legalAdvice':
        response += 'I cannot provide legal advice. ';
        break;
      case 'financialAdvice':
        response += 'I cannot provide personalized financial advice. ';
        break;
      case 'accountSpecific':
        response += 'I cannot access your personal account information. ';
        break;
      default:
        response += 'I cannot process this type of request. ';
    }

    response += firstIssue.reason;
    response += ' For account-specific questions, please contact Aven support at (888) 966-4655 or support@aven.com.';

    return response;
  }

  /**
   * Log safety violations for monitoring
   */
  logSafetyViolation(issues, message, sessionId) {
    if (issues.length > 0) {
      console.log(`🚨 Safety violation detected in session ${sessionId}:`, {
        issues: issues.map(i => i.type),
        message: message.substring(0, 100) + '...',
        timestamp: new Date().toISOString()
      });
    }
  }
}

module.exports = new GuardrailsService(); 