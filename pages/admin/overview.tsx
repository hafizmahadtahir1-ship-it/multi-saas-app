// pages/admin/overview.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface AdminStats {
  totalTeams: number;
  totalProTeams: number;
  totalUsage: number;
  mrr: number;
}

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    totalTeams: 0,
    totalProTeams: 0,
    totalUsage: 0,
    mrr: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.status === 403) {
          router.push("/"); // redirect non-admin users
          return;
        }
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.log("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [router]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Teams</p>
          <p className="text-2xl font-bold">{stats.totalTeams}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Pro Teams</p>
          <p className="text-2xl font-bold">{stats.totalProTeams}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Usage</p>
          <p className="text-2xl font-bold">{stats.totalUsage}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">MRR ($)</p>
          <p className="text-2xl font-bold">{stats.mrr}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;