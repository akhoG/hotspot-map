import { createContext, useContext, useState, useEffect, useRef } from 'react';

const SessionContext = createContext(null);

// Points: 10 pts/min for time packages, 2 pts/MB for data packages
function calcPoints(session) {
  if (!session) return 0;
  if (session.packageType === 'time') {
    const used = session.packageValue - Math.floor((session.secondsRemaining ?? 0) / 60);
    return Math.max(0, used) * 10;
  }
  if (session.packageType === 'data') {
    return Math.floor((session.dataUsedMb ?? 0) * 2);
  }
  return 0;
}

export function SessionProvider({ children }) {
  const [sessionId, setSessionId] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('hsn_points');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [redeemedIds, setRedeemedIds] = useState(() => {
    const saved = localStorage.getItem('hsn_redeemed');
    return saved ? JSON.parse(saved) : [];
  });
  const lastPointsRef = useRef(0);

  // Persist points
  useEffect(() => {
    localStorage.setItem('hsn_points', String(points));
  }, [points]);

  useEffect(() => {
    localStorage.setItem('hsn_redeemed', JSON.stringify(redeemedIds));
  }, [redeemedIds]);

  function startSession(id, data) {
    setSessionId(id);
    setSessionData(data);
    lastPointsRef.current = 0;
  }

  function clearSession() {
    setSessionId(null);
    setSessionData(null);
  }

  // Called by useSession polling to award points incrementally
  function syncPoints(session) {
    if (!session || !session.active) return;
    const earned = calcPoints(session);
    const delta = earned - lastPointsRef.current;
    if (delta > 0) {
      lastPointsRef.current = earned;
      setPoints(p => p + delta);
    }
  }

  function redeemReward(reward) {
    if (points < reward.cost) return false;
    setPoints(p => p - reward.cost);
    setRedeemedIds(r => [...r, `${reward.id}_${Date.now()}`]);
    return true;
  }

  return (
    <SessionContext.Provider value={{
      sessionId, sessionData, startSession, clearSession,
      points, syncPoints, redeemReward, redeemedIds,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  return useContext(SessionContext);
}
