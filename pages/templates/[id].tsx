// /pages/templates/[id].tsx
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function TemplateDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleActivate = async () => {
    try {
      setLoading(true);
      setMessage('Activating...');

      const res = await fetch('/api/templates/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: id }),
      });

      if (!res.ok) throw new Error('Activation failed');

      setMessage('✅ Template activated successfully!');
    } catch (err: any) {
      setMessage('❌ ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!id) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>Template Detail Page ✅</h1>
      <p>Template ID: {id}</p>

      <button
        onClick={handleActivate}
        disabled={loading}
        style={{
          backgroundColor: '#4F46E5',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Activating...' : 'Activate Template'}
      </button>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}