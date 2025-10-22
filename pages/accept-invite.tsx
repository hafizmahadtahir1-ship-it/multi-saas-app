import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function InvitePage() {
  const router = useRouter();
  const { token } = router.query;

  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  // ✅ Invite verify function
  const verifyInvite = async (token: string) => {
    try {
      const res = await fetch('/api/invite/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const json = await res.json();

      if (json.found) {
        console.log('✅ Invite Found:', json.invite);
        setValid(true);
      } else {
        console.log('❌ Invite Not Found');
        setValid(false);
      }
    } catch (err) {
      console.error('❌ Error verifying invite:', err);
      setValid(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Page load hone par token verify karo
  useEffect(() => {
    if (token && typeof token === 'string') {
      console.log('Token mil gaya ✅', token);
      verifyInvite(token);
    }
  }, [token]);

  // ✅ Join Team button ka handler
  const handleJoinTeam = async () => {
    if (!token || typeof token !== 'string') return;
    setJoining(true);

    try {
      const res = await fetch('/api/team/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const json = await res.json();

      if (json.success) {
        alert('🎉 You have successfully joined the team!');
        console.log('Team member added:', json.member);
        // 👇 optional redirect after join
        // router.push('/team/dashboard');
      } else {
        alert('❌ Failed to join team: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('❌ Error joining team:', err);
      alert('❌ Something went wrong');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Accept Invite Page</h1>
      <p>
        Token: <strong>{token ? token : 'Loading...'}</strong>
      </p>

      {loading && <p>⏳ Verifying invite...</p>}

      {!loading && valid && (
        <>
          <p style={{ color: 'green' }}>✅ Invite Found</p>
          <button
            onClick={handleJoinTeam}
            disabled={joining}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: joining ? 'gray' : 'black',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: joining ? 'not-allowed' : 'pointer',
            }}
          >
            {joining ? 'Joining...' : '✅ Join Team'}
          </button>
        </>
      )}

      {!loading && !valid && (
        <p style={{ color: 'red' }}>❌ Invite Not Found or Invalid</p>
      )}
    </div>
  );
}