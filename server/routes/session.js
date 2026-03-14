const router = require('express').Router();
const db = require('../db');

router.get('/:id', (req, res) => {
  const session = db.prepare('SELECT * FROM sessions WHERE id = ?').get(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  let secondsRemaining = null;
  if (session.package_type === 'time' && session.expires_at) {
    secondsRemaining = Math.max(0,
      Math.floor((new Date(session.expires_at) - Date.now()) / 1000)
    );
  }

  res.json({
    sessionId:        session.id,
    active:           session.active === 1,
    packageType:      session.package_type,
    packageValue:     session.package_value,
    startedAt:        session.started_at,
    expiresAt:        session.expires_at,
    secondsRemaining,
    dataMb:           session.package_type === 'data' ? session.package_value : null,
    dataUsedMb:       session.package_type === 'data' ? session.data_used_mb  : null,
  });
});

module.exports = router;
