// components/templates/TemplateCard.tsx - FULL UPDATED VERSION
"use client";

import { useState } from "react";

interface Template {
  id: number;
  name: string;
  description: string;
}

interface TemplateCardProps {
  template: Template;
  isActive?: boolean;
  onActivate: (templateId: number) => Promise<void>;
  onDeactivate: (templateId: number) => Promise<void>; // ✅ NEW PROP
}

export default function TemplateCard({ 
  template, 
  isActive = false, 
  onActivate,
  onDeactivate 
}: TemplateCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (isActive) {
        // Deactivate if already active
        await onDeactivate(template.id);
      } else {
        // Activate if not active
        await onActivate(template.id);
      }
    } catch (err: any) {
      setError(err.message || `Failed to ${isActive ? 'deactivate' : 'activate'} template`);
      console.error("Template action error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm mb-4 bg-white">
      <h2 className="font-bold text-lg text-gray-800">{template.name}</h2>
      <p className="text-gray-600 mb-3 mt-1">{template.description}</p>

      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}

      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-full px-4 py-2 rounded-md font-medium ${
          isActive
            ? "bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
            : loading
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
        } transition-colors`}
      >
        {loading 
          ? "Processing..." 
          : isActive 
            ? "✓ Active - Click to Deactivate" 
            : "Activate Template"
        }
      </button>
      
      {isActive && (
        <p className="text-green-600 text-sm mt-2 text-center">
          ✅ This template is active for your team
        </p>
      )}
    </div>
  );
}