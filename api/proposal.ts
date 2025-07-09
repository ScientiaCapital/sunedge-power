import { addressToProposal } from '../src/lib/addressToProposal';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { address } = req.body;
  if (!address) {
    return res.status(400).json({ error: 'Missing address' });
  }
  try {
    const proposal = await addressToProposal({ address });
    res.status(200).json(proposal);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate proposal', details: String(err) });
  }
} 