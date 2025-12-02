// pages/team/dashboard.tsx
import React, { useState, useEffect } from "react";
import UpgradeModal from "../../components/UpgradeModal";

interface TeamData {
  plan: string;
}

const DashboardPage: React.FC = () => {
  // Modal state
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  // Team plan state
  const [teamPlan, setTeamPlan] = useState<string>("free");

  // Sample templates for dashboard
  const templates = [
    { id: 1, name: "Async Standup" },
    { id: 2, name: "Meeting Cost Calculator" },
  ];

  // Fetch team plan from Supabase API
  useEffect(() => {
    async function fetchTeamPlan() {
      try {
        const res = await fetch("/api/get_team_plan");
        const data: TeamData = await res.json();
        if (data.plan) setTeamPlan(data.plan);
      } catch (err) {
        console.log("Error fetching team plan:", err);
      }
    }
    fetchTeamPlan();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Team Dashboard</h1>

      {/* Templates Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {templates.map((t) => (
          <div key={t.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-2">{t.name}</h2>
            {/* Run Template Button */}
            <button
              className="px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => {
                if (teamPlan === "free") {
                  alert("You’ve reached the Free Plan limit! Upgrade to Pro to run unlimited templates.");
                } else {
                  alert(`Running ${t.name} template...`);
                }
              }}
            >
              Run Template
            </button>
          </div>
        ))}
      </div>

      {/* Free Plan Notice */}
      {teamPlan === "free" && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded mb-6">
          <p className="mb-2 font-semibold">Upgrade Required 🚀</p>
          <p className="mb-4">
            You’ve reached the limit for the Free Plan. Upgrade to Pro for unlimited runs and premium features.
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setIsUpgradeOpen(true)}
          >
            Upgrade to Pro
          </button>
        </div>
      )}

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
      />
    </div>
  );
};

export default DashboardPage;