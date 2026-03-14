import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';

export function usePayHotspot() {
  const { connection }              = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  async function payAndActivate(hotspot, pkg) {
    // Build SOL transfer
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey:   new PublicKey(hotspot.walletAddress),
        lamports:   Math.floor(pkg.priceSol * LAMPORTS_PER_SOL),
      })
    );

    // Send via Phantom/Solflare popup
    const signature = await sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, 'confirmed');

    // Notify backend
    const res = await fetch(`/api/solana/activate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hotspotId:     hotspot.id,
        packageId:     pkg.id,
        txSignature:   signature,
        walletAddress: publicKey.toString(),
      })
    });

    return res.json(); // { sessionId, expiresAt, dataMb }
  }

  return { payAndActivate };
}
