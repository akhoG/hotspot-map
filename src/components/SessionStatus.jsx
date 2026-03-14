import { useSessionContext } from '../context/SessionContext';
import { useSession } from '../hooks/useSession';

export default function SessionStatus() {
  const { sessionId } = useSessionContext();
  const session = useSession(sessionId);

  if (!session || !session.active) return null;

  const isTime = session.packageType === 'time';
  const pct = isTime
    ? Math.round((session.secondsRemaining / (session.packageValue * 60)) * 100)
    : Math.round(((session.dataMb - session.dataUsedMb) / session.dataMb) * 100);

  const label = isTime
    ? `${Math.floor(session.secondsRemaining / 60)}m ${session.secondsRemaining % 60}s`
    : `${(session.dataMb - session.dataUsedMb).toFixed(1)} MB left`;

  return (
    <div className="px-4 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          <span className="text-emerald-400 text-xs font-semibold">Connected</span>
        </div>
        <span className="text-white text-xs font-bold">{label}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
