import { createServerClientAsync } from './supabase';

/**
 * Returns active team_id for a user
 */
export async function getTeamId(userId: string): Promise<string> {
  const supabase = await createServerClientAsync();
  
  const { data, error } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', userId)
    .eq('status', 'active')
    .limit(1)
    .single();

  if (error || !data) throw new Error('Team not found or user inactive');
  return data.team_id;
}

/**
 * Get team details with plan information
 */
export async function getTeamWithPlan(userId: string) {
  const supabase = await createServerClientAsync();
  
  const { data, error } = await supabase
    .from('team_members')
    .select(`
      team_id,
      teams (
        id,
        name,
        slug,
        plan_id,
        stripe_customer_id,
        created_at
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .limit(1)
    .single();

  if (error || !data) throw new Error('Team not found or user inactive');
  
  return {
    team_id: data.team_id,
    ...data.teams
  };
}