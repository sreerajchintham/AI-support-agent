const express = require('express');
const router = express.Router();
const vapiService = require('../services/vapiService');
const guardrailsService = require('../services/guardrailsService');

// Get Vapi configuration for frontend
router.get('/config', async (req, res) => {
  try {
    const config = vapiService.getPublicConfig();
    res.json(config);
  } catch (error) {
    console.error('Failed to get Vapi config:', error);
    res.status(500).json({ error: 'Failed to get Vapi configuration' });
  }
});

// Vapi webhook handler for voice interactions
router.post('/webhook', async (req, res) => {
  try {
    const { type, message, call } = req.body;
    
    console.log(`🎙️ Vapi webhook received: ${type}`);
    
    // Handle different webhook types
    switch (type) {
      case 'message':
        if (message && message.role === 'user') {
          // Apply guardrails to user messages
          const safetyChecks = await guardrailsService.performSafetyChecks(message.content, {
            sessionId: call?.id,
            callType: 'voice'
          });
          
          if (!safetyChecks.overallSafe) {
            // Log safety violation
            guardrailsService.logSafetyViolation(safetyChecks.issues, message.content, call?.id || 'unknown');
            
            // Return safety response
            const safetyResponse = guardrailsService.generateSafetyResponse(safetyChecks.issues, 'Sarah');
            
            return res.json({
              response: {
                role: 'assistant',
                content: safetyResponse
              }
            });
          }
        }
        break;
        
      case 'call-start':
        console.log(`📞 Call started: ${call?.id}`);
        break;
        
      case 'call-end':
        console.log(`📞 Call ended: ${call?.id}`);
        break;
        
      case 'function-call':
        // Handle function calls (meeting scheduling, etc.)
        const result = await vapiService.handleFunctionCall(req.body.functionCall);
        return res.json({ response: result });
        
      default:
        console.log(`📝 Unhandled webhook type: ${type}`);
    }
    
    // Default response for unhandled cases
    res.json({ response: null });
    
  } catch (error) {
    console.error('❌ Vapi webhook error:', error);
    res.status(500).json({ 
      error: 'Webhook processing failed',
      message: 'I apologize, but I encountered an error. Please try again or contact support.'
    });
  }
});

// Health check for Vapi service
router.get('/health', async (req, res) => {
  try {
    const isConfigured = vapiService.getPublicConfig().isConfigured;
    res.json({
      status: isConfigured ? 'healthy' : 'unconfigured',
      service: 'Vapi Voice Assistant',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router; 