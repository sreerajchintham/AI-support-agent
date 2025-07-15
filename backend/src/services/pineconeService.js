const { Pinecone } = require('@pinecone-database/pinecone');
const config = require('../../config');

class PineconeService {
  constructor() {
    this.pinecone = null;
    this.index = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      console.log('🔗 Initializing Pinecone...');
      
      this.pinecone = new Pinecone({
        apiKey: config.PINECONE_API_KEY
      });

      this.index = this.pinecone.index(config.PINECONE_INDEX_NAME);
      this.initialized = true;
      
      console.log('✅ Pinecone initialized successfully');
    } catch (error) {
      console.error('❌ Pinecone initialization failed:', error);
      throw new Error(`Failed to initialize Pinecone: ${error.message}`);
    }
  }

  async ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  async upsertVectors(vectors) {
    await this.ensureInitialized();
    
    try {
      console.log(`📤 Upserting ${vectors.length} vectors to Pinecone...`);
      
      const batchSize = 100;
      const results = [];
      
      for (let i = 0; i < vectors.length; i += batchSize) {
        const batch = vectors.slice(i, i + batchSize);
        const result = await this.index.upsert(batch);
        results.push(result);
      }
      
      console.log('✅ Vectors upserted successfully');
      return results;
    } catch (error) {
      console.error('❌ Failed to upsert vectors:', error);
      throw new Error(`Failed to upsert vectors: ${error.message}`);
    }
  }

  async queryVectors(vector, topK = 5, filter = {}) {
    await this.ensureInitialized();
    
    try {
      const queryRequest = {
        vector,
        topK,
        includeMetadata: true,
        includeValues: false
      };

      if (Object.keys(filter).length > 0) {
        queryRequest.filter = filter;
      }

      const queryResponse = await this.index.query(queryRequest);
      return queryResponse.matches || [];
    } catch (error) {
      console.error('❌ Failed to query vectors:', error);
      throw new Error(`Failed to query vectors: ${error.message}`);
    }
  }

  async deleteVectors(ids) {
    await this.ensureInitialized();
    
    try {
      console.log(`🗑️ Deleting ${ids.length} vectors from Pinecone...`);
      await this.index.deleteMany(ids);
      console.log('✅ Vectors deleted successfully');
    } catch (error) {
      console.error('❌ Failed to delete vectors:', error);
      throw new Error(`Failed to delete vectors: ${error.message}`);
    }
  }

  async clearIndex() {
    await this.ensureInitialized();
    
    try {
      console.log('🧹 Clearing Pinecone index...');
      await this.index.deleteAll();
      console.log('✅ Index cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear index:', error);
      throw new Error(`Failed to clear index: ${error.message}`);
    }
  }

  async getIndexStats() {
    await this.ensureInitialized();
    
    try {
      const stats = await this.index.describeIndexStats();
      return {
        dimension: stats.dimension,
        indexFullness: stats.indexFullness,
        totalVectorCount: stats.totalVectorCount,
        namespaces: stats.namespaces || {}
      };
    } catch (error) {
      console.error('❌ Failed to get index stats:', error);
      throw new Error(`Failed to get index stats: ${error.message}`);
    }
  }

  async createIndex(dimension = 1536) {
    try {
      console.log(`🏗️ Checking if Pinecone index exists: ${config.PINECONE_INDEX_NAME}`);
      
      // Check if index already exists
      try {
        const indexList = await this.pinecone.listIndexes();
        const existingIndex = indexList.indexes?.find(idx => idx.name === config.PINECONE_INDEX_NAME);
        
        if (existingIndex) {
          console.log('📋 Index already exists, skipping creation...');
          return;
        }
      } catch (error) {
        console.log('⚠️ Could not check existing indexes, attempting to create...');
      }
      
      console.log(`🏗️ Creating Pinecone index: ${config.PINECONE_INDEX_NAME}`);
      
      await this.pinecone.createIndex({
        name: config.PINECONE_INDEX_NAME,
        dimension: dimension,
        metric: 'cosine',
        spec: {
          serverless: {
            cloud: 'aws',
            region: 'us-east-1'
          }
        }
      });
      
      console.log('✅ Index created successfully');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('📋 Index already exists, continuing...');
      } else {
        console.error('❌ Failed to create index:', error);
        throw new Error(`Failed to create index: ${error.message}`);
      }
    }
  }
}

module.exports = new PineconeService(); 