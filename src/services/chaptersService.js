// Service handle interaction with the db

const Chapters = require('../models/chaptersModel');

function getAllChapters() {
  return Chapters.find().sort({ index: 1 }); // sort by index asc (1)
}

function getChapterByIndex(index) {
  return Chapters.findOne({ index });
}

module.exports = { getAllChapters, getChapterByIndex };
