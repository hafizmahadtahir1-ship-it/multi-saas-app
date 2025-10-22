import { NextPage } from "next";
import { useEffect, useState } from "react";
import TemplateCard from "../../components/TemplateCard";

const TemplatesPage: NextPage = () => {
  const teamId = "08fca22a-75c4-4311-a9e4-535cf69bdeeb"; // 🧠 your real team_id
  const [templates, setTemplates] = useState<any[]>([]);
  const [activeTemplates, setActiveTemplates] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null); // ✅ Toast state

  // ✅ Fetch templates (static for now)
  useEffect(() => {
    setTemplates([
      {
        id: "async_standup",
        name: "Async Standup",
        description: "Daily team async check-ins",
      },
      {
        id: "meeting_cost_calculator",
        name: "Meeting Cost Calculator",
        description: "Track meeting costs",
      },
    ]);
  }, []);

  // ✅ Fetch active templates from Supabase
  const fetchActive = async () => {
    const res = await fetch(`/api/team_templates/list?teamId=${teamId}`);
    const data = await res.json();
    if (Array.isArray(data)) {
      setActiveTemplates(data.map((t: any) => t.template_id));
    }
  };

  useEffect(() => {
    fetchActive();
  }, []);

  // ✅ Handle activation with optimistic UI and Slack notification
  const handleActivated = async (templateId: string) => {
    setLoading(templateId);

    // ✅ Optimistic UI update
    setActiveTemplates((prev) => [...prev, templateId]);

    try {
      const res = await fetch("/api/team_templates/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, templateId }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Activation failed");

      // ✅ Toast feedback
      setToast(`Template ${templateId} activated ✅ Slack notified!`);
      setTimeout(() => setToast(null), 4000);

      // ✅ Fetch active templates to ensure DB consistency
      await fetchActive();
    } catch (err: any) {
      console.error("Activation error:", err);
      setToast(`Activation failed: ${err.message}`);
      setTimeout(() => setToast(null), 4000);

      // ❌ Revert optimistic update on failure
      setActiveTemplates((prev) => prev.filter((id) => id !== templateId));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-2xl font-bold mb-4">Templates</h1>

      {/* ✅ Toast feedback */}
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
          {toast}
        </div>
      )}

      {templates.map((t) => (
        <TemplateCard
          key={t.id}
          template={t}
          teamId={teamId}
          isActive={activeTemplates.includes(t.id)} // ✅ ensures latest state
          onActivated={handleActivated}
          loading={loading} // ✅ pass loading state
        />
      ))}
    </div>
  );
};

export default TemplatesPage;