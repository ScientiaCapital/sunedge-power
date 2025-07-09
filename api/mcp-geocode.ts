import fs from 'fs';
import path from 'path';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: 'Missing address' });
  }
  // Load MCP config
  const configPath = path.join(process.cwd(), 'mcp-servers.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  const mcpUrl = config['google-maps'].url;
  try {
    const response = await fetch(`${mcpUrl}/geocode`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address }),
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch geocode', details: String(err) });
  }
} 