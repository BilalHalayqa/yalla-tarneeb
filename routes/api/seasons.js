const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');

// Utils
const utils = require('./utils');

// Season Model
const Season = require('../../models/Season');
const Game = require('../../models/Game');
const Team = require('../../models/Team');

// @route POST /api/seasons
// @desc Create A Season
// @access PRIVATE
router.post('/', auth, (req, res) => {
  Season.findOne({}, {}, { sort: { number: -1 } }, async function (
    err,
    lastSeason
  ) {
    const currentLast = lastSeason ? lastSeason.number : 0;

    // Create the new player
    const newSeason = new Season({
      number: currentLast + 1,
    });

    await newSeason
      .save()
      .then((season) => res.json(season))
      .catch((err) =>
        res.status(404).json({
          msg: 'Season could not be saved. ' + err.message,
        })
      );
  }).catch((err) =>
    res.status(404).json({
      msg: 'Could not get last season. ' + err.message,
    })
  );
});

// @route GET /api/seasons
// @desc Get All Seasons
// @access PUBLIC
router.get('/', async (req, res) => {
  Season.find()
    // Teams - PLayer1
    .populate([
      {
        path: 'teams',
        model: 'team',
        select: '-team_season',
        options: { sort: { score: -1 } },
        populate: {
          path: 'player1',
          model: 'player',
          select: ['name', 'nickname', 'country'],
        },
      },
    ])
    // Teams - Player2
    .populate([
      {
        path: 'teams',
        model: 'team',
        select: '-team_season',
        options: { sort: { score: -1 } },
        populate: {
          path: 'player2',
          model: 'player',
          select: ['name', 'nickname', 'country'],
        },
      },
    ])
    // Games - Team 1 Player 1
    .populate([
      {
        path: 'games',
        model: 'game',
        select: '-game_season',
        options: { sort: { round: 1, score1: 1 } },
        populate: {
          path: 'team1',
          model: 'team',
          select: ['name', 'player1', 'player2'],
          populate: {
            path: 'player1',
            model: 'player',
            select: ['name'],
          },
        },
      },
    ])
    // Games - Team 1 Player 2
    .populate([
      {
        path: 'games',
        model: 'game',
        select: '-game_season',
        options: { sort: { round: 1, score1: 1 } },
        populate: {
          path: 'team1',
          model: 'team',
          select: ['name', 'player1', 'player2'],
          populate: {
            path: 'player2',
            model: 'player',
            select: ['name'],
          },
        },
      },
    ])
    // Games - Team 2 Player 1
    .populate([
      {
        path: 'games',
        model: 'game',
        select: '-game_season',
        options: { sort: { round: 1, score1: 1 } },
        populate: {
          path: 'team2',
          model: 'team',
          select: ['name', 'player1', 'player2'],
          populate: {
            path: 'player1',
            model: 'player',
            select: ['name'],
          },
        },
      },
    ])
    // Games - Team 2 Player 2
    .populate([
      {
        path: 'games',
        model: 'game',
        select: '-game_season',
        options: { sort: { round: 1, score1: 1 } },
        populate: {
          path: 'team2',
          model: 'team',
          select: ['name', 'player1', 'player2'],
          populate: {
            path: 'player2',
            model: 'player',
            select: ['name'],
          },
        },
      },
    ])
    .sort({
      number: 1,
    })
    .then((seasons) => res.json(seasons))
    .catch((err) =>
      res.status(404).json({
        msg: 'Something went wrong. ' + err.message,
      })
    );
});

