import { mcpManager } from './mcp-manager';
import { tenantIsolationManager } from './tenant-isolation';
import { skillInjectionSystem } from './skill-injection';

export interface MCPInitResult {
  success: boolean;
  components: {
    mcpManager: boolean;
    tenantIsolation: boolean;
    skillInjection: boolean;
  };
  servers: {
    memory: boolean;
    fetch: boolean;
    puppeteer: boolean;
  };
  errors: string[];
  warnings: string[];
}

export class MCPInitializer {
  private static instance: MCPInitializer;
  private isInitialized = false;
  private initPromise: Promise<MCPInitResult> | null = null;

  private constructor() {}

  static getInstance(): MCPInitializer {
    if (!MCPInitializer.instance) {
      MCPInitializer.instance = new MCPInitializer();
    }
    return MCPInitializer.instance;
  }

  async initialize(): Promise<MCPInitResult> {
    if (this.isInitialized) {
      return {
        success: true,
        components: { mcpManager: true, tenantIsolation: true, skillInjection: true },
        servers: { memory: true, fetch: true, puppeteer: true },
        errors: [],
        warnings: []
      };
    }

    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.performInitialization();
    return this.initPromise;
  }

  private async performInitialization(): Promise<MCPInitResult> {
    const result: MCPInitResult = {
      success: false,
      components: {
        mcpManager: false,
        tenantIsolation: false,
        skillInjection: false
      },
      servers: {
        memory: false,
        fetch: false,
        puppeteer: false
      },
      errors: [],
      warnings: []
    };

    console.log('🚀 Initializing MCP System...');

    try {
      // Initialize MCP Manager
      console.log('📡 Initializing MCP Manager...');
      await mcpManager.initialize();
      result.components.mcpManager = true;
      console.log('✅ MCP Manager initialized');

      // Test server connectivity
      console.log('🔌 Testing server connectivity...');
      await this.testServerConnectivity(result);

      // Initialize Tenant Isolation Manager
      console.log('🏢 Initializing Tenant Isolation Manager...');
      tenantIsolationManager.startCleanupRoutine();
      result.components.tenantIsolation = true;
      console.log('✅ Tenant Isolation Manager initialized');

      // Initialize Skill Injection System
      console.log('🧠 Initializing Skill Injection System...');
      skillInjectionSystem.startCleanup();
      result.components.skillInjection = true;
      console.log('✅ Skill Injection System initialized');

      // Run health checks
      console.log('🔍 Running health checks...');
      await this.runHealthChecks(result);

      result.success = this.isSystemHealthy(result);
      this.isInitialized = result.success;

      if (result.success) {
        console.log('🎉 MCP System initialization complete!');
      } else {
        console.warn('⚠️  MCP System initialization completed with issues');
      }

    } catch (error) {
      console.error('❌ MCP System initialization failed:', error);
      result.errors.push(`Initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  private async testServerConnectivity(result: MCPInitResult): Promise<void> {
    const servers = ['memory', 'fetch', 'puppeteer'];
    
    for (const serverId of servers) {
      try {
        const server = await mcpManager.getServerStatus(serverId);
        if (server && server.status === 'connected') {
          result.servers[serverId as keyof typeof result.servers] = true;
          console.log(`✅ ${server.name} connected`);
        } else {
          result.warnings.push(`Server ${serverId} not connected`);
          console.warn(`⚠️  ${serverId} server not connected`);
        }
      } catch (error) {
        result.errors.push(`Failed to connect to ${serverId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error(`❌ Failed to connect to ${serverId}:`, error);
      }
    }
  }

  private async runHealthChecks(result: MCPInitResult): Promise<void> {
    try {
      // Check MCP Manager health
      const mcpReady = mcpManager.isReady();
      if (!mcpReady) {
        result.warnings.push('MCP Manager is not ready');
      }

      // Check server registry
      const registry = mcpManager.getRegistry();
      const serverCount = Object.keys(registry.servers).length;
      if (serverCount === 0) {
        result.warnings.push('No servers registered in MCP registry');
      }

      // Test basic functionality
      await this.testBasicFunctionality(result);

    } catch (error) {
      result.errors.push(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async testBasicFunctionality(result: MCPInitResult): Promise<void> {
    try {
      // Test tenant environment creation
      const testTenantId = 'test-tenant-' + Date.now();
      await tenantIsolationManager.initializeTenantEnvironment(testTenantId);
      
      // Test skill initialization
      await skillInjectionSystem.initializeTenantSkills(testTenantId, 'solar');
      
      // Test memory server
      if (result.servers.memory) {
        await mcpManager.executeRequest({
          id: 'test-memory-' + Date.now(),
          serverId: 'memory',
          capability: 'initializeTenant',
          payload: { tenantId: testTenantId },
          timestamp: new Date(),
          tenantId: testTenantId
        });
      }
      
      // Clean up test tenant
      await tenantIsolationManager.cleanupTenantEnvironment(testTenantId);
      
      console.log('✅ Basic functionality test passed');
    } catch (error) {
      result.warnings.push(`Basic functionality test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private isSystemHealthy(result: MCPInitResult): boolean {
    // System is healthy if all components are initialized and at least one server is connected
    const componentsHealthy = Object.values(result.components).every(Boolean);
    const atLeastOneServerConnected = Object.values(result.servers).some(Boolean);
    const noErrors = result.errors.length === 0;
    
    return componentsHealthy && atLeastOneServerConnected && noErrors;
  }

  async initializeTenant(tenantId: string, options: any = {}): Promise<{
    success: boolean;
    environment: any;
    skills: number;
    errors: string[];
  }> {
    const result = {
      success: false,
      environment: null,
      skills: 0,
      errors: [] as string[]
    };

    try {
      // Ensure MCP system is initialized
      await this.initialize();

      // Initialize tenant environment
      const environment = await tenantIsolationManager.initializeTenantEnvironment(tenantId, options);
      result.environment = environment;

      // Initialize tenant skills
      const industry = options.industry || 'solar';
      await skillInjectionSystem.initializeTenantSkills(tenantId, industry);
      
      const skills = skillInjectionSystem.getActiveSkills(tenantId);
      result.skills = skills.length;

      result.success = true;
      console.log(`✅ Tenant ${tenantId} initialized with ${result.skills} skills`);

    } catch (error) {
      result.errors.push(`Failed to initialize tenant: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(`❌ Failed to initialize tenant ${tenantId}:`, error);
    }

    return result;
  }

  async testTenantCapabilities(tenantId: string): Promise<{
    success: boolean;
    tests: { [key: string]: boolean };
    errors: string[];
  }> {
    const result = {
      success: false,
      tests: {} as { [key: string]: boolean },
      errors: [] as string[]
    };

    try {
      // Test memory operations
      try {
        await mcpManager.executeRequest({
          id: 'test-memory-' + Date.now(),
          serverId: 'memory',
          capability: 'storeMemory',
          payload: {
            conversationId: 'test-conv',
            tenantId,
            type: 'fact',
            content: 'Test memory storage',
            importance: 'medium'
          },
          timestamp: new Date(),
          tenantId
        });
        result.tests.memory = true;
      } catch (error) {
        result.tests.memory = false;
        result.errors.push(`Memory test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test fetch operations
      try {
        await mcpManager.executeRequest({
          id: 'test-fetch-' + Date.now(),
          serverId: 'fetch',
          capability: 'getWeatherData',
          payload: {
            location: 'San Francisco, CA',
            forecast: false
          },
          timestamp: new Date(),
          tenantId
        });
        result.tests.fetch = true;
      } catch (error) {
        result.tests.fetch = false;
        result.errors.push(`Fetch test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Test skill execution
      try {
        const skills = skillInjectionSystem.getActiveSkills(tenantId);
        if (skills.length > 0) {
          await skillInjectionSystem.executeSkill(
            skills[0],
            { test: true },
            tenantId
          );
          result.tests.skills = true;
        } else {
          result.tests.skills = false;
          result.errors.push('No active skills found for tenant');
        }
      } catch (error) {
        result.tests.skills = false;
        result.errors.push(`Skills test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      result.success = Object.values(result.tests).some(Boolean);

    } catch (error) {
      result.errors.push(`Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }

  getStatus(): {
    initialized: boolean;
    ready: boolean;
    uptime: number;
    stats: any;
  } {
    return {
      initialized: this.isInitialized,
      ready: mcpManager.isReady(),
      uptime: Date.now(),
      stats: {
        registry: mcpManager.getRegistry(),
        isolation: tenantIsolationManager.getIsolationStatistics()
      }
    };
  }

  async shutdown(): Promise<void> {
    console.log('🔄 Shutting down MCP System...');
    
    try {
      await mcpManager.shutdown();
      await tenantIsolationManager.shutdown();
      
      this.isInitialized = false;
      this.initPromise = null;
      
      console.log('✅ MCP System shutdown complete');
    } catch (error) {
      console.error('❌ Error during MCP shutdown:', error);
    }
  }
}

// Export singleton instance
export const mcpInitializer = MCPInitializer.getInstance();

// Auto-initialize on import (for development)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  mcpInitializer.initialize().then(result => {
    if (result.success) {
      console.log('🚀 MCP System auto-initialized for development');
    } else {
      console.warn('⚠️  MCP System auto-initialization had issues:', result.errors);
    }
  });
}