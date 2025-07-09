import { NextApiRequest, NextApiResponse } from 'next';
import { mcpManager } from '@/lib/mcp/mcp-manager';
import { tenantIsolationManager } from '@/lib/mcp/tenant-isolation';
import { skillInjectionSystem } from '@/lib/mcp/skill-injection';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tenantId } = req.query;

    if (!tenantId || typeof tenantId !== 'string') {
      return res.status(400).json({ error: 'Tenant ID is required' });
    }

    // Get MCP Manager status
    const mcpReady = mcpManager.isReady();
    const mcpConfig = mcpManager.getConfig();
    const mcpRegistry = mcpManager.getRegistry();

    // Get tenant environment
    const tenantEnvironment = tenantIsolationManager.getTenantEnvironment(tenantId);
    const tenantMetrics = tenantIsolationManager.getTenantMetrics(tenantId);

    // Get tenant skills
    const tenantSkills = skillInjectionSystem.getTenantSkills(tenantId);
    const activeSkills = skillInjectionSystem.getActiveSkills(tenantId);

    // Get skill performance metrics
    const skillMetrics = activeSkills.map(skill => ({
      ...skill,
      metrics: skillInjectionSystem.getSkillMetrics(skill.id, tenantId)
    }));

    // Get server statuses
    const serverStatuses = Object.values(mcpRegistry.servers).map(server => ({
      id: server.id,
      name: server.name,
      type: server.type,
      status: server.status,
      lastHeartbeat: server.lastHeartbeat,
      errorCount: server.errorCount,
      capabilities: server.capabilities.length
    }));

    // Build comprehensive status response
    const status = {
      timestamp: new Date().toISOString(),
      mcp: {
        ready: mcpReady,
        enabled: mcpConfig.enabled,
        lastUpdated: mcpRegistry.lastUpdated
      },
      tenant: {
        id: tenantId,
        environment: tenantEnvironment ? {
          serversConnected: tenantEnvironment.servers.length,
          activeConnections: tenantEnvironment.connections.filter(c => c.isActive).length,
          skillsRegistered: tenantEnvironment.skills.length,
          memoryContexts: tenantEnvironment.memoryContexts.size,
          isolation: tenantEnvironment.isolation
        } : null,
        metrics: tenantMetrics,
        skills: {
          total: tenantSkills.length,
          active: activeSkills.length,
          performance: skillMetrics
        }
      },
      servers: serverStatuses,
      health: {
        healthy: mcpReady && serverStatuses.every(s => s.status === 'connected'),
        issues: serverStatuses.filter(s => s.status !== 'connected').map(s => 
          `Server ${s.name} is ${s.status}`
        )
      }
    };

    res.status(200).json(status);
  } catch (error) {
    console.error('Error getting MCP status:', error);
    res.status(500).json({ 
      error: 'Failed to get MCP status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}