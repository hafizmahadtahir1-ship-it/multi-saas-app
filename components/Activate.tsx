"use client";
import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function Activate({
  teamId,
  templateId,
}: {
  teamId: string;
  templateId: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login first");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/team/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ template_id: templateId, team_id: teamId }),
      });

      const json = await res.json();

      if (json.ok) {
        alert("Template activated ✅");
      } else {
        alert("Failed to activate ❌");
      }
    } catch (error) {
      console.error(error);
      alert("Error occurred ❌");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleActivate}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      {loading ? "Activating..." : "Activate"}
    </button>
  );
}