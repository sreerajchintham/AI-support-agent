const knowledgeService = require('./src/services/knowledgeService');

async function initializeKnowledgeBase() {
  console.log('🚀 Initializing Aven Knowledge Base');
  console.log('====================================\n');
  
  try {
    // Initialize the knowledge service
    console.log('📚 Initializing knowledge service...');
    await knowledgeService.initialize();
    
    // Reindex the knowledge base with Aven data
    console.log('🔄 Loading and processing Aven data...');
    const result = await knowledgeService.reindexKnowledgeBase();
    
    console.log('✅ Knowledge base initialized successfully!');
    console.log(`📄 Documents processed: ${result.documentsProcessed}`);
    console.log(`🔮 Vectors created: ${result.vectorsUpserted}`);
    
    // Test the search functionality
    console.log('\n🧪 Testing search functionality...');
    const testQuery = "What is the Aven Card?";
    const searchResults = await knowledgeService.searchKnowledge(testQuery, 3);
    
    console.log(`Query: "${testQuery}"`);
    console.log(`Found ${searchResults.length} relevant results:`);
    
    for (const result of searchResults) {
      console.log(`  - ${result.title} (Score: ${result.score.toFixed(3)})`);
    }
    
    console.log('\n🎉 Knowledge base is ready!');
    console.log('💡 You can now use the chat interface to ask questions about Aven.');
    
  } catch (error) {
    console.error('❌ Failed to initialize knowledge base:', error.message);
    process.exit(1);
  }
}

// Run the initialization
initializeKnowledgeBase(); 