// @route GET /api/seasons
// @desc Get a season [with games]
// @access PUBLIC
router.get('/games/:id', async (req, res) => {
  // Get and return an update season record with games instead of teams
  await Season.findById(req.params.id)
    .select('-teams')
    // Team 1 Player 1
    .populate([
      {
        path: 'games',
        model: 'game',
        select: '-game_season',
        populate: {
          path: 'team1',
          model: 'team',
          select: ['name', 'player1', 'player2'],
          populate: {
            path: 'player1',
            model: 'player',
            select: ['name'],
          },
        },
      },
    ])
    // Team 1 Player 2
    .populate([
      {
        path: 'games',
        model: 'game',
        select: '-game_season',
        populate: {
          path: 'team1',
          model: 'team',
          select: ['name', 'player1', 'player2'],
          populate: {
            path: 'player2',
            model: 'player',
            select: ['name'],
          },
        },
      },
    ])
    // Team 2 Player 1
    .populate([
      {
        path: 'games',
        model: 'game',
        select: '-game_season',
        populate: {
          path: 'team2',
          model: 'team',
          select: ['name', 'player1', 'player2'],
          populate: {
            path: 'player1',
            model: 'player',
            select: ['name'],
          },
        },
      },
    ])
    // Team 2 Player 2
    .populate([
      {
        path: 'games',
        model: 'game',
        select: '-game_season',
        populate: {
          path: 'team2',
          model: 'team',
          select: ['name', 'player1', 'player2'],
          populate: {
            path: 'player2',
            model: 'player',
            select: ['name'],
          },
        },
      },
    ])
    .sort({
      number: 1,
    })
    .then((season) => res.json(season))
    .catch((err) =>
      res.status(404).json({
        msg: 'Could not get the updated season. ' + err.message,
      })
    );
});

// @route DELETE /api/seasons/:id
// @desc Delete a Season
// @access PRIVATE
router.delete('/:id', auth, (req, res) => {
  Season.findById(req.params.id)
    .then((season) => season.remove().then(() => res.json()))
    .catch((err) =>
      res.status(404).json({
        msg: 'Season could not be found.' + err.message,
      })
    );
});

