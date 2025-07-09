import { MCPServer, MCPCapability, MCPRequest, FetchRequest, FetchResponse, WebScrapingTask } from '@/types/mcp';

export class FetchMCPServer {
  private server: MCPServer;
  private scrapingTasks: Map<string, WebScrapingTask> = new Map();
  private requestCache: Map<string, { response: FetchResponse; timestamp: Date }> = new Map();
  private isInitialized = false;

  constructor() {
    this.server = {
      id: 'fetch',
      name: 'Fetch MCP Server',
      type: 'fetch',
      status: 'disconnected',
      capabilities: this.getCapabilities(),
      config: {
        maxRetries: 3,
        heartbeatInterval: 30000,
        timeout: 30000,
        rateLimit: {
          requests: 60,
          timeWindow: 60000
        },
        features: {
          cacheEnabled: true,
          cacheTTL: 300000, // 5 minutes
          maxCacheSize: 1000,
          followRedirects: true,
          userAgent: 'SunEdge-Power-Bot/1.0',
          allowedDomains: ['*'], // Allow all domains initially
          blockedDomains: ['localhost', '127.0.0.1', '0.0.0.0']
        }
      },
      tenantId: '',
      lastHeartbeat: new Date(),
      errorCount: 0,
      version: '1.0.0'
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing Fetch MCP Server...');
      
      // Initialize rate limiting
      this.initializeRateLimiting();
      
      // Start cache cleanup
      this.startCacheCleanup();
      
      // Initialize scraping tasks
      await this.initializeScrapingTasks();
      
      this.server.status = 'connected';
      this.server.lastHeartbeat = new Date();
      this.isInitialized = true;
      
      console.log('Fetch MCP Server initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Fetch MCP Server:', error);
      this.server.status = 'error';
      throw error;
    }
  }

  private initializeRateLimiting(): void {
    // Simple rate limiting implementation
    console.log('Rate limiting initialized');
  }

  private startCacheCleanup(): void {
    // Clean up cache every 5 minutes
    setInterval(() => {
      this.cleanupCache();
    }, 300000);
  }

  private async initializeScrapingTasks(): Promise<void> {
    // Initialize default scraping tasks for utility rates and competitor data
    const defaultTasks = [
      {
        id: 'utility-rates-general',
        url: 'https://www.energy.gov/eere/solar/solar-energy-technologies-office',
        selectors: {
          title: 'h1',
          content: '.field-name-body p',
          links: 'a[href*="solar"]'
        },
        type: 'utility-rates' as const,
        tenantId: 'default',
        status: 'pending' as const
      }
    ];

    // Add default tasks
    for (const task of defaultTasks) {
      this.scrapingTasks.set(task.id, task);
    }
  }

