#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config();

const knowledgeService = require('../src/services/knowledgeService');
const pineconeService = require('../src/services/pineconeService');
const openaiService = require('../src/services/openaiService');

console.log('🚀 Aven AI Support Agent Setup');
console.log('================================\n');

async function checkEnvironment() {
  console.log('🔍 Checking environment variables...');
  
  const requiredVars = [
    'OPENAI_API_KEY',
    'PINECONE_API_KEY',
    'PINECONE_ENVIRONMENT',
    'PINECONE_INDEX_NAME'
  ];
  
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    console.log('❌ Missing required environment variables:');
    missing.forEach(varName => console.log(`   - ${varName}`));
    console.log('\n💡 Please create a .env file with these variables or update your config.template.js file');
    return false;
  }
  
  console.log('✅ All required environment variables are set\n');
  return true;
}

async function testConnections() {
  console.log('🔗 Testing API connections...');
  
  try {
    // Test OpenAI
    console.log('   Testing OpenAI connection...');
    await openaiService.initialize();
    console.log('   ✅ OpenAI connection successful');
    
    // Test Pinecone
    console.log('   Testing Pinecone connection...');
    await pineconeService.initialize();
    console.log('   ✅ Pinecone connection successful');
    
    console.log('✅ All API connections successful\n');
    return true;
  } catch (error) {
    console.log(`❌ Connection failed: ${error.message}\n`);
    return false;
  }
}

async function createPineconeIndex() {
  console.log('🏗️ Setting up Pinecone index...');
  
  try {
    await pineconeService.createIndex();
    console.log('✅ Pinecone index ready\n');
    return true;
  } catch (error) {
    console.log(`❌ Failed to create index: ${error.message}\n`);
    return false;
  }
}

async function initializeKnowledgeBase() {
  console.log('📚 Initializing knowledge base...');
  
  try {
    const result = await knowledgeService.reindexKnowledgeBase();
    console.log(`✅ Knowledge base initialized successfully`);
    console.log(`   📄 Documents processed: ${result.documentsProcessed}`);
    console.log(`   🔮 Vectors created: ${result.vectorsUpserted}\n`);
    return true;
  } catch (error) {
    console.log(`❌ Failed to initialize knowledge base: ${error.message}\n`);
    return false;
  }
}

async function testRAG() {
  console.log('🧪 Testing RAG system...');
  
  const testQueries = [
    "What is the Aven Card?",
    "How do I apply for an Aven Card?",
    "What are the fees?"
  ];
  
  try {
    for (const query of testQueries) {
      console.log(`   Testing: "${query}"`);
      const result = await knowledgeService.searchKnowledge(query, 3);
      console.log(`   Found ${result.length} relevant results`);
    }
    
    console.log('✅ RAG system test successful\n');
    return true;
  } catch (error) {
    console.log(`❌ RAG test failed: ${error.message}\n`);
    return false;
  }
}

async function getIndexStats() {
  console.log('📊 Knowledge base statistics:');
  
  try {
    const stats = await pineconeService.getIndexStats();
    console.log(`   📈 Total vectors: ${stats.totalVectorCount}`);
    console.log(`   📏 Dimension: ${stats.dimension}`);
    console.log(`   🔋 Index fullness: ${(stats.indexFullness * 100).toFixed(2)}%\n`);
  } catch (error) {
    console.log(`❌ Failed to get stats: ${error.message}\n`);
  }
}

async function main() {
  try {
    // Step 1: Check environment
    const envOk = await checkEnvironment();
    if (!envOk) {
      process.exit(1);
    }
    
    // Step 2: Test connections
    const connectionsOk = await testConnections();
    if (!connectionsOk) {
      console.log('💡 Make sure your API keys are correct and you have internet access');
      process.exit(1);
    }
    
    // Step 3: Create Pinecone index
    const indexOk = await createPineconeIndex();
    if (!indexOk) {
      process.exit(1);
    }
    
    // Step 4: Initialize knowledge base
    const kbOk = await initializeKnowledgeBase();
    if (!kbOk) {
      process.exit(1);
    }
    
    // Step 5: Test RAG system
    const ragOk = await testRAG();
    if (!ragOk) {
      process.exit(1);
    }
    
    // Step 6: Show stats
    await getIndexStats();
    
    console.log('🎉 Setup completed successfully!');
    console.log('💡 You can now start the backend server with: npm run dev');
    console.log('💡 Available endpoints:');
    console.log('   - POST /api/chat/message - Send chat messages');
    console.log('   - GET /api/admin/stats - Get knowledge base stats');
    console.log('   - GET /health - Check system health\n');
    
  } catch (error) {
    console.error('💥 Setup failed:', error.message);
    process.exit(1);
  }
}

// Run setup if called directly
if (require.main === module) {
  main();
}

module.exports = { main }; 