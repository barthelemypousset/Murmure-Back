// Service handle interaction with the db

const User = require('../models/usersModel');

function getByUsername(username) {
  return User.findOne({ username });
}

function getByEmail(email) {
  return User.findOne({ email });
}

function getByToken(token) {
  return User.findOne({ token });
}

function createUser(userData) {
  const user = new User({
    ...userData,
    creationDate: new Date(),
  });
  return user.save();
}

function deleteByToken(token) {
  return User.deleteOne({ token });
}

function updateUsername(token, newUsername) {
  return User.updateOne({ token }, { username: newUsername });
}

function updateProgress(token, progressNb) {
  return User.updateOne({ token }, { progressNb });
}

module.exports = {
  getByUsername,
  getByEmail,
  getByToken,
  createUser,
  deleteByToken,
  updateUsername,
  updateProgress,
};
