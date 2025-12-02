// app/api/templates/deactivate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

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
      .eq("status", "active")
      .single();

    if (teamError || !userTeam) {
      return NextResponse.json({ message: "Team not found or user not member" }, { status: 403 });
    }

    // Deactivate template
    const { error } = await supabase
      .from('team_templates')
      .update({ active: false, updated_at: new Date().toISOString() })
      .eq('team_id', userTeam.team_id)
      .eq('template_id', template_id);

    if (error) {
      console.error("Deactivation error:", error);
      return NextResponse.json(
        { message: error.message || "Failed to deactivate template" }, 
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Template deactivated successfully"
    });
    
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { message: err.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}