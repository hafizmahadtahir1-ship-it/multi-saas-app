import { createServerClientAsync } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { user_id, team_name } = await request.json()
    
    if (!user_id || !team_name) {
      return NextResponse.json(
        { error: 'user_id and team_name are required' },
        { status: 400 }
      )
    }

    const supabase = await createServerClientAsync()

    // Create team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .insert({
        name: team_name,
        slug: team_name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
      })
      .select()
      .single()

    if (teamError) {
      return NextResponse.json(
        { error: 'Failed to create team: ' + teamError.message },
        { status: 500 }
      )
    }

    // Add user as owner
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: team.id,
        user_id: user_id,
        role: 'owner',
        status: 'active'
      })

    if (memberError) {
      // Rollback team creation
      await supabase.from('teams').delete().eq('id', team.id)
      return NextResponse.json(
        { error: 'Failed to create team membership: ' + memberError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ team })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}