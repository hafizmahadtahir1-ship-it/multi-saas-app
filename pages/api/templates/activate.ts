// pages/api/templates/activate.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { logError, logInfo } from "@/lib/logger";
import { rateLimit } from "@/lib/rateLimit";
import { encrypt } from "@/lib/encrypt";
import { z } from "zod";

// Input validation schema
const uuidRegex = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;

const activateSchema = z.object({
  team_id: z.string().regex(uuidRegex, "Invalid UUID"),
  template_id: z.string().regex(uuidRegex, "Invalid UUID"),
  user_id: z.string().regex(uuidRegex, "Invalid UUID"),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Rate limit check
    if (!rateLimit(req, res, "free")) return;

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    // Validate input
    const parseResult = activateSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ error: "Invalid input", details: parseResult.error });
    }

    const { team_id, template_id, user_id } = parseResult.data;

    // Check if template exists
    const { data: existingTemplate, error: templateError } = await supabaseAdmin
      .from("templates")
      .select("*")
      .eq("id", template_id)
      .single();

    if (templateError || !existingTemplate) {
      logError(templateError || new Error("Template not found"), "ActivateTemplate");
      return res.status(404).json({ error: "Template not found" });
    }

    // Encrypt template_id (example: if storing API keys with templates)
    const encryptedTemplateId = encrypt(template_id);

    // Insert into team_templates (activate template)
    const { data, error } = await supabaseAdmin
      .from("team_templates")
      .insert([{ team_id, template_id }])
      .select()
      .single();

    if (error) {
      logError(error, "ActivateTemplate");
      return res.status(500).json({ error: "Activation failed", details: error.message });
    }

    // Insert audit log
    await supabaseAdmin.from("audit_logs").insert([
      {
        team_id,
        user_id: user_id || null,
        action: "activate_template",
        details: { template_id, encryptedTemplateId },
      },
    ]);

    logInfo(`Template ${template_id} activated for team ${team_id}`, "ActivateTemplate");

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    logError(error, "ActivateTemplate");
    return res.status(500).json({ error: "Activation failed", details: error.message });
  }
}