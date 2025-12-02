import { createServerClientAsync } from './supabase'
import { redirect } from 'next/navigation'

export async function getCurrentUser() {
  const supabase = await createServerClientAsync()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    redirect('/login')
  }

  return user
}

export async function getCurrentUserWithTeam() {
  const user = await getCurrentUser()
  const supabase = await createServerClientAsync()

  // Get user's team
  const { data: userTeam, error: teamError } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('user_id', user.id)
    .single()

  if (teamError || !userTeam) {
    // Use direct database call instead of API to avoid circular dependency
    const { data: newTeam, error: createError } = await supabase
      .from('teams')
      .insert({
        name: `${user.email}'s Team`,
        slug: `${user.email?.split('@')[0]}-team-${Date.now()}`
      })
      .select()
      .single()

    if (createError || !newTeam) {
      throw new Error('Failed to create team: ' + createError?.message)
    }

    // Add user as team owner
    const { error: memberError } = await supabase
      .from('team_members')
      .insert({
        team_id: newTeam.id,
        user_id: user.id,
        role: 'owner'
      })

    if (memberError) {
      throw new Error('Failed to create team membership: ' + memberError.message)
    }

    return { 
      user, 
      team: { team_id: newTeam.id } 
    }
  }

  return { 
    user, 
    team: { team_id: userTeam.team_id } 
  }
}