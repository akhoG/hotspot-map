const router = require('express').Router();

const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const LAMPORTS_PER_SOL = 1_000_000_000;

async function rpc(method, params) {
  const res = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message || 'RPC error');
  return json.result;
}

router.post('/', async (req, res) => {
  const { walletAddress } = req.body;
  if (!walletAddress)
    return res.status(400).json({ error: 'walletAddress required' });

  try {
    const signature = await rpc('requestAirdrop', [walletAddress, LAMPORTS_PER_SOL]);
    res.json({ success: true, signature });
  } catch (err) {
    console.error('Airdrop error:', err.message);
    res.status(429).json({ error: 'Airdrop failed — devnet rate limit. Try again later.' });
  }
});

module.exports = router;
