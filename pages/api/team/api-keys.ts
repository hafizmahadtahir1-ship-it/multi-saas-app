import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { teamId, service, token } = req.body;

      if (!teamId || !service || !token) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const encryptionKey = process.env.ENCRYPTION_KEY!;
      if (!encryptionKey || encryptionKey.length !== 32) {
        throw new Error("Invalid ENCRYPTION_KEY length (must be 32 chars)");
      }

      const iv = Buffer.alloc(16, 0);
      const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(encryptionKey, "utf-8"),
        iv
      );

      let encrypted = cipher.update(token, "utf-8", "hex");
      encrypted += cipher.final("hex");

      const { data, error } = await supabase
        .from("team_api_keys")
        .insert([{ team_id: teamId, service, token_encrypted: encrypted }]);

      if (error) throw error;

      return res.status(200).json({ success: true, data });
    } catch (error: any) {
      console.error("API Error:", error.message);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}