// lib/supabase/queries/templates.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getActiveTeamTemplates() {
  const { data, error } = await supabase
    .from('team_templates')
    .select(`
      team_id,
      template_id,
      teams (
        id,
        name,
        slack_access_token
      ),
      templates (
        id,
        name,
        slug
      )
    `)
    .eq('active', true);

  if (error) {
    throw error;
  }

  return data;
}

export async function getTemplateById(id: number) {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getTeamActiveTemplates(teamId: string) {
  const { data, error } = await supabase
    .from('team_templates')
    .select(`
      template_id,
      templates (
        id,
        name,
        description
      )
    `)
    .eq('team_id', teamId)
    .eq('active', true);

  if (error) {
    throw error;
  }

  return data;
}