'use client';

import { useState } from 'react';
import UpgradeModal from '@/components/UpgradeModal';

export default function UsagePage() {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📊 Team Usage Dashboard</h1>
      <p className="text-gray-600 mb-6">No usage data found.</p>

      {/* Temporary Upgrade Button */}
      <button
        onClick={() => setIsUpgradeModalOpen(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        Upgrade to Pro
      </button>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
}