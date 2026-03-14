const router = require('express').Router();
const db = require('../db');
const firewall = require('../firewall');
const config = require('../config');

router.post('/redeem', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code is required' });

  const voucher = db.prepare('SELECT * FROM vouchers WHERE code = ?').get(code.trim().toUpperCase());
  if (!voucher || voucher.used) {
    return res.status(400).json({ error: 'Invalid or already used code' });
  }

  const userIP = req.ip;
  const now = new Date().toISOString();

  // Mark voucher as used
  db.prepare(`
    UPDATE vouchers SET used = 1, used_at = ?, used_by_ip = ? WHERE id = ?
  `).run(now, userIP, voucher.id);

  // Grant firewall access
  firewall.allowIP(userIP);

  const expiresAt = voucher.package_type === 'time'
    ? new Date(Date.now() + voucher.package_value * 60 * 1000).toISOString()
    : null;

  const result = db.prepare(`
    INSERT INTO sessions(ip, package_type, package_value, started_at, expires_at, active)
    VALUES(?, ?, ?, datetime('now'), ?, 1)
  `).run(userIP, voucher.package_type, voucher.package_value, expiresAt);

  res.json({
    success: true,
    sessionId: result.lastInsertRowid,
    packageType: voucher.package_type,
    packageValue: voucher.package_value,
    expiresAt,
    dataMb: voucher.package_type === 'data' ? voucher.package_value : null,
  });
});

module.exports = router;
