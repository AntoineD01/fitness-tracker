require('dotenv').config();
const express = require('express');
const pool = require('./db');
const app = express();

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

// Get all workouts
app.get('/workouts', async (req, res) => {
  const result = await pool.query('SELECT * FROM workouts');
  res.json(result.rows);
});

// Add workout
app.post('/workouts', async (req, res) => {
  const { user_id, name, duration } = req.body;
  const result = await pool.query(
    'INSERT INTO workouts (user_id, name, duration) VALUES ($1, $2, $3) RETURNING *',
    [user_id, name, duration]
  );
  res.json(result.rows[0]);
});

// Delete workout
app.delete('/workouts/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM workouts WHERE id = $1', [id]);
  res.send('Deleted');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Workout Service running on port ${PORT}`));
