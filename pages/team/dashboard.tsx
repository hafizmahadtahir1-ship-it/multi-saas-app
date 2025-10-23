import { useState } from "react";

export default function Dashboard() {
  const [slackToken, setSlackToken] = useState("");

  const handleSaveToken = async () => {
    try {
      if (!slackToken) {
        alert("Please enter your Slack token first");
        return;
      }

      const teamId = "08fca22a-75c4-4311-a9e4-535cf69bdeeb"; // 👈 apna real team ID yahan daalo

      const payload = {
        teamId: teamId,
        service: "slack",
        token: slackToken.trim(),
      };

      console.log("Sending payload:", payload);

      const response = await fetch("/api/team/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert("Failed: " + data.error);
        return;
      }

      alert("Slack token saved successfully ✅");
    } catch (err: any) {
      console.error("Request failed", err);
      alert("Request failed: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Team Dashboard</h1>
      <p>Connect your Slack token below:</p>
      <input
        type="text"
        placeholder="Enter Slack token"
        value={slackToken}
        onChange={(e) => setSlackToken(e.target.value)}
        style={{ padding: "0.5rem", width: "300px" }}
      />
      <button
        onClick={handleSaveToken}
        style={{
          marginLeft: "1rem",
          padding: "0.5rem 1rem",
          background: "#0070f3",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Save Token
      </button>
    </div>
  );
}