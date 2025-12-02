"use server";

import { getCurrentUserWithTeam } from '@/lib/auth-utils';
import { createServerClientAsync } from '@/lib/supabase';

export async function activateTemplate(templateId: number) {
  const { user, team } = await getCurrentUserWithTeam();
  const supabase = await createServerClientAsync();

  // Check if template exists for this team
  const { data: existing, error: checkError } = await supabase
    .from('team_templates')
    .select('id, active')
    .eq('team_id', team.team_id)
    .eq('template_id', templateId)
    .maybeSingle();

  if (checkError) {
    throw new Error(checkError.message || "Failed to check template status");
  }

  let result;
  if (existing) {
    // Toggle active status
    result = await supabase
      .from('team_templates')
      .update({ 
        active: !existing.active,
        updated_at: new Date().toISOString()
      })
      .eq('id', existing.id);
  } else {
    // Insert new record
    result = await supabase
      .from('team_templates')
      .insert({
        team_id: team.team_id,
        template_id: templateId,
        active: true,
      });
  }

  if (result.error) {
    throw new Error(result.error.message || "Failed to update template");
  }

  return { 
    success: true, 
    message: existing ? `Template ${!existing.active ? 'activated' : 'deactivated'} successfully` : "Template activated successfully"
  };
}

export async function getTemplatesWithActiveStatus() {
  const { user, team } = await getCurrentUserWithTeam();
  const supabase = await createServerClientAsync();

  // Get all templates
  const { data: templates, error: templatesError } = await supabase
    .from("templates")
    .select("id, name, description")
    .order("id");

  if (templatesError) {
    throw templatesError;
  }

  // Get active templates for this SPECIFIC team
  const { data: activeTemplates, error: activeError } = await supabase
    .from("team_templates")
    .select("template_id")
    .eq("team_id", team.team_id)
    .eq("active", true);

  if (activeError) {
    throw activeError;
  }

  // Combine data
  const activeTemplateIds = new Set(activeTemplates?.map(at => at.template_id) || []);

  const templatesWithActive = templates?.map(template => ({
    id: template.id,
    name: template.name,
    description: template.description,
    active: activeTemplateIds.has(template.id)
  })) || [];

  return { templates: templatesWithActive, team_id: team.team_id };
}

export async function getActiveTemplates() {
  const { user, team } = await getCurrentUserWithTeam();
  const supabase = await createServerClientAsync();

  // Get only active templates for this SPECIFIC team
  const { data: activeTemplates, error: activeError } = await supabase
    .from("team_templates")
    .select(`
      template_id,
      templates (id, name, description)
    `)
    .eq("team_id", team.team_id)
    .eq("active", true);

  if (activeError) {
    throw activeError;
  }

  // Transform data
  const templates = activeTemplates?.map(item => ({
    id: item.templates.id,
    name: item.templates.name,
    description: item.templates.description
  })) || [];

  return templates;
}