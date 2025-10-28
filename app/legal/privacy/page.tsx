import React from "react";

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Privacy Policy</h1>
      <div className="prose prose-gray">
        <p>We value your privacy. This policy explains how we collect, use, and protect your information.</p>
        <h2>1. Data Collection</h2>
        <p>We collect only essential information necessary to provide the services.</p>
        <h2>2. Data Usage</h2>
        <p>Your data is used for service functionality and improvement. We do not sell personal data.</p>
        <h2>3. Security</h2>
        <p>We implement measures to protect your data from unauthorized access.</p>
        <h2>4. Cookies</h2>
        <p>We use minimal cookies to enhance user experience. Users can opt-out via browser settings.</p>
      </div>
    </main>
  );
}