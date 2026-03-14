import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import PackageCard from './PackageCard';
import { usePayHotspot } from '../hooks/usePayHotspot';
import { useSessionContext } from '../context/SessionContext';

export default function HotspotDrawer({ hotspot, packages, onClose }) {
  const { publicKey } = useWallet();
  const { payAndActivate } = usePayHotspot();
  const { startSession } = useSessionContext();
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!hotspot) return null;

  async function handleBuy() {
    if (!publicKey) { setErrorMsg('Connect your wallet first.'); return; }
    if (!selectedPkg) { setErrorMsg('Select a package first.'); return; }
    setStatus('paying'); setErrorMsg('');
    try {
      const result = await payAndActivate(hotspot, selectedPkg);
      if (result.error) { setErrorMsg(result.error); setStatus('error'); return; }
      startSession(result.sessionId, result);
      setStatus('success');
    } catch (err) {
      setErrorMsg(err.message || 'Transaction failed');
      setStatus('error');
    }
  }

  return (
    <div className="bg-slate-900 rounded-t-3xl border-t border-white/10 shadow-2xl pb-safe pb-6">
      {/* Drag handle */}
      <div className="flex justify-center pt-3 pb-1">
        <div className="w-10 h-1 rounded-full bg-white/20" />
      </div>

      <div className="px-5 pt-2 pb-2">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-xl">📡</div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">{hotspot.name}</h2>
              <p className="text-slate-400 text-sm">{hotspot.address}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                <span className="text-emerald-400 text-xs font-medium">Online</span>
                <span className="text-slate-600 text-xs">• {packages.length} plans</span>
                {hotspot.clients != null && (
                  <span className="text-slate-600 text-xs">• {hotspot.clients} connected</span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/20 transition-colors text-lg">
            ×
          </button>
        </div>

        {/* Packages */}
        <div className="flex gap-3 mb-4">
          {packages.map(pkg => (
            <PackageCard key={pkg.id} pkg={pkg} selected={selectedPkg?.id === pkg.id} onClick={setSelectedPkg} />
          ))}
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="mb-3 px-4 py-2.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {errorMsg}
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="mb-3 px-4 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            ✓ Session activated! You're connected.
          </div>
        )}

        {/* Buy button */}
        <button
          onClick={handleBuy}
          disabled={status === 'paying' || status === 'success'}
          className="w-full py-4 rounded-2xl font-bold text-base transition-all disabled:opacity-50"
          style={{background: status === 'success' ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#6366f1,#0ea5e9)'}}
        >
          {status === 'paying' ? '⏳ Confirm in wallet...' : status === 'success' ? '✓ Connected!' : '⚡ Buy & Connect'}
        </button>

        {!publicKey && (
          <p className="text-center text-xs text-slate-500 mt-3">Connect your wallet to purchase</p>
        )}
      </div>
    </div>
  );
}
