const db = require('../db');

module.exports = {
  allowIP(ip) {
    console.log(`[MOCK FIREWALL] ALLOW ${ip}`);
    db.prepare(`INSERT INTO firewall_log(ip,action,ts) VALUES(?,?,datetime('now'))`).run(ip,'ALLOW');
  },
  denyIP(ip) {
    console.log(`[MOCK FIREWALL] DENY ${ip}`);
    db.prepare(`INSERT INTO firewall_log(ip,action,ts) VALUES(?,?,datetime('now'))`).run(ip,'DENY');
  }
};
