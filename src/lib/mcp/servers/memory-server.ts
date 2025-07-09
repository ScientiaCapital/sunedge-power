import { MCPServer, MCPCapability, MCPRequest, MemoryContext, MemoryItem, CustomerMemory } from '@/types/mcp';

export class MemoryMCPServer {
  private server: MCPServer;
  private memoryContexts: Map<string, MemoryContext> = new Map();
  private isInitialized = false;

  constructor() {
    this.server = {
      id: 'memory',
      name: 'Memory MCP Server',
      type: 'memory',
      status: 'disconnected',
      capabilities: this.getCapabilities(),
      config: {
        maxRetries: 3,
        heartbeatInterval: 30000,
        timeout: 10000,
        rateLimit: {
          requests: 1000,
          timeWindow: 60000
        },
        features: {
          maxContextSize: 100000,
          memoryRetentionDays: 30,
          compressionEnabled: true,
          persistenceEnabled: true
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
      console.log('Initializing Memory MCP Server...');
      
      // Initialize memory storage
      await this.initializeStorage();
      
      // Start cleanup routine
      this.startCleanupRoutine();
      
      this.server.status = 'connected';
      this.server.lastHeartbeat = new Date();
      this.isInitialized = true;
      
      console.log('Memory MCP Server initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Memory MCP Server:', error);
      this.server.status = 'error';
      throw error;
    }
  }

  private async initializeStorage(): Promise<void> {
    // In a production environment, this would initialize persistent storage
    // For now, we'll use in-memory storage with cleanup
    console.log('Memory storage initialized');
  }

  private getCapabilities(): MCPCapability[] {
    return [
      {
        name: 'initializeTenant',
        description: 'Initialize memory context for a tenant',
        inputSchema: {
          type: 'object',
          properties: {
            tenantId: { type: 'string' }
          },
          required: ['tenantId']
        },
        outputSchema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            contextId: { type: 'string' }
          }
        },
        requiredPermissions: ['memory.write'],
        isEnabled: true
      },
      {
        name: 'storeMemory',
        description: 'Store a memory item in context',
        inputSchema: {
          type: 'object',
          properties: {
            conversationId: { type: 'string' },
            tenantId: { type: 'string' },
            type: { type: 'string', enum: ['fact', 'preference', 'context', 'decision'] },
            content: { type: 'string' },
            importance: { type: 'string', enum: ['low', 'medium', 'high'] },
            expiresAt: { type: 'string', format: 'date-time' },
            metadata: { type: 'object' }
          },
          required: ['conversationId', 'tenantId', 'type', 'content']
        },
        outputSchema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            memoryId: { type: 'string' }
          }
        },
        requiredPermissions: ['memory.write'],
        isEnabled: true
      },
      {
        name: 'retrieveMemory',
        description: 'Retrieve memory items from context',
        inputSchema: {
          type: 'object',
          properties: {
            conversationId: { type: 'string' },
            tenantId: { type: 'string' },
            query: { type: 'string' },
            type: { type: 'string' },
            importance: { type: 'string' },
            limit: { type: 'number' }
          },
          required: ['conversationId', 'tenantId']
        },
        outputSchema: {
          type: 'object',
          properties: {
            memories: { type: 'array' },
            totalCount: { type: 'number' }
          }
        },
        requiredPermissions: ['memory.read'],
        isEnabled: true
      },
      {
        name: 'updateCustomerProfile',
        description: 'Update customer profile in memory',
        inputSchema: {
          type: 'object',
          properties: {
            conversationId: { type: 'string' },
            tenantId: { type: 'string' },
            profile: { type: 'object' }
          },
          required: ['conversationId', 'tenantId', 'profile']
        },
        outputSchema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' }
          }
        },
        requiredPermissions: ['memory.write'],
        isEnabled: true
      },
      {
        name: 'getContext',
        description: 'Get full conversation context',
        inputSchema: {
          type: 'object',
          properties: {
            conversationId: { type: 'string' },
            tenantId: { type: 'string' }
          },
          required: ['conversationId', 'tenantId']
        },
        outputSchema: {
          type: 'object',
          properties: {
            context: { type: 'object' }
          }
        },
        requiredPermissions: ['memory.read'],
        isEnabled: true
      },
      {
        name: 'clearMemory',
        description: 'Clear memory for a conversation',
        inputSchema: {
          type: 'object',
          properties: {
            conversationId: { type: 'string' },
            tenantId: { type: 'string' },
            type: { type: 'string' }
          },
          required: ['conversationId', 'tenantId']
        },
        outputSchema: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            itemsCleared: { type: 'number' }
          }
        },
        requiredPermissions: ['memory.write'],
        isEnabled: true
      }
    ];
  }

  async handleRequest(request: MCPRequest): Promise<any> {
    try {
      this.server.lastHeartbeat = new Date();
      
      switch (request.capability) {
        case 'initializeTenant':
          return await this.initializeTenant(request.payload);
        case 'storeMemory':
          return await this.storeMemory(request.payload);
        case 'retrieveMemory':
          return await this.retrieveMemory(request.payload);
        case 'updateCustomerProfile':
          return await this.updateCustomerProfile(request.payload);
        case 'getContext':
          return await this.getContext(request.payload);
        case 'clearMemory':
          return await this.clearMemory(request.payload);
        default:
          throw new Error(`Unknown capability: ${request.capability}`);
      }
    } catch (error) {
      console.error(`Error handling request ${request.id}:`, error);
      throw error;
    }
  }

  private async initializeTenant(payload: any): Promise<any> {
    const { tenantId } = payload;
    
    // Create default memory context for tenant
    const contextId = `${tenantId}-default`;
    const context: MemoryContext = {
      conversationId: contextId,
      tenantId,
      shortTermMemory: [],
      longTermMemory: [],
      customerProfile: this.createEmptyCustomerProfile(),
      preferences: {},
      lastAccessed: new Date()
    };

    this.memoryContexts.set(contextId, context);
    
    return {
      success: true,
      contextId
    };
  }

  private async storeMemory(payload: any): Promise<any> {
    const { conversationId, tenantId, type, content, importance = 'medium', expiresAt, metadata = {} } = payload;
    
    const context = this.getOrCreateContext(conversationId, tenantId);
    
    const memoryItem: MemoryItem = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date(),
      importance,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      metadata
    };

    // Store in appropriate memory based on importance and type
    if (importance === 'high' || type === 'preference' || type === 'decision') {
      context.longTermMemory.push(memoryItem);
    } else {
      context.shortTermMemory.push(memoryItem);
    }

    // Keep memory size manageable
    this.compressMemory(context);
    
    context.lastAccessed = new Date();
    this.memoryContexts.set(conversationId, context);
    
    return {
      success: true,
      memoryId: memoryItem.id
    };
  }

  private async retrieveMemory(payload: any): Promise<any> {
    const { conversationId, tenantId, query, type, importance, limit = 10 } = payload;
    
    const context = this.getOrCreateContext(conversationId, tenantId);
    
    // Combine short and long term memories
    const allMemories = [...context.shortTermMemory, ...context.longTermMemory];
    
    // Filter memories
    let filteredMemories = allMemories.filter(memory => {
      // Check if memory is expired
      if (memory.expiresAt && memory.expiresAt < new Date()) {
        return false;
      }
      
      // Filter by type
      if (type && memory.type !== type) {
        return false;
      }
      
      // Filter by importance
      if (importance && memory.importance !== importance) {
        return false;
      }
      
      // Search by query
      if (query && !memory.content.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      
      return true;
    });

    // Sort by importance and recency
    filteredMemories.sort((a, b) => {
      const importanceOrder = { high: 3, medium: 2, low: 1 };
      const importanceDiff = importanceOrder[b.importance] - importanceOrder[a.importance];
      
      if (importanceDiff !== 0) {
        return importanceDiff;
      }
      
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    // Apply limit
    filteredMemories = filteredMemories.slice(0, limit);
    
    context.lastAccessed = new Date();
    
    return {
      memories: filteredMemories,
      totalCount: filteredMemories.length
    };
  }

  private async updateCustomerProfile(payload: any): Promise<any> {
    const { conversationId, tenantId, profile } = payload;
    
    const context = this.getOrCreateContext(conversationId, tenantId);
    
    // Deep merge profile updates
    context.customerProfile = {
      ...context.customerProfile,
      ...profile,
      preferences: {
        ...context.customerProfile.preferences,
        ...profile.preferences
      },
      history: {
        ...context.customerProfile.history,
        ...profile.history
      },
      context: {
        ...context.customerProfile.context,
        ...profile.context
      }
    };
    
    context.lastAccessed = new Date();
    this.memoryContexts.set(conversationId, context);
    
    return {
      success: true
    };
  }

  private async getContext(payload: any): Promise<any> {
    const { conversationId, tenantId } = payload;
    
    const context = this.getOrCreateContext(conversationId, tenantId);
    context.lastAccessed = new Date();
    
    return {
      context: {
        conversationId: context.conversationId,
        tenantId: context.tenantId,
        shortTermMemoryCount: context.shortTermMemory.length,
        longTermMemoryCount: context.longTermMemory.length,
        customerProfile: context.customerProfile,
        preferences: context.preferences,
        lastAccessed: context.lastAccessed
      }
    };
  }

  private async clearMemory(payload: any): Promise<any> {
    const { conversationId, tenantId, type } = payload;
    
    const context = this.getOrCreateContext(conversationId, tenantId);
    
    let itemsCleared = 0;
    
    if (type) {
      // Clear specific type
      const shortTermBefore = context.shortTermMemory.length;
      const longTermBefore = context.longTermMemory.length;
      
      context.shortTermMemory = context.shortTermMemory.filter(item => item.type !== type);
      context.longTermMemory = context.longTermMemory.filter(item => item.type !== type);
      
      itemsCleared = (shortTermBefore - context.shortTermMemory.length) + 
                     (longTermBefore - context.longTermMemory.length);
    } else {
      // Clear all memory
      itemsCleared = context.shortTermMemory.length + context.longTermMemory.length;
      context.shortTermMemory = [];
      context.longTermMemory = [];
    }
    
    context.lastAccessed = new Date();
    this.memoryContexts.set(conversationId, context);
    
    return {
      success: true,
      itemsCleared
    };
  }

  private getOrCreateContext(conversationId: string, tenantId: string): MemoryContext {
    let context = this.memoryContexts.get(conversationId);
    
    if (!context) {
      context = {
        conversationId,
        tenantId,
        shortTermMemory: [],
        longTermMemory: [],
        customerProfile: this.createEmptyCustomerProfile(),
        preferences: {},
        lastAccessed: new Date()
      };
      
      this.memoryContexts.set(conversationId, context);
    }
    
    return context;
  }

  private createEmptyCustomerProfile(): CustomerMemory {
    return {
      preferences: {
        communicationStyle: 'casual',
        interests: [],
        budget: undefined,
        timeline: undefined
      },
      history: {
        previousQuestions: [],
        concerns: [],
        requirements: []
      },
      context: {
        propertyType: '',
        location: undefined,
        currentProvider: undefined,
        painPoints: []
      }
    };
  }

  private compressMemory(context: MemoryContext): void {
    const maxShortTerm = 50;
    const maxLongTerm = 200;
    
    // Compress short-term memory
    if (context.shortTermMemory.length > maxShortTerm) {
      // Keep most recent and high importance items
      const sortedShortTerm = context.shortTermMemory.sort((a, b) => {
        if (a.importance === 'high' && b.importance !== 'high') return -1;
        if (b.importance === 'high' && a.importance !== 'high') return 1;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
      
      context.shortTermMemory = sortedShortTerm.slice(0, maxShortTerm);
    }
    
    // Compress long-term memory
    if (context.longTermMemory.length > maxLongTerm) {
      const sortedLongTerm = context.longTermMemory.sort((a, b) => {
        if (a.importance === 'high' && b.importance !== 'high') return -1;
        if (b.importance === 'high' && a.importance !== 'high') return 1;
        return b.timestamp.getTime() - a.timestamp.getTime();
      });
      
      context.longTermMemory = sortedLongTerm.slice(0, maxLongTerm);
    }
  }

  private startCleanupRoutine(): void {
    // Clean up expired memories every hour
    setInterval(() => {
      this.cleanupExpiredMemories();
    }, 3600000); // 1 hour
  }

  private cleanupExpiredMemories(): void {
    const now = new Date();
    
    for (const [conversationId, context] of this.memoryContexts.entries()) {
      const retentionTime = 30 * 24 * 60 * 60 * 1000; // 30 days
      
      // Remove expired memories
      context.shortTermMemory = context.shortTermMemory.filter(memory => {
        if (memory.expiresAt && memory.expiresAt < now) {
          return false;
        }
        return true;
      });
      
      context.longTermMemory = context.longTermMemory.filter(memory => {
        if (memory.expiresAt && memory.expiresAt < now) {
          return false;
        }
        return true;
      });
      
      // Remove old contexts that haven't been accessed
      const timeSinceAccess = now.getTime() - context.lastAccessed.getTime();
      if (timeSinceAccess > retentionTime) {
        this.memoryContexts.delete(conversationId);
      }
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
    console.log('Shutting down Memory MCP Server...');
    
    // In a production environment, this would save persistent data
    this.memoryContexts.clear();
    this.server.status = 'disconnected';
    
    console.log('Memory MCP Server shutdown complete');
  }
}