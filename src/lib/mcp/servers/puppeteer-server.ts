import { MCPServer, MCPCapability, MCPRequest, PuppeteerTask, PuppeteerAction } from '@/types/mcp';

export class PuppeteerMCPServer {
  private server: MCPServer;
  private activeTasks: Map<string, PuppeteerTask> = new Map();
  private taskQueue: PuppeteerTask[] = [];
  private isInitialized = false;
  private concurrentTasks = 0;

  constructor() {
    this.server = {
      id: 'puppeteer',
      name: 'Puppeteer MCP Server',
      type: 'puppeteer',
      status: 'disconnected',
      capabilities: this.getCapabilities(),
      config: {
        maxRetries: 3,
        heartbeatInterval: 30000,
        timeout: 60000,
        rateLimit: {
          requests: 10,
          timeWindow: 60000
        },
        features: {
          maxConcurrentTasks: 3,
          maxPageLoadTime: 30000,
          enableScreenshots: true,
          enablePdfGeneration: true,
          headless: true,
          defaultViewport: {
            width: 1920,
            height: 1080
          },
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
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
      console.log('Initializing Puppeteer MCP Server...');
      
      // Initialize task processor
      this.startTaskProcessor();
      
      this.server.status = 'connected';
      this.server.lastHeartbeat = new Date();
      this.isInitialized = true;
      
      console.log('Puppeteer MCP Server initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Puppeteer MCP Server:', error);
      this.server.status = 'error';
      throw error;
    }
  }

  private startTaskProcessor(): void {
    // Process queued tasks every 2 seconds
    setInterval(() => {
      this.processTaskQueue();
    }, 2000);
  }

  private getCapabilities(): MCPCapability[] {
    return [
      {
        name: 'takeScreenshot',
        description: 'Take a screenshot of a webpage',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', format: 'uri' },
            selector: { type: 'string' },
            fullPage: { type: 'boolean' },
            viewport: {
              type: 'object',
              properties: {
                width: { type: 'number' },
                height: { type: 'number' }
              }
            },
            waitFor: { type: 'string' }
          },
          required: ['url']
        },
        outputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            success: { type: 'boolean' },
            screenshotUrl: { type: 'string' }
          }
        },
        requiredPermissions: ['puppeteer.screenshot'],
        isEnabled: true
      },
      {
        name: 'generatePdf',
        description: 'Generate a PDF from a webpage',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', format: 'uri' },
            options: {
              type: 'object',
              properties: {
                format: { type: 'string', enum: ['A4', 'A3', 'Letter', 'Legal'] },
                landscape: { type: 'boolean' },
                margin: { type: 'object' },
                headerTemplate: { type: 'string' },
                footerTemplate: { type: 'string' }
              }
            }
          },
          required: ['url']
        },
        outputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            success: { type: 'boolean' },
            pdfUrl: { type: 'string' }
          }
        },
        requiredPermissions: ['puppeteer.pdf'],
        isEnabled: true
      },
      {
        name: 'scrapeDynamicContent',
        description: 'Scrape content from dynamic websites',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', format: 'uri' },
            selectors: { type: 'object' },
            actions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['click', 'type', 'select', 'wait', 'scroll'] },
                  selector: { type: 'string' },
                  value: { type: 'string' },
                  options: { type: 'object' }
                }
              }
            },
            waitFor: { type: 'string' }
          },
          required: ['url', 'selectors']
        },
        outputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            success: { type: 'boolean' },
            data: { type: 'object' }
          }
        },
        requiredPermissions: ['puppeteer.scrape'],
        isEnabled: true
      },
      {
        name: 'fillForm',
        description: 'Fill and submit web forms',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', format: 'uri' },
            formData: { type: 'object' },
            submitSelector: { type: 'string' },
            waitForNavigation: { type: 'boolean' }
          },
          required: ['url', 'formData']
        },
        outputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            success: { type: 'boolean' },
            result: { type: 'object' }
          }
        },
        requiredPermissions: ['puppeteer.form'],
        isEnabled: true
      },
      {
        name: 'monitorPage',
        description: 'Monitor a page for changes',
        inputSchema: {
          type: 'object',
          properties: {
            url: { type: 'string', format: 'uri' },
            selector: { type: 'string' },
            interval: { type: 'number' },
            threshold: { type: 'number' }
          },
          required: ['url', 'selector']
        },
        outputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' },
            success: { type: 'boolean' },
            monitoringStarted: { type: 'boolean' }
          }
        },
        requiredPermissions: ['puppeteer.monitor'],
        isEnabled: true
      },
      {
        name: 'getTaskStatus',
        description: 'Get the status of a Puppeteer task',
        inputSchema: {
          type: 'object',
          properties: {
            taskId: { type: 'string' }
          },
          required: ['taskId']
        },
        outputSchema: {
          type: 'object',
          properties: {
            task: { type: 'object' },
            found: { type: 'boolean' }
          }
        },
        requiredPermissions: ['puppeteer.read'],
        isEnabled: true
      }
    ];
  }

  async handleRequest(request: MCPRequest): Promise<any> {
    try {
      this.server.lastHeartbeat = new Date();
      
      switch (request.capability) {
        case 'takeScreenshot':
          return await this.takeScreenshot(request.payload, request.tenantId);
        case 'generatePdf':
          return await this.generatePdf(request.payload, request.tenantId);
        case 'scrapeDynamicContent':
          return await this.scrapeDynamicContent(request.payload, request.tenantId);
        case 'fillForm':
          return await this.fillForm(request.payload, request.tenantId);
        case 'monitorPage':
          return await this.monitorPage(request.payload, request.tenantId);
        case 'getTaskStatus':
          return await this.getTaskStatus(request.payload);
        default:
          throw new Error(`Unknown capability: ${request.capability}`);
      }
    } catch (error) {
      console.error(`Error handling request ${request.id}:`, error);
      throw error;
    }
  }

  private async takeScreenshot(payload: any, tenantId: string): Promise<any> {
    const { url, selector, fullPage = false, viewport, waitFor } = payload;
    
    const task: PuppeteerTask = {
      id: this.generateTaskId(),
      type: 'screenshot',
      url,
      actions: waitFor ? [{ type: 'wait', selector: waitFor }] : [],
      options: {
        viewport: viewport || this.server.config.features.defaultViewport,
        screenshot: true,
        pdf: false,
        timeout: this.server.config.features.maxPageLoadTime,
        waitFor: selector
      },
      tenantId,
      status: 'pending'
    };

    this.queueTask(task);
    
    return {
      taskId: task.id,
      success: true,
      screenshotUrl: null // Will be populated when task completes
    };
  }

  private async generatePdf(payload: any, tenantId: string): Promise<any> {
    const { url, options = {} } = payload;
    
    const task: PuppeteerTask = {
      id: this.generateTaskId(),
      type: 'pdf',
      url,
      actions: [],
      options: {
        viewport: this.server.config.features.defaultViewport,
        screenshot: false,
        pdf: true,
        timeout: this.server.config.features.maxPageLoadTime,
        pdfOptions: {
          format: options.format || 'A4',
          landscape: options.landscape || false,
          margin: options.margin || { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' },
          printBackground: true,
          ...options
        }
      },
      tenantId,
      status: 'pending'
    };

    this.queueTask(task);
    
    return {
      taskId: task.id,
      success: true,
      pdfUrl: null // Will be populated when task completes
    };
  }

  private async scrapeDynamicContent(payload: any, tenantId: string): Promise<any> {
    const { url, selectors, actions = [], waitFor } = payload;
    
    const task: PuppeteerTask = {
      id: this.generateTaskId(),
      type: 'scrape',
      url,
      actions: [
        ...actions,
        { type: 'extract', selector: 'body', value: JSON.stringify(selectors) }
      ],
      options: {
        viewport: this.server.config.features.defaultViewport,
        screenshot: false,
        pdf: false,
        timeout: this.server.config.features.maxPageLoadTime,
        waitFor
      },
      tenantId,
      status: 'pending'
    };

    this.queueTask(task);
    
    return {
      taskId: task.id,
      success: true,
      data: null // Will be populated when task completes
    };
  }

  private async fillForm(payload: any, tenantId: string): Promise<any> {
    const { url, formData, submitSelector, waitForNavigation = false } = payload;
    
    const actions: PuppeteerAction[] = [];
    
    // Create actions for form filling
    for (const [selector, value] of Object.entries(formData)) {
      actions.push({
        type: 'type',
        selector,
        value: value as string
      });
    }
    
    // Add submit action if specified
    if (submitSelector) {
      actions.push({
        type: 'click',
        selector: submitSelector,
        options: { waitForNavigation }
      });
    }
    
    const task: PuppeteerTask = {
      id: this.generateTaskId(),
      type: 'form-fill',
      url,
      actions,
      options: {
        viewport: this.server.config.features.defaultViewport,
        screenshot: false,
        pdf: false,
        timeout: this.server.config.features.maxPageLoadTime
      },
      tenantId,
      status: 'pending'
    };

    this.queueTask(task);
    
    return {
      taskId: task.id,
      success: true,
      result: null // Will be populated when task completes
    };
  }

  private async monitorPage(payload: any, tenantId: string): Promise<any> {
    const { url, selector, interval = 60000, threshold = 0.1 } = payload;
    
    const task: PuppeteerTask = {
      id: this.generateTaskId(),
      type: 'navigation',
      url,
      actions: [
        {
          type: 'wait',
          selector,
          options: { interval, threshold }
        }
      ],
      options: {
        viewport: this.server.config.features.defaultViewport,
        screenshot: false,
        pdf: false,
        timeout: this.server.config.features.maxPageLoadTime
      },
      tenantId,
      status: 'pending'
    };

    this.queueTask(task);
    
    return {
      taskId: task.id,
      success: true,
      monitoringStarted: true
    };
  }

  private async getTaskStatus(payload: any): Promise<any> {
    const { taskId } = payload;
    
    const task = this.activeTasks.get(taskId) || 
                 this.taskQueue.find(t => t.id === taskId);
    
    return {
      task: task || null,
      found: !!task
    };
  }

  private generateTaskId(): string {
    return `pup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private queueTask(task: PuppeteerTask): void {
    this.taskQueue.push(task);
    console.log(`Task queued: ${task.id} (${task.type})`);
  }

  private async processTaskQueue(): Promise<void> {
    if (this.taskQueue.length === 0) return;
    
    const maxConcurrent = this.server.config.features.maxConcurrentTasks;
    if (this.concurrentTasks >= maxConcurrent) return;
    
    const task = this.taskQueue.shift();
    if (!task) return;
    
    this.concurrentTasks++;
    this.activeTasks.set(task.id, task);
    
    try {
      await this.executeTask(task);
    } catch (error) {
      console.error(`Task execution failed: ${task.id}`, error);
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
    } finally {
      this.concurrentTasks--;
      
      // Keep completed tasks for a while for status queries
      setTimeout(() => {
        this.activeTasks.delete(task.id);
      }, 300000); // 5 minutes
    }
  }

  private async executeTask(task: PuppeteerTask): Promise<void> {
    console.log(`Executing task: ${task.id} (${task.type})`);
    task.status = 'running';
    
    try {
      // Mock implementation - in production, this would use actual Puppeteer
      await this.simulateTaskExecution(task);
      
      task.status = 'completed';
      console.log(`Task completed: ${task.id}`);
    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Task failed: ${task.id}`, error);
    }
  }

  private async simulateTaskExecution(task: PuppeteerTask): Promise<void> {
    // Simulate task execution time
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
    
    // Mock results based on task type
    switch (task.type) {
      case 'screenshot':
        task.result = {
          screenshotUrl: `https://example.com/screenshots/${task.id}.png`,
          dimensions: { width: 1920, height: 1080 }
        };
        break;
      
      case 'pdf':
        task.result = {
          pdfUrl: `https://example.com/pdfs/${task.id}.pdf`,
          pages: Math.floor(Math.random() * 10) + 1
        };
        break;
      
      case 'scrape':
        task.result = {
          data: {
            title: `Page Title for ${task.url}`,
            content: 'Scraped content would appear here',
            links: ['https://example.com/link1', 'https://example.com/link2'],
            images: ['https://example.com/image1.jpg']
          },
          metadata: {
            scrapedAt: new Date().toISOString(),
            elementsFound: Math.floor(Math.random() * 50) + 10
          }
        };
        break;
      
      case 'form-fill':
        task.result = {
          success: true,
          formSubmitted: true,
          redirectUrl: task.url + '/success',
          responseData: { message: 'Form submitted successfully' }
        };
        break;
      
      case 'navigation':
        task.result = {
          monitoring: true,
          checksPerformed: 1,
          lastCheck: new Date().toISOString(),
          changesDetected: false
        };
        break;
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

  getActiveTaskCount(): number {
    return this.concurrentTasks;
  }

  getQueuedTaskCount(): number {
    return this.taskQueue.length;
  }

  async shutdown(): Promise<void> {
    console.log('Shutting down Puppeteer MCP Server...');
    
    // Wait for active tasks to complete or timeout
    const maxWaitTime = 30000; // 30 seconds
    const startTime = Date.now();
    
    while (this.concurrentTasks > 0 && Date.now() - startTime < maxWaitTime) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Clear remaining tasks
    this.taskQueue.length = 0;
    this.activeTasks.clear();
    this.server.status = 'disconnected';
    
    console.log('Puppeteer MCP Server shutdown complete');
  }
}