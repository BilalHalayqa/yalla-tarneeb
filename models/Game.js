const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema

const GameSchema = new Schema({
  game_season: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'season',
    required: true,
  },
  team1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'team',
    required: true,
  },
  team2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'team',
    required: true,
  },
  score1: {
    type: Number,
    default: null,
  },
  score2: {
    type: Number,
    default: null,
  },
  // Normal game is 999. Rounds like 8, 4, 2 or 1 for the final
  round: {
    type: Number,
    default: 999,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('game', GameSchema);
