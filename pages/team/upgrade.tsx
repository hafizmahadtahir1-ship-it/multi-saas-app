import { useState } from "react";

export default function UpgradePage() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/create-checkout-session", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url; // Stripe checkout redirect
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-semibold mb-4">Upgrade to Pro Plan</h1>
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Redirecting..." : "Upgrade → $29 / month"}
      </button>
    </div>
  );
}