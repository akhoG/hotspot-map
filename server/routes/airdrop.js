const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const router = require('express').Router();

const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const connection = new Connection(RPC_URL, 'confirmed');

router.post('/', async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress) return res.status(400).json({ error: 'walletAddress required' });

  let pubkey;
  try {
    pubkey = new PublicKey(walletAddress);
  } catch {
    return res.status(400).json({ error: 'Invalid wallet address' });
  }

  try {
    const sig = await connection.requestAirdrop(pubkey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(sig, 'confirmed');
    const balance = await connection.getBalance(pubkey);
    res.json({ success: true, signature: sig, balance: balance / LAMPORTS_PER_SOL });
  } catch (err) {
    console.error('Airdrop error:', err.message);
    res.status(429).json({ error: 'Airdrop failed — devnet rate limit. Try again in 24h or use: solana airdrop 2 ' + walletAddress + ' --url devnet' });
  }
});

module.exports = router;
