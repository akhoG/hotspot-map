// In-memory database — no native deps, works on Vercel serverless
// Data resets on cold start (fine for demo)

const now = () => new Date().toISOString().replace('T', ' ').split('.')[0];

const tables = {
  vouchers:        [],
  sessions:        [],
  solana_payments: [],
  firewall_log:    [],
};
const counters = { vouchers: 0, sessions: 0, solana_payments: 0, firewall_log: 0 };
const nextId = (t) => ++counters[t];

class Statement {
  constructor(sql) { this.sql = sql; }

  run(...args) {
    const p = args.flat();
    const sql = this.sql;

    if (/INSERT INTO solana_payments/i.test(sql)) {
      const id = nextId('solana_payments');
      tables.solana_payments.push({
        id, tx_signature: p[0], wallet_address: p[1],
        hotspot_id: p[2], package_id: p[3], amount_sol: p[4], created_at: now(),
      });
      return { lastInsertRowid: id };
    }
    if (/INSERT INTO sessions/i.test(sql)) {
      const id = nextId('sessions');
      tables.sessions.push({
        id, ip: p[0], package_type: p[1], package_value: p[2],
        started_at: now(), expires_at: p[3] || null,
        data_used_mb: 0, tx_signature: p[4], active: 1,
      });
      return { lastInsertRowid: id };
    }
    if (/INSERT INTO firewall_log/i.test(sql)) {
      tables.firewall_log.push({ id: nextId('firewall_log'), ip: p[0], action: p[1], ts: now() });
      return {};
    }
    if (/INSERT INTO vouchers/i.test(sql)) {
      tables.vouchers.push({
        id: nextId('vouchers'), code: p[0],
        package_type: p[1], package_value: p[2], used: 0,
      });
      return {};
    }
    if (/UPDATE vouchers SET used=1/i.test(sql)) {
      const v = tables.vouchers.find(x => x.code === p[1]);
      if (v) { v.used = 1; v.used_at = now(); v.used_by_ip = p[0]; }
      return {};
    }
    if (/UPDATE sessions SET active=0 WHERE id/i.test(sql)) {
      const s = tables.sessions.find(x => x.id === p[0]);
      if (s) s.active = 0;
      return {};
    }
    return {};
  }

  get(...args) {
    const p = args.flat();
    const sql = this.sql;

    if (/SELECT id FROM solana_payments WHERE tx_signature/i.test(sql)) {
      return tables.solana_payments.find(x => x.tx_signature === p[0]);
    }
    if (/SELECT \* FROM sessions WHERE id/i.test(sql)) {
      return tables.sessions.find(x => String(x.id) === String(p[0]));
    }
    if (/SELECT \* FROM vouchers WHERE code/i.test(sql)) {
      return tables.vouchers.find(x => x.code === p[0] && x.used === 0);
    }
    return undefined;
  }

  all(...args) {
    const sql = this.sql;
    if (/SELECT.*FROM sessions WHERE active=1/i.test(sql)) {
      const n = new Date();
      return tables.sessions.filter(s =>
        s.active === 1 && s.package_type === 'time' &&
        s.expires_at && new Date(s.expires_at) < n
      );
    }
    return [];
  }
}

const db = {
  exec() {},
  prepare(sql) { return new Statement(sql.trim()); },
};

module.exports = db;
