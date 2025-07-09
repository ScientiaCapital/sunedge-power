import { MCPServer, MCPRegistry, MCPConnection, MCPSkill, MCPServerType } from '@/types/mcp';

export class MCPServerRegistry {
  private servers: Map<string, MCPServer> = new Map();
  private connections: Map<string, MCPConnection[]> = new Map();
  private skills: Map<string, MCPSkill[]> = new Map();
  private lastUpdated: Date = new Date();

  async registerServer(server: MCPServer): Promise<void> {
    try {
      this.servers.set(server.id, server);
      this.lastUpdated = new Date();
      console.log(`Server registered: ${server.id} (${server.type})`);
    } catch (error) {
      console.error(`Failed to register server ${server.id}:`, error);
      throw error;
    }
  }

  async unregisterServer(serverId: string): Promise<void> {
    try {
      const server = this.servers.get(serverId);
      if (server) {
        this.servers.delete(serverId);
        
        // Clean up connections for this server
        for (const [tenantId, connections] of this.connections.entries()) {
          const filteredConnections = connections.filter(conn => conn.serverId !== serverId);
          if (filteredConnections.length !== connections.length) {
            this.connections.set(tenantId, filteredConnections);
          }
        }

        this.lastUpdated = new Date();
        console.log(`Server unregistered: ${serverId}`);
      }
    } catch (error) {
      console.error(`Failed to unregister server ${serverId}:`, error);
      throw error;
    }
  }

  getServer(serverId: string): MCPServer | null {
    return this.servers.get(serverId) || null;
  }

  getServerByType(type: MCPServerType): MCPServer | null {
    for (const server of this.servers.values()) {
      if (server.type === type) {
        return server;
      }
    }
    return null;
  }

  getAllServers(): MCPServer[] {
    return Array.from(this.servers.values());
  }

  getServersByTenant(tenantId: string): MCPServer[] {
    return Array.from(this.servers.values()).filter(server => server.tenantId === tenantId);
  }

  getServersByType(type: MCPServerType): MCPServer[] {
    return Array.from(this.servers.values()).filter(server => server.type === type);
  }

  async updateServerStatus(serverId: string, status: MCPServer['status']): Promise<void> {
    const server = this.servers.get(serverId);
    if (server) {
      server.status = status;
      server.lastHeartbeat = new Date();
      this.lastUpdated = new Date();
    }
  }

  async incrementErrorCount(serverId: string): Promise<void> {
    const server = this.servers.get(serverId);
    if (server) {
      server.errorCount += 1;
      this.lastUpdated = new Date();
    }
  }

  async resetErrorCount(serverId: string): Promise<void> {
    const server = this.servers.get(serverId);
    if (server) {
      server.errorCount = 0;
      this.lastUpdated = new Date();
    }
  }

  // Connection management
  async addConnection(connection: MCPConnection): Promise<void> {
    const tenantConnections = this.connections.get(connection.tenantId) || [];
    
    // Remove existing connection for same server/tenant
    const filteredConnections = tenantConnections.filter(
      conn => conn.serverId !== connection.serverId
    );
    
    filteredConnections.push(connection);
    this.connections.set(connection.tenantId, filteredConnections);
    this.lastUpdated = new Date();
  }

  async removeConnection(serverId: string, tenantId: string): Promise<void> {
    const tenantConnections = this.connections.get(tenantId) || [];
    const filteredConnections = tenantConnections.filter(
      conn => conn.serverId !== serverId
    );
    
    if (filteredConnections.length !== tenantConnections.length) {
      this.connections.set(tenantId, filteredConnections);
      this.lastUpdated = new Date();
    }
  }

  getConnection(serverId: string, tenantId: string): MCPConnection | null {
    const tenantConnections = this.connections.get(tenantId) || [];
    return tenantConnections.find(conn => conn.serverId === serverId) || null;
  }

  getTenantConnections(tenantId: string): MCPConnection[] {
    return this.connections.get(tenantId) || [];
  }

  getActiveConnections(): MCPConnection[] {
    const allConnections: MCPConnection[] = [];
    for (const connections of this.connections.values()) {
      allConnections.push(...connections.filter(conn => conn.isActive));
    }
    return allConnections;
  }

  // Skill management
  async registerSkill(skill: MCPSkill): Promise<void> {
    const tenantSkills = this.skills.get(skill.tenantId) || [];
    
    // Remove existing skill with same ID
    const filteredSkills = tenantSkills.filter(s => s.id !== skill.id);
    filteredSkills.push(skill);
    
    this.skills.set(skill.tenantId, filteredSkills);
    this.lastUpdated = new Date();
  }

  async unregisterSkill(skillId: string, tenantId: string): Promise<void> {
    const tenantSkills = this.skills.get(tenantId) || [];
    const filteredSkills = tenantSkills.filter(s => s.id !== skillId);
    
    if (filteredSkills.length !== tenantSkills.length) {
      this.skills.set(tenantId, filteredSkills);
      this.lastUpdated = new Date();
    }
  }

