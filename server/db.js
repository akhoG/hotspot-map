const Database = require('better-sqlite3');
const db = new Database('/tmp/hotspot.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS vouchers (
    id           INTEGER PRIMARY KEY,
    code         TEXT UNIQUE NOT NULL,
    package_type TEXT NOT NULL,
    package_value INTEGER NOT NULL,
    used         INTEGER DEFAULT 0,
    used_at      TEXT,
    used_by_ip   TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id            INTEGER PRIMARY KEY,
    ip            TEXT NOT NULL,
    package_type  TEXT NOT NULL,
    package_value INTEGER NOT NULL,
    started_at    TEXT NOT NULL,
    expires_at    TEXT,
    data_used_mb  REAL DEFAULT 0,
    tx_signature  TEXT,
    active        INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS solana_payments (
    id             INTEGER PRIMARY KEY,
    tx_signature   TEXT UNIQUE NOT NULL,
    wallet_address TEXT NOT NULL,
    hotspot_id     TEXT NOT NULL,
    package_id     TEXT NOT NULL,
    amount_sol     REAL NOT NULL,
    created_at     TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS firewall_log (
    id     INTEGER PRIMARY KEY,
    ip     TEXT NOT NULL,
    action TEXT NOT NULL,
    ts     TEXT NOT NULL
  );
`);

module.exports = db;
