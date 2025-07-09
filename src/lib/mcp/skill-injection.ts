import { MCPSkill, MCPRequest, MCPResponse, SkillExecution, AIContextEnhancement, EnhancedContext } from '@/types/mcp';
import { mcpManager } from './mcp-manager';

export class SkillInjectionSystem {
  private skills: Map<string, MCPSkill[]> = new Map();
  private skillExecutions: Map<string, SkillExecution[]> = new Map();
  private contextEnhancements: Map<string, AIContextEnhancement[]> = new Map();

  // Register a new skill for a tenant
  async registerSkill(skill: MCPSkill): Promise<void> {
    const tenantSkills = this.skills.get(skill.tenantId) || [];
    
    // Remove existing skill with same ID
    const filteredSkills = tenantSkills.filter(s => s.id !== skill.id);
    filteredSkills.push(skill);
    
    // Sort by priority (higher priority first)
    filteredSkills.sort((a, b) => b.priority - a.priority);
    
    this.skills.set(skill.tenantId, filteredSkills);
    
    console.log(`Skill registered: ${skill.name} for tenant ${skill.tenantId}`);
  }

  // Unregister a skill
  async unregisterSkill(skillId: string, tenantId: string): Promise<void> {
    const tenantSkills = this.skills.get(tenantId) || [];
    const filteredSkills = tenantSkills.filter(s => s.id !== skillId);
    
    if (filteredSkills.length !== tenantSkills.length) {
      this.skills.set(tenantId, filteredSkills);
      console.log(`Skill unregistered: ${skillId} for tenant ${tenantId}`);
    }
  }

  // Get all skills for a tenant
  getTenantSkills(tenantId: string): MCPSkill[] {
    return this.skills.get(tenantId) || [];
  }

  // Get active skills for a tenant
  getActiveSkills(tenantId: string): MCPSkill[] {
    const tenantSkills = this.skills.get(tenantId) || [];
    return tenantSkills.filter(skill => skill.isActive);
  }

  // Analyze user input and determine which skills to trigger
  async analyzeUserInput(userInput: string, tenantId: string, context: any = {}): Promise<MCPSkill[]> {
    const activeSkills = this.getActiveSkills(tenantId);
    const triggeredSkills: MCPSkill[] = [];
    
    for (const skill of activeSkills) {
      if (this.shouldTriggerSkill(skill, userInput, context)) {
        triggeredSkills.push(skill);
      }
    }
    
    // Sort by priority and return top matches
    return triggeredSkills.sort((a, b) => b.priority - a.priority);
  }

  // Check if a skill should be triggered based on conditions
  private shouldTriggerSkill(skill: MCPSkill, userInput: string, context: any): boolean {
    const inputLower = userInput.toLowerCase();
    
    // Check keyword matches
    const keywordMatch = skill.conditions.keywords.some(keyword => 
      inputLower.includes(keyword.toLowerCase())
    );
    
    // Check context matches
    const contextMatch = skill.conditions.context.length === 0 || 
      skill.conditions.context.some(contextKey => 
        context[contextKey] !== undefined
      );
    
    // Check stage matches
    const stageMatch = skill.conditions.stage.length === 0 || 
      skill.conditions.stage.includes(context.stage);
    
    return keywordMatch && contextMatch && stageMatch;
  }

