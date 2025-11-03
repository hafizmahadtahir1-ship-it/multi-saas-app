import React from "react";

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Terms of Service</h1>
      <div className="prose prose-gray">
        <p>Welcome to Multi-Micro SaaS! By using our platform, you agree to comply with these Terms of Service. Please read them carefully.</p>
        <h2>1. Acceptance</h2>
        <p>By accessing or using our services, you agree to be bound by these terms.</p>
        <h2>2. Account Responsibility</h2>
        <p>You are responsible for maintaining your account credentials and activities under your account.</p>
        <h2>3. Usage Limitations</h2>
        <p>Free plan users have usage limits. Do not attempt to bypass our systems or misuse the service.</p>
        <h2>4. Termination</h2>
        <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
      </div>
    </main>
  );
}