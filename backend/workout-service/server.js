require('dotenv').config();
const express = require('express');
const pool = require('./db');
const app = express();
const authenticateJWT = require('./middleware/authenticateJWT');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphqlSchema');

app.use('/graphql', authenticateJWT, (req, res) => {
  graphqlHTTP({
    schema,
    graphiql: true,
    context: { user: req.user }
  })(req, res);
});


app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

app.use('/workouts', authenticateJWT);

// Get all workouts
app.get('/workouts', async (req, res) => {
  const result = await pool.query('SELECT * FROM workouts WHERE user_id = $1', [req.user.id]);
  res.json(result.rows);
});

// Add workout
app.post('/workouts', async (req, res) => {
const { name, duration } = req.body;
const user_id = req.user.id;
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
