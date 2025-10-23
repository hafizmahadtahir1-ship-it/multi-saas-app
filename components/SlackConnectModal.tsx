// components/SlackConnectModal.tsx
import { useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next');

interface SlackConnectModalProps {
  teamId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SlackConnectModal({ teamId, isOpen, onClose }: SlackConnectModalProps) {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/team/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: teamId, slack_token: token }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to save token');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Connect Slack" className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Connect Slack</h2>
      {success ? (
        <p className="text-green-600 mb-4">Slack token saved successfully!</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter Slack Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          />
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {loading ? 'Saving...' : 'Save Token'}
          </button>
        </>
      )}
      <button onClick={onClose} className="mt-4 text-gray-500 hover:underline">Close</button>
    </Modal>
  );
}