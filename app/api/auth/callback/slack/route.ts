// app/api/auth/callback/slack/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function GET(request: NextRequest) {
  let response = NextResponse.next(); // ✅ Move response here so cookies can access it

  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    // 🔹 DEBUG LOG: API route hit + code
    console.log('✅ API Route Hit - Code:', code);
    console.log('✅ Environment Check:', {
      hasClientId: !!process.env.NEXT_PUBLIC_SLACK_CLIENT_ID,
      hasClientSecret: !!process.env.SLACK_CLIENT_SECRET,
      hasAppUrl: !!process.env.NEXT_PUBLIC_APP_URL
    });

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // 1. Exchange code for access token
    const slackResponse = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID!,
        client_secret: process.env.SLACK_CLIENT_SECRET!,
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/slack`,
      }),
    });

    const data = await slackResponse.json();

    if (!data.ok) {
      throw new Error(data.error || 'Slack OAuth failed');
    }

    // 2. Create Supabase client with LATEST syntax
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            request.cookies.set({ name, value, ...options });
            response.cookies.set({ name, value, ...options });
          },
          remove(name, options) {
            request.cookies.delete(name);
            response.cookies.delete(name);
          },
        },
      }
    );

    // 3. Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // 4. Get user's team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (teamError || !team) {
      return NextResponse.redirect(new URL('/team/create', request.url));
    }

    // 5. Save Slack token to team
    const { error: updateError } = await supabase
      .from('teams')
      .update({
        slack_access_token_encrypted: data.access_token,
        slack_team_id: data.team.id,
        slack_team_name: data.team.name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', team.id);

    if (updateError) {
      throw new Error('Failed to save Slack token');
    }

    // 6. Redirect to integrations page with success
    return NextResponse.redirect(new URL('/settings/integrations?success=slack_connected', request.url));

  } catch (error: any) {
    console.error('Slack OAuth error:', error);
    return NextResponse.redirect(new URL('/settings/integrations?error=oauth_failed', request.url));
  }
}