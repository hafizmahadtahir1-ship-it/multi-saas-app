import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const templates = [
      { id: "1", name: "Async Standup", description: "Daily standup template", active: false },
      { id: "2", name: "Meeting Cost Calculator", description: "Track meeting costs", active: true },
    ];
    res.status(200).json({ templates });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}