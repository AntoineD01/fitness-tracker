require('dotenv').config();
const express = require('express');
require('./db');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.send('OK');
});

app.get('/test-db', (req, res) => {
  res.send('MongoDB connected');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Nutrition Service running on port ${PORT}`));
