const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  username: String,
  password: String,
  token: String,
  creationDate: Date,
  progressNb: Number,
});

const User = mongoose.model('users', userSchema);

module.exports = User;