  // Execute a skill
  async executeSkill(skill: MCPSkill, input: any, tenantId: string, conversationId?: string): Promise<SkillExecution> {
    const execution: SkillExecution = {
      skillId: skill.id,
      input,
      output: null,
      confidence: 0,
      timestamp: new Date(),
      executionTime: 0,
      success: false
    };
    
    const startTime = Date.now();
    
    try {
      // Create MCP request
      const request: MCPRequest = {
        id: `skill-${skill.id}-${Date.now()}`,
        serverId: skill.serverId,
        capability: skill.capability,
        payload: input,
        timestamp: new Date(),
        tenantId,
        conversationId
      };
      
      // Execute the request through MCP Manager
      const response = await mcpManager.executeRequest(request);
      
      execution.success = response.success;
      execution.output = response.data;
      execution.confidence = this.calculateConfidence(skill, input, response);
      execution.executionTime = Date.now() - startTime;
      
      if (!response.success) {
        execution.error = response.error;
      }
      
      // Store execution history
      this.recordExecution(tenantId, execution);
      
      console.log(`Skill executed: ${skill.name} (${execution.success ? 'success' : 'failed'})`);
      
    } catch (error) {
      execution.success = false;
      execution.error = error instanceof Error ? error.message : 'Unknown error';
      execution.executionTime = Date.now() - startTime;
      
      console.error(`Skill execution failed: ${skill.name}`, error);
    }
    
    return execution;
  }

  // Execute multiple skills in parallel
  async executeSkillsParallel(skills: MCPSkill[], input: any, tenantId: string, conversationId?: string): Promise<SkillExecution[]> {
    const executions = await Promise.all(
      skills.map(skill => this.executeSkill(skill, input, tenantId, conversationId))
    );
    
    return executions.filter(exec => exec.success);
  }

  // Calculate confidence score for skill execution
  private calculateConfidence(skill: MCPSkill, input: any, response: MCPResponse): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on response quality
    if (response.success) {
      confidence += 0.3;
    }
    
    // Increase confidence based on response data
    if (response.data && typeof response.data === 'object') {
      confidence += 0.1;
    }
    
    // Increase confidence based on execution time (faster is better)
    if (response.executionTime < 1000) {
      confidence += 0.1;
    }
    
