import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function addAuditLog({
  team_id,
  user_id,
  action,
  metadata = {},
}: {
  team_id?: string;
  user_id?: string;
  action: string;
  metadata?: Record<string, any>;
}) {
  try {
    await supabase.from('audit_logs').insert([
      {
        team_id,
        user_id,
        action,
        metadata,
      },
    ]);
  } catch (err) {
    console.error('Audit log error:', err);
  }
}