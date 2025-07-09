import { MCPServer, MCPRegistry, MCPConnection, MCPRequest, MCPResponse, MCPConfig, MCPEvent, MCPEventHandler } from '@/types/mcp';
import { MCPConnectionHandler } from './connection-handler';
import { MCPServerRegistry } from './server-registry';
import { MemoryMCPServer } from './servers/memory-server';
import { FetchMCPServer } from './servers/fetch-server';
import { PuppeteerMCPServer } from './servers/puppeteer-server';

export class MCPManager {
  private static instance: MCPManager;
  private registry: MCPServerRegistry;
  private connectionHandler: MCPConnectionHandler;
  private eventHandlers: MCPEventHandler[] = [];
  private config: MCPConfig;
  private isInitialized = false;

  private constructor() {
    this.config = this.getDefaultConfig();
    this.registry = new MCPServerRegistry();
    this.connectionHandler = new MCPConnectionHandler(this.registry);
  }

  static getInstance(): MCPManager {
    if (!MCPManager.instance) {
      MCPManager.instance = new MCPManager();
    }
    return MCPManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('Initializing MCP Manager...');
      
      // Initialize core servers
      await this.initializeCoreServers();
      
      // Start connection monitoring
      this.connectionHandler.startMonitoring();
      
      // Setup event handlers
      this.setupEventHandlers();
      
      this.isInitialized = true;
      console.log('MCP Manager initialized successfully');
    } catch (error) {
      console.error('Failed to initialize MCP Manager:', error);
      throw error;
    }
  }

  private async initializeCoreServers(): Promise<void> {
    const servers = [
      new MemoryMCPServer(),
      new FetchMCPServer(),
      new PuppeteerMCPServer()
    ];

    for (const server of servers) {
      try {
        await server.initialize();
        await this.registry.registerServer(server);
        console.log(`Registered MCP server: ${server.getName()}`);
      } catch (error) {
        console.error(`Failed to initialize server ${server.getName()}:`, error);
      }
    }
  }

  private setupEventHandlers(): void {
    this.connectionHandler.on('server.connected', (event) => {
      console.log(`MCP Server connected: ${event.serverId}`);
      this.emitEvent(event);
    });

    this.connectionHandler.on('server.disconnected', (event) => {
      console.log(`MCP Server disconnected: ${event.serverId}`);
      this.emitEvent(event);
    });

    this.connectionHandler.on('server.error', (event) => {
      console.error(`MCP Server error: ${event.serverId}`, event.data);
      this.emitEvent(event);
    });
  }

  async createTenantEnvironment(tenantId: string): Promise<void> {
    try {
      console.log(`Creating MCP environment for tenant: ${tenantId}`);
      
      // Create isolated connections for each server
      const servers = this.registry.getAllServers();
      const connections: MCPConnection[] = [];

      for (const server of servers) {
        const connection = await this.connectionHandler.createConnection(server.id, tenantId);
        connections.push(connection);
      }

      // Initialize tenant-specific memory context
      await this.initializeTenantMemory(tenantId);
      
      console.log(`MCP environment created for tenant: ${tenantId}`);
    } catch (error) {
      console.error(`Failed to create MCP environment for tenant ${tenantId}:`, error);
      throw error;
    }
  }

  private async initializeTenantMemory(tenantId: string): Promise<void> {
    const memoryServer = this.registry.getServer('memory');
    if (memoryServer) {
      await this.executeRequest({
        id: `init-${tenantId}-${Date.now()}`,
        serverId: 'memory',
        capability: 'initializeTenant',
        payload: { tenantId },
        timestamp: new Date(),
        tenantId
      });
    }
  }

  async executeRequest(request: MCPRequest): Promise<MCPResponse> {
    try {
      const server = this.registry.getServer(request.serverId);
      if (!server) {
        throw new Error(`Server not found: ${request.serverId}`);
      }

      const connection = this.connectionHandler.getConnection(request.serverId, request.tenantId);
      if (!connection || !connection.isActive) {
        throw new Error(`No active connection for server: ${request.serverId}`);
      }

      const startTime = Date.now();
      const response = await this.executeOnServer(server, request);
      const executionTime = Date.now() - startTime;

      return {
        id: `resp-${request.id}`,
        requestId: request.id,
        success: true,
        data: response,
        timestamp: new Date(),
        executionTime
      };
    } catch (error) {
      return {
        id: `resp-${request.id}`,
        requestId: request.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        executionTime: 0
      };
    }
  }

  private async executeOnServer(server: MCPServer, request: MCPRequest): Promise<any> {
    // This would be implemented by each server type
    // For now, we'll route to the appropriate server implementation
    switch (server.type) {
      case 'memory':
        return await this.executeMemoryRequest(request);
      case 'fetch':
        return await this.executeFetchRequest(request);
      case 'puppeteer':
        return await this.executePuppeteerRequest(request);
      default:
        throw new Error(`Unsupported server type: ${server.type}`);
    }
  }

  private async executeMemoryRequest(request: MCPRequest): Promise<any> {
    const memoryServer = this.registry.getServerByType('memory');
    if (!memoryServer) {
      throw new Error('Memory server not available');
    }

    // Import and use the memory server
    const { MemoryMCPServer } = await import('./servers/memory-server');
    const server = new MemoryMCPServer();
    return await server.handleRequest(request);
  }

  private async executeFetchRequest(request: MCPRequest): Promise<any> {
    const fetchServer = this.registry.getServerByType('fetch');
    if (!fetchServer) {
      throw new Error('Fetch server not available');
    }

    const { FetchMCPServer } = await import('./servers/fetch-server');
    const server = new FetchMCPServer();
    return await server.handleRequest(request);
  }

  private async executePuppeteerRequest(request: MCPRequest): Promise<any> {
    const puppeteerServer = this.registry.getServerByType('puppeteer');
    if (!puppeteerServer) {
      throw new Error('Puppeteer server not available');
    }

    const { PuppeteerMCPServer } = await import('./servers/puppeteer-server');
    const server = new PuppeteerMCPServer();
    return await server.handleRequest(request);
  }

  async getServerStatus(serverId: string): Promise<MCPServer | null> {
    return this.registry.getServer(serverId);
  }

  async getTenantServers(tenantId: string): Promise<MCPServer[]> {
    return this.registry.getServersByTenant(tenantId);
  }

  async getServerCapabilities(serverId: string): Promise<string[]> {
    const server = this.registry.getServer(serverId);
    return server ? server.capabilities.map(cap => cap.name) : [];
  }

  on(eventType: string, handler: MCPEventHandler): void {
    this.eventHandlers.push(handler);
  }

  private emitEvent(event: MCPEvent): void {
    this.eventHandlers.forEach(handler => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in event handler:', error);
      }
    });
  }

  async shutdown(): Promise<void> {
    console.log('Shutting down MCP Manager...');
    
    try {
      await this.connectionHandler.shutdown();
      await this.registry.shutdown();
      this.isInitialized = false;
      console.log('MCP Manager shutdown complete');
    } catch (error) {
      console.error('Error during MCP Manager shutdown:', error);
    }
  }

  private getDefaultConfig(): MCPConfig {
    return {
      enabled: true,
      maxServersPerTenant: 10,
      defaultTimeout: 30000,
      heartbeatInterval: 30000,
      retryAttempts: 3,
      servers: {
        memory: {
          enabled: true,
          maxContextSize: 100000,
          memoryRetentionDays: 30
        },
        fetch: {
          enabled: true,
          maxRequestsPerMinute: 60,
          allowedDomains: ['*'],
          blockedDomains: ['localhost', '127.0.0.1']
        },
        puppeteer: {
          enabled: true,
          maxConcurrentTasks: 5,
          maxPageLoadTime: 30000,
          enableScreenshots: true
        }
      }
    };
  }

  getConfig(): MCPConfig {
    return { ...this.config };
  }

  async updateConfig(newConfig: Partial<MCPConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    console.log('MCP configuration updated');
  }

  getRegistry(): MCPRegistry {
    return this.registry.getRegistry();
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const mcpManager = MCPManager.getInstance();