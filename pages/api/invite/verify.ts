import type { NextApiRequest, NextApiResponse } from 'next';
import supabaseAdmin from '../../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'token required' });

  const { data, error } = await supabaseAdmin
    .from('invites')
    .select('*')
    .eq('token', token)
    .limit(1)
    .single();

  if (error) return res.status(500).json({ error: error.message });

  if (!data) return res.status(404).json({ found: false });

  return res.status(200).json({ found: true, invite: data });
}
