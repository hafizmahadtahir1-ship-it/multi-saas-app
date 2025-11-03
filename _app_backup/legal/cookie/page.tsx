import React from "react";

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Cookie Policy</h1>
      <div className="prose prose-gray">
        <p>We use cookies to improve your experience on our platform.</p>
        <h2>1. Essential Cookies</h2>
        <p>These are necessary for the basic operation of the website.</p>
        <h2>2. Analytics Cookies</h2>
        <p>We use cookies to monitor usage and improve features. No personal data is sold.</p>
        <h2>3. Managing Cookies</h2>
        <p>You can disable cookies in your browser settings at any time.</p>
      </div>
    </main>
  );
}