import { useState } from "react";

export default function Dashboard() {
  const [activeTemplates, setActiveTemplates] = useState<string[]>([]);

  const activateTemplate = async (templateName: string) => {
    try {
      const res = await fetch("/api/templates/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          team_id: "08fca22a-75c4-4311-a9e4-535cf69bdeeb", // replace with your test team ID
          template_id: "async_standup",
          channel_id: "C09MQTQVANQ", // replace with your Slack channel ID (#bot-testing)
        }),
      });

      if (res.ok) {
        setActiveTemplates([...activeTemplates, templateName]);
        alert(`${templateName} template activated!`);
      } else {
        alert("Failed to activate template");
      }
    } catch (err) {
      console.error(err);
      alert("Error activating template");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Team Dashboard</h1>

      <h2>Active Templates:</h2>
      <ul>
        {activeTemplates.length === 0 && <li>No templates active yet</li>}
        {activeTemplates.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>

      <h2>Available Templates:</h2>
      <button onClick={() => activateTemplate("Async Standup")}>
        Activate Async Standup
      </button>
    </div>
  );
}