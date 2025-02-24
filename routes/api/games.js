const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// Models
const Game = require('../../models/Game');
const Team = require('../../models/Team');

// Utils
const utils = require('./utils');
const Season = require('../../models/Season');

// @route     PUT api/games/:id
// @desc      Update Game Score
// @access    Private
router.put('/:id', auth, async (req, res) => {
  const { score1, score2, team1, team2 } = req.body;

  // Build game object
  const gameFields = {};
  if (score1) gameFields.score1 = score1;
  if (score2) gameFields.score2 = score2;

  try {
    // Check if the game exists
    let game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ msg: 'Game was not found' });

    // Update game
    game = await Game.findByIdAndUpdate(
      req.params.id,
      { $set: gameFields },
      { new: true }
    );

    // Update team1 score
    await Team.findByIdAndUpdate(
      team1,
      { $inc: { score: score1 } },
      { new: true }
    );

    // Update team2 score
    await Team.findByIdAndUpdate(
      team2,
      { $inc: { score: score2 } },
      { new: true }
    );

    res.json(game);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: err.message });
  }
});

// @route     PUT api/games/:id
// @desc      Update Game Score
// @access    Private
router.put('/random/:id', auth, async (req, res) => {
  try {
    // Check if the game exists
    let season = await Season.findById(req.params.id);
    if (!season) return res.status(404).json({ msg: 'Season was not found' });

    await Game.find({ game_season: req.params.id })
      .then((games) => {
        // Build game object
        //  const gameFields = {};
        //  gameFields.score1 = Math.random() * (45 - 0) + 0;
        //  gameFields.score2 = Math.random() * (45 - 0) + 0;

        games.forEach((game) => {
          game.score1 = parseInt(Math.random() * (45 - 0) + 0);
          game.score2 = parseInt(Math.random() * (45 - 0) + 0);
          game.save().then(() => {});
        });
      })
      .catch((err) =>
        res.status(404).json({
          msg: 'Game could not be found',
        })
      );
    res.json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: err.message });
  }
});

// @route POST /api/players
// @desc Create A Game
// @access PRIVATE
router.post(
  '/',
  [
    // Season
    check('season', 'Season is required').not().isEmpty(),
    // Team 1
    check('team1', 'Team 1 is required').not().isEmpty(),
    // Team 2
    check('team2', 'Team 2 is required').not().isEmpty(),
  ],
  auth,
  (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { season, team1, team2 } = req.body;

    // Validated Ids
    if (
      !mongoose.Types.ObjectId.isValid(season) ||
      !mongoose.Types.ObjectId.isValid(team1) ||
      !mongoose.Types.ObjectId.isValid(team2)
    )
      return res.status(404).json({ msg: 'Invalid requested ID' });
    else if (team1 === team2)
      return res.status(404).json({ msg: 'One team cannot make a game' });

    // Check if season exists
    utils.seasonExists(season).then((season) => {
      if (!season)
        return res.status(404).json({ msg: 'season does not exist' });
      else {
        // Check if team1 exists
        utils.teamExists(team1).then((team1) => {
          if (!team1)
            return res.status(404).json({ msg: 'team1 does not exist' });
          else {
            // Check if team2 exists
            utils.teamExists(team2).then((team2) => {
              if (!team2)
                return res.status(404).json({ msg: 'team2 does not exist' });
              else {
                // Create the new game
                const newGame = new Game({
                  game_season: season,
                  team1: team1,
                  team2: team2,
                });

                newGame
                  .save()
                  .then((game) => res.json(game))
                  .catch((err) =>
                    res.status(404).json({
                      msg: `Game could not be saved. ${err}`,
                    })
                  );
              }
            });
          }
        });
      }
    });
  }
);

// @route GET /api/games
// @desc Get All Games
// @access PUBLIC
router.get('/:season?', (req, res) => {
  const rule = req.params.season ? { game_season: req.params.season } : {};
  Game.find(rule)
    .sort({
      created_date: -1,
    })
    // .select('-teams')
    .populate([
      {
        path: 'team1',
        model: 'team',
        select: '-team_season',
        populate: {
          path: 'player1',
          model: 'player',
          select: ['name', 'nickname', 'country'],
        },
      },
    ])
    .populate([
      {
        path: 'team1',
        model: 'team',
        select: '-team_season',
        populate: {
          path: 'player2',
          model: 'player',
          select: ['name', 'nickname', 'country'],
        },
      },
    ])
    .populate([
      {
        path: 'team2',
        model: 'team',
        select: '-team_season',
        populate: {
          path: 'player1',
          model: 'player',
          select: ['name', 'nickname', 'country'],
        },
      },
    ])
    .populate([
      {
        path: 'team2',
        model: 'team',
        select: '-team_season',
        populate: {
          path: 'player2',
          model: 'player',
          select: ['name', 'nickname', 'country'],
        },
      },
    ])
    .then((games) => res.json(games))
    .catch((err) =>
      res.status(404).json({
        msg: 'Games could not be found',
      })
    );
});

// @route DELETE /api/games/:id
// @desc Delete An Game
// @access PRIVATE
router.delete('/:id', auth, (req, res) => {
  Game.findById(req.params.id)
    .then((game) =>
      game.remove().then(() =>
        res.json({
          success: true,
        })
      )
    )
    .catch((err) =>
      res.status(404).json({
        msg: 'Game could not be found',
      })
    );
});

// @route DELETE /api/games/season/:id
// @desc Delete games per season
// @access PRIVATE
router.delete('/season/:id', auth, async (req, res) => {
  await Game.find({ game_season: req.params.id })
    .then((games) => {
      games.forEach((game) => {
        game.remove().then(() => {});
      });
    })
    .catch((err) =>
      res.status(404).json({
        msg: 'Game could not be found',
      })
    );
  res.json({ success: true });
});

module.exports = router;
