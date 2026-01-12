// Service handle interaction with the db

const Meditations = require('../models/meditationsModel');

function findMeditation({ theme, mode, duration }) {
  return Meditations.findOne({
    theme,
    mode,
    duration,
  });
}

function createMeditation(data) {
  const meditation = new Meditations(data);
  return meditation.save();
}

function getAllMeditations() {
  return Meditations.find();
}

module.exports = {
  findMeditation,
  createMeditation,
  getAllMeditations,
};
