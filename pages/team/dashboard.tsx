import { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';

export default function DashboardPage() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await supabase
        .from('team_templates')
        .select('id, template_id, active, created_at');

      if (error) {
        console.error('Error fetching templates:', error.message);
      } else {
        setTemplates(data || []);
      }

      setLoading(false);
    };

    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-4">Team Dashboard</h1>
        <p>Loading templates...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Team Dashboard</h1>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Active Templates</h2>

        {templates.length === 0 ? (
          <p>No active templates yet.</p>
        ) : (
          <ul className="list-disc ml-5">
            {templates.map((t) => (
              <li key={t.id} className="mb-2">
                Template ID: <b>{t.template_id}</b> — Status:{' '}
                {t.active ? '✅ Active' : '❌ Inactive'} — Created:{' '}
                {new Date(t.created_at).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}