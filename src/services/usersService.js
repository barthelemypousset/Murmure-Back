// Service handle interaction with the db

const Users = require('../models/usersModel');

function createUser(userData) {
  const user = new Users({
    ...userData,
    creationDate: new Date(),
  });
  return user.save();
}

function getById(id) {
  return Users.findById(id);
}

function getByUsername(username) {
  return Users.findOne({ username });
}

function getByEmail(email) {
  return Users.findOne({ email });
}

function deleteById(userId) {
  return Users.deleteOne({ _id: userId });
}

function updateUsername(userId, newUsername) {
  return Users.updateOne({ _id: userId }, { username: newUsername });
}

function updateProgress(userId, progressNb) {
  return Users.updateOne({ _id: userId }, { progressNb });
}

module.exports = {
  getByUsername,
  getByEmail,
  getById,
  createUser,
  deleteById,
  updateUsername,
  updateProgress,
};