  getSkill(skillId: string, tenantId: string): MCPSkill | null {
    const tenantSkills = this.skills.get(tenantId) || [];
    return tenantSkills.find(skill => skill.id === skillId) || null;
  }

  getTenantSkills(tenantId: string): MCPSkill[] {
    return this.skills.get(tenantId) || [];
  }

  getSkillsByServer(serverId: string, tenantId: string): MCPSkill[] {
    const tenantSkills = this.skills.get(tenantId) || [];
    return tenantSkills.filter(skill => skill.serverId === serverId);
  }

  getActiveSkills(tenantId: string): MCPSkill[] {
    const tenantSkills = this.skills.get(tenantId) || [];
    return tenantSkills.filter(skill => skill.isActive);
  }

  // Health checks
  async performHealthCheck(): Promise<{
    healthy: boolean;
    servers: { [serverId: string]: boolean };
    connections: { [tenantId: string]: number };
    issues: string[];
  }> {
    const issues: string[] = [];
    const serverHealth: { [serverId: string]: boolean } = {};
    const connectionCounts: { [tenantId: string]: number } = {};

    // Check server health
    for (const server of this.servers.values()) {
      const timeSinceHeartbeat = Date.now() - server.lastHeartbeat.getTime();
      const isHealthy = timeSinceHeartbeat < 60000 && server.status === 'connected';
      
      serverHealth[server.id] = isHealthy;
      
      if (!isHealthy) {
        issues.push(`Server ${server.id} is unhealthy (status: ${server.status})`);
      }
      
      if (server.errorCount > 5) {
        issues.push(`Server ${server.id} has high error count: ${server.errorCount}`);
      }
    }

    // Check connection health
    for (const [tenantId, connections] of this.connections.entries()) {
      const activeConnections = connections.filter(conn => conn.isActive);
      connectionCounts[tenantId] = activeConnections.length;
      
      if (activeConnections.length === 0) {
        issues.push(`Tenant ${tenantId} has no active connections`);
      }
    }

    return {
      healthy: issues.length === 0,
      servers: serverHealth,
      connections: connectionCounts,
      issues
    };
  }

  // Statistics
  getStatistics(): {
    totalServers: number;
    serversByType: { [type: string]: number };
    totalConnections: number;
    activeConnections: number;
    totalSkills: number;
    skillsByServer: { [serverId: string]: number };
  } {
    const serversByType: { [type: string]: number } = {};
    let totalSkills = 0;
    const skillsByServer: { [serverId: string]: number } = {};

    // Count servers by type
    for (const server of this.servers.values()) {
      serversByType[server.type] = (serversByType[server.type] || 0) + 1;
    }

    // Count skills
    for (const skills of this.skills.values()) {
      totalSkills += skills.length;
      
      for (const skill of skills) {
        skillsByServer[skill.serverId] = (skillsByServer[skill.serverId] || 0) + 1;
      }
    }

    // Count connections
    let totalConnections = 0;
    let activeConnections = 0;
    
    for (const connections of this.connections.values()) {
      totalConnections += connections.length;
      activeConnections += connections.filter(conn => conn.isActive).length;
    }

    return {
      totalServers: this.servers.size,
      serversByType,
      totalConnections,
      activeConnections,
      totalSkills,
      skillsByServer
    };
  }

  // Registry snapshot
  getRegistry(): MCPRegistry {
    const servers: { [serverId: string]: MCPServer } = {};
    const connections: { [tenantId: string]: MCPConnection[] } = {};
    const skills: { [tenantId: string]: MCPSkill[] } = {};

    // Convert maps to objects for JSON serialization
    for (const [id, server] of this.servers.entries()) {
      servers[id] = server;
    }

    for (const [tenantId, tenantConnections] of this.connections.entries()) {
      connections[tenantId] = tenantConnections;
    }

    for (const [tenantId, tenantSkills] of this.skills.entries()) {
      skills[tenantId] = tenantSkills;
    }

    return {
      servers,
      connections,
      skills,
      lastUpdated: this.lastUpdated
    };
  }

  // Cleanup
  async cleanup(): Promise<void> {
    const now = Date.now();
    
    // Remove inactive connections older than 1 hour
    for (const [tenantId, connections] of this.connections.entries()) {
      const activeConnections = connections.filter(conn => {
        const isRecentlyActive = now - conn.lastActivity.getTime() < 3600000; // 1 hour
        return conn.isActive || isRecentlyActive;
      });
      
      if (activeConnections.length !== connections.length) {
        this.connections.set(tenantId, activeConnections);
      }
    }

    // Remove empty tenant entries
    for (const [tenantId, connections] of this.connections.entries()) {
      if (connections.length === 0) {
        this.connections.delete(tenantId);
      }
    }

    this.lastUpdated = new Date();
  }

  async shutdown(): Promise<void> {
    console.log('Shutting down MCP Server Registry...');
    
    // Close all connections
    for (const connections of this.connections.values()) {
      for (const connection of connections) {
        if (connection.websocket) {
          connection.websocket.close();
        }
      }
    }

    // Clear all data
    this.servers.clear();
    this.connections.clear();
    this.skills.clear();
    
    console.log('MCP Server Registry shutdown complete');
  }
}