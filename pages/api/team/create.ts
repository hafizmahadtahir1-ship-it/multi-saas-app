import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '../../../lib/rateLimit';
import { addAuditLog } from '../../../lib/auditLog';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await rateLimit(req);

    const { user_id, team_name } = req.body;

    const { data, error } = await supabase
      .from('teams')
      .insert([{ name: team_name, owner_id: user_id }])
      .select()
      .single();

    if (error) throw error;

    await addAuditLog({
      team_id: data.id,
      user_id,
      action: 'TEAM_CREATED',
      metadata: { team_name },
    });

    return res.status(200).json({ success: true, team: data });
  } catch (err: any) {
    console.error(err);
    return res.status(400).json({ error: err.message || 'Error creating team' });
  }
}