// Models
const Season = require('../../models/Season');
const Player = require('../../models/Player');
const Team = require('../../models/Team');

// Check if season exists
async function seasonExists(id) {
  res = await Season.findById(id)
    .then((season) => {
      return season;
    })
    .catch((err) => {
      return null;
    });
  return res;
}

// Check if player exists
async function playerExists(id) {
  res = await Player.findById(id)
    .then((player) => {
      return player;
    })
    .catch((err) => {
      return null;
    });
  return res;
}

// Check if team exists
async function teamExists(id) {
  res = await Team.findById(id)
    .then((team) => {
      return team;
    })
    .catch((err) => {
      return null;
    });
  return res;
}

module.exports = {
  seasonExists: seasonExists,
  playerExists: playerExists,
  teamExists: teamExists,
};
