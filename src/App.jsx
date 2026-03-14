import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Map from './components/Map';
import HotspotDrawer from './components/HotspotDrawer';
import SessionStatus from './components/SessionStatus';
import HomeScreen from './screens/HomeScreen';
import StatsScreen from './screens/StatsScreen';
import WalletScreen from './screens/WalletScreen';
import RewardsScreen from './screens/RewardsScreen';

const API_BASE = '';

export default function App() {
  const { publicKey } = useWallet();
  const [screen, setScreen] = useState('home'); // home | map | stats | wallet
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [hotspots, setHotspots] = useState([]);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/hotspots`)
      .then(r => r.json())
      .then(data => {
        setHotspots(data);
        if (data.length > 0) setPackages(data[0].packages);
      })
      .catch(err => console.error('Failed to load hotspots:', err));
  }, []);

  function handleSelectHotspot(hotspot) {
    setSelectedHotspot(hotspot);
    const found = hotspots.find(h => h.id === hotspot.id);
    if (found) setPackages(found.packages);
  }

  return (
    <div className="flex flex-col w-full h-full bg-slate-950 overflow-hidden">

      {/* ── HOME ── */}
      {screen === 'home' && (
        <HomeScreen onNavigate={setScreen} />
      )}

      {/* ── MAP ── */}
      {screen === 'map' && (
        <div className="relative flex-1 w-full h-full">
          <div className="absolute inset-0">
            <Map selectedHotspot={selectedHotspot} onSelectHotspot={handleSelectHotspot} />
          </div>

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 z-[1000] px-4 pt-10">
            <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-xl">
              <button
                onClick={() => { setSelectedHotspot(null); setScreen('home'); }}
                className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors flex-shrink-0"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <span className="text-white font-bold text-base flex-1">Hotspot Finder</span>
            </div>
          </div>

          {/* Session status */}
          <div className="absolute top-28 left-4 right-4 z-[999]">
            <SessionStatus />
          </div>

          {/* Drawer or hint */}
          {selectedHotspot ? (
            <div className="absolute bottom-0 left-0 right-0 z-[1000]">
              <HotspotDrawer
                hotspot={selectedHotspot}
                packages={packages}
                onClose={() => setSelectedHotspot(null)}
              />
            </div>
          ) : (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[999]">
              <div className="px-5 py-2.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 shadow-xl text-sm text-slate-300 whitespace-nowrap">
                Tap a hotspot to connect
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STATS ── */}
      {screen === 'stats' && (
        <div className="flex flex-col h-full">
          <BackBar title="Usage Statistics" onBack={() => setScreen('home')} />
          <div className="flex-1 overflow-y-auto">
            <StatsScreen />
          </div>
        </div>
      )}

      {/* ── WALLET ── */}
      {screen === 'wallet' && (
        <div className="flex flex-col h-full">
          <BackBar title="Wallet" onBack={() => setScreen('home')} />
          <div className="flex-1 overflow-y-auto">
            <WalletScreen />
          </div>
        </div>
      )}

      {/* ── REWARDS ── */}
      {screen === 'rewards' && (
        <div className="flex flex-col h-full">
          <BackBar title="Rewards" onBack={() => setScreen('home')} />
          <div className="flex-1 overflow-y-auto">
            <RewardsScreen />
          </div>
        </div>
      )}

    </div>
  );
}

function BackBar({ title, onBack }) {
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-4 pt-10 pb-3 bg-slate-950 border-b border-white/5">
      <button
        onClick={onBack}
        className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <span className="text-white font-bold text-base">{title}</span>
    </div>
  );
}
