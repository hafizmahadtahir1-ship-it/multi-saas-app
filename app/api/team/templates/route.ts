// app/api/team/templates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Authentication check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get user's team
    const { data: userTeam, error: teamError } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .single();

    if (teamError || !userTeam) {
      return NextResponse.json({ message: "Team not found" }, { status: 403 });
    }

    // Get templates with active status
    const { data: templates, error: templatesError } = await supabase
      .from("templates")
      .select("id, name, description")
      .order("id");

    if (templatesError) {
      throw templatesError;
    }

    // Get active templates for this team
    const { data: activeTemplates, error: activeError } = await supabase
      .from("team_templates")
      .select("template_id")
      .eq("team_id", userTeam.team_id)
      .eq("active", true);

    if (activeError) {
      throw activeError;
    }

    const activeTemplateIds = new Set(activeTemplates?.map(at => at.template_id) || []);
    
    const templatesWithActive = templates?.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      active: activeTemplateIds.has(template.id)
    })) || [];

    return NextResponse.json({ 
      templates: templatesWithActive,
      team_id: userTeam.team_id 
    });
    
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { message: err.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { template_id } = await request.json();

    // Authentication check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!template_id) {
      return NextResponse.json({ message: "Missing template_id" }, { status: 400 });
    }

    // Get user's team
    const { data: userTeam, error: teamError } = await supabase
      .from("team_members")
      .select("team_id")
      .eq("user_id", user.id)
      .single();

    if (teamError || !userTeam) {
      return NextResponse.json({ message: "Team not found" }, { status: 403 });
    }

    // Activate template
    const { data, error } = await supabase.rpc('activate_team_template', {
      p_team_id: userTeam.team_id,
      p_template_id: template_id
    });

    if (error) {
      console.error("Activation error:", error);
      return NextResponse.json(
        { message: error.message || "Failed to activate template" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      message: "Template activated successfully",
      team_template_id: data 
    });
    
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { message: err.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}