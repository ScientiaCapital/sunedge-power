import { MCPConnection, MCPServer, MCPEvent, MCPEventHandler } from '@/types/mcp';
import { MCPServerRegistry } from './server-registry';

export class MCPConnectionHandler {
  private registry: MCPServerRegistry;
  private eventHandlers: Map<string, MCPEventHandler[]> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  constructor(registry: MCPServerRegistry) {
    this.registry = registry;
  }

  async createConnection(serverId: string, tenantId: string): Promise<MCPConnection> {
    try {
      const server = this.registry.getServer(serverId);
      if (!server) {
        throw new Error(`Server not found: ${serverId}`);
      }

      const connection: MCPConnection = {
        serverId,
        tenantId,
        isActive: true,
        lastActivity: new Date(),
        reconnectAttempts: 0
      };

      // For local servers, we don't need WebSocket connections
      // We'll simulate the connection as active
      await this.registry.addConnection(connection);
      
      // Update server status
      await this.registry.updateServerStatus(serverId, 'connected');
      
      // Emit connection event
      this.emitEvent({
        type: 'server.connected',
        serverId,
        tenantId,
        data: { connection },
        timestamp: new Date()
      });

      console.log(`Connection created: ${serverId} -> ${tenantId}`);
      return connection;
    } catch (error) {
      console.error(`Failed to create connection ${serverId} -> ${tenantId}:`, error);
      throw error;
    }
  }

  async closeConnection(serverId: string, tenantId: string): Promise<void> {
    try {
      const connection = this.registry.getConnection(serverId, tenantId);
      if (!connection) {
        return;
      }

      if (connection.websocket) {
        connection.websocket.close();
      }

      connection.isActive = false;
      await this.registry.removeConnection(serverId, tenantId);
      
      // Update server status if no more connections
      const allConnections = this.registry.getActiveConnections();
      const serverConnections = allConnections.filter(conn => conn.serverId === serverId);
      
      if (serverConnections.length === 0) {
        await this.registry.updateServerStatus(serverId, 'disconnected');
      }

      // Emit disconnection event
      this.emitEvent({
        type: 'server.disconnected',
        serverId,
        tenantId,
        data: { connection },
        timestamp: new Date()
      });

      console.log(`Connection closed: ${serverId} -> ${tenantId}`);
    } catch (error) {
      console.error(`Failed to close connection ${serverId} -> ${tenantId}:`, error);
    }
  }

  getConnection(serverId: string, tenantId: string): MCPConnection | null {
    return this.registry.getConnection(serverId, tenantId);
  }

  getActiveConnections(): MCPConnection[] {
    return this.registry.getActiveConnections();
  }

  async reconnect(serverId: string, tenantId: string): Promise<boolean> {
    try {
      const connection = this.registry.getConnection(serverId, tenantId);
      if (!connection) {
        return false;
      }

      // Close existing connection
      await this.closeConnection(serverId, tenantId);
      
      // Create new connection
      const newConnection = await this.createConnection(serverId, tenantId);
      
      // Reset reconnect attempts on successful connection
      newConnection.reconnectAttempts = 0;
      
      return true;
    } catch (error) {
      console.error(`Failed to reconnect ${serverId} -> ${tenantId}:`, error);
      
      // Increment reconnect attempts
      const connection = this.registry.getConnection(serverId, tenantId);
      if (connection) {
        connection.reconnectAttempts += 1;
      }
      
      return false;
    }
  }

  async handleConnectionError(serverId: string, tenantId: string, error: Error): Promise<void> {
    console.error(`Connection error ${serverId} -> ${tenantId}:`, error);
    
    // Update server error count
    await this.registry.incrementErrorCount(serverId);
    
    // Update server status
    await this.registry.updateServerStatus(serverId, 'error');
    
    // Emit error event
    this.emitEvent({
      type: 'server.error',
      serverId,
      tenantId,
      data: { error: error.message },
      timestamp: new Date()
    });

    // Attempt reconnection for transient errors
    const connection = this.registry.getConnection(serverId, tenantId);
    if (connection && connection.reconnectAttempts < 5) {
      console.log(`Attempting to reconnect ${serverId} -> ${tenantId} (attempt ${connection.reconnectAttempts + 1})`);
      
      // Exponential backoff
      const delay = Math.pow(2, connection.reconnectAttempts) * 1000;
      setTimeout(() => {
        this.reconnect(serverId, tenantId);
      }, delay);
    }
  }

  startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    
    // Start heartbeat monitoring
    this.heartbeatInterval = setInterval(() => {
      this.performHeartbeatCheck();
    }, 30000); // Check every 30 seconds

    // Start connection monitoring
    this.monitoringInterval = setInterval(() => {
      this.performConnectionMonitoring();
    }, 60000); // Monitor every minute

    console.log('MCP Connection monitoring started');
  }

  private async performHeartbeatCheck(): Promise<void> {
    const servers = this.registry.getAllServers();
    const now = Date.now();

    for (const server of servers) {
      const timeSinceHeartbeat = now - server.lastHeartbeat.getTime();
      
      // Consider server unhealthy if no heartbeat for 2 minutes
      if (timeSinceHeartbeat > 120000 && server.status === 'connected') {
        console.warn(`Server ${server.id} missed heartbeat, marking as disconnected`);
        await this.registry.updateServerStatus(server.id, 'disconnected');
        
        // Emit disconnection event for all tenant connections
        const allConnections = this.registry.getActiveConnections();
        const serverConnections = allConnections.filter(conn => conn.serverId === server.id);
        
        for (const connection of serverConnections) {
          this.emitEvent({
            type: 'server.disconnected',
            serverId: server.id,
            tenantId: connection.tenantId,
            data: { reason: 'heartbeat_timeout' },
            timestamp: new Date()
          });
        }
      }
    }
  }

  private async performConnectionMonitoring(): Promise<void> {
    const activeConnections = this.registry.getActiveConnections();
    const now = Date.now();

    for (const connection of activeConnections) {
      const timeSinceActivity = now - connection.lastActivity.getTime();
      
      // Mark connection as inactive if no activity for 30 minutes
      if (timeSinceActivity > 1800000) {
        console.log(`Connection ${connection.serverId} -> ${connection.tenantId} inactive, closing`);
        await this.closeConnection(connection.serverId, connection.tenantId);
      }
    }

    // Clean up registry
    await this.registry.cleanup();
  }

  async updateConnectionActivity(serverId: string, tenantId: string): Promise<void> {
    const connection = this.registry.getConnection(serverId, tenantId);
    if (connection) {
      connection.lastActivity = new Date();
    }
  }

  async pingServer(serverId: string): Promise<boolean> {
    try {
      const server = this.registry.getServer(serverId);
      if (!server) {
        return false;
      }

      // For local servers, we'll simulate a successful ping
      // In a real implementation, this would send a ping message
      await this.registry.updateServerStatus(serverId, 'connected');
      
      return true;
    } catch (error) {
      console.error(`Failed to ping server ${serverId}:`, error);
      return false;
    }
  }

  async performHealthCheck(): Promise<{
    healthy: boolean;
    servers: { [serverId: string]: boolean };
    connections: { [tenantId: string]: number };
    issues: string[];
  }> {
    return await this.registry.performHealthCheck();
  }

  on(eventType: string, handler: MCPEventHandler): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType)?.push(handler);
  }

  off(eventType: string, handler: MCPEventHandler): void {
    const handlers = this.eventHandlers.get(eventType);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emitEvent(event: MCPEvent): void {
    const handlers = this.eventHandlers.get(event.type);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event);
        } catch (error) {
          console.error(`Error in event handler for ${event.type}:`, error);
        }
      });
    }
  }

  stopMonitoring(): void {
    if (!this.isMonitoring) {
      return;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }

    this.isMonitoring = false;
    console.log('MCP Connection monitoring stopped');
  }

  async shutdown(): Promise<void> {
    console.log('Shutting down MCP Connection Handler...');
    
    // Stop monitoring
    this.stopMonitoring();
    
    // Close all connections
    const activeConnections = this.registry.getActiveConnections();
    for (const connection of activeConnections) {
      await this.closeConnection(connection.serverId, connection.tenantId);
    }
    
    // Clear event handlers
    this.eventHandlers.clear();
    
    console.log('MCP Connection Handler shutdown complete');
  }
}