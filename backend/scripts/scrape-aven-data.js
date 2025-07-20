const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

class AvenDataScraper {
  constructor() {
    this.dataDir = path.join(__dirname, '../../data/scraped');
    this.browser = null;
  }

  async initialize() {
    console.log('🚀 Initializing Aven data scraper...');
    
    // Create data directory if it doesn't exist
    await fs.mkdir(this.dataDir, { recursive: true });
    
    // Launch browser
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('✅ Scraper initialized');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  // Scrape Aven's main website
  async scrapeAvenWebsite() {
    console.log('🌐 Scraping Aven website...');
    
    const page = await this.browser.newPage();
    const data = {
      company_info: {},
      products: [],
      features: [],
      faqs: [],
      contact: {},
      scraped_at: new Date().toISOString()
    };

    try {
      // Main website
      await page.goto('https://aven.com', { waitUntil: 'networkidle2', timeout: 30000 });
      
      // Extract company information
      data.company_info = await page.evaluate(() => {
        const info = {};
        
        // Get page title
        info.title = document.title || 'Aven - Home Equity Credit Card';
        
        // Get meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        info.description = metaDesc ? metaDesc.getAttribute('content') : '';
        
        // Get main heading
        const mainHeading = document.querySelector('h1');
        info.main_heading = mainHeading ? mainHeading.textContent.trim() : '';
        
        return info;
      });

      // Extract product information
      data.products = await page.evaluate(() => {
        const products = [];
        
        // Look for product sections
        const productSections = document.querySelectorAll('[class*="product"], [class*="card"], [class*="feature"]');
        
        productSections.forEach(section => {
          const title = section.querySelector('h2, h3, h4')?.textContent.trim();
          const description = section.querySelector('p')?.textContent.trim();
          
          if (title && description) {
            products.push({ title, description });
          }
        });
        
        return products;
      });

      // Extract features
      data.features = await page.evaluate(() => {
        const features = [];
        
        // Look for feature lists
        const featureElements = document.querySelectorAll('li, [class*="feature"], [class*="benefit"]');
        
        featureElements.forEach(element => {
          const text = element.textContent.trim();
          if (text.length > 20 && text.length < 200) {
            features.push(text);
          }
        });
        
        return features.slice(0, 10); // Limit to 10 features
        });

      // Extract contact information
      data.contact = await page.evaluate(() => {
        const contact = {};
        
        // Look for phone numbers
        const phoneRegex = /\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;
        const phoneMatches = document.body.textContent.match(phoneRegex);
        if (phoneMatches) {
          contact.phone = phoneMatches[0];
        }
        
        // Look for email addresses
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const emailMatches = document.body.textContent.match(emailRegex);
        if (emailMatches) {
          contact.email = emailMatches.find(email => email.includes('aven'));
        }
        
        return contact;
      });

      console.log('✅ Website scraping completed');
    } catch (error) {
      console.error('❌ Website scraping failed:', error.message);
    } finally {
      await page.close();
    }

    return data;
  }

  // Scrape additional Aven information from various sources
  async scrapeAdditionalSources() {
    console.log('🔍 Scraping additional sources...');
    
    const additionalData = {
      heloc_info: [],
      rates_info: [],
      application_process: [],
      customer_reviews: [],
            scraped_at: new Date().toISOString()
    };

    try {
      // Scrape HELOC information from financial websites
      const helocSources = [
        'https://www.investopedia.com/terms/h/heloc.asp',
        'https://www.consumerfinance.gov/ask-cfpb/what-is-a-home-equity-line-of-credit-heloc-en-168/'
      ];

      for (const source of helocSources) {
        try {
          const response = await axios.get(source, { timeout: 10000 });
          const $ = cheerio.load(response.data);
          
          // Extract relevant content
          const content = $('p, h1, h2, h3, h4, h5, h6').map((i, el) => $(el).text().trim()).get();
          
          additionalData.heloc_info.push({
            source: source,
            content: content.slice(0, 10).join(' ').substring(0, 1000) // Limit content
          });
        } catch (error) {
          console.log(`⚠️ Failed to scrape ${source}:`, error.message);
        }
  }

      // Generate synthetic Aven-specific data
      additionalData.rates_info = [
      {
          title: 'Aven Card Interest Rates',
          content: 'The Aven Card offers variable interest rates based on the Prime Rate or Federal Funds Target Rate, with a maximum APR of 18%. Rates are typically much lower than traditional credit cards due to the home equity backing.',
          source: 'synthetic'
      },
      {
          title: 'Rate Calculation',
          content: 'Your rate is calculated based on your credit profile, home equity, and current market conditions. The rate can adjust monthly based on changes in the Prime Rate.',
          source: 'synthetic'
        }
      ];

      additionalData.application_process = [
        {
          title: 'How to Apply for Aven Card',
          content: 'The application process starts with a soft credit pull that doesn\'t affect your credit score. You\'ll need to provide information about your income, home equity, and debt obligations. The process typically takes 10-15 minutes online.',
          source: 'synthetic'
      },
      {
          title: 'Eligibility Requirements',
          content: 'To qualify for the Aven Card, you need to be a homeowner with sufficient equity in your home, have a good credit score, and meet income requirements. The underwriting system evaluates your overall financial profile.',
          source: 'synthetic'
        }
      ];

      console.log('✅ Additional sources scraping completed');
      } catch (error) {
      console.error('❌ Additional sources scraping failed:', error.message);
    }

    return additionalData;
  }

  // Generate comprehensive FAQ data
  generateComprehensiveFAQs() {
    console.log('📋 Generating comprehensive FAQ data...');
    
    const faqs = [
      {
        category: 'Product Basics',
        question: 'What is the Aven Card?',
        answer: 'The Aven Card is a credit card backed by your home equity (HELOC). It allows you to access your home\'s equity through everyday spending, with rates typically much lower than traditional credit cards.'
      },
      {
        category: 'Product Basics',
        question: 'How does the Aven Card work?',
        answer: 'The Aven Card works like a regular credit card but is secured by your home equity. You can use it for purchases wherever VISA is accepted, and you only pay interest on what you use. No monthly payments are required.'
      },
      {
        category: 'Product Basics',
        question: 'What is the maximum credit limit?',
        answer: 'The maximum credit limit for the Aven Card is $250,000, depending on your home equity and credit profile.'
      },
      {
        category: 'Rates and Fees',
        question: 'What are the interest rates?',
        answer: 'The Aven Card has variable rates based on the Prime Rate or Federal Funds Target Rate, with a maximum APR of 18%. Rates are typically much lower than traditional credit cards.'
      },
      {
        category: 'Rates and Fees',
        question: 'Are there any annual fees?',
        answer: 'No, there are no annual fees, application fees, or account closing fees with the Aven Card.'
      },
      {
        category: 'Rates and Fees',
        question: 'What fees are associated with the card?',
        answer: 'The Aven Card has no application fees, no annual fees, and no account closing fees. You only pay interest on the amount you use.'
      },
      {
        category: 'Application Process',
        question: 'How do I apply for an Aven Card?',
        answer: 'You can apply online at aven.com. The process starts with a soft credit pull that doesn\'t affect your credit score and typically takes 10-15 minutes to complete.'
      },
      {
        category: 'Application Process',
        question: 'What are the eligibility requirements?',
        answer: 'You need to be a homeowner with sufficient equity, have a good credit score, and meet income requirements. The underwriting system evaluates your overall financial profile.'
      },
      {
        category: 'Application Process',
        question: 'Does applying affect my credit score?',
        answer: 'The initial application uses a soft credit pull that doesn\'t affect your credit score. Only if you proceed with the offer will a hard pull be performed.'
      },
      {
        category: 'Usage and Features',
        question: 'Where can I use my Aven Card?',
        answer: 'You can use your Aven Card anywhere VISA is accepted for purchases. However, it cannot be used at ATMs, casinos, timeshares, money transfer businesses, or cryptocurrency exchanges.'
      },
      {
        category: 'Usage and Features',
        question: 'Can I get cash advances?',
        answer: 'No, the Aven Card cannot be used for cash advances or ATM withdrawals.'
      },
      {
        category: 'Usage and Features',
        question: 'How do I make payments?',
        answer: 'You can set up automatic payments from your bank account or make manual payments online. You only need to pay the interest on what you use, with no minimum payment required.'
      },
      {
        category: 'Rewards and Benefits',
        question: 'Do I earn cashback?',
        answer: 'Yes, you can earn 2% cashback on eligible purchases when autopay is enabled.'
      },
      {
        category: 'Rewards and Benefits',
        question: 'How do I earn cashback rewards?',
        answer: 'To earn 2% cashback, you need to enable autopay on your account. The cashback is applied to eligible purchases.'
      },
      {
        category: 'Account Management',
        question: 'How do I check my balance?',
        answer: 'You can check your balance online through your Aven account dashboard or by contacting customer service.'
      },
      {
        category: 'Account Management',
        question: 'Can I view my transactions online?',
        answer: 'Yes, you can view all your transactions and account activity through your online account dashboard.'
      },
      {
        category: 'Contact and Support',
        question: 'How do I contact Aven support?',
        answer: 'You can contact Aven support by calling (888) 966-4655 or emailing support@aven.com.'
      },
      {
        category: 'Contact and Support',
        question: 'What is the customer service phone number?',
        answer: 'The Aven customer service phone number is (888) 966-4655.'
      },
      {
        category: 'Advanced Topics',
        question: 'How does the variable rate work?',
        answer: 'The variable rate is based on the Prime Rate or Federal Funds Target Rate and can adjust monthly. Your specific rate depends on your credit profile and market conditions.'
      },
      {
        category: 'Advanced Topics',
        question: 'What happens if I miss a payment?',
        answer: 'Missing payments can result in late fees and may affect your credit score. It\'s important to make at least the minimum payment by the due date.'
      },
      {
        category: 'Edge Cases',
        question: 'Can I use my card internationally?',
        answer: 'The Aven Card cannot be used in foreign countries that are on US sanctions lists. For other international use, please check with customer service.'
      },
      {
        category: 'Edge Cases',
        question: 'What if I want to close my account?',
        answer: 'You can close your Aven Card account at any time without fees. Contact customer service to initiate the closure process.'
      }
    ];

    return {
      faqs: faqs,
      categories: [...new Set(faqs.map(faq => faq.category))],
      scraped_at: new Date().toISOString()
    };
  }

  // Combine all data and save to files
  async scrapeAndSaveAllData() {
    try {
      console.log('🚀 Starting comprehensive Aven data scraping...');
      
      // Scrape website data
      const websiteData = await this.scrapeAvenWebsite();
      
      // Scrape additional sources
      const additionalData = await this.scrapeAdditionalSources();
      
      // Generate comprehensive FAQs
      const faqData = this.generateComprehensiveFAQs();
      
      // Combine all data
      const comprehensiveData = {
        website: websiteData,
        additional: additionalData,
        faqs: faqData,
        metadata: {
          scraped_at: new Date().toISOString(),
          total_sources: 3,
          version: '2.0'
        }
      };

      // Save comprehensive data
      const comprehensivePath = path.join(this.dataDir, 'aven-comprehensive-data.json');
      await fs.writeFile(comprehensivePath, JSON.stringify(comprehensiveData, null, 2));
      console.log(`✅ Comprehensive data saved to ${comprehensivePath}`);

      // Save individual files for backward compatibility
      const enhancedPath = path.join(this.dataDir, 'aven-enhanced-data.json');
      const enhancedData = {
        data: [
          ...websiteData.products.map(p => ({ title: p.title, content: p.description, source: 'website', category: 'products' })),
          ...websiteData.features.map(f => ({ title: 'Feature', content: f, source: 'website', category: 'features' })),
          ...additionalData.rates_info,
          ...additionalData.application_process
        ],
        scraped_at: new Date().toISOString()
      };
      await fs.writeFile(enhancedPath, JSON.stringify(enhancedData, null, 2));
      console.log(`✅ Enhanced data saved to ${enhancedPath}`);

      // Save FAQ data
      const faqPath = path.join(this.dataDir, 'aven-detailed-faq.json');
      await fs.writeFile(faqPath, JSON.stringify(faqData, null, 2));
      console.log(`✅ FAQ data saved to ${faqPath}`);

      console.log('🎉 All data scraping completed successfully!');
      
      return {
        comprehensive: comprehensiveData,
        enhanced: enhancedData,
        faqs: faqData
      };
    } catch (error) {
      console.error('❌ Data scraping failed:', error);
      throw error;
    } finally {
      await this.close();
    }
  }
}

// Run the scraper if this file is executed directly
if (require.main === module) {
  const scraper = new AvenDataScraper();
  
  scraper.scrapeAndSaveAllData()
    .then(() => {
      console.log('✅ Scraping completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Scraping failed:', error);
      process.exit(1);
    });
}

module.exports = AvenDataScraper; 