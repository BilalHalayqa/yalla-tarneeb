const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// Utils
const utils = require('./utils');

// Models
const Team = require('../../models/Team');

// @route POST /api/teams
// @desc Create A Team
// @access PRIVATE
router.post(
  '/',
  [
    // username must be an email
    check('name', 'Name is required').not().isEmpty(),
    // Season
    check('season', 'Season is required').not().isEmpty(),
    // Player 1
    check('player1', 'Player 1 is required').not().isEmpty(),
    // Player 2
    check('player2', 'Player 2 is required').not().isEmpty(),
  ],
  auth,
  (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, season, player1, player2 } = req.body;

    // Validated Ids
    if (
      !mongoose.Types.ObjectId.isValid(season) ||
      !mongoose.Types.ObjectId.isValid(player1) ||
      !mongoose.Types.ObjectId.isValid(player2)
    )
      return res.status(404).json({ msg: 'Invalid requested ID' });
    else if (player1 === player2)
      return res.status(404).json({ msg: 'One player cannot make a team' });

    // Check if season exists
    utils.seasonExists(season).then((season) => {
      if (!season)
        return res.status(404).json({ msg: 'season does not exist' });
      else {
        // Check if player1 exists
        utils.playerExists(player1).then((player1) => {
          if (!player1)
            return res.status(404).json({ msg: 'player1 does not exist' });
          else {
            // Check if player2 exists
            utils.playerExists(player2).then((player2) => {
              if (!player2)
                return res.status(404).json({ msg: 'player2 does not exist' });
              else {
                // Check if team already exists in the same season
                Team.findOne({
                  $and: [
                    { team_season: season._id },
                    {
                      $or: [
                        { player1: player1 },
                        { player1: player2 },
                        { player2: player1 },
                        { player2: player2 },
                      ],
                    },
                  ],
                })
                  .then((team) => {
                    if (team)
                      return res.status(400).json({
                        msg:
                          'A player can be in one team only in the same season',
                      });

                    // Create the new team
                    const newTeam = new Team({
                      name: name,
                      team_season: season._id,
                      player1: player1,
                      player2: player2,
                    });
                    newTeam
                      .save()
                      .then((team) => {
                        // Team added, add its reference in season model
                        season.teams.push(mongoose.Types.ObjectId(team._id));
                        season.save(function (err, season) {
                          if (err) {
                            res.status(404).json({
                              msg: `Could not update team ref in season. ${err.message}`,
                            });
                          } else {
                            res.json(team);
                          }
                        });
                      })
                      .catch((err) =>
                        res.status(404).json({
                          msg: `Team could not be saved. ${err}`,
                        })
                      );
                  })
                  .catch((err) =>
                    res.status(404).json({
                      msg: `Team could not be saved. ${err}`,
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

// @route GET /api/teams/:season
// @desc Get All Teams
// @access PUBLIC
router.get('/:season?', (req, res) => {
  if (!req.params.season)
    Team.find()
      .populate('team_season', ['number', 'status'])
      .populate('player1', ['name', 'nickname', 'country'])
      .populate('player2', ['name', 'nickname', 'country'])
      .sort({
        created_date: -1,
      })
      .then((teams) => res.json(teams))
      .catch((err) =>
        res.status(404).json({
          msg: 'Team could not be found ' + err.message,
        })
      );
  else
    Team.find({ team_season: req.params.season })
      .sort({
        created_date: -1,
      })
      .then((teams) => res.json(teams))
      .catch((err) =>
        res.status(404).json({
          msg: 'Team could not be found ',
        })
      );
});

// @route DELETE /api/teams/:id
// @desc Delete An Team
// @access PRIVATE
router.delete('/:id', auth, (req, res) => {
  Team.findById(req.params.id)
    .then((team) => team.remove().then(() => res.json()))
    .catch((err) =>
      res.status(404).json({
        msg: 'Team could not be found',
      })
    );
});

// @route DELETE /api/teams/season/:id
// @desc Delete teams per season
// @access PRIVATE
router.delete('/season/:id', auth, async (req, res) => {
  await Team.find({ team_season: req.params.id })
    .then((teams) => {
      teams.forEach((team) => {
        team.remove().then(() => {});
      });
    })
    .catch((err) =>
      res.status(404).json({
        msg: 'Team could not be found',
      })
    );
  res.json({ success: true });
});

module.exports = router;
