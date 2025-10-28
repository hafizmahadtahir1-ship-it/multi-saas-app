import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { team_id, template_id } = req.body;

    if (!team_id || !template_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Step 1: Fetch template UUID from name (e.g. "async standup")
    const { data: templateRow, error: fetchError } = await supabase
      .from("templates")
      .select("id")
      .eq("name", template_id)
      .single();

    if (fetchError || !templateRow) {
      console.error("Template not found:", fetchError);
      return res.status(404).json({ error: "Template not found" });
    }

    // ✅ Step 2: Insert into team_templates
    const { error: insertError } = await supabase
      .from("team_templates")
      .insert({
        team_id,
        template_id: templateRow.id,
        is_active: true,
      });

    if (insertError) {
      console.error("Insert failed:", insertError);
      return res.status(400).json({ error: insertError.message });
    }

    // ✅ Success
    return res.status(200).json({ success: true, message: "Template activated successfully" });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}