const fs = require('fs').promises;
const path = require('path');
const openaiService = require('./openaiService');
const pineconeService = require('./pineconeService');

class KnowledgeService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    await openaiService.initialize();
    await pineconeService.initialize();
    
    this.initialized = true;
    console.log('✅ Knowledge service initialized');
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  // Chunk text into smaller pieces for better embeddings
  chunkText(text, maxChunkSize = 1000, overlap = 200) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const chunks = [];
    let currentChunk = '';
    
    for (const sentence of sentences) {
      const testChunk = currentChunk + sentence.trim() + '. ';
      
      if (testChunk.length <= maxChunkSize) {
        currentChunk = testChunk;
      } else {
        if (currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          
          // Create overlap by starting new chunk with last sentence
          const words = currentChunk.split(' ');
          const overlapWords = words.slice(-Math.floor(overlap / 6)); // Roughly overlap chars / avg word length
          currentChunk = overlapWords.join(' ') + ' ' + sentence.trim() + '. ';
        } else {
          // If single sentence is too long, just add it
          chunks.push(sentence.trim() + '.');
          currentChunk = '';
        }
      }
    }
    
    if (currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks.filter(chunk => chunk.length > 20); // Filter out very short chunks
  }

  // Process and add a document to the knowledge base
  async addDocument(document) {
    await this.ensureInitialized();
    
    try {
      const { title, content, source = 'manual', metadata = {} } = document;
      
      console.log(`📄 Processing document: ${title}`);
      
      // Chunk the content
      const chunks = this.chunkText(content);
      console.log(`📝 Created ${chunks.length} chunks`);
      
      // Create embeddings for each chunk
      const embeddings = await openaiService.createEmbeddings(chunks);
      
      // Prepare vectors for Pinecone
      const vectors = chunks.map((chunk, index) => ({
        id: `${source}_${title.replace(/\s+/g, '_')}_chunk_${index}`,
        values: embeddings[index],
        metadata: {
          title,
          content: chunk,
          source,
          chunkIndex: index,
          totalChunks: chunks.length,
          ...metadata
        }
      }));
      
      // Upsert to Pinecone
      await pineconeService.upsertVectors(vectors);
      
      console.log(`✅ Document "${title}" added to knowledge base`);
      
      return {
        documentId: `${source}_${title.replace(/\s+/g, '_')}`,
        vectorsCreated: vectors.length,
        chunksProcessed: chunks.length
      };
    } catch (error) {
      console.error('❌ Failed to add document:', error);
      throw new Error(`Failed to add document: ${error.message}`);
    }
  }

  // Search the knowledge base for relevant information
  async searchKnowledge(query, topK = 5) {
    await this.ensureInitialized();
    
    try {
      // Create embedding for the query
      const queryEmbedding = await openaiService.createEmbedding(query);
      
      // Search Pinecone for similar vectors
      const results = await pineconeService.queryVectors(queryEmbedding, topK);
      
      // Format results
      return results.map(match => ({
        id: match.id,
        score: match.score,
        title: match.metadata?.title || 'Unknown',
        content: match.metadata?.content || '',
        source: match.metadata?.source || 'unknown',
        chunkIndex: match.metadata?.chunkIndex || 0
      }));
    } catch (error) {
      console.error('❌ Failed to search knowledge:', error);
      throw new Error(`Failed to search knowledge: ${error.message}`);
    }
  }

  // Generate context from search results
  generateContext(searchResults, maxLength = 3000) {
    let context = '';
    let currentLength = 0;
    
    for (const result of searchResults) {
      const addition = `Source: ${result.title}\n${result.content}\n\n`;
      
      if (currentLength + addition.length <= maxLength) {
        context += addition;
        currentLength += addition.length;
      } else {
        break;
      }
    }
    
    return context.trim();
  }

  // Load and process Aven data from files
  async loadAvenData() {
    try {
      console.log('📚 Loading Aven knowledge base data...');
      
      const dataPath = path.join(__dirname, '../../../data/scraped/aven-support-data.json');
      const faqPath = path.join(__dirname, '../../../data/scraped/aven-detailed-faq.json');
      
      const rawData = await fs.readFile(dataPath, 'utf8');
      const faqData = await fs.readFile(faqPath, 'utf8');
      
      const avenData = JSON.parse(rawData);
      const faqContent = JSON.parse(faqData);
      
      // Create comprehensive content from the JSON data
      const documents = [];
      
      // Main company info
      documents.push({
        title: 'Aven Company Overview',
        content: `${avenData.company_info.description}. Contact information: Phone: ${avenData.company_info.contact.phone}, Support: ${avenData.company_info.contact.support_phone}, Email: ${avenData.company_info.contact.email}. Corporate address: ${avenData.company_info.contact.corporate_address}.`,
        source: 'company_info',
        metadata: { category: 'overview' }
      });
      
      // Key features
      const featuresContent = Object.entries(avenData.key_features)
        .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`)
        .join('. ');
      
      documents.push({
        title: 'Aven Card Features and Benefits',
        content: featuresContent,
        source: 'features',
        metadata: { category: 'features' }
      });
      
      // Trending questions
      const trendingContent = avenData.trending_questions
        .map((q, i) => `${i + 1}. ${q}`)
        .join(' ');
      
      documents.push({
        title: 'Frequently Asked Questions',
        content: `Common questions about Aven: ${trendingContent}`,
        source: 'faq',
        metadata: { category: 'faq' }
      });
      
      // Add detailed FAQ content (you would expand this with actual FAQ answers)
      const faqCategories = avenData.faq_categories.join(', ');
      documents.push({
        title: 'Support Categories',
        content: `Aven provides support in the following areas: ${faqCategories}. For detailed questions in these areas, customers can visit the support page or contact customer service.`,
        source: 'support_categories',
        metadata: { category: 'support' }
      });

      // Process detailed FAQ data
      console.log(`📋 Processing ${faqContent.faqs.length} detailed FAQ items...`);
      
      // Group FAQs by category
      const faqByCategory = {};
      for (const faq of faqContent.faqs) {
        if (!faqByCategory[faq.category]) {
          faqByCategory[faq.category] = [];
        }
        faqByCategory[faq.category].push(faq);
      }

      // Create documents for each FAQ category
      for (const [category, faqs] of Object.entries(faqByCategory)) {
        const categoryContent = faqs.map(faq => 
          `Q: ${faq.question}\nA: ${faq.answer}`
        ).join('\n\n');

        documents.push({
          title: `${category} - Frequently Asked Questions`,
          content: categoryContent,
          source: 'detailed_faq',
          metadata: { 
            category: category.toLowerCase().replace(/\s+/g, '_'),
            faq_count: faqs.length
          }
        });
      }

      // Create individual FAQ documents for better retrieval
      for (const faq of faqContent.faqs) {
        documents.push({
          title: `FAQ: ${faq.question}`,
          content: `Question: ${faq.question}\n\nAnswer: ${faq.answer}`,
          source: 'individual_faq',
          metadata: { 
            category: faq.category.toLowerCase().replace(/\s+/g, '_'),
            question_type: 'faq'
          }
        });
      }
      
      return documents;
    } catch (error) {
      console.error('❌ Failed to load Aven data:', error);
      throw new Error(`Failed to load Aven data: ${error.message}`);
    }
  }

  // Initialize knowledge base with Aven data
  async reindexKnowledgeBase() {
    await this.ensureInitialized();
    
    try {
      console.log('🔄 Reindexing knowledge base...');
      
      // Clear existing data
      await pineconeService.clearIndex();
      
      // Load Aven data
      const documents = await this.loadAvenData();
      
      let totalVectors = 0;
      
      // Process each document
      for (const doc of documents) {
        const result = await this.addDocument(doc);
        totalVectors += result.vectorsCreated;
      }
      
      console.log('✅ Knowledge base reindexed successfully');
      
      return {
        documentsProcessed: documents.length,
        vectorsUpserted: totalVectors
      };
    } catch (error) {
      console.error('❌ Failed to reindex knowledge base:', error);
      throw new Error(`Failed to reindex knowledge base: ${error.message}`);
    }
  }

  // Main function to get AI response with RAG
  async getAIResponse(query, conversationHistory = []) {
    await this.ensureInitialized();
    
    try {
      // Search for relevant information
      const searchResults = await this.searchKnowledge(query, 5);
      
      // Generate context from search results
      const context = this.generateContext(searchResults);
      
      // Get AI response
      const response = await openaiService.generateRAGResponse(query, context, conversationHistory);
      
      return {
        message: response.content,
        sources: searchResults.map(r => ({
          title: r.title,
          source: r.source,
          relevanceScore: r.score
        }))
      };
    } catch (error) {
      console.error('❌ Failed to get AI response:', error);
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
  }
}

module.exports = new KnowledgeService(); 