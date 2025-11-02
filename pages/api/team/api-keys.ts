import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "12345678901234567890123456789012";

function encrypt(text: string) {
  if (!text) return null;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(encrypted: string) {
  const [ivHex, encryptedText] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // ---------------- POST METHOD ----------------
    if (req.method === "POST") {
      const { team_id, integration, api_key, user_id } = req.body;

      if (!team_id || !integration || !api_key || !user_id) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const encryptedKey = encrypt(api_key);

      const { data, error } = await supabase
        .from("team_api_keys")
        .insert([
          {
            team_id,
            integration,
            encrypted_key: encryptedKey,
            created_by: user_id,
          },
        ])
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        return res.status(400).json({ error: error.message });
      }

      return res.status(200).json({ success: true, data });
    }

    // ---------------- GET METHOD ----------------
    if (req.method === "GET") {
      const { team_id, integration } = req.query;

      if (!team_id || !integration) {
        return res.status(400).json({ error: "Missing required query parameters" });
      }

      const { data, error } = await supabase
        .from("team_api_keys")
        .select("*")
        .eq("team_id", team_id as string)
        .eq("integration", integration as string)
        .limit(1)
        .single();

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      const decryptedKey = decrypt(data.encrypted_key as string);

      return res.status(200).json({ api_key: decryptedKey });
    }

    // ---------------- DEFAULT ----------------
    return res.status(405).json({ error: "Method not allowed" });
  } catch (err: any) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
}
