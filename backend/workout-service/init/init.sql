CREATE TABLE IF NOT EXISTS workouts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  name TEXT,
  duration INTEGER
);
