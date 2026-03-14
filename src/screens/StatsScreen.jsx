import { useSessionContext } from '../context/SessionContext';
import { useSession } from '../hooks/useSession';

const API_BASE = '';

export default function StatsScreen() {
  const { sessionId, sessionData } = useSessionContext();
  const session = useSession(sessionId);

  const isActive = session && session.active;
  const isTime = session?.packageType === 'time';

  const pct = isActive
    ? isTime
      ? Math.round((session.secondsRemaining / (session.packageValue * 60)) * 100)
      : Math.round(((session.dataMb - session.dataUsedMb) / session.dataMb) * 100)
    : 0;

  const timeLabel = isActive && isTime
    ? `${Math.floor(session.secondsRemaining / 60)}m ${session.secondsRemaining % 60}s remaining`
    : null;

  const dataLabel = isActive && !isTime
    ? `${(session.dataMb - session.dataUsedMb).toFixed(1)} / ${session.dataMb} MB`
    : null;

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-2xl font-bold text-white">Usage Stats</h1>
        <p className="text-slate-400 text-sm mt-1">Your session activity</p>
      </div>

      <div className="px-5 space-y-4 pb-8">
        {/* Active session card */}
        {isActive ? (
          <div className="rounded-3xl bg-gradient-to-br from-indigo-500/20 to-sky-500/20 border border-indigo-500/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-semibold text-sm">Active Session</span>
            </div>

            <div className="text-4xl font-bold text-white mb-1">
              {isTime ? timeLabel?.split(' ')[0] : `${(session.dataMb - session.dataUsedMb).toFixed(1)}`}
            </div>
            <div className="text-slate-400 text-sm mb-5">
              {isTime ? 'remaining' : 'MB remaining'}
            </div>

            {/* Progress bar */}
            <div className="h-2 rounded-full bg-white/10 overflow-hidden mb-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all duration-1000"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>{isTime ? `${session.packageValue} min plan` : `${session.dataMb} MB plan`}</span>
              <span>{pct}% left</span>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl bg-slate-900 border border-white/5 p-5 text-center">
            <div className="text-4xl mb-3">📡</div>
            <div className="text-white font-semibold mb-1">No active session</div>
            <div className="text-slate-500 text-sm">Go to Hotspot Finder to connect</div>
          </div>
        )}

        {/* Session details */}
        {isActive && (
          <div className="rounded-3xl bg-slate-900 border border-white/5 p-5 space-y-3">
            <h3 className="text-white font-semibold text-sm">Session Details</h3>
            <Row label="Session ID" value={`#${sessionId}`} />
            <Row label="Package" value={isTime ? `${session.packageValue} Minutes` : `${session.dataMb} MB Data`} />
            {session.startedAt && (
              <Row label="Started" value={new Date(session.startedAt).toLocaleTimeString()} />
            )}
            {isTime && session.expiresAt && (
              <Row label="Expires" value={new Date(session.expiresAt).toLocaleTimeString()} />
            )}
          </div>
        )}

        {/* Stats summary */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon="⚡" label="Sessions" value={sessionId ? '1' : '0'} sub="this session" />
          <StatCard icon="📶" label="Status" value={isActive ? 'Online' : 'Offline'} sub={isActive ? 'connected' : 'not connected'} accent={isActive} />
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-white text-sm font-medium">{value}</span>
    </div>
  );
}

function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div className={`rounded-2xl p-4 border ${accent ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-slate-900 border-white/5'}`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className={`text-xl font-bold ${accent ? 'text-emerald-400' : 'text-white'}`}>{value}</div>
      <div className="text-slate-500 text-xs mt-0.5">{sub}</div>
    </div>
  );
}
