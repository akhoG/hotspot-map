const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/solana', require('../server/routes/solana'));
app.use('/api/session', require('../server/routes/session'));
app.use('/api/voucher', require('../server/routes/voucher'));
app.use('/api/airdrop', require('../server/routes/airdrop'));

app.get('/api/hotspots', (req, res) => {
  const config = require('../server/config');
  res.json(config.hotspots.map(h => ({
    id: h.id, name: h.name, lat: h.lat, lng: h.lng,
    address: h.address,
    packages: config.packages.map(p => ({ id: p.id, label: p.label, priceSol: p.priceSol }))
  })));
});

module.exports = app;
