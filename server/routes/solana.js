const { Connection, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const router   = require('express').Router();
const db       = require('../db');
const firewall = require('../firewall');
const config   = require('../config');

const RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';

router.post('/activate', async (req, res) => {
  try {
    const connection = new Connection(RPC_URL, 'confirmed');
    const { hotspotId, packageId, txSignature, walletAddress } = req.body;

    const pkg     = config.packages.find(p => p.id === packageId);
    const hotspot = config.hotspots.find(h => h.id === hotspotId);
    if (!pkg || !hotspot)
      return res.status(400).json({ error: 'Unknown package or hotspot' });

    // Replay attack check
    const used = db.prepare('SELECT id FROM solana_payments WHERE tx_signature = ?').get(txSignature);
    if (used)
      return res.status(400).json({ error: 'Transaction already used' });

    // Fetch & verify transaction on-chain
    const tx = await connection.getTransaction(txSignature, {
      commitment: 'confirmed',
      maxSupportedTransactionVersion: 0,
    });
    if (!tx)
      return res.status(400).json({ error: 'Transaction not found on devnet' });

    // Verify recipient
    const accountKeys = tx.transaction.message.staticAccountKeys
      ?? tx.transaction.message.accountKeys;
    if (accountKeys[1].toString() !== hotspot.walletAddress)
      return res.status(400).json({ error: 'Wrong recipient wallet' });

    // Verify amount
    const paid = tx.meta.postBalances[1] - tx.meta.preBalances[1];
    if (paid < pkg.priceSol * LAMPORTS_PER_SOL)
      return res.status(400).json({ error: 'Amount too low for package' });

    // Store payment
    db.prepare(
      'INSERT INTO solana_payments(tx_signature,wallet_address,hotspot_id,package_id,amount_sol,created_at) VALUES(?,?,?,?,?,datetime("now"))'
    ).run(txSignature, walletAddress, hotspotId, packageId, paid / LAMPORTS_PER_SOL);

    // Grant access
    firewall.allowIP(req.ip || 'unknown');

    const expiresAt = pkg.type === 'time'
      ? new Date(Date.now() + pkg.value * 60 * 1000).toISOString()
      : null;

    const result = db.prepare(
      'INSERT INTO sessions(ip,package_type,package_value,started_at,expires_at,tx_signature,active) VALUES(?,?,?,datetime("now"),?,?,1)'
    ).run(req.ip || 'unknown', pkg.type, pkg.value, expiresAt, txSignature);

    res.json({
      success: true,
      sessionId: result.lastInsertRowid,
      packageType: pkg.type,
      packageValue: pkg.value,
      expiresAt,
      dataMb: pkg.type === 'data' ? pkg.value : null,
    });
  } catch (err) {
    console.error('Activate error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

module.exports = router;