  private getCapabilities(): MCPCapability[] {
    return [
      {
        name: 'fetchUrl',
        description: 'Fetch content from a URL',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', format: 'uri' },
            method: { type: 'string', enum: ['GET', 'POST', 'PUT', 'DELETE'], default: 'GET' },
            headers: { type: 'object' },
            body: { type: 'string' },
            options: {
              type: 'object',
              properties: {
                timeout: { type: 'number' },
                retries: { type: 'number' },
                followRedirects: { type: 'boolean' },
                parseType: { type: 'string', enum: ['json', 'text', 'html'] }
              }
            }
          },
          required: ['url']
        },
        outputSchema: {
          type: 'object',
          properties: {
            status: { type: 'number' },
            headers: { type: 'object' },
            data: { type: 'any' },
            url: { type: 'string' },
            timing: { type: 'object' }
          }
        },
        requiredPermissions: ['fetch.read'],
        isEnabled: true
      },
      {
        name: 'scrapeWebsite',
        description: 'Scrape structured data from a website',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', format: 'uri' },
            selectors: { type: 'object' },
            options: {
              type: 'object',
              properties: {
                waitFor: { type: 'string' },
                timeout: { type: 'number' },
                followPagination: { type: 'boolean' }
              }
            }
          },
          required: ['url', 'selectors']
        },
        outputSchema: {
          type: 'object',
          properties: {
            data: { type: 'object' },
            url: { type: 'string' },
            timestamp: { type: 'string' }
          }
        },
        requiredPermissions: ['fetch.scrape'],
        isEnabled: true
      },
      {
        name: 'monitorUtilityRates',
        description: 'Monitor utility rates for a specific location',
        inputSchema: {
          type: 'object',
          properties: {
            state: { type: 'string' },
            utility: { type: 'string' },
            scheduleInterval: { type: 'number' }
          },
          required: ['state']
        },
        outputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            success: { type: 'boolean' },
            nextRun: { type: 'string' }
          }
        },
        requiredPermissions: ['fetch.monitor'],
        isEnabled: true
      },
      {
        name: 'getCompetitorData',
        description: 'Fetch competitor pricing and service data',
        inputSchema: {
          type: 'object',
          properties: {
            competitors: { type: 'array', items: { type: 'string' } },
            industry: { type: 'string' },
            location: { type: 'string' }
          },
          required: ['competitors', 'industry']
        },
        outputSchema: {
          type: 'object',
          properties: {
            data: { type: 'array' },
            lastUpdated: { type: 'string' }
          }
        },
        requiredPermissions: ['fetch.competitor'],
        isEnabled: true
      },
      {
        name: 'getWeatherData',
        description: 'Fetch weather data for location-based recommendations',
        inputSchema: {
          type: 'object',
          properties: {
            location: { type: 'string' },
            forecast: { type: 'boolean' }
          },
          required: ['location']
        },
        outputSchema: {
          type: 'object',
          properties: {
            current: { type: 'object' },
            forecast: { type: 'array' },
            location: { type: 'string' }
          }
        },
        requiredPermissions: ['fetch.weather'],
        isEnabled: true
      },
      {
        name: 'getNewsAndTrends',
        description: 'Fetch industry news and trends',
        inputSchema: {
          type: 'object',
          properties: {
            industry: { type: 'string' },
            keywords: { type: 'array', items: { type: 'string' } },
            limit: { type: 'number' }
          },
          required: ['industry']
        },
        outputSchema: {
          type: 'object',
          properties: {
            articles: { type: 'array' },
            totalCount: { type: 'number' }
          }
        },
        requiredPermissions: ['fetch.news'],
        isEnabled: true
      }
    ];
  }

  async handleRequest(request: MCPRequest): Promise<any> {
    try {
      this.server.lastHeartbeat = new Date();
      
      switch (request.capability) {
        case 'fetchUrl':
          return await this.fetchUrl(request.payload);
        case 'scrapeWebsite':
          return await this.scrapeWebsite(request.payload);
        case 'monitorUtilityRates':
          return await this.monitorUtilityRates(request.payload);
        case 'getCompetitorData':
          return await this.getCompetitorData(request.payload);
        case 'getWeatherData':
          return await this.getWeatherData(request.payload);
        case 'getNewsAndTrends':
          return await this.getNewsAndTrends(request.payload);
        default:
          throw new Error(`Unknown capability: ${request.capability}`);
      }
    } catch (error) {
      console.error(`Error handling request ${request.id}:`, error);
      throw error;
    }
  }

  private async fetchUrl(payload: any): Promise<FetchResponse> {
    const { url, method = 'GET', headers = {}, body, options = {} } = payload;
    
    // Check cache first
    const cacheKey = this.getCacheKey(url, method, headers, body);
    const cached = this.requestCache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.response;
    }

    // Validate URL
    if (!this.isUrlAllowed(url)) {
      throw new Error(`URL not allowed: ${url}`);
    }

    const startTime = Date.now();
    
    try {
      // Use fetch API
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'User-Agent': this.server.config.features.userAgent,
          ...headers
        },
        body: method !== 'GET' ? body : undefined,
        redirect: options.followRedirects ? 'follow' : 'manual'
      };

      const response = await fetch(url, fetchOptions);
      
      // Parse response based on content type
      let data: any;
      const contentType = response.headers.get('content-type') || '';
      
      if (options.parseType === 'json' || contentType.includes('application/json')) {
        data = await response.json();
      } else if (options.parseType === 'html' || contentType.includes('text/html')) {
        data = await response.text();
      } else {
        data = await response.text();
      }

      const fetchResponse: FetchResponse = {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data,
        url: response.url,
        timing: {
          total: Date.now() - startTime,
          dns: 0,
          connect: 0,
          ttfb: 0
        }
      };

      // Cache the response
      this.requestCache.set(cacheKey, {
        response: fetchResponse,
        timestamp: new Date()
      });

      return fetchResponse;
    } catch (error) {
      console.error(`Fetch error for ${url}:`, error);
      throw error;
    }
  }

  private async scrapeWebsite(payload: any): Promise<any> {
    const { url, selectors, options = {} } = payload;
    
    try {
      // Fetch the page content
      const response = await this.fetchUrl({ url, options: { parseType: 'html' } });
      
      if (response.status !== 200) {
        throw new Error(`Failed to fetch page: ${response.status}`);
      }

      // Parse HTML (in a real implementation, you'd use a proper HTML parser)
      const html = response.data;
      const scrapedData: any = {};
      
      // Simple text extraction (in production, use cheerio or similar)
      for (const [key, selector] of Object.entries(selectors)) {
        scrapedData[key] = this.extractContentBySelector(html, selector as string);
      }

      return {
        data: scrapedData,
        url: response.url,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Scraping error for ${url}:`, error);
      throw error;
    }
  }

  private extractContentBySelector(html: string, selector: string): string | string[] {
    // Simple text extraction - in production, use a proper HTML parser
    if (selector.includes('h1')) {
      const match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      return match ? match[1].replace(/<[^>]*>/g, '').trim() : '';
    }
    
    if (selector.includes('p')) {
      const matches = html.match(/<p[^>]*>(.*?)<\/p>/gi);
      return matches ? matches.map(m => m.replace(/<[^>]*>/g, '').trim()) : [];
    }
    
    if (selector.includes('a')) {
      const matches = html.match(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi);
      return matches ? matches.map(m => {
        const hrefMatch = m.match(/href="([^"]*)"/);
        return hrefMatch ? hrefMatch[1] : '';
      }).filter(Boolean) : [];
    }
    
    return '';
  }

  private async monitorUtilityRates(payload: any): Promise<any> {
    const { state, utility, scheduleInterval = 24 * 60 * 60 * 1000 } = payload; // Default 24 hours
    
    const taskId = `utility-rates-${state}-${utility || 'general'}-${Date.now()}`;
    
    // Create a monitoring task
    const task: WebScrapingTask = {
      id: taskId,
      url: this.getUtilityRateUrl(state, utility),
      selectors: {
        rates: '.rate-table td',
        effective_date: '.effective-date',
        utility_name: '.utility-name'
      },
      schedule: {
        interval: scheduleInterval,
        nextRun: new Date(Date.now() + scheduleInterval)
      },
      tenantId: 'default',
      type: 'utility-rates',
      status: 'pending'
    };

    this.scrapingTasks.set(taskId, task);
    
    // Execute initial scrape
    try {
      await this.executeScrapingTask(task);
    } catch (error) {
      console.error(`Initial scrape failed for ${taskId}:`, error);
    }

    return {
      taskId,
      success: true,
      nextRun: task.schedule?.nextRun.toISOString()
    };
  }

  private getUtilityRateUrl(state: string, utility?: string): string {
    // Default utility rate URLs - in production, this would be a comprehensive database
    const baseUrls = {
      'CA': 'https://www.cpuc.ca.gov/industries-and-topics/electrical-energy/electric-rates',
      'TX': 'https://www.puc.texas.gov/consumer/electricity/rates',
      'FL': 'https://www.psc.state.fl.us/ElectricNaturalGas/Electric',
      'NY': 'https://www3.dps.ny.gov/W/PSCWeb.nsf/All/26BE8A93967E604785257687006F38BD'
    };
    
    return baseUrls[state as keyof typeof baseUrls] || 'https://www.energy.gov/eere/solar/solar-energy-technologies-office';
  }

  private async executeScrapingTask(task: WebScrapingTask): Promise<void> {
    try {
      task.status = 'running';
      task.lastRun = new Date();
      
      const result = await this.scrapeWebsite({
        url: task.url,
        selectors: task.selectors
      });
      
      task.status = 'completed';
      
      // Store or process the scraped data
      console.log(`Scraping task ${task.id} completed:`, result);
    } catch (error) {
      task.status = 'failed';
      console.error(`Scraping task ${task.id} failed:`, error);
    }
  }

  private async getCompetitorData(payload: any): Promise<any> {
    const { competitors, industry, location } = payload;
    
    const competitorData = [];
    
    for (const competitor of competitors) {
      try {
        // In production, this would scrape actual competitor websites
        const mockData = {
          name: competitor,
          industry,
          location,
          pricing: {
            residential: '$2.50/watt',
            commercial: '$2.00/watt'
          },
          services: ['Installation', 'Maintenance', 'Monitoring'],
          rating: Math.random() * 2 + 3, // Mock rating 3-5
          reviews: Math.floor(Math.random() * 1000) + 100,
          lastUpdated: new Date().toISOString()
        };
        
        competitorData.push(mockData);
      } catch (error) {
        console.error(`Failed to fetch data for ${competitor}:`, error);
      }
    }
    
    return {
      data: competitorData,
      lastUpdated: new Date().toISOString()
    };
  }

  private async getWeatherData(payload: any): Promise<any> {
    const { location, forecast = false } = payload;
    
    // Mock weather data - in production, integrate with weather API
    const mockWeatherData = {
      current: {
        temperature: Math.floor(Math.random() * 40) + 60, // 60-100°F
        humidity: Math.floor(Math.random() * 60) + 40, // 40-100%
        cloudCover: Math.floor(Math.random() * 100), // 0-100%
        windSpeed: Math.floor(Math.random() * 20) + 5, // 5-25 mph
        uvIndex: Math.floor(Math.random() * 10) + 1, // 1-10
        solarIrradiance: Math.floor(Math.random() * 1000) + 200 // 200-1200 W/m²
      },
      forecast: forecast ? [
        { date: new Date().toISOString(), high: 85, low: 65, conditions: 'Sunny' },
        { date: new Date(Date.now() + 86400000).toISOString(), high: 82, low: 62, conditions: 'Partly Cloudy' }
      ] : undefined,
      location
    };
    
    return mockWeatherData;
  }

  private async getNewsAndTrends(payload: any): Promise<any> {
    const { industry, keywords = [], limit = 10 } = payload;
    
    // Mock news data - in production, integrate with news APIs
    const mockNews = [
      {
        title: 'Solar Energy Adoption Reaches New Heights in 2024',
        url: 'https://example.com/solar-news-1',
        summary: 'Solar installations have increased by 25% this year...',
        publishDate: new Date(Date.now() - 86400000).toISOString(),
        source: 'Solar Power World'
      },
      {
        title: 'New Battery Technology Improves Energy Storage',
        url: 'https://example.com/battery-news-1',
        summary: 'Advanced lithium-ion batteries now offer 40% longer life...',
        publishDate: new Date(Date.now() - 172800000).toISOString(),
        source: 'Energy Storage News'
      }
    ];
    
    // Filter by keywords if provided
    let filteredNews = mockNews;
    if (keywords.length > 0) {
      filteredNews = mockNews.filter(article => 
        keywords.some(keyword => 
          article.title.toLowerCase().includes(keyword.toLowerCase()) ||
          article.summary.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    }
    
    return {
      articles: filteredNews.slice(0, limit),
      totalCount: filteredNews.length
    };
  }

  private getCacheKey(url: string, method: string, headers: any, body: any): string {
    return `${method}:${url}:${JSON.stringify(headers)}:${JSON.stringify(body)}`;
  }

  private isCacheValid(timestamp: Date): boolean {
    const ttl = this.server.config.features.cacheTTL;
    return Date.now() - timestamp.getTime() < ttl;
  }

  private isUrlAllowed(url: string): boolean {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname.toLowerCase();
      
      // Check blocked domains
      const blockedDomains = this.server.config.features.blockedDomains;
      if (blockedDomains.includes(hostname)) {
        return false;
      }
      
      // Check allowed domains
      const allowedDomains = this.server.config.features.allowedDomains;
      if (allowedDomains.includes('*')) {
        return true;
      }
      
      return allowedDomains.some(domain => 
        hostname === domain || hostname.endsWith(`.${domain}`)
      );
    } catch (error) {
      return false;
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    const ttl = this.server.config.features.cacheTTL;
    
    for (const [key, cached] of this.requestCache.entries()) {
      if (now - cached.timestamp.getTime() > ttl) {
        this.requestCache.delete(key);
      }
    }
    
    // Also limit cache size
    const maxSize = this.server.config.features.maxCacheSize;
    if (this.requestCache.size > maxSize) {
      const entries = Array.from(this.requestCache.entries());
      entries.sort((a, b) => a[1].timestamp.getTime() - b[1].timestamp.getTime());
      
      const toDelete = entries.slice(0, entries.length - maxSize);
      toDelete.forEach(([key]) => this.requestCache.delete(key));
    }
  }

  getName(): string {
    return this.server.name;
  }

  getServer(): MCPServer {
    return { ...this.server };
  }

  getCapabilities(): MCPCapability[] {
    return [...this.server.capabilities];
  }

  async shutdown(): Promise<void> {
    console.log('Shutting down Fetch MCP Server...');
    
    this.scrapingTasks.clear();
    this.requestCache.clear();
    this.server.status = 'disconnected';
    
    console.log('Fetch MCP Server shutdown complete');
  }
}