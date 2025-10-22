import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { team_id, template_id, channel_id } = req.body;

  if (!team_id || !template_id || !channel_id) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    // 1️⃣ Get Slack token from Supabase
    const { data, error } = await supabase
      .from("team_api_keys")
      .select("slack_access_token")
      .eq("team_id", team_id)
      .single();

    if (error || !data?.slack_access_token) {
      return res.status(400).json({ error: "Slack token not found" });
    }

    const slackToken = data.slack_access_token;

    // 2️⃣ Post message to Slack
    const slackRes = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${slackToken}`,
      },
      body: JSON.stringify({
        channel: channel_id,
        text: `🚀 Template ${template_id} was just activated for team ${team_id}!`,
      }),
    });

    const slackData = await slackRes.json();

    if (!slackData.ok) {
      return res.status(400).json({ error: slackData.error });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}