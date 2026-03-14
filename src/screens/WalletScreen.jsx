import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function WalletScreen() {
  const { publicKey, disconnect, connected } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!publicKey) { setBalance(null); return; }
    setLoading(true);
    connection.getBalance(publicKey)
      .then(b => setBalance(b / LAMPORTS_PER_SOL))
      .catch(() => setBalance(null))
      .finally(() => setLoading(false));
  }, [publicKey, connection]);

  const short = publicKey
    ? `${publicKey.toString().slice(0, 6)}...${publicKey.toString().slice(-4)}`
    : null;

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto">
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your Solana wallet</p>
      </div>

      <div className="px-5 space-y-4 pb-8">
        {connected && publicKey ? (
          <>
            {/* Balance card */}
            <div className="rounded-3xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 p-6 text-center">
              <div className="text-slate-400 text-sm mb-2">Available Balance</div>
              <div className="text-5xl font-bold text-white mb-1">
                {loading ? '—' : balance !== null ? balance.toFixed(4) : '—'}
              </div>
              <div className="text-violet-400 font-semibold">SOL</div>
              <div className="mt-4 text-xs text-slate-500">Solana Devnet</div>
            </div>

            {/* Wallet info */}
            <div className="rounded-3xl bg-slate-900 border border-white/5 p-5 space-y-3">
              <h3 className="text-white font-semibold text-sm">Wallet Info</h3>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Address</span>
                <span className="text-white text-sm font-mono">{short}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Network</span>
                <span className="text-sky-400 text-sm font-medium">Devnet</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Status</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-sm font-medium">Connected</span>
                </div>
              </div>
            </div>

            {/* Full address */}
            <div className="rounded-3xl bg-slate-900 border border-white/5 p-5">
              <div className="text-slate-400 text-xs mb-2">Full Public Key</div>
              <div className="text-white text-xs font-mono break-all leading-relaxed">
                {publicKey.toString()}
              </div>
            </div>

            {/* Disconnect */}
            <button
              onClick={disconnect}
              className="w-full py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold text-sm hover:bg-red-500/20 transition-colors"
            >
              Disconnect Wallet
            </button>
          </>
        ) : (
          /* Not connected */
          <div className="rounded-3xl bg-slate-900 border border-white/5 p-8 text-center">
            <div className="text-5xl mb-4">👻</div>
            <div className="text-white font-bold text-lg mb-2">No Wallet Connected</div>
            <div className="text-slate-400 text-sm mb-6">Connect Phantom or Solflare to get started</div>
            <div className="flex justify-center">
              <WalletMultiButton style={{
                background: 'linear-gradient(135deg,#6366f1,#0ea5e9)',
                borderRadius: '16px',
                fontWeight: '700',
                fontSize: '14px',
                height: '48px',
                border: 'none',
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
