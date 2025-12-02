// app/dashboard/page.tsx
import { getActiveTemplates } from "@/lib/actions/templates";
import Link from "next/link";

export default async function DashboardPage() {
  let activeTemplates: any[] = [];
  let error: string | null = null;

  try {
    activeTemplates = await getActiveTemplates();
  } catch (err: any) {
    console.error("Error fetching active templates:", err);
    // Better error handling
    if (err.message?.includes('team') || err.message?.includes('member')) {
      error = "Team access issue. Please check your team membership.";
    } else {
      error = "Failed to load active templates. Please try again.";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Overview of your team's active templates and usage
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">Error loading dashboard</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Active Templates Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Active Templates</h2>
            <Link 
              href="/templates" 
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Manage Templates
            </Link>
          </div>

          {!error && activeTemplates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No active templates</p>
              <Link 
                href="/templates" 
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Activate Your First Template
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeTemplates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 bg-green-50 border-green-200">
                  <h3 className="font-semibold text-green-800">{template.name}</h3>
                  <p className="text-green-600 text-sm mt-1">{template.description}</p>
                  <div className="flex items-center mt-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    <span className="text-green-700 text-sm">Active</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats - Only show if no error */}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Active Templates</h3>
              <p className="text-3xl font-bold text-blue-600">{activeTemplates.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Templates</h3>
              <p className="text-3xl font-bold text-gray-600">2</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Team Members</h3>
              <p className="text-3xl font-bold text-gray-600">1</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}