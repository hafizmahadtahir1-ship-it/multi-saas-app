import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { teamId, templateId } = req.body;

  if (!teamId || !templateId) {
    return res.status(400).json({ error: "Missing teamId or templateId" });
  }

  // 1️⃣ Insert the team-template relation
  const { data: insertData, error: insertError } = await supabase
    .from("team_templates")
    .insert([{ team_id: teamId, template_id: templateId }]);

  if (insertError) {
    console.error("❌ Error inserting team_template:", insertError.message);
    return res.status(500).json({ error: insertError.message });
  }

  // 2️⃣ Fetch the Slack API key
  const { data: apiKeyRow, error: keyError } = await supabase
    .from("team_api_keys")
    .select("api_key_encrypted")
    .eq("team_id", teamId)
    .eq("service", "slack")
    .single();

  console.log("🔍 Checking Slack key for team:", teamId);
  console.log("Result:", apiKeyRow, keyError);

  if (keyError || !apiKeyRow) {
    console.error("⚠️ Slack API key not found for team:", teamId);
    return res.status(404).json({ error: "Slack API key not found for this team" });
  }

  const slackToken = apiKeyRow.api_key_encrypted;

  // 3️⃣ Send Slack message
  try {
    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${slackToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channel: "#bot-testing",
        text: `🚀 Template *${templateId}* was just activated for team *${teamId}*!`,
      }),
    });

    const slackResult = await response.json();
    console.log("📤 Slack response:", slackResult);

    if (!slackResult.ok) {
      throw new Error(slackResult.error || "Failed to send Slack message");
    }
  } catch (err: any) {
    console.error("❌ Slack error:", err.message);
    return res.status(500).json({ error: "Failed to send Slack message" });
  }

  // 4️⃣ Return success
  return res.status(200).json({
    message: "Template activated and Slack message sent successfully!",
    data: insertData,
  });
}