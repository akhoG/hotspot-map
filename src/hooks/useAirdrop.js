import { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { AIRDROP_AMOUNT } from '../config/solana';

export function useAirdrop() {
  const { connection } = useConnection();
  const { publicKey }  = useWallet();
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [error, setError] = useState(null);

  async function requestAirdrop() {
    if (!publicKey || state !== 'idle') return;
    setState('loading');
    setError(null);
    try {
      const sig = await connection.requestAirdrop(publicKey, AIRDROP_AMOUNT);
      await connection.confirmTransaction(sig, 'confirmed');
      setState('done');
    } catch (err) {
      console.error('Airdrop failed:', err);
      setError(err.message);
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  }

  return { state, error, requestAirdrop };
}
