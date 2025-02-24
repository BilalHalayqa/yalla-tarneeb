const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema

const PlayerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  nickname: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  country: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('player', PlayerSchema);
