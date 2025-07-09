import { MCPServer, MCPConnection, MCPRequest, MCPResponse, MCPSkill, MemoryContext } from '@/types/mcp';
import { mcpManager } from './mcp-manager';
import { skillInjectionSystem } from './skill-injection';

export interface TenantMCPEnvironment {
  tenantId: string;
  servers: MCPServer[];
  connections: MCPConnection[];
  skills: MCPSkill[];
  memoryContexts: Map<string, MemoryContext>;
  requestQueue: MCPRequest[];
  rateLimits: Map<string, RateLimitInfo>;
  isolation: {
    allowedServers: string[];
    blockedCapabilities: string[];
    maxConcurrentRequests: number;
    maxMemorySize: number;
    maxSkillsPerTenant: number;
  };
  metrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    memoryUsage: number;
    skillExecutions: number;
  };
}

export interface RateLimitInfo {
  requests: number;
  windowStart: Date;
  windowSize: number;
  maxRequests: number;
}

export class TenantIsolationManager {
  private tenantEnvironments: Map<string, TenantMCPEnvironment> = new Map();
  private globalLimits = {
    maxTenantsPerInstance: 1000,
    maxServersPerTenant: 10,
    maxConnectionsPerTenant: 20,
    maxSkillsPerTenant: 50,
    maxMemoryPerTenant: 100 * 1024 * 1024, // 100MB
    maxRequestsPerMinute: 1000
  };

  // Initialize isolated environment for a tenant
  async initializeTenantEnvironment(tenantId: string, config: any = {}): Promise<TenantMCPEnvironment> {
    if (this.tenantEnvironments.has(tenantId)) {
      return this.tenantEnvironments.get(tenantId)!;
    }

    const environment: TenantMCPEnvironment = {
      tenantId,
      servers: [],
      connections: [],
      skills: [],
      memoryContexts: new Map(),
      requestQueue: [],
      rateLimits: new Map(),
      isolation: {
        allowedServers: config.allowedServers || ['memory', 'fetch', 'puppeteer'],
        blockedCapabilities: config.blockedCapabilities || [],
        maxConcurrentRequests: config.maxConcurrentRequests || 10,
        maxMemorySize: config.maxMemorySize || 50 * 1024 * 1024, // 50MB
        maxSkillsPerTenant: config.maxSkillsPerTenant || 30
      },
      metrics: {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0,
        memoryUsage: 0,
        skillExecutions: 0
      }
    };

    this.tenantEnvironments.set(tenantId, environment);

    // Initialize tenant-specific MCP environment
    await this.setupTenantMCPEnvironment(environment);

    console.log(`Tenant MCP environment initialized: ${tenantId}`);
    return environment;
  }

  // Setup MCP environment for tenant
  private async setupTenantMCPEnvironment(environment: TenantMCPEnvironment): Promise<void> {
    const { tenantId, isolation } = environment;

    try {
      // Create tenant environment in MCP Manager
      await mcpManager.createTenantEnvironment(tenantId);

      // Setup allowed servers
      for (const serverId of isolation.allowedServers) {
        const server = await mcpManager.getServerStatus(serverId);
        if (server) {
          environment.servers.push(server);
        }
      }

      // Initialize rate limits
      this.initializeRateLimits(environment);

      // Setup tenant-specific skills
      await this.initializeTenantSkills(environment);

      console.log(`MCP environment setup complete for tenant: ${tenantId}`);
    } catch (error) {
      console.error(`Failed to setup MCP environment for tenant ${tenantId}:`, error);
      throw error;
    }
  }

  // Initialize rate limiting for tenant
  private initializeRateLimits(environment: TenantMCPEnvironment): void {
    const { tenantId } = environment;
    
    // Initialize rate limits for each server
    for (const server of environment.servers) {
      environment.rateLimits.set(server.id, {
        requests: 0,
        windowStart: new Date(),
        windowSize: 60000, // 1 minute
        maxRequests: server.config.rateLimit.requests
      });
    }
  }

  // Initialize skills for tenant
  private async initializeTenantSkills(environment: TenantMCPEnvironment): Promise<void> {
    const { tenantId } = environment;
    
    // Get tenant information to determine industry
    const industry = await this.getTenantIndustry(tenantId);
    
    // Initialize skills through skill injection system
    await skillInjectionSystem.initializeTenantSkills(tenantId, industry);
    
    // Get and store skills in environment
    environment.skills = skillInjectionSystem.getActiveSkills(tenantId);
  }

  // Get tenant industry (mock implementation)
  private async getTenantIndustry(tenantId: string): Promise<string> {
    // In production, this would query the database
    return 'solar'; // Default to solar for now
  }

  // Execute request with tenant isolation
  async executeRequest(request: MCPRequest): Promise<MCPResponse> {
    const environment = this.tenantEnvironments.get(request.tenantId);
    if (!environment) {
      throw new Error(`Tenant environment not found: ${request.tenantId}`);
    }

    // Validate request against tenant isolation rules
    await this.validateRequest(request, environment);

    // Check rate limits
    await this.checkRateLimit(request, environment);

    // Execute request
    const response = await this.executeIsolatedRequest(request, environment);

    // Update metrics
    this.updateMetrics(environment, response);

    return response;
  }

