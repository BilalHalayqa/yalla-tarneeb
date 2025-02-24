const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

// User Model
const User = require('../../models/User');

// @route POST /api/users/
// @desc authenticate the user (Login)
// @access Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').not().isEmpty(),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    // Check for existing user
    try {
      // Get the user by email
      let user = await User.findOne({ email: email });
      if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

      // Validation password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

      const payload = { user: { id: user.id } };

      // Generate and send current user token (ID)
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 3600000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({
            token: token,
            user: { name: user.name },
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route GET /api/users
// @desc Get user data
// @access PRIVATE
//
// The middleware passes the user for the token if there is a token, then it will be used to return the related user
//
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/* NOT USED */
// @route DELETE /api/users/:id
// @desc Delete A User
// @access PRIVATE
router.delete('/:id', auth, (req, res) => {
  User.findById(req.params.id)
    .then((user) =>
      user.remove().then(() =>
        res.json({
          success: true,
        })
      )
    )
    .catch((err) =>
      res.status(404).json({
        msg: 'User could not be found',
      })
    );
});

/* NOT USED */
// @route POST /api/users
// @desc Register New User
// @access PUBLIC
router.post(
  '/register',
  [
    // name must be set
    check('email', 'Name is required').not().isEmpty(),
    // username must be an email
    check('email', 'Email is required').isEmail(),
    // password must be at least 5 chars long
    check('password', 'Password is required').not().isEmpty(),
  ],
  (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // check for existing user
    User.findOne({ email: email }).then((user) => {
      if (user) return res.status(400).json({ msg: 'User already exists' });
      // Create the new user
      const newUser = new User({
        name: name,
        email: email,
        password: password,
      });

      // Create salt which used to create the hash. 10 is the rounds, higher is more secure, it takes more time though
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // Save the hash instead of the password
          newUser.password = hash;
          newUser.save().then((user) => {
            // Send current user token (ID)
            jwt.sign(
              { id: user.id },
              config.get('jwtSecret'),
              {
                // 60days !
                expiresIn: '60d',
              },
              (err, token) => {
                if (err) throw err;
                res.json({
                  token: token,
                  user: { name: user.name },
                });
              }
            );
          });
        });
      });
    });
  }
);
module.exports = router;
