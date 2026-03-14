import { useState, useEffect } from 'react';
import { useSessionContext } from '../context/SessionContext';

export function useSession(sessionId) {
  const [session, setSession] = useState(null);
  const { syncPoints } = useSessionContext();

  useEffect(() => {
    if (!sessionId) return;
    const poll = async () => {
      try {
        const res = await fetch(`/api/session/${sessionId}`);
        const data = await res.json();
        setSession(data);
        syncPoints(data);
      } catch (err) {
        console.error('Session poll error:', err);
      }
    };
    poll();
    const id = setInterval(poll, 10_000);
    return () => clearInterval(id);
  }, [sessionId]);

  return session;
}
