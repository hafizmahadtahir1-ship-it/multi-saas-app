// app/api/templates/run/route.ts - EXECUTION CODE
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
      return NextResponse.json({ message: "Team not found" }, { status: 403 });
    }

    // Simple template execution (for testing)
    console.log(`🚀 Executing template ${template_id} for team ${userTeam.team_id}`);
    
    // Track usage
    const month = new Date().toISOString().slice(0, 7);
    const { data: existingUsage } = await supabase
      .from('team_usage')
      .select('count')
      .eq('team_id', userTeam.team_id)
      .eq('month', month)
      .single();

    const currentCount = existingUsage?.count || 0;
    
    await supabase
      .from('team_usage')
      .upsert(
        {
          team_id: userTeam.team_id,
          month: month,
          count: currentCount + 1,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'team_id,month' }
      );

    return NextResponse.json({ 
      success: true,
      message: "Template executed successfully",
      usage: currentCount + 1
    });
    
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json(
      { message: err.message || "Internal server error" }, 
      { status: 500 }
    );
  }
}