  // Validate request against tenant isolation rules
  private async validateRequest(request: MCPRequest, environment: TenantMCPEnvironment): Promise<void> {
    const { isolation } = environment;

    // Check if server is allowed
    if (!isolation.allowedServers.includes(request.serverId)) {
      throw new Error(`Server not allowed for tenant: ${request.serverId}`);
    }

    // Check if capability is blocked
    if (isolation.blockedCapabilities.includes(request.capability)) {
      throw new Error(`Capability blocked for tenant: ${request.capability}`);
    }

    // Check concurrent request limit
    const activeRequests = environment.requestQueue.filter(req => req.timestamp > new Date(Date.now() - 60000));
    if (activeRequests.length >= isolation.maxConcurrentRequests) {
      throw new Error(`Too many concurrent requests for tenant: ${request.tenantId}`);
    }

    // Check memory usage
    if (environment.metrics.memoryUsage > isolation.maxMemorySize) {
      throw new Error(`Memory limit exceeded for tenant: ${request.tenantId}`);
    }
  }

  // Check rate limits for tenant
  private async checkRateLimit(request: MCPRequest, environment: TenantMCPEnvironment): Promise<void> {
    const rateLimit = environment.rateLimits.get(request.serverId);
    if (!rateLimit) return;

    const now = new Date();
    const windowElapsed = now.getTime() - rateLimit.windowStart.getTime();

    // Reset window if expired
    if (windowElapsed >= rateLimit.windowSize) {
      rateLimit.requests = 0;
      rateLimit.windowStart = now;
    }

    // Check rate limit
    if (rateLimit.requests >= rateLimit.maxRequests) {
      throw new Error(`Rate limit exceeded for server: ${request.serverId}`);
    }

    // Increment request count
    rateLimit.requests++;
  }

  // Execute request in isolated environment
  private async executeIsolatedRequest(request: MCPRequest, environment: TenantMCPEnvironment): Promise<MCPResponse> {
    const startTime = Date.now();
    
    // Add to request queue
    environment.requestQueue.push(request);

    try {
      // Execute through MCP Manager
      const response = await mcpManager.executeRequest(request);

      // Process response for tenant isolation
      const isolatedResponse = await this.processResponseForTenant(response, environment);

      return isolatedResponse;
    } catch (error) {
      // Create error response
      return {
        id: `resp-${request.id}`,
        requestId: request.id,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
        executionTime: Date.now() - startTime
      };
    } finally {
      // Remove from request queue
      environment.requestQueue = environment.requestQueue.filter(req => req.id !== request.id);
    }
  }

  // Process response for tenant-specific isolation
  private async processResponseForTenant(response: MCPResponse, environment: TenantMCPEnvironment): Promise<MCPResponse> {
    // Filter sensitive data if needed
    const filteredResponse = this.filterSensitiveData(response, environment);

    // Update memory usage if it's a memory operation
    if (response.data && typeof response.data === 'object') {
      const dataSize = JSON.stringify(response.data).length;
      environment.metrics.memoryUsage += dataSize;
    }

    return filteredResponse;
  }

  // Filter sensitive data from response
  private filterSensitiveData(response: MCPResponse, environment: TenantMCPEnvironment): MCPResponse {
    // Clone response to avoid modifying original
    const filteredResponse = { ...response };

    // Remove sensitive fields if present
    if (filteredResponse.data && typeof filteredResponse.data === 'object') {
      const sensitiveFields = ['password', 'token', 'secret', 'key', 'apiKey'];
      const filteredData = { ...filteredResponse.data };

      for (const field of sensitiveFields) {
        if (filteredData[field]) {
          filteredData[field] = '[FILTERED]';
        }
      }

      filteredResponse.data = filteredData;
    }

    return filteredResponse;
  }

  // Update metrics for tenant
  private updateMetrics(environment: TenantMCPEnvironment, response: MCPResponse): void {
    const { metrics } = environment;

    metrics.totalRequests++;
    
    if (response.success) {
      metrics.successfulRequests++;
    } else {
      metrics.failedRequests++;
    }

    // Update average response time
    const currentAverage = metrics.averageResponseTime;
    const newAverage = (currentAverage * (metrics.totalRequests - 1) + response.executionTime) / metrics.totalRequests;
    metrics.averageResponseTime = newAverage;
  }

  // Get tenant environment
  getTenantEnvironment(tenantId: string): TenantMCPEnvironment | null {
    return this.tenantEnvironments.get(tenantId) || null;
  }

  // Get tenant metrics
  getTenantMetrics(tenantId: string): TenantMCPEnvironment['metrics'] | null {
    const environment = this.tenantEnvironments.get(tenantId);
    return environment ? environment.metrics : null;
  }

