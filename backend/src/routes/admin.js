const express = require('express');
const knowledgeService = require('../services/knowledgeService');
const pineconeService = require('../services/pineconeService');

const router = express.Router();

// Get knowledge base stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await pineconeService.getIndexStats();
    
    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Stats retrieval error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve stats'
    });
  }
});

// Reindex knowledge base
router.post('/reindex', async (req, res) => {
  try {
    console.log('🔄 Starting knowledge base reindexing...');
    
    const result = await knowledgeService.reindexKnowledgeBase();
    
    res.json({
      success: true,
      message: 'Knowledge base reindexed successfully',
      documentsProcessed: result.documentsProcessed,
      vectorsUpserted: result.vectorsUpserted,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Reindexing error:', error);
    res.status(500).json({ 
      error: 'Failed to reindex knowledge base'
    });
  }
});

// Add new document to knowledge base
router.post('/documents', async (req, res) => {
  try {
    const { title, content, source, metadata } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        error: 'Title and content are required'
      });
    }

    const result = await knowledgeService.addDocument({
      title,
      content,
      source: source || 'manual',
      metadata: metadata || {}
    });
    
    res.json({
      success: true,
      message: 'Document added successfully',
      documentId: result.documentId,
      vectorsCreated: result.vectorsCreated,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Document addition error:', error);
    res.status(500).json({ 
      error: 'Failed to add document'
    });
  }
});

// Clear entire knowledge base (use with caution!)
router.delete('/clear', async (req, res) => {
  try {
    const { confirm } = req.body;
    
    if (confirm !== 'CLEAR_ALL_DATA') {
      return res.status(400).json({
        error: 'Please provide confirmation: { "confirm": "CLEAR_ALL_DATA" }'
      });
    }

    await pineconeService.clearIndex();
    
    res.json({
      success: true,
      message: 'Knowledge base cleared successfully',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Knowledge base clearing error:', error);
    res.status(500).json({ 
      error: 'Failed to clear knowledge base'
    });
  }
});

// Test knowledge retrieval
router.post('/test-retrieval', async (req, res) => {
  try {
    const { query, topK = 5 } = req.body;
    
    if (!query) {
      return res.status(400).json({
        error: 'Query is required'
      });
    }

    const results = await knowledgeService.searchKnowledge(query, topK);
    
    res.json({
      success: true,
      query,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Test retrieval error:', error);
    res.status(500).json({ 
      error: 'Failed to test retrieval'
    });
  }
});

module.exports = router; 