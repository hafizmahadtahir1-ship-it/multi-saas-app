import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Simple async standup message (MVP version)
const standupMessage = `
👋 Good morning team!
Here’s your daily Async Standup.
1️⃣ What did you do yesterday?
2️⃣ What will you do today?
3️⃣ Any blockers?
Reply in this Slack channel.
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 1️⃣ Get all active teams (assuming 1 team for now)
    const { data: keys, error } = await supabase
      .from("team_api_keys")
      .select("team_id, token_encrypted, service");

    if (error || !keys || keys.length === 0)
      return res.status(400).json({ error: "No Slack API keys found" });

    // 2️⃣ Just take first key (MVP)
    const key = keys[0];
    const slackToken = key.token_encrypted; // not decrypting for MVP (demo)
    console.log("Running standup for team:", key.team_id);

    // 3️⃣ Post fake Slack message (demo only)
    // Later: use Slack API with decrypted token
    console.log("Message sent:", standupMessage);

    // 4️⃣ Log run into usage table
    await supabase.from("usage").insert([
      {
        team_id: key.team_id,
        template: "async-standup",
        status: "success",
        run_at: new Date().toISOString(),
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Async Standup run completed (MVP).",
    });
  } catch (err: any) {
    console.error("Runner error:", err);
    return res.status(500).json({ error: err.message });
  }
}
