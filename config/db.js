const mongoose = require('mongoose');
const config = require('config');

// DB Connection
const db = config.get('mongoURI');
mongoose.set('useFindAndModify', false);

//  Connect to DB
const connectDB = () =>
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log('MongoDB is connected');
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });

module.exports = connectDB;
