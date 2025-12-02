// lib/cron/template-processor.ts
import { createClient } from '@supabase/supabase-js';
import { WebClient } from '@slack/web-api';
import { decrypt } from '@/lib/encrypt';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function processActiveTemplates() {
  console.log('🔄 Starting template processing...');
  
  try {
    // Get all active team templates
    const { data: activeTeamTemplates, error } = await supabase
      .from('team_templates')
      .select(`
        team_id,
        template_id,
        teams (
          id,
          name,
          slack_access_token_encrypted
        ),
        templates (
          id,
          name,
          slug
        )
      `)
      .eq('active', true);

    if (error) {
      console.error('❌ Error fetching active templates:', error);
      return;
    }

    console.log(`📊 Found ${activeTeamTemplates?.length || 0} active templates`);

    if (!activeTeamTemplates || activeTeamTemplates.length === 0) {
      console.log('✅ No active templates to process');
      return;
    }

    // Process each active template
    for (const item of activeTeamTemplates) {
      try {
        await processTemplateForTeam(
          item.team_id,
          item.template_id,
          item.teams as any,
          item.templates as any
        );
      } catch (teamError) {
        console.error(`❌ Error processing team ${item.teams?.name || item.team_id}:`, teamError);
      }
    }

    console.log('✅ Template processing completed');
  } catch (err) {
    console.error('❌ Fatal error in template processing:', err);
  }
}

async function processTemplateForTeam(
  teamId: string, 
  templateId: number, 
  team: any, 
  template: any
) {
  console.log(`🔄 Processing template "${template?.name}" for team "${team?.name}"`);
  
  if (!team?.slack_access_token_encrypted) {
    console.log(`⚠️ Team "${team?.name}" has no Slack integration`);
    return;
  }

  try {
    // Decrypt Slack token
    const slackToken = decrypt(team.slack_access_token_encrypted);
    const slack = new WebClient(slackToken);

    switch (template.slug) {
      case 'async-standup':
        await sendAsyncStandup(slack, team);
        break;
      case 'weekly-retrospective':
        await sendWeeklyRetrospective(slack, team);
        break;
      default:
        console.log(`⚠️ Unknown template: ${template.slug}`);
    }

    await trackTemplateUsage(teamId, templateId);
    console.log(`✅ Successfully processed "${template.name}" for team "${team.name}"`);
  } catch (error) {
    console.error(`❌ Error processing template for team ${team?.name}:`, error);
  }
}

async function sendAsyncStandup(slack: WebClient, team: any) {
  try {
    const message = {
      channel: 'general',
      text: `📊 *Daily Async Standup Reminder*\n\nHello team ${team.name}! 👋\n\nIt's time for your daily async standup!\n\n1. What did you accomplish yesterday?\n2. What will you do today?\n3. Any blockers?`,
      mrkdwn: true
    };

    const result = await slack.chat.postMessage(message);
    console.log(`📨 Standup sent to team ${team.name}, TS: ${result.ts}`);
  } catch (error: any) {
    if (error?.data?.error === 'rate_limited') {
      console.log(`⏳ Rate limited for team ${team.name}, retrying later`);
      throw error;
    }
    console.error(`❌ Slack error for team ${team.name}:`, error?.data?.error || error.message);
  }
}

async function sendWeeklyRetrospective(slack: WebClient, team: any) {
  try {
    const message = {
      channel: 'general',
      text: `🔄 *Weekly Retrospective Reminder*\n\nHello team ${team.name}! 👋\n\nIt's time for our weekly retrospective!\n\n1. What went well?\n2. What could be improved?\n3. Action items for next week?`,
      mrkdwn: true
    };

    const result = await slack.chat.postMessage(message);
    console.log(`📨 Retrospective sent to team ${team.name}, TS: ${result.ts}`);
  } catch (error: any) {
    if (error?.data?.error === 'rate_limited') {
      console.log(`⏳ Rate limited for team ${team.name}, retrying later`);
      throw error;
    }
    console.error(`❌ Slack error for team ${team.name}:`, error?.data?.error || error.message);
  }
}

async function trackTemplateUsage(teamId: string, templateId: number) {
  try {
    const today = new Date();
    const month = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
    
    // Upsert usage record
    const { error } = await supabase
      .from('team_usage_monthly')
      .upsert(
        {
          team_id: teamId,
          month: month,
          template_id: templateId,
          runs_count: 1
        },
        { 
          onConflict: 'team_id,month,template_id',
          ignoreDuplicates: false
        }
      )
      .select();

    if (error) {
      console.error(`❌ Usage tracking error for team ${teamId}:`, error);
      return;
    }

    console.log(`📈 Usage tracked for team ${teamId}, template ${templateId}`);
  } catch (error) {
    console.error(`❌ Failed to track usage for team ${teamId}:`, error);
  }
}