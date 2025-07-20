const fs = require('fs').promises;
const path = require('path');
const AvenDataScraper = require('./scrape-aven-data');
const knowledgeService = require('../src/services/knowledgeService');
const evaluationService = require('../src/services/evaluationService');
const meetingService = require('../src/services/meetingService');

class EnhancedSetup {
  constructor() {
    this.scraper = new AvenDataScraper();
  }

  async run() {
    console.log('🚀 Starting Enhanced Aven AI Support Agent Setup...');
    console.log('=' .repeat(60));

    try {
      // Step 1: Initialize scraper
      console.log('\n📊 Step 1: Initializing data scraper...');
      await this.scraper.initialize();

      // Step 2: Scrape comprehensive data
      console.log('\n🌐 Step 2: Scraping comprehensive Aven data...');
      const scrapedData = await this.scraper.scrapeAndSaveAllData();
      console.log('✅ Data scraping completed successfully');

      // Step 3: Initialize knowledge base
      console.log('\n🧠 Step 3: Initializing knowledge base...');
      await knowledgeService.initialize();
      console.log('✅ Knowledge service initialized');

      // Step 4: Reindex knowledge base with new data
      console.log('\n📚 Step 4: Reindexing knowledge base...');
      const reindexResult = await knowledgeService.reindexKnowledgeBase();
      console.log(`✅ Knowledge base reindexed: ${reindexResult.documentsProcessed} documents, ${reindexResult.vectorsUpserted} vectors`);

      // Step 5: Initialize evaluation system
      console.log('\n📊 Step 5: Initializing evaluation system...');
      const questions = evaluationService.getAllQuestions();
      console.log(`✅ Evaluation system ready with ${questions.length} test questions`);

      // Step 6: Initialize meeting service
      console.log('\n📅 Step 6: Initializing meeting service...');
      const meetingStats = meetingService.getMeetingStats();
      console.log(`✅ Meeting service ready with ${meetingStats.availableSlots} available slots`);

      // Step 7: Run quick evaluation test
      console.log('\n🧪 Step 7: Running quick evaluation test...');
      const testResult = await evaluationService.evaluateQuestion(1);
      console.log(`✅ Evaluation test completed - Accuracy: ${testResult.evaluation.accuracy}, Helpfulness: ${testResult.evaluation.helpfulness}`);

      // Step 8: Test knowledge retrieval
      console.log('\n🔍 Step 8: Testing knowledge retrieval...');
      const searchResult = await knowledgeService.searchKnowledge('What is the Aven Card?', 3);
      console.log(`✅ Knowledge retrieval test completed - Found ${searchResult.length} relevant results`);

      // Step 9: Generate setup summary
      console.log('\n📋 Step 9: Generating setup summary...');
      await this.generateSetupSummary();

      console.log('\n🎉 Enhanced setup completed successfully!');
      console.log('=' .repeat(60));
      console.log('\n🤖 Sarah is ready to help with:');
      console.log('   • Text and voice conversations');
      console.log('   • Meeting scheduling');
      console.log('   • Comprehensive Aven knowledge');
      console.log('   • Enhanced safety guardrails');
      console.log('   • Evaluation and testing');
      console.log('\n🚀 Start the servers with: npm run dev');

    } catch (error) {
      console.error('\n❌ Setup failed:', error);
      throw error;
    } finally {
      await this.scraper.close();
    }
  }

  async generateSetupSummary() {
    const summary = {
      timestamp: new Date().toISOString(),
      version: '2.0',
      features: {
        agent: 'Sarah',
        voice_support: true,
        meeting_scheduling: true,
        evaluation_system: true,
        enhanced_guardrails: true,
        comprehensive_knowledge: true
      },
      statistics: {
        test_questions: evaluationService.getAllQuestions().length,
        knowledge_documents: await this.getKnowledgeStats(),
        meeting_slots: meetingService.getMeetingStats().availableSlots
      },
      endpoints: {
        chat: '/api/chat',
        meetings: '/api/meetings',
        evaluation: '/api/evaluation',
        admin: '/api/admin',
        vapi: '/api/vapi'
      }
    };

    const summaryPath = path.join(__dirname, '../../data/setup-summary.json');
    await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));
    console.log(`✅ Setup summary saved to ${summaryPath}`);
  }

  async getKnowledgeStats() {
    try {
      // This would typically query the knowledge base
      // For now, return estimated stats
      return {
        total_documents: 50,
        total_vectors: 200,
        categories: ['product_basics', 'application', 'rates_fees', 'usage', 'rewards', 'support']
      };
    } catch (error) {
      return { error: 'Could not retrieve knowledge stats' };
    }
  }
}

// Run the enhanced setup if this file is executed directly
if (require.main === module) {
  const setup = new EnhancedSetup();
  
  setup.run()
    .then(() => {
      console.log('\n✅ Enhanced setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Enhanced setup failed:', error);
      process.exit(1);
    });
}

module.exports = EnhancedSetup; 