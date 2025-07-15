const express = require('express');
const { body, validationResult } = require('express-validator');
const vapiService = require('../services/vapiService');
const router = express.Router();

/**
 * GET /api/vapi/config
 * Get public Vapi configuration for frontend
 */
router.get('/config', async (req, res) => {
  try {
    const config = vapiService.getPublicConfig();
    
    if (!config.isConfigured) {
      return res.status(503).json({
        error: 'Vapi not configured',
        message: 'Voice chat is not available. Please configure Vapi credentials.'
      });
    }
    
    res.json(config);
  } catch (error) {
    console.error('Error getting Vapi config:', error);
    res.status(500).json({
      error: 'Configuration error',
      message: 'Failed to get voice chat configuration'
    });
  }
});

/**
 * GET /api/vapi/assistant
 * Get current assistant configuration
 */
router.get('/assistant', async (req, res) => {
  try {
    const assistant = await vapiService.getAssistant();
    res.json(assistant);
  } catch (error) {
    console.error('Error getting assistant:', error);
    res.status(500).json({
      error: 'Assistant error',
      message: 'Failed to get assistant configuration'
    });
  }
});

/**
 * PUT /api/vapi/assistant
 * Update assistant configuration
 */
router.put('/assistant', [
  body('name').optional().isString().isLength({ min: 1, max: 100 }),
  body('firstMessage').optional().isString().isLength({ min: 1, max: 500 }),
  body('voice.voiceId').optional().isString(),
  body('model.temperature').optional().isFloat({ min: 0, max: 2 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation error',
        details: errors.array()
      });
    }

    const updates = req.body;
    const assistant = await vapiService.updateAssistant(updates);
    res.json(assistant);
  } catch (error) {
    console.error('Error updating assistant:', error);
    res.status(500).json({
      error: 'Update error',
      message: 'Failed to update assistant configuration'
    });
  }
});

/**
 * POST /api/vapi/webhook
 * Handle Vapi webhooks (function calls, call events, etc.)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const payload = JSON.parse(req.body.toString());
    console.log('📞 Received Vapi webhook:', payload.type || payload.message?.type);

    // Handle different webhook types
    switch (payload.type || payload.message?.type) {
      case 'function-call':
        return await handleFunctionCall(payload, res);
      
      case 'status-update':
        return await handleStatusUpdate(payload, res);
      
      case 'transcript':
        return await handleTranscript(payload, res);
      
      case 'call-start':
        return await handleCallStart(payload, res);
      
      case 'call-end':
        return await handleCallEnd(payload, res);
      
      default:
        console.log('📝 Unhandled webhook type:', payload.type || payload.message?.type);
        res.status(200).json({ received: true });
    }
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({
      error: 'Webhook processing failed',
      message: 'Internal server error'
    });
  }
});

/**
 * Handle function call webhooks
 */
async function handleFunctionCall(payload, res) {
  try {
    const functionCall = payload.functionCall || payload.message?.functionCall;
    
    if (!functionCall) {
      return res.status(400).json({
        error: 'Invalid function call',
        message: 'Function call data missing'
      });
    }

    console.log(`🔧 Processing function: ${functionCall.name}`);
    const result = await vapiService.handleFunctionCall(functionCall);
    
    // Return result to Vapi
    res.json({
      result: result
    });
    
  } catch (error) {
    console.error('Function call error:', error);
    res.status(500).json({
      error: 'Function execution failed',
      result: {
        error: 'Function execution failed',
        message: 'I apologize, but I encountered an error. Could you please try again?'
      }
    });
  }
}

/**
 * Handle call status updates
 */
async function handleStatusUpdate(payload, res) {
  try {
    const call = payload.call || payload.message?.call;
    console.log(`📱 Call status: ${call?.status} - ID: ${call?.id}`);
    
    // Log call information for analytics
    if (call) {
      console.log(`🕐 Call duration: ${call.endedAt ? 
        Math.round((new Date(call.endedAt) - new Date(call.startedAt)) / 1000) : 'ongoing'} seconds`);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(200).json({ received: true });
  }
}

/**
 * Handle transcript webhooks
 */
async function handleTranscript(payload, res) {
  try {
    const transcript = payload.transcript || payload.message?.transcript;
    const role = payload.role || payload.message?.role;
    
    if (transcript) {
      console.log(`💬 ${role}: ${transcript}`);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Transcript error:', error);
    res.status(200).json({ received: true });
  }
}

/**
 * Handle call start events
 */
async function handleCallStart(payload, res) {
  try {
    const call = payload.call || payload.message?.call;
    console.log(`🚀 Call started: ${call?.id}`);
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Call start error:', error);
    res.status(200).json({ received: true });
  }
}

/**
 * Handle call end events
 */
async function handleCallEnd(payload, res) {
  try {
    const call = payload.call || payload.message?.call;
    console.log(`🏁 Call ended: ${call?.id}`);
    
    // Log call summary for analytics
    if (call) {
      const duration = call.endedAt ? 
        Math.round((new Date(call.endedAt) - new Date(call.startedAt)) / 1000) : 0;
      console.log(`📊 Call summary - Duration: ${duration}s, End reason: ${call.endedReason || 'unknown'}`);
    }
    
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Call end error:', error);
    res.status(200).json({ received: true });
  }
}

/**
 * POST /api/vapi/call
 * Create an outbound call (for future use)
 */
router.post('/call', [
  body('phoneNumber').isString().matches(/^\+?[1-9]\d{1,14}$/),
  body('assistantId').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation error',
        details: errors.array()
      });
    }

    const { phoneNumber, assistantId } = req.body;
    const call = await vapiService.createCall(phoneNumber, assistantId);
    
    res.json({
      callId: call.id,
      status: call.status,
      message: 'Call initiated successfully'
    });
  } catch (error) {
    console.error('Error creating call:', error);
    res.status(500).json({
      error: 'Call creation failed',
      message: 'Failed to initiate outbound call'
    });
  }
});

/**
 * GET /api/vapi/health
 * Health check for Vapi service
 */
router.get('/health', (req, res) => {
  const config = vapiService.getPublicConfig();
  res.json({
    status: 'OK',
    vapiConfigured: config.isConfigured,
    assistantId: config.defaultAssistantId,
    timestamp: new Date().toISOString()
  });
});

module.exports = router; 