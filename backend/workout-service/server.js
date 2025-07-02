require('dotenv').config();
const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());

app.get('/health', (req, res) => {
  res.send('OK');
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('DB error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Workout Service running on port ${PORT}`));
