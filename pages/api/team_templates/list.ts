import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { teamId } = req.query;

  if (!teamId || typeof teamId !== "string") {
    return res.status(400).json({ error: "Missing or invalid teamId" });
  }

  const { data, error } = await supabase
    .from("team_templates")
    .select("template_id")
    .eq("team_id", teamId);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const active = data.map((row) => row.template_id);
  return res.status(200).json({ active });
}
