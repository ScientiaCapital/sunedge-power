// MCP (Model Context Protocol) types for chatbot superpowers

export interface MCPServer {
  id: string;
  name: string;
  type: 'memory' | 'fetch' | 'puppeteer' | 'custom';
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  capabilities: MCPCapability[];
  config: MCPServerConfig;
  tenantId: string;
  lastHeartbeat: Date;
  errorCount: number;
  version: string;
}

export interface MCPCapability {
  name: string;
  description: string;
  inputSchema: any;
  outputSchema: any;
  requiredPermissions: string[];
  isEnabled: boolean;
}

export interface MCPServerConfig {
  maxRetries: number;
  heartbeatInterval: number;
  timeout: number;
  rateLimit: {
    requests: number;
    timeWindow: number;
  };
  features: {
    [key: string]: any;
  };
}

export interface MCPRequest {
  id: string;
  serverId: string;
  capability: string;
  payload: any;
  timestamp: Date;
  tenantId: string;
  conversationId?: string;
}

export interface MCPResponse {
  id: string;
  requestId: string;
  success: boolean;
  data?: any;
  error?: string;
  timestamp: Date;
  executionTime: number;
}

export interface MCPConnection {
  serverId: string;
  tenantId: string;
  websocket?: WebSocket;
  isActive: boolean;
  lastActivity: Date;
  reconnectAttempts: number;
}

// Memory MCP Server Types
export interface MemoryContext {
  conversationId: string;
  tenantId: string;
  shortTermMemory: MemoryItem[];
  longTermMemory: MemoryItem[];
  customerProfile: CustomerMemory;
  preferences: any;
  lastAccessed: Date;
}

export interface MemoryItem {
  id: string;
  type: 'fact' | 'preference' | 'context' | 'decision';
  content: string;
  timestamp: Date;
  importance: 'low' | 'medium' | 'high';
  expiresAt?: Date;
  metadata: any;
}

export interface CustomerMemory {
  name?: string;
  email?: string;
  phone?: string;
  preferences: {
    communicationStyle: 'formal' | 'casual' | 'technical';
    interests: string[];
    budget?: string;
    timeline?: string;
  };
  history: {
    previousQuestions: string[];
    concerns: string[];
    requirements: string[];
  };
  context: {
    propertyType: string;
    location?: string;
    currentProvider?: string;
    painPoints: string[];
  };
}

// Fetch MCP Server Types
export interface FetchRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: { [key: string]: string };
  body?: any;
  options?: {
    timeout?: number;
    retries?: number;
    followRedirects?: boolean;
    parseType?: 'json' | 'text' | 'html';
  };
}

export interface FetchResponse {
  status: number;
  headers: { [key: string]: string };
  data: any;
  url: string;
  timing: {
    total: number;
    dns: number;
    connect: number;
    ttfb: number;
  };
}

export interface WebScrapingTask {
  id: string;
  url: string;
  selectors: {
    [key: string]: string;
  };
  schedule?: {
    interval: number;
    nextRun: Date;
  };
  tenantId: string;
  type: 'utility-rates' | 'competitor-pricing' | 'news' | 'weather' | 'custom';
  lastRun?: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

// Puppeteer MCP Server Types
export interface PuppeteerTask {
  id: string;
  type: 'screenshot' | 'pdf' | 'scrape' | 'form-fill' | 'navigation';
  url: string;
  actions: PuppeteerAction[];
  options: {
    viewport?: { width: number; height: number };
    timeout?: number;
    waitFor?: string;
    screenshot?: boolean;
    pdf?: boolean;
  };
  tenantId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export interface PuppeteerAction {
  type: 'click' | 'type' | 'select' | 'wait' | 'scroll' | 'extract';
  selector?: string;
  value?: string;
  options?: any;
}

// Skill Injection Types
export interface MCPSkill {
  id: string;
  name: string;
  description: string;
  serverId: string;
  capability: string;
  isActive: boolean;
  tenantId: string;
  prompt: string;
  examples: string[];
  priority: number;
  conditions: {
    keywords: string[];
    context: string[];
    stage: string[];
  };
}

export interface SkillExecution {
  skillId: string;
  input: any;
  output: any;
  confidence: number;
  timestamp: Date;
  executionTime: number;
  success: boolean;
  error?: string;
}

// Context Enhancement Types
export interface AIContextEnhancement {
  type: 'memory' | 'realtime' | 'market' | 'seasonal' | 'competitive';
  data: any;
  source: string;
  timestamp: Date;
  relevance: number;
  priority: 'low' | 'medium' | 'high';
}

export interface EnhancedContext {
  baseContext: string;
  enhancements: AIContextEnhancement[];
  totalRelevance: number;
  sources: string[];
  lastUpdated: Date;
}

// MCP Registry Types
export interface MCPRegistry {
  servers: { [serverId: string]: MCPServer };
  connections: { [tenantId: string]: MCPConnection[] };
  skills: { [tenantId: string]: MCPSkill[] };
  lastUpdated: Date;
}

// Event Types
export interface MCPEvent {
  type: 'server.connected' | 'server.disconnected' | 'server.error' | 'skill.executed' | 'context.updated';
  serverId: string;
  tenantId: string;
  data: any;
  timestamp: Date;
}

export interface MCPEventHandler {
  (event: MCPEvent): void;
}

// Configuration Types
export interface MCPConfig {
  enabled: boolean;
  maxServersPerTenant: number;
  defaultTimeout: number;
  heartbeatInterval: number;
  retryAttempts: number;
  servers: {
    memory: {
      enabled: boolean;
      maxContextSize: number;
      memoryRetentionDays: number;
    };
    fetch: {
      enabled: boolean;
      maxRequestsPerMinute: number;
      allowedDomains: string[];
      blockedDomains: string[];
    };
    puppeteer: {
      enabled: boolean;
      maxConcurrentTasks: number;
      maxPageLoadTime: number;
      enableScreenshots: boolean;
    };
  };
}

// Utility Types
export type MCPServerType = 'memory' | 'fetch' | 'puppeteer' | 'custom';
export type MCPStatus = 'connected' | 'connecting' | 'disconnected' | 'error';
export type TaskStatus = 'pending' | 'running' | 'completed' | 'failed';
export type Priority = 'low' | 'medium' | 'high';
export type CommunicationStyle = 'formal' | 'casual' | 'technical';