// pages/api/invite/accept.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabaseAdmin'; // 👈 path adjust karo agar alag hai

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token, user_id } = req.body;
  if (!token || !user_id) {
    return res.status(400).json({ error: 'token and user_id required' });
  }

  // 1) Token check
  const { data: invite, error: fetchErr } = await supabaseAdmin
    .from('invites')
    .select('*')
    .eq('token', token)
    .single();

  if (fetchErr || !invite) return res.status(400).json({ error: 'Invalid token' });
  if (invite.used) return res.status(400).json({ error: 'Invite already used' });
  if (new Date(invite.expires_at) < new Date()) return res.status(400).json({ error: 'Invite expired' });

  // 2) Check if user already in team
  const { data: existing } = await supabaseAdmin
    .from('team_members')
    .select('*')
    .eq('team_id', invite.team_id)
    .eq('user_id', user_id)
    .maybeSingle();

  if (!existing) {
    const { error: insertErr } = await supabaseAdmin.from('team_members').insert([
      {
        team_id: invite.team_id,
        user_id,
        role: invite.role || 'member',
        joined_at: new Date().toISOString(),
      },
    ]);
    if (insertErr) return res.status(500).json({ error: 'Failed to add member' });
  }

  // 3) Mark invite as used
  await supabaseAdmin
    .from('invites')
    .update({ used: true, used_at: new Date().toISOString() })
    .eq('id', invite.id);

  return res.status(200).json({ success: true });
}