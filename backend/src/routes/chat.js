const express = require('express');
const { body, validationResult } = require('express-validator');
const chatService = require('../services/chatService');

const router = express.Router();

// Validation middleware
const validateChatMessage = [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be between 1 and 1000 characters'),
  body('sessionId').optional().isString().withMessage('Session ID must be a string')
];

// Send a chat message and get AI response
router.post('/message', validateChatMessage, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }

    const { message, sessionId } = req.body;
    
    console.log(`💬 New chat message: "${message}"`);
    
    // Get AI response using RAG
    const response = await chatService.processMessage(message, sessionId);
    
    res.json({
      success: true,
      message: response.message,
      sessionId: response.sessionId,
      sources: response.sources || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      message: 'Sorry, I encountered an error. Please try again.'
    });
  }
});

// Get chat history for a session
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = await chatService.getChatHistory(sessionId);
    
    res.json({
      success: true,
      history: history || [],
      sessionId
    });

  } catch (error) {
    console.error('History retrieval error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve chat history'
    });
  }
});

// Clear chat history for a session
router.delete('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await chatService.clearChatHistory(sessionId);
    
    res.json({
      success: true,
      message: 'Chat history cleared',
      sessionId
    });

  } catch (error) {
    console.error('History clearing error:', error);
    res.status(500).json({ 
      error: 'Failed to clear chat history'
    });
  }
});

// Get suggested questions
router.get('/suggestions', async (req, res) => {
  try {
    const suggestions = await chatService.getSuggestedQuestions();
    
    res.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({ 
      error: 'Failed to get suggestions'
    });
  }
});

module.exports = router; 