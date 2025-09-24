const express = require('express');
const cors = require('cors');
const si = require('systeminformation');

const app = express();
app.use(cors());

app.get('/metrics', async (_req, res) => {
  try {
    const [cpuLoad, graphics] = await Promise.all([
      si.currentLoad(),
      si.graphics()
    ]);

    const cpu = Math.max(0, Math.min(100, Math.round(cpuLoad.currentload)));


    let gpu = null;
    if (graphics && Array.isArray(graphics.controllers)) {
      for (const c of graphics.controllers) {
        if (typeof c.utilizationGpu === 'number') {
          gpu = Math.max(0, Math.min(100, Math.round(c.utilizationGpu)));
          break;
        }
        if (typeof c.loadGpu === 'number') {
          gpu = Math.max(0, Math.min(100, Math.round(c.loadGpu)));
          break;
        }
      }
    }

    res.json({ cpu, gpu });
  } catch (err) {
    res.status(500).json({ error: 'metrics_unavailable', message: String(err && err.message || err) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Metrics server listening on http://localhost:${PORT}`);
});



