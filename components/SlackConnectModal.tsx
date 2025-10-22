import { useState } from 'react'

interface SlackConnectModalProps {
  teamId: string
  onClose: () => void
}

export default function SlackConnectModal({ teamId, onClose }: SlackConnectModalProps) {
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    if (!apiKey) {
      setMessage('Please enter your Slack API key')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/team/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_id: teamId,
          provider: 'slack',
          api_key: apiKey,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setMessage('✅ Slack connected successfully!')
        setTimeout(() => onClose(), 1500)
      } else {
        setMessage(`❌ Error: ${data.error || 'Something went wrong'}`)
      }
    } catch (err) {
      setMessage('❌ Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-lg font-bold mb-4">Connect Slack</h2>
        <input
          type="text"
          placeholder="Enter Slack API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="border w-full px-3 py-2 mb-3 rounded"
        />
        {message && <p className="mb-2 text-sm">{message}</p>}
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-300 px-3 py-2 rounded">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}