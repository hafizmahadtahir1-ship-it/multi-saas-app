// app/templates/page.tsx - FINAL WORKING VERSION
"use client";

import { useState, useEffect } from "react";
import { getTemplatesWithActiveStatus } from "@/lib/actions/templates";
import { activateTemplate } from "@/lib/actions/templates";
import dynamic from "next/dynamic";

// Client component ko dynamically import karo
const TemplateCard = dynamic(() => import("@/components/templates/TemplateCard"), {
  ssr: false,
  loading: () => (
    <div className="border p-4 rounded-lg bg-white mb-4">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
    </div>
  )
});

interface Template {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await getTemplatesWithActiveStatus();
      setTemplates(data.templates || []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load templates");
      console.error("Error fetching templates:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleActivateTemplate = async (templateId: number) => {
    try {
      setError(null);
      await activateTemplate(templateId);
      // Refresh the templates list to get updated active status
      await fetchTemplates();
    } catch (err: any) {
      setError(err.message || "Failed to update template");
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Templates</h1>
          <div className="animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="border p-4 rounded-lg bg-white mb-4">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Templates</h1>
          <p className="text-gray-600">
            Choose and activate templates for your team
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid gap-4">
          {templates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No templates available</p>
            </div>
          ) : (
            templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isActive={template.active}
                onActivate={handleActivateTemplate}
                onDeactivate={handleActivateTemplate}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}