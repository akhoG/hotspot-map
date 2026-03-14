import { useSessionContext } from '../context/SessionContext';
import { useSession } from '../hooks/useSession';

export default function HomeScreen({ onNavigate }) {
  const { sessionId, points } = useSessionContext();
  const session = useSession(sessionId);
  const isActive = session && session.active;

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-12 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-sky-500 flex items-center justify-center text-lg">📡</div>
          <span className="text-white font-bold text-lg tracking-tight">HotspotNet</span>
        </div>
        {/* Points badge */}
        <button
          onClick={() => onNavigate('rewards')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 active:opacity-70 transition-opacity"
        >
          <span className="text-base">🎁</span>
          <span className="text-indigo-300 font-bold text-sm">{points}</span>
          <span className="text-indigo-400 text-xs">pts</span>
        </button>
      </div>

      {/* Greeting */}
      <div className="px-5 pt-5 pb-4">
        <p className="text-slate-400 text-sm">Solana devnet</p>
        <h2 className="text-white text-2xl font-bold mt-1">
          {isActive ? '🟢 You\'re connected' : 'Find internet\nnear you'}
        </h2>
      </div>

      {/* Active session banner */}
      {isActive && (
        <div className="mx-5 mb-4">
          <div
            onClick={() => onNavigate('stats')}
            className="rounded-2xl bg-gradient-to-r from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 p-4 cursor-pointer active:opacity-80"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-sm font-semibold">Active Session</span>
              </div>
              <span className="text-slate-400 text-xs">View details →</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-500 to-sky-400" />
            </div>
          </div>
        </div>
      )}

      {/* Nav cards */}
      <div className="px-5 space-y-3 pb-8">
        <NavCard
          icon={<MapSvg />}
          title="Hotspot Finder"
          subtitle="Find & connect to nearby hotspots"
          gradient="from-sky-500/15 to-indigo-500/15"
          border="border-sky-500/20"
          onClick={() => onNavigate('map')}
        />
        <NavCard
          icon={<RewardSvg />}
          title="Rewards"
          subtitle="Redeem points for tickets & discounts"
          gradient="from-indigo-500/15 to-purple-500/15"
          border="border-indigo-500/20"
          badge={points > 0 ? `${points} pts` : null}
          onClick={() => onNavigate('rewards')}
        />
        <NavCard
          icon={<StatsSvg />}
          title="Usage Statistics"
          subtitle="Monitor your session & data usage"
          gradient="from-violet-500/15 to-purple-500/15"
          border="border-violet-500/20"
          onClick={() => onNavigate('stats')}
        />
        <NavCard
          icon={<WalletSvg />}
          title="Wallet"
          subtitle="Balance, address & transactions"
          gradient="from-amber-500/15 to-orange-500/15"
          border="border-amber-500/20"
          onClick={() => onNavigate('wallet')}
        />
      </div>

    </div>
  );
}

function NavCard({ icon, title, subtitle, gradient, border, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r ${gradient} border ${border} text-left active:opacity-70 transition-opacity`}
    >
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold text-sm">{title}</span>
          {badge && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-semibold">{badge}</span>
          )}
        </div>
        <div className="text-slate-400 text-xs mt-0.5">{subtitle}</div>
      </div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>
  );
}

function MapSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function RewardSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

function StatsSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6"  y1="20" x2="6"  y2="14" />
    </svg>
  );
}

function WalletSvg() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="3" />
      <path d="M2 10V6a2 2 0 0 1 2-2h16" />
      <circle cx="16" cy="14" r="1" fill="#fbbf24" stroke="none" />
    </svg>
  );
}
