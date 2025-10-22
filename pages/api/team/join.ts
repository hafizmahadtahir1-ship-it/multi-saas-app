import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token required' });

  try {
    // 1️⃣ Verify invite
    const { data: invite, error: inviteErr } = await supabaseAdmin
      .from('invites')
      .select('*')
      .eq('token', token)
      .limit(1)
      .single();

    if (inviteErr || !invite) return res.status(404).json({ error: 'Invite not found' });

    if (!invite.email) return res.status(400).json({ error: 'Invite email missing' });

    // 2️⃣ Insert member into team_members
    const { data: member, error: memberErr } = await supabaseAdmin
      .from('team_members')
      .insert([
        {
          team_id: invite.team_id,
          user_email: invite.email,
          role: 'member',
        },
      ])
      .select()
      .single();

    if (memberErr) return res.status(500).json({ error: memberErr.message });

    // 3️⃣ Mark invite as used
    await supabaseAdmin
      .from('invites')
      .update({ used: true })
      .eq('token', token); // token ke through match

    // 4️⃣ Insert run log
    await supabaseAdmin.from('run_logs').insert([
      {
        user_email: invite.email,
        action: `Joined team ${invite.team_id} via invite`,
      },
    ]);

    return res.status(200).json({ success: true, member });
  } catch (err) {
    console.error('Join API Error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}