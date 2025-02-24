const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

// Player Model
const Player = require('../../models/Player');

// @route POST /api/players
// @desc Create A Player
// @access PRIVATE
router.post(
  '/',
  [
    // username must be an email
    check('name', 'Name is required').not().isEmpty(),
    // Country
    check('country', 'Country is required').not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ msg: 'Season could not be saved. ' + errors.errors[0].msg });
    }
    try {
      const { name, nickname, email, country } = req.body;

      // Check of player exists
      let playerExist = await Player.findOne({ email: email });
      if (playerExist)
        return res.status(400).json({ msg: 'Player already exists' });

      // Create the new player
      const newPlayer = new Player({
        name: name,
        nickname: nickname,
        email: email,
        country: country,
      });

      const player = await newPlayer.save();
      res.json(player);
    } catch (err) {
      console.error(err.message);
      res.status(500).send({ msg: err.message });
    }
  }
);

// @route     PUT api/players/:id
// @desc      Update player
// @access    Private
router.put('/:id', auth, async (req, res) => {
  const { name, nickname, email, country } = req.body;

  // Build player object
  const playerFields = {};
  if (name) playerFields.name = name;
  if (nickname) playerFields.nickname = nickname;
  if (email) playerFields.email = email;
  if (country) playerFields.country = country;

  try {
    // Check if the player exists
    let player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ msg: 'Player not found' });

    // Update
    player = await Player.findByIdAndUpdate(
      req.params.id,
      { $set: playerFields },
      { new: true }
    );

    res.json(player);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: err.message });
  }
});

// @route GET /api/players
// @desc Get All Players
// @access PUBLIC
router.get('/', async (req, res) => {
  try {
    let players = await Player.find();
    res.json(players);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: err.message });
  }
});

// @route DELETE /api/players/:id
// @desc Delete An Player
// @access PRIVATE
router.delete('/:id', auth, async (req, res) => {
  try {
    let player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ msg: 'Player not found' });

    await Player.findByIdAndRemove(req.params.id);
    res.json({ msg: 'Contact removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ msg: err.message });
  }
});

// @route DELETE /api/players/all/:id
// @desc Delete Teams within a season
// @access PRIVATE
// router.delete('/all', (req, res) => {
//   Player.find()
//     .then((players) => {
//       players.forEach((player) => {
//         player.remove().then(() =>
//           res.json({
//             success: true,
//           })
//         );
//       });
//     })
//     .catch((err) =>
//       res.status(404).json({
//         msg: err.message,
//       })
//     );
// });

module.exports = router;