    return Math.min(1.0, confidence);
  }

  // Record skill execution for analytics
  private recordExecution(tenantId: string, execution: SkillExecution): void {
    const tenantExecutions = this.skillExecutions.get(tenantId) || [];
    tenantExecutions.push(execution);
    
    // Keep only last 100 executions per tenant
    if (tenantExecutions.length > 100) {
      tenantExecutions.splice(0, tenantExecutions.length - 100);
    }
    
    this.skillExecutions.set(tenantId, tenantExecutions);
  }

  // Get execution history for a tenant
  getExecutionHistory(tenantId: string): SkillExecution[] {
    return this.skillExecutions.get(tenantId) || [];
  }

  // Get skill performance metrics
  getSkillMetrics(skillId: string, tenantId: string): {
    totalExecutions: number;
    successRate: number;
    averageExecutionTime: number;
    averageConfidence: number;
  } {
    const executions = this.getExecutionHistory(tenantId)
      .filter(exec => exec.skillId === skillId);
    
    if (executions.length === 0) {
      return {
        totalExecutions: 0,
        successRate: 0,
        averageExecutionTime: 0,
        averageConfidence: 0
      };
    }
    
    const successCount = executions.filter(exec => exec.success).length;
    const totalExecutionTime = executions.reduce((sum, exec) => sum + exec.executionTime, 0);
    const totalConfidence = executions.reduce((sum, exec) => sum + exec.confidence, 0);
    
    return {
      totalExecutions: executions.length,
      successRate: successCount / executions.length,
      averageExecutionTime: totalExecutionTime / executions.length,
      averageConfidence: totalConfidence / executions.length
    };
  }

  // Add context enhancement from skill execution
  addContextEnhancement(tenantId: string, enhancement: AIContextEnhancement): void {
    const tenantEnhancements = this.contextEnhancements.get(tenantId) || [];
    tenantEnhancements.push(enhancement);
    
    // Keep only last 50 enhancements per tenant
    if (tenantEnhancements.length > 50) {
      tenantEnhancements.splice(0, tenantEnhancements.length - 50);
    }
    
    this.contextEnhancements.set(tenantId, tenantEnhancements);
  }

  // Get enhanced context for AI responses
  getEnhancedContext(tenantId: string, baseContext: string): EnhancedContext {
    const enhancements = this.contextEnhancements.get(tenantId) || [];
    
    // Filter recent and relevant enhancements
    const recentEnhancements = enhancements.filter(enhancement => {
      const age = Date.now() - enhancement.timestamp.getTime();
      return age < 3600000; // Last hour
    });
    
    // Sort by relevance and priority
    recentEnhancements.sort((a, b) => {
      if (a.priority !== b.priority) {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.relevance - a.relevance;
    });
    
    // Calculate total relevance
    const totalRelevance = recentEnhancements.reduce((sum, enhancement) => 
      sum + enhancement.relevance, 0);
    
    // Extract unique sources
    const sources = [...new Set(recentEnhancements.map(e => e.source))];
    
    return {
      baseContext,
      enhancements: recentEnhancements,
      totalRelevance,
      sources,
      lastUpdated: new Date()
    };
  }

  // Initialize default skills for a tenant
  async initializeTenantSkills(tenantId: string, industry: string): Promise<void> {
    const defaultSkills = this.getDefaultSkillsForIndustry(industry, tenantId);
    
    for (const skill of defaultSkills) {
      await this.registerSkill(skill);
    }
    
    console.log(`Initialized ${defaultSkills.length} default skills for tenant ${tenantId}`);
  }

  // Get default skills based on industry
  private getDefaultSkillsForIndustry(industry: string, tenantId: string): MCPSkill[] {
    const baseSkills: MCPSkill[] = [
      // Memory skills
      {
        id: `memory-store-${tenantId}`,
        name: 'Store Customer Information',
        description: 'Automatically store important customer information in memory',
        serverId: 'memory',
        capability: 'storeMemory',
        isActive: true,
        tenantId,
        prompt: 'Store this information for future reference',
        examples: ['Remember that I prefer morning appointments', 'My budget is $10,000'],
        priority: 8,
        conditions: {
          keywords: ['remember', 'store', 'save', 'note', 'prefer', 'budget', 'timeline'],
          context: [],
          stage: ['discovery', 'consideration']
        }
      },
      {
        id: `memory-recall-${tenantId}`,
        name: 'Recall Customer Information',
        description: 'Retrieve stored customer information when relevant',
        serverId: 'memory',
        capability: 'retrieveMemory',
        isActive: true,
        tenantId,
        prompt: 'Recall what we know about this customer',
        examples: ['What did I tell you about my budget?', 'Do you remember my preferences?'],
        priority: 9,
        conditions: {
          keywords: ['remember', 'recall', 'what did', 'previous', 'before', 'earlier'],
          context: [],
          stage: ['consideration', 'decision']
        }
      },
      
      // Fetch skills
      {
        id: `fetch-weather-${tenantId}`,
        name: 'Get Weather Information',
        description: 'Fetch current weather and forecast for location-based recommendations',
        serverId: 'fetch',
        capability: 'getWeatherData',
        isActive: true,
        tenantId,
        prompt: 'Get weather information for better recommendations',
        examples: ['What\'s the weather like?', 'Will it be sunny this week?'],
        priority: 6,
        conditions: {
          keywords: ['weather', 'sunny', 'rain', 'storm', 'forecast', 'temperature'],
          context: [],
          stage: ['discovery', 'consideration']
        }
      },
      {
        id: `fetch-news-${tenantId}`,
        name: 'Get Industry News',
        description: 'Fetch latest industry news and trends',
        serverId: 'fetch',
        capability: 'getNewsAndTrends',
        isActive: true,
        tenantId,
        prompt: 'Get latest industry news and trends',
        examples: ['What\'s new in solar?', 'Any industry updates?'],
        priority: 4,
        conditions: {
          keywords: ['news', 'updates', 'trends', 'latest', 'new', 'industry'],
          context: [],
          stage: ['discovery']
        }
      }
    ];

    // Add industry-specific skills
    const industrySkills = this.getIndustrySpecificSkills(industry, tenantId);
    
    return [...baseSkills, ...industrySkills];
  }

  // Get industry-specific skills
  private getIndustrySpecificSkills(industry: string, tenantId: string): MCPSkill[] {
    const skills: { [key: string]: MCPSkill[] } = {
      solar: [
        {
          id: `solar-utility-rates-${tenantId}`,
          name: 'Monitor Utility Rates',
          description: 'Monitor local utility rates for solar savings calculations',
          serverId: 'fetch',
          capability: 'monitorUtilityRates',
          isActive: true,
          tenantId,
          prompt: 'Get current utility rates for solar savings calculation',
          examples: ['What are the current electricity rates?', 'How much can I save with solar?'],
          priority: 7,
          conditions: {
            keywords: ['rates', 'utility', 'electricity', 'bill', 'savings', 'cost'],
            context: [],
            stage: ['consideration', 'decision']
          }
        },
        {
          id: `solar-competitor-data-${tenantId}`,
          name: 'Check Competitor Pricing',
          description: 'Get competitor pricing and service information',
          serverId: 'fetch',
          capability: 'getCompetitorData',
          isActive: true,
          tenantId,
          prompt: 'Get competitor pricing information',
          examples: ['How do your prices compare?', 'Are you competitive?'],
          priority: 5,
          conditions: {
            keywords: ['compare', 'competitor', 'pricing', 'other companies', 'alternatives'],
            context: [],
            stage: ['consideration']
          }
        }
      ],
      roofing: [
        {
          id: `roofing-weather-alerts-${tenantId}`,
          name: 'Weather Alert Monitoring',
          description: 'Monitor weather alerts for roofing urgency',
          serverId: 'fetch',
          capability: 'getWeatherData',
          isActive: true,
          tenantId,
          prompt: 'Monitor weather for roofing urgency',
          examples: ['Is there a storm coming?', 'Should I repair my roof before winter?'],
          priority: 8,
          conditions: {
            keywords: ['storm', 'damage', 'urgent', 'emergency', 'weather', 'winter'],
            context: [],
            stage: ['discovery', 'decision']
          }
        }
      ],
      hvac: [
        {
          id: `hvac-energy-monitoring-${tenantId}`,
          name: 'Energy Usage Monitoring',
          description: 'Monitor energy usage patterns for HVAC optimization',
          serverId: 'fetch',
          capability: 'getWeatherData',
          isActive: true,
          tenantId,
          prompt: 'Monitor energy usage for HVAC optimization',
          examples: ['My energy bills are high', 'Is my system efficient?'],
          priority: 7,
          conditions: {
            keywords: ['energy', 'bills', 'efficient', 'usage', 'costs', 'optimize'],
            context: [],
            stage: ['discovery', 'consideration']
          }
        }
      ]
    };

    return skills[industry] || [];
  }

  // Clean up old data
  cleanup(): void {
    const oneHourAgo = new Date(Date.now() - 3600000);
    
    // Clean up old context enhancements
    for (const [tenantId, enhancements] of this.contextEnhancements.entries()) {
      const recentEnhancements = enhancements.filter(e => e.timestamp > oneHourAgo);
      this.contextEnhancements.set(tenantId, recentEnhancements);
    }
    
    // Clean up old executions (keep last 24 hours)
    const oneDayAgo = new Date(Date.now() - 86400000);
    for (const [tenantId, executions] of this.skillExecutions.entries()) {
      const recentExecutions = executions.filter(e => e.timestamp > oneDayAgo);
      this.skillExecutions.set(tenantId, recentExecutions);
    }
  }

  // Start cleanup routine
  startCleanup(): void {
    setInterval(() => {
      this.cleanup();
    }, 3600000); // Clean up every hour
  }
}

// Export singleton instance
export const skillInjectionSystem = new SkillInjectionSystem();