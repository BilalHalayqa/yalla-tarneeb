// Added by BILAL HALAYQA
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const mongoose = require('mongoose');

const Game = require('./models/Game');
const Season = require('./models/Season');

// Express
const app = express();

// Connect to DB
connectDB();

// Middlewares
app.use(express.json({ extended: false })); // Parse JSON body

app.use('/api/seasons', require('./routes/api/seasons')); // seasons routes
app.use('/api/users', require('./routes/api/users')); // users routes
app.use('/api/players', require('./routes/api/players')); // players routes
app.use('/api/teams', require('./routes/api/teams')); // teams routes
app.use('/api/games', require('./routes/api/games')); // games routes

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static('client/build'));
  // Any request not for the routs defined above goes to this folder
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

//
//
//
// TESTS
//
//
//
Season.aggregate([
  { $match: { _id: mongoose.Types.ObjectId('5ee6a80759caad4898edd871') } },
  {
    $unwind: { path: '$games' },
  },
  {
    $lookup: {
      from: 'games',
      localField: 'games',
      foreignField: '_id',
      as: 'resultingArray',
    },
  },
]).exec(function (err, games) {
  // console.log(games);
  // Don't forget your error handling
  // The callback with your transactions
  // Assuming you are having a Tag model
  // Tag.populate(transactions, { path: '_id' }, function (
  //   err,
  //   populatedTransactions
  // ) {
  //   // Your populated translactions are inside populatedTransactions
  // });
});
