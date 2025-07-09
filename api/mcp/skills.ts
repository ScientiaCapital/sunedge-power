import { NextApiRequest, NextApiResponse } from 'next';
import { skillInjectionSystem } from '@/lib/mcp/skill-injection';
import { MCPSkill } from '@/types/mcp';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tenantId } = req.query;

  if (!tenantId || typeof tenantId !== 'string') {
    return res.status(400).json({ error: 'Tenant ID is required' });
  }

  try {
    switch (req.method) {
      case 'GET':
        await handleGetSkills(req, res, tenantId);
        break;
      case 'POST':
        await handleCreateSkill(req, res, tenantId);
        break;
      case 'PUT':
        await handleUpdateSkill(req, res, tenantId);
        break;
      case 'DELETE':
        await handleDeleteSkill(req, res, tenantId);
        break;
      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in skills API:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

async function handleGetSkills(req: NextApiRequest, res: NextApiResponse, tenantId: string) {
  const { active } = req.query;
  
  let skills: MCPSkill[];
  if (active === 'true') {
    skills = skillInjectionSystem.getActiveSkills(tenantId);
  } else {
    skills = skillInjectionSystem.getTenantSkills(tenantId);
  }

  // Add performance metrics to each skill
  const skillsWithMetrics = skills.map(skill => ({
    ...skill,
    metrics: skillInjectionSystem.getSkillMetrics(skill.id, tenantId)
  }));

  res.status(200).json({
    success: true,
    skills: skillsWithMetrics,
    total: skills.length,
    active: skills.filter(s => s.isActive).length
  });
}

async function handleCreateSkill(req: NextApiRequest, res: NextApiResponse, tenantId: string) {
  const { name, description, serverId, capability, prompt, examples, priority, conditions } = req.body;

  // Validate required fields
  if (!name || !description || !serverId || !capability) {
    return res.status(400).json({ 
      error: 'Missing required fields: name, description, serverId, capability' 
    });
  }

  const skill: MCPSkill = {
    id: `skill-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    description,
    serverId,
    capability,
    isActive: true,
    tenantId,
    prompt: prompt || '',
    examples: examples || [],
    priority: priority || 5,
    conditions: conditions || {
      keywords: [],
      context: [],
      stage: []
    }
  };

  await skillInjectionSystem.registerSkill(skill);

  res.status(201).json({
    success: true,
    skill,
    message: 'Skill created successfully'
  });
}

async function handleUpdateSkill(req: NextApiRequest, res: NextApiResponse, tenantId: string) {
  const { skillId, ...updates } = req.body;

  if (!skillId) {
    return res.status(400).json({ error: 'Skill ID is required' });
  }

  // Get existing skill
  const existingSkills = skillInjectionSystem.getTenantSkills(tenantId);
  const existingSkill = existingSkills.find(s => s.id === skillId);

  if (!existingSkill) {
    return res.status(404).json({ error: 'Skill not found' });
  }

  // Update skill
  const updatedSkill: MCPSkill = {
    ...existingSkill,
    ...updates,
    tenantId // Ensure tenantId cannot be changed
  };

  await skillInjectionSystem.registerSkill(updatedSkill);

  res.status(200).json({
    success: true,
    skill: updatedSkill,
    message: 'Skill updated successfully'
  });
}

async function handleDeleteSkill(req: NextApiRequest, res: NextApiResponse, tenantId: string) {
  const { skillId } = req.body;

  if (!skillId) {
    return res.status(400).json({ error: 'Skill ID is required' });
  }

  await skillInjectionSystem.unregisterSkill(skillId, tenantId);

  res.status(200).json({
    success: true,
    message: 'Skill deleted successfully'
  });
}