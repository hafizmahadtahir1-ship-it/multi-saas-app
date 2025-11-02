import type { NextApiRequest, NextApiResponse } from "next";
import { logError, logInfo } from "@/lib/logger";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    logInfo("Logger test started", "TestLogger");
    throw new Error("This is a test error for Sentry logging");
  } catch (error: any) {
    logError(error, "TestLogger");
    return res.status(500).json({ success: false, message: error.message });
  }
}
