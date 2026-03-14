import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

export default function AirdropButton() {
  const { publicKey } = useWallet();
  const [state, setState] = useState('idle');

  async function requestAirdrop() {
    if (!publicKey || state !== 'idle') return;
    setState('loading');
    try {
      const res = await fetch(`/api/airdrop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: publicKey.toString() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Airdrop failed');
      setState('done');
    } catch (err) {
      console.error('Airdrop error:', err);
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  }

  if (!publicKey) return null;

  const labels = { idle: '🪂 SOL', loading: '...', done: '✅', error: '❌' };

  return (
    <button
      onClick={requestAirdrop}
      disabled={state !== 'idle'}
      className="px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 disabled:opacity-50 text-purple-300 font-semibold text-sm transition-colors"
    >
      {labels[state]}
    </button>
  );
}
