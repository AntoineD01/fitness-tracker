const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  user_id: Number,
  name: String,
  calories: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Meal', mealSchema);
