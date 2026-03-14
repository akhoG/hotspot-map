import { useState } from 'react';
import { useSessionContext } from '../context/SessionContext';

const REWARDS = [
  {
    id: 'museum',
    emoji: '🏛️',
    title: 'Georgian National Museum',
    subtitle: 'Free entry ticket',
    cost: 300,
    category: 'Culture',
    color: 'from-amber-500/20 to-yellow-500/20',
    border: 'border-amber-500/30',
  },
  {
    id: 'cable_car',
    emoji: '🚡',
    title: 'Tbilisi Cable Car',
    subtitle: 'One round trip ticket',
    cost: 200,
    category: 'Transport',
    color: 'from-sky-500/20 to-blue-500/20',
    border: 'border-sky-500/30',
  },
  {
    id: 'sulfur_bath',
    emoji: '♨️',
    title: 'Sulfur Bath — Abanotubani',
    subtitle: '30% discount on private room',
    cost: 250,
    category: 'Wellness',
    color: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/30',
  },
  {
    id: 'wine_tasting',
    emoji: '🍷',
    title: 'Georgian Wine Tasting',
    subtitle: '4-wine tasting at local winery',
    cost: 400,
    category: 'Food & Drink',
    color: 'from-rose-500/20 to-pink-500/20',
    border: 'border-rose-500/30',
  },
  {
    id: 'fabrika',
    emoji: '☕',
    title: 'Fabrika Cafe',
    subtitle: '20% off your order',
    cost: 100,
    category: 'Food & Drink',
    color: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
  },
  {
    id: 'walking_tour',
    emoji: '🚶',
    title: 'Old Town Walking Tour',
    subtitle: '2-hour guided tour',
    cost: 350,
    category: 'Tours',
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'border-violet-500/30',
  },
  {
    id: 'narikala',
    emoji: '🏰',
    title: 'Narikala Fortress Audio Guide',
    subtitle: 'Full audio tour access',
    cost: 150,
    category: 'Culture',
    color: 'from-stone-500/20 to-slate-500/20',
    border: 'border-stone-500/30',
  },
  {
    id: 'river_cruise',
    emoji: '⛵',
    title: 'Mtkvari River Cruise',
    subtitle: '1-hour evening cruise',
    cost: 500,
    category: 'Tours',
    color: 'from-cyan-500/20 to-sky-500/20',
    border: 'border-cyan-500/30',
  },
];

export default function RewardsScreen() {
  const { points, redeemReward, redeemedIds } = useSessionContext();
  const [toast, setToast] = useState(null);

  function handleRedeem(reward) {
    const ok = redeemReward(reward);
    if (ok) {
      setToast(`✓ ${reward.title} redeemed!`);
      setTimeout(() => setToast(null), 3000);
    } else {
      setToast(`Need ${reward.cost - points} more points`);
      setTimeout(() => setToast(null), 2500);
    }
  }

  const redeemCount = redeemedIds.length;

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">

      {/* Points hero */}
      <div className="mx-5 mt-4 mb-4 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/10 border border-indigo-500/30 p-5">
        <div className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wider">Your balance</div>
        <div className="flex items-end gap-2 mb-3">
          <span className="text-5xl font-bold text-white">{points}</span>
          <span className="text-indigo-400 font-bold text-lg mb-1">pts</span>
        </div>
        <div className="flex gap-4 text-xs">
          <div>
            <span className="text-slate-400">Earned by </span>
            <span className="text-white font-semibold">sharing hotspots</span>
          </div>
          <div>
            <span className="text-slate-400">Redeemed </span>
            <span className="text-white font-semibold">{redeemCount}×</span>
          </div>
        </div>

        {/* How to earn */}
        <div className="mt-3 pt-3 border-t border-white/10 flex gap-4 text-xs text-slate-400">
          <span>⏱ <span className="text-white">10 pts</span> / min</span>
          <span>📦 <span className="text-white">2 pts</span> / MB</span>
        </div>
      </div>

      {/* Rewards list */}
      <div className="px-5 pb-8 space-y-3">
        <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Available Rewards</div>
        {REWARDS.map(reward => {
          const canAfford = points >= reward.cost;
          return (
            <div
              key={reward.id}
              className={`rounded-2xl bg-gradient-to-r ${reward.color} border ${reward.border} p-4 flex items-center gap-3`}
            >
              <div className="text-3xl flex-shrink-0">{reward.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm leading-tight">{reward.title}</div>
                <div className="text-slate-400 text-xs mt-0.5">{reward.subtitle}</div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300">{reward.category}</span>
                  <span className={`text-xs font-bold ${canAfford ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {reward.cost} pts
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleRedeem(reward)}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  canAfford
                    ? 'bg-white text-slate-900 hover:bg-slate-100 active:scale-95'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                {canAfford ? 'Redeem' : `${reward.cost - points} more`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-800 border border-white/10 text-white text-sm font-medium shadow-2xl whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}
