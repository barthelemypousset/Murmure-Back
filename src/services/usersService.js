// Service handle interaction with the db

const User = require('../models/usersModel');

function createUser(userData) {
  const user = new User({
    ...userData,
    creationDate: new Date(),
  });
  return user.save();
}

function getById(id) {
  return User.findById(id);
}  

function getByUsername(username) {
  return User.findOne({ username });
}  

function getByEmail(email) {
  return User.findOne({ email });
}  

// function getByToken(token) {
//   return User.findOne({ token });  
// }

function deleteById(userId) {
  return User.deleteOne({ _id: userId });
}

function updateUsername(userId, newUsername) {
  return User.updateOne({ _id: userId }, { username: newUsername });
}

function updateProgress(userId, progressNb) {
  return User.updateOne({ _id: userId }, { progressNb });
}

module.exports = {
  getByUsername,
  getByEmail,
  //getByToken,
  getById,
  createUser,
  deleteById,
  updateUsername,
  updateProgress,
};
