import { useEffect, useState } from 'react'
import { useSession } from '@supabase/auth-helpers-react'
import supabase from '../../lib/supabaseClient'
import TemplateCard from '../../components/TemplateCard'
import Activate from '../../components/Activate'

type Template = {
  id: string
  name: string
  description: string
}

export default function TeamSettings() {
  const session = useSession()
  const [templates, setTemplates] = useState<Template[]>([])
  const [teamId, setTeamId] = useState<string>('')

  useEffect(() => {
    const fetchTeamAndTemplates = async () => {
      if (!session?.user) return

      // Fetch user's team
      const { data: members, error: memberError } = await supabase
        .from('members')
        .select('team_id')
        .eq('user_id', session.user.id)
        .single()

      if (memberError) {
        console.error(memberError)
        return
      }

      setTeamId(members.team_id)

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
          <Activate team_id={teamId} template_id={template.id} />
        </TemplateCard>
      ))}
    </div>
  )
}