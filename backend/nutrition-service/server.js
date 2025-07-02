require('dotenv').config();
const express = require('express');
require('./db');
const Meal = require('./Meal');

const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

// Get all meals
app.get('/meals', async (req, res) => {
  const meals = await Meal.find();
  res.json(meals);
});

// Add meal
app.post('/meals', async (req, res) => {
  const meal = new Meal(req.body);
  await meal.save();
  res.json(meal);
});

// Delete meal
app.delete('/meals/:id', async (req, res) => {
  await Meal.findByIdAndDelete(req.params.id);
  res.send('Deleted');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Nutrition Service running on port ${PORT}`));
