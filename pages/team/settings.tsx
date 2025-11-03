// pages/team/settings.tsx
import { useEffect, useState } from 'react'
import supabase from '../../lib/supabaseClient'
import TemplateCard from '../../components/TemplateCard'
import Activate from '../../components/Activate'

type Template = {
  id: string
  name: string
  description: string
}

export default function TeamSettings() {
  const [session, setSession] = useState<any>(null)
  const [templates, setTemplates] = useState<Template[]>([])
  const [teamId, setTeamId] = useState<string>('')

  // Fetch session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
    }
    getSession()
  }, [])

  // Fetch team and templates after session is ready
  useEffect(() => {
    const fetchTeamAndTemplates = async () => {
      if (!session?.user) return

      // Fetch user's team
      const { data: member, error: memberError } = await supabase
        .from('members')
        .select('team_id')
        .eq('user_id', session.user.id)
        .single()

      if (memberError) {
        console.error(memberError)
        return
      }

      setTeamId(member.team_id)

      // Fetch all templates
      const { data: templatesData, error: templateError } = await supabase
        .from('templates')
        .select('*')

      if (templateError) console.error(templateError)
      else setTemplates(templatesData)
    }

    fetchTeamAndTemplates()
  }, [session])

  if (!session) return <p>Please login</p>
  if (!teamId) return <p>Loading team...</p>

  return (
    <div>
      <h1>Team Settings</h1>
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template}>
          <Activate teamId={teamId} templateId={template.id} />
        </TemplateCard>
      ))}
    </div>
  )
}