// @route PUT /api/seasons/:id
// @desc Update Season
// @access PRIVATE
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      games_with_teams,
      playoffs,
      playoffs_type,
      last_playoffs_times,
    } = req.body;
    // const { status, games_with_teams, playoffs } = req.body;
    // if (games_with_teams) updatedSeason.games_with_teams = games_with_teams;
    // if (playoffs) updatedSeason.playoffs = playoffs;

    // Check if season exists
    utils.seasonExists(req.params.id).then(async (season) => {
      if (!season) {
        return res.status(404).json({ msg: 'season does not exist' });
        // Season exists, continue
      } else {
        // Updating season from created to running,
        // Generate first round games and return them instead of the teams
        const gamesIds = [];
        if (season.status === -1) {
          try {
            // If no teams, return error
            if (season.teams.length <= 0)
              return res.status(404).json({
                msg: 'Please add some teams to start the season !',
              });

            season.games_with_teams = games_with_teams;
            const generatedGames = await generateGamesArray(season);
            // Generate games
            await Game.insertMany(generatedGames)
              .then(async function (games) {
                games.forEach((game) => {
                  gamesIds.push(mongoose.Types.ObjectId(game._id));
                });
                // Update season status to running
                await Season.findByIdAndUpdate(season._id, {
                  $set: { status: 0, games_with_teams: games_with_teams },
                });
              })
              .catch(function (err) {
                return res.status(500).json({
                  msg: 'Could not generate games. ' + err.message,
                });
              });
          } catch (err) {
            return res.status(500).json({
              msg: 'Could not get the updated season. ' + err.message,
            });
          }
        }
        // Mark season as completed if remaining_games is 0
        else if (
               season.status === 0 &&
               (season.remaining_games === 0 || playoffs == 1)
             ) {
               // Check if all season scores are set
               const ready = await allSeasonScoresAreSet(season._id);
               if (!ready) {
                 res.status(400).json({
                   msg: 'Some scores are missing !',
                 });
                 return;
               }

               // Mark as completed
               await Season.findByIdAndUpdate(
                 season._id,
                 { $set: { status: 1 } },
                 { new: true }
               )
                 .select('-teams')
                 // Team 1 Player 1
                 .populate([
                   {
                     path: 'games',
                     model: 'game',
                     select: '-game_season',
                     options: {
                       sort: { round: -1 },
                     },
                     populate: {
                       path: 'team1',
                       model: 'team',
                       select: ['name', 'player1', 'player2'],
                       populate: {
                         path: 'player1',
                         model: 'player',
                         select: ['name'],
                       },
                     },
                   },
                 ])
                 // Team 1 Player 2
                 .populate([
                   {
                     path: 'games',
                     model: 'game',
                     select: '-game_season',
                     options: {
                       sort: { round: -1 },
                     },
                     populate: {
                       path: 'team1',
                       model: 'team',
                       select: ['name', 'player1', 'player2'],
                       populate: {
                         path: 'player2',
                         model: 'player',
                         select: ['name'],
                       },
                     },
                   },
                 ])
                 // Team 2 Player 1
                 .populate([
                   {
                     path: 'games',
                     model: 'game',
                     select: '-game_season',
                     options: {
                       sort: { round: -1 },
                     },
                     populate: {
                       path: 'team2',
                       model: 'team',
                       select: ['name', 'player1', 'player2'],
                       populate: {
                         path: 'player1',
                         model: 'player',
                         select: ['name'],
                       },
                     },
                   },
                 ])
                 // Team 2 Player 2
                 .populate([
                   {
                     path: 'games',
                     model: 'game',
                     select: '-game_season',
                     options: {
                       sort: { round: -1 },
                     },
                     populate: {
                       path: 'team2',
                       model: 'team',
                       select: ['name', 'player1', 'player2'],
                       populate: {
                         path: 'player2',
                         model: 'player',
                         select: ['name'],
                       },
                     },
                   },
                 ])
                 .then((season) => {
                   res.json(season);
                 })
                 .catch((err) =>
                   res.status(400).json({
                     msg: 'Could not get the updated season. ' + err.message,
                   })
                 );
             }
             // Generates next round games
             else if (season.status === 0) {
               // If playoffs > teams , return error
               if (playoffs > season.teams.length)
                 return res.status(400).json({
                   msg: 'Playoffs is larger than the number of teams !',
                 });

               // Check if all scores are set to to next
               const ready = await allSeasonScoresAreSet(season._id);
               if (!ready) {
                 res.status(400).json({
                   msg: 'Some scores are missing !',
                 });
                 return;
               }
               // Generate next bulk of games based on remaining_games
               season.playoffs = playoffs;
               season.playoffs_type = playoffs_type;
               const generatedGames = await generateGamesArray(
                 season,
                 last_playoffs_times
               );
               season.last_playoffs_times = last_playoffs_times;
               // Generate games
               await Game.insertMany(generatedGames)
                 .then(function (games) {
                   games.forEach((game) => {
                     gamesIds.push(mongoose.Types.ObjectId(game._id));
                   });
                 })
                 .catch(function (err) {
                   res.status(500).send(err);
                 });

               // Update remaining games
               if (gamesIds.length >= 1) {
                 const newRemaining = parseInt(
                   (season.remaining_games !== -1
                     ? season.remaining_games
                     : season.playoffs / 2) / 2
                 );
                 await Season.findByIdAndUpdate(
                   season._id,
                   {
                     $set: {
                       remaining_games: newRemaining,
                       last_playoffs_times: last_playoffs_times,
                     },
                   },
                   { new: true }
                 );
               }
             }

        // Save games ids in the season and return the season
        if (gamesIds.length > 0) {
          Season.findByIdAndUpdate(
            season._id,
            { $push: { games: gamesIds } },
            { new: true }
          )
            .select('-teams')
            // Team 1 Player 1
            .populate([
              {
                path: 'games',
                model: 'game',
                select: '-game_season',
                options: { sort: { round: -1 } },
                populate: {
                  path: 'team1',
                  model: 'team',
                  select: ['name', 'player1', 'player2'],
                  populate: {
                    path: 'player1',
                    model: 'player',
                    select: ['name'],
                  },
                },
              },
            ])
            // Team 1 Player 2
            .populate([
              {
                path: 'games',
                model: 'game',
                select: '-game_season',
                options: { sort: { round: -1 } },
                populate: {
                  path: 'team1',
                  model: 'team',
                  select: ['name', 'player1', 'player2'],
                  populate: {
                    path: 'player2',
                    model: 'player',
                    select: ['name'],
                  },
                },
              },
            ])
            // Team 2 Player 1
            .populate([
              {
                path: 'games',
                model: 'game',
                select: '-game_season',
                options: { sort: { round: -1 } },
                populate: {
                  path: 'team2',
                  model: 'team',
                  select: ['name', 'player1', 'player2'],
                  populate: {
                    path: 'player1',
                    model: 'player',
                    select: ['name'],
                  },
                },
              },
            ])
            // Team 2 Player 2
            .populate([
              {
                path: 'games',
                model: 'game',
                select: '-game_season',
                options: { sort: { round: -1 } },
                populate: {
                  path: 'team2',
                  model: 'team',
                  select: ['name', 'player1', 'player2'],
                  populate: {
                    path: 'player2',
                    model: 'player',
                    select: ['name'],
                  },
                },
              },
            ])
            .then((season) => {
              res.json(season);
            })
            .catch((err) =>
              res.status(400).json({
                msg: 'Could not get the updated season. ' + err.message,
              })
            );
        }
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Generates games based on remaining_games which is by default -1, to generate the first round games
async function generateGamesArray(season, last_playoffs_times = 1) {
  var games = [];
  // Generate first round of games if season status is just created
  if (season.status === -1) {
    season.teams.map(function (team, index) {
      let t = index + 1;
      for (let i = t; i < season.teams.length; i++) {
        for (let y = 0; y < season.games_with_teams; y++) {
          games.push({
            game_season: season._id,
            team1: season.teams[index],
            team2: season.teams[i],
          });
        }
      }
    });
  }
  // Generate first playoffs' round games (teams selected to play = season.playoffs)
  else if (season.remaining_games === -1) {
    const teamsToSelect = season.playoffs;
    await Team.find({ team_season: season._id })
      .sort({
        score: -1,
      })
      .limit(teamsToSelect)
      .then((teams) => {
        // Generate an array of indices based on the playoffs type
        const teamsIds = generateArrayOfTeams(teams, season.playoffs_type);
        for (let i = 0; i < teamsIds.length; i += 2) {
          for (let y = 0; y < last_playoffs_times; y++)
            games.push({
              game_season: season._id,
              team1: teamsIds[i],
              team2: teamsIds[i + 1],
              round:
                season.remaining_games !== -1
                  ? season.remaining_games
                  : season.playoffs / 2,
            });
        }
      })
      .catch((err) => console.log(err.message));
  }
  // Generate the next round games based on the remaining_games
  // Select all games with round = season.remainingGames * 2 in this season
  else {
    await Game.find({
      game_season: season._id,
      round: season.remaining_games * 2,
    })
      .then((roundGames) => {
        for (
          let i = 0;
          i < roundGames.length / (season.last_playoffs_times * 2);
          i++
        ) {
          const t1 = winnerTeam(
            roundGames.slice(
              2 * i * season.last_playoffs_times,
              (2 * i + 1) * season.last_playoffs_times
            )
          );
          const t2 = winnerTeam(
            roundGames.slice(
              (2 * i + 1) * season.last_playoffs_times,
              (2 * i + 2) * season.last_playoffs_times
            )
          );
          for (let y = 0; y < last_playoffs_times; y++) {
            games.push({
              game_season: season._id,
              team1: t1,
              team2: t2,
              round: season.remaining_games,
            });
          }
        }
      })
      .catch((err) => console.log(err.message));
  }
  return games;
}

// Generate games based on playoffs types
function generateArrayOfTeams(teams, playoffs_type) {
  var teamsIds = [];
  // First plays last
  if (playoffs_type === 1) {
    for (let i = 0; i < teams.length / 2; i++) {
      teamsIds.push(teams[i].id);
      teamsIds.push(teams[teams.length - 1 - i].id);
    }
  }
  // Random
  if (playoffs_type === 2) {
    teamsIds = shuffle(teams);
  }
  return teamsIds;
}

// Shuffle array elements (teams)
function shuffle(teams) {
  var j, x, i;
  for (i = teams.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = teams[i];
    teams[i] = teams[j];
    teams[j] = x;
  }
  var teamsIds = [];
  for (i = 0; i < teams.length; i++) teamsIds.push(teams[i]._id);
  return teamsIds;
}

// Check if all scores are set
async function allSeasonScoresAreSet(season) {
  var ready = true;

  await Season.findById(season)
    // Games
    .populate([
      {
        path: 'games',
        model: 'game',
        select: '-game_season',
      },
    ])
    .then((season) => {
      season.games.map(async function (game) {
        if (!game.score1 || !game.score2) {
          ready = false;
          return true;
        }
        return true;
      });
    })
    .catch((err) => {
      console.log(err.message);
    });

  return ready;
}

// Return the ID of the winner team
function winnerTeam(games) {
  let t1WiningTimes = 0;
  let t2WiningTimes = 0;
  games.forEach((game) => {
    if (game.score1 > game.score2) t1WiningTimes++;
    else t2WiningTimes++;
  });
  if (t1WiningTimes > t2WiningTimes) return games[0].team1._id;
  else return games[0].team2._id;
}

module.exports = router;
