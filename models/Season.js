const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create Schema

const SeasonSchema = new Schema({
  number: {
    type: Number,
    default: 1,
  },
  // -1 => Created
  //  0 => In Progress
  //  1 => Finished
  status: {
    type: Number,
    default: -1,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'team',
    },
  ],
  games: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'game',
    },
  ],
  games_with_teams: {
    type: Number,
    default: 1,
  },
  playoffs: {
    type: Number,
    default: 1,
  },
  // How to form the playoffs: 1- First plays last. 2- Random.
  playoffs_type: {
    type: Number,
    default: 1,
  },
  // Default is the playoffs/2. Then it will be updated in each Next click.
  remaining_games: {
    type: Number,
    default: -1,
  },
  // How many times next playoffs teams are going to play each others
  last_playoffs_times: {
    type: Number,
    default: 1,
  },
});

// Delete related teams
SeasonSchema.pre('remove', function (callback) {
  this.model('team').deleteMany({ team_season: this._id }, callback);
  this.model('game').deleteMany({ game_season: this._id }, callback);
});

module.exports = mongoose.model('season', SeasonSchema);