  // Update tenant isolation settings
  async updateTenantIsolation(tenantId: string, isolationConfig: Partial<TenantMCPEnvironment['isolation']>): Promise<void> {
    const environment = this.tenantEnvironments.get(tenantId);
    if (!environment) {
      throw new Error(`Tenant environment not found: ${tenantId}`);
    }

    // Update isolation settings
    environment.isolation = {
      ...environment.isolation,
      ...isolationConfig
    };

    // Reinitialize environment if needed
    if (isolationConfig.allowedServers) {
      await this.setupTenantMCPEnvironment(environment);
    }

    console.log(`Tenant isolation updated: ${tenantId}`);
  }

  // Clean up tenant environment
  async cleanupTenantEnvironment(tenantId: string): Promise<void> {
    const environment = this.tenantEnvironments.get(tenantId);
    if (!environment) return;

    // Clear memory contexts
    environment.memoryContexts.clear();

    // Clear request queue
    environment.requestQueue = [];

    // Clear rate limits
    environment.rateLimits.clear();

    // Remove from environments
    this.tenantEnvironments.delete(tenantId);

    console.log(`Tenant environment cleaned up: ${tenantId}`);
  }

  // Monitor tenant resource usage
  async monitorTenantResources(): Promise<Map<string, { usage: number; limit: number; percentage: number }>> {
    const resourceUsage = new Map<string, { usage: number; limit: number; percentage: number }>();

    for (const [tenantId, environment] of this.tenantEnvironments.entries()) {
      const memoryUsage = environment.metrics.memoryUsage;
      const memoryLimit = environment.isolation.maxMemorySize;
      const memoryPercentage = (memoryUsage / memoryLimit) * 100;

      resourceUsage.set(tenantId, {
        usage: memoryUsage,
        limit: memoryLimit,
        percentage: memoryPercentage
      });

      // Log warnings for high usage
      if (memoryPercentage > 80) {
        console.warn(`High memory usage for tenant ${tenantId}: ${memoryPercentage.toFixed(1)}%`);
      }
    }

    return resourceUsage;
  }

  // Get isolation statistics
  getIsolationStatistics(): {
    totalTenants: number;
    averageMemoryUsage: number;
    averageRequestRate: number;
    tenantsAtLimit: number;
    resourceDistribution: { [tenantId: string]: number };
  } {
    const tenants = Array.from(this.tenantEnvironments.values());
    const totalTenants = tenants.length;

    if (totalTenants === 0) {
      return {
        totalTenants: 0,
        averageMemoryUsage: 0,
        averageRequestRate: 0,
        tenantsAtLimit: 0,
        resourceDistribution: {}
      };
    }

    const totalMemoryUsage = tenants.reduce((sum, env) => sum + env.metrics.memoryUsage, 0);
    const averageMemoryUsage = totalMemoryUsage / totalTenants;

    const totalRequests = tenants.reduce((sum, env) => sum + env.metrics.totalRequests, 0);
    const averageRequestRate = totalRequests / totalTenants;

    const tenantsAtLimit = tenants.filter(env => {
      const memoryPercentage = (env.metrics.memoryUsage / env.isolation.maxMemorySize) * 100;
      return memoryPercentage > 90;
    }).length;

    const resourceDistribution: { [tenantId: string]: number } = {};
    for (const env of tenants) {
      resourceDistribution[env.tenantId] = env.metrics.memoryUsage;
    }

    return {
      totalTenants,
      averageMemoryUsage,
      averageRequestRate,
      tenantsAtLimit,
      resourceDistribution
    };
  }

  // Cleanup routine for tenant environments
  async performCleanup(): Promise<void> {
    const now = Date.now();
    const inactiveThreshold = 24 * 60 * 60 * 1000; // 24 hours

    for (const [tenantId, environment] of this.tenantEnvironments.entries()) {
      // Check if tenant has been inactive
      const lastRequest = environment.requestQueue.length > 0 ? 
        Math.max(...environment.requestQueue.map(req => req.timestamp.getTime())) : 0;

      if (lastRequest > 0 && now - lastRequest > inactiveThreshold) {
        console.log(`Cleaning up inactive tenant environment: ${tenantId}`);
        await this.cleanupTenantEnvironment(tenantId);
      }

      // Clean up old request queue entries
      environment.requestQueue = environment.requestQueue.filter(req => 
        now - req.timestamp.getTime() < 60000 // Keep only last minute
      );

      // Reset metrics if they get too large
      if (environment.metrics.totalRequests > 1000000) {
        environment.metrics = {
          ...environment.metrics,
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          averageResponseTime: 0
        };
      }
    }
  }

  // Start cleanup routine
  startCleanupRoutine(): void {
    setInterval(() => {
      this.performCleanup();
    }, 3600000); // Run every hour
  }

  // Shutdown all tenant environments
  async shutdown(): Promise<void> {
    console.log('Shutting down Tenant Isolation Manager...');

    for (const tenantId of this.tenantEnvironments.keys()) {
      await this.cleanupTenantEnvironment(tenantId);
    }

    console.log('Tenant Isolation Manager shutdown complete');
  }
}

// Export singleton instance
export const tenantIsolationManager = new TenantIsolationManager();