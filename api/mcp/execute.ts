import { NextApiRequest, NextApiResponse } from 'next';
import { mcpManager } from '@/lib/mcp/mcp-manager';
import { tenantIsolationManager } from '@/lib/mcp/tenant-isolation';
import { MCPRequest } from '@/types/mcp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { tenantId, serverId, capability, payload, conversationId } = req.body;

    // Validate required fields
    if (!tenantId || !serverId || !capability) {
      return res.status(400).json({ 
        error: 'Missing required fields: tenantId, serverId, capability' 
      });
    }

    // Check if tenant environment exists
    const tenantEnvironment = tenantIsolationManager.getTenantEnvironment(tenantId);
    if (!tenantEnvironment) {
      return res.status(404).json({ error: 'Tenant environment not found' });
    }

    // Create MCP request
    const mcpRequest: MCPRequest = {
      id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      serverId,
      capability,
      payload: payload || {},
      timestamp: new Date(),
      tenantId,
      conversationId
    };

    // Execute request through tenant isolation manager
    const response = await tenantIsolationManager.executeRequest(mcpRequest);

    // Return response
    res.status(200).json({
      success: true,
      request: {
        id: mcpRequest.id,
        serverId,
        capability,
        timestamp: mcpRequest.timestamp
      },
      response: {
        id: response.id,
        requestId: response.requestId,
        success: response.success,
        data: response.data,
        error: response.error,
        timestamp: response.timestamp,
        executionTime: response.executionTime
      }
    });

  } catch (error) {
    console.error('Error executing MCP request:', error);
    res.status(500).json({ 
      error: 'Failed to execute MCP request',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}