import type { NextApiRequest, NextApiResponse } from "next";
import supabaseAdmin from "../../../lib/supabaseAdmin";  // apna sahi path rakhna

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { teamId, templateId } = req.body;

  if (!teamId || !templateId) {
    return res.status(400).json({ error: "Missing teamId or templateId" });
  }

  const { error } = await supabaseAdmin
    .from("team_templates")
    .insert([{ team_id: teamId, template_id: templateId, activated_at: new Date().toISOString() }]);

  if (error) {
    console.error("Supabase insert error:", error);
    return res.status(500).json({ error: "Database insert failed", details: error.message });
  }

  return res.status(200).json({ success: true });
}