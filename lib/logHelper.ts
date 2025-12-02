import { supabase } from './supabaseClient';

export async function addRunLog({
  team_id,
  template_id,
  status,
  message,
}: {
  team_id: string;
  template_id: string;
  status: 'success' | 'failed';
  message?: string;
}) {
  try {
    const { error } = await supabase.from('run_logs').insert([
      {
        team_id,
        template_id,
        status,
        message: message || '',
      },
    ]);

    if (error) console.error('Log insert error:', error.message);
  } catch (err: any) {
    console.error('Unexpected log error:', err.message);
  }
}