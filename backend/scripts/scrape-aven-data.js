const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class AvenDataScraper {
  constructor() {
    this.baseUrl = 'https://www.aven.com';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
  }

  // Scrape Aven website for additional information
  async scrapeAvenWebsite() {
    const pages = [
      '/about',
      '/how-it-works',
      '/faq',
      '/support',
      '/rates',
      '/application',
      '/contact'
    ];

    const scrapedData = [];

    for (const page of pages) {
      try {
        console.log(`🔍 Scraping ${this.baseUrl}${page}...`);
        const response = await axios.get(`${this.baseUrl}${page}`, {
          headers: this.headers,
          timeout: 10000
        });

        // Extract text content (simplified extraction)
        const content = this.extractTextContent(response.data);
        
        if (content.length > 100) {
          scrapedData.push({
            url: `${this.baseUrl}${page}`,
            title: `Aven ${page.replace('/', '').replace('-', ' ')} Page`,
            content: content.substring(0, 2000), // Limit content size
            source: 'aven_website',
            scraped_at: new Date().toISOString()
          });
        }
      } catch (error) {
        console.log(`⚠️  Could not scrape ${page}: ${error.message}`);
      }
    }

    return scrapedData;
  }

  // Extract text content from HTML (basic implementation)
  extractTextContent(html) {
    // Remove script and style tags
    const cleanHtml = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                         .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    
    // Remove HTML tags and extract text
    const textContent = cleanHtml.replace(/<[^>]*>/g, ' ')
                                 .replace(/\s+/g, ' ')
                                 .trim();
    
    return textContent;
  }

  // Generate comprehensive HELOC information
  async generateHELOCInfo() {
    const helocData = [
      {
        title: "What is a HELOC (Home Equity Line of Credit)?",
        content: "A HELOC is a revolving line of credit that allows homeowners to borrow against the equity in their home. Unlike a traditional loan, a HELOC works like a credit card where you can draw funds as needed up to your credit limit, pay it back, and borrow again. The credit limit is typically based on the appraised value of your home minus any outstanding mortgage balance.",
        category: "HELOC Basics",
        source: "heloc_education"
      },
      {
        title: "How HELOC Interest Rates Work",
        content: "HELOC interest rates are typically variable, meaning they can change over time based on market conditions. Most HELOCs are tied to the prime rate, which is influenced by the Federal Reserve's federal funds rate. When the prime rate changes, your HELOC rate will adjust accordingly. Some lenders may offer fixed-rate options for portions of your HELOC balance.",
        category: "HELOC Rates",
        source: "heloc_education"
      },
      {
        title: "HELOC vs Home Equity Loan",
        content: "A HELOC provides flexible access to funds with variable interest rates, while a home equity loan gives you a lump sum with fixed interest rates. HELOCs are better for ongoing expenses or projects with uncertain costs, while home equity loans are ideal for one-time expenses with known amounts. Both use your home as collateral.",
        category: "HELOC Comparison",
        source: "heloc_education"
      },
      {
        title: "Tax Benefits of HELOC",
        content: "Interest paid on a HELOC may be tax-deductible if the funds are used to buy, build, or substantially improve the home that secures the loan. The Tax Cuts and Jobs Act of 2017 suspended the deduction for HELOC interest used for other purposes through 2025. Always consult with a tax professional for guidance specific to your situation.",
        category: "HELOC Tax Information",
        source: "heloc_education"
      },
      {
        title: "HELOC Draw Period vs Repayment Period",
        content: "HELOCs typically have two phases: the draw period (usually 5-10 years) where you can access funds and make interest-only payments, and the repayment period (usually 10-20 years) where you pay both principal and interest. During the draw period, you have flexibility in how much you borrow and repay.",
        category: "HELOC Terms",
        source: "heloc_education"
      },
      {
        title: "Aven's Unique HELOC Approach",
        content: "Aven revolutionizes the traditional HELOC by providing access through a credit card format. This eliminates the need for checks or bank transfers typical with traditional HELOCs. You can use the Aven card anywhere Visa is accepted, making it as convenient as a regular credit card while leveraging your home equity at lower interest rates than unsecured credit cards.",
        category: "Aven Innovation",
        source: "aven_advantage"
      }
    ];

    return helocData;
  }

  // Enhanced Aven-specific information
  async generateAvenInfo() {
    const avenData = [
      {
        title: "Aven's Mission and Vision",
        content: "Aven aims to democratize access to home equity by making it as easy to use as a credit card. The company believes homeowners should be able to access their home equity simply and affordably, without complex processes or lengthy approval times. Aven combines the flexibility of a credit card with the lower interest rates typically associated with home equity financing.",
        category: "About Aven",
        source: "aven_company"
      },
      {
        title: "How Aven Differs from Traditional HELOCs",
        content: "Traditional HELOCs require checks, bank transfers, or separate loan applications to access funds. Aven simplifies this by providing a Visa credit card that directly accesses your home equity line of credit. This means you can use your home equity at any merchant that accepts Visa, making it incredibly convenient for daily expenses, home improvements, or major purchases.",
        category: "Aven Advantages",
        source: "aven_company"
      },
      {
        title: "Aven's Technology Platform",
        content: "Aven leverages modern technology to streamline the traditionally complex HELOC process. The platform uses automated underwriting, digital document processing, and real-time account management. This allows for faster approvals, easier account management, and a more user-friendly experience compared to traditional banking institutions.",
        category: "Aven Technology",
        source: "aven_company"
      },
      {
        title: "Aven's Banking Partnership",
        content: "Aven partners with Coastal Community Bank, which is FDIC insured and provides the actual credit line. This partnership ensures that customers have the security of working with a regulated financial institution while benefiting from Aven's innovative technology and user experience. The credit card is issued by Coastal Community Bank pursuant to a license from Visa U.S.A., Inc.",
        category: "Aven Banking",
        source: "aven_company"
      },
      {
        title: "Aven's Customer Support Philosophy",
        content: "Aven prioritizes customer education and support throughout the entire process. The company provides comprehensive resources about home equity, responsible borrowing, and financial planning. Customer support is available through multiple channels and focuses on helping customers make informed decisions about their home equity.",
        category: "Aven Support",
        source: "aven_company"
      }
    ];

    return avenData;
  }

  // Main scraping function
  async scrapeAllData() {
    console.log('🚀 Starting comprehensive Aven and HELOC data collection...');
    
    const allData = [];
    
    try {
      // Generate educational HELOC content
      console.log('📚 Generating HELOC educational content...');
      const helocInfo = await this.generateHELOCInfo();
      allData.push(...helocInfo);
      
      // Generate Aven-specific content
      console.log('🏢 Generating Aven company information...');
      const avenInfo = await this.generateAvenInfo();
      allData.push(...avenInfo);
      
      // Attempt to scrape Aven website (may fail due to rate limiting)
      console.log('🌐 Attempting to scrape Aven website...');
      try {
        const webData = await this.scrapeAvenWebsite();
        allData.push(...webData);
      } catch (error) {
        console.log('⚠️  Website scraping failed, using generated content only');
      }
      
      // Save to file
      const outputPath = path.join(__dirname, '..', '..', 'data', 'scraped', 'aven-enhanced-data.json');
      await fs.writeFile(outputPath, JSON.stringify({
        source: "Enhanced Aven and HELOC Information",
        scraped_at: new Date().toISOString(),
        total_entries: allData.length,
        data: allData
      }, null, 2));
      
      console.log(`✅ Successfully created ${allData.length} enhanced data entries`);
      console.log(`📁 Saved to: ${outputPath}`);
      
      return allData;
      
    } catch (error) {
      console.error('❌ Error during data collection:', error);
      throw error;
    }
  }
}

// Run the scraper
if (require.main === module) {
  const scraper = new AvenDataScraper();
  scraper.scrapeAllData().catch(console.error);
}

module.exports = AvenDataScraper; 