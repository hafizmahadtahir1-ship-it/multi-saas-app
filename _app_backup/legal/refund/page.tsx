import React from "react";

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Refund Policy</h1>
      <div className="prose prose-gray">
        <p>All purchases on Multi-Micro SaaS are subject to our refund policy.</p>
        <h2>1. Free Plan</h2>
        <p>No payment is involved in the free plan; thus no refunds apply.</p>
        <h2>2. Paid Plan</h2>
        <p>Refunds for the $29 Pro plan can be requested within 7 days of purchase.</p>
        <h2>3. Contact</h2>
        <p>To request a refund, contact us via the support form.</p>
      </div>
    </main>
  );
}