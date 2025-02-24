const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema

const TeamSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  team_season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'season',
    required: true,
  },
  player1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'player',
    required: true,
  },
  player2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'player',
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('team', TeamSchema);
