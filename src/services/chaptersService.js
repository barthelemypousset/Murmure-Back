// Service handle interaction with the db

const chapterModel = require('../models/chaptersModel');

function getAllChapters() {
  return chapterModel.find().sort({ index: 1 }); // sort by index asc (1)
}

function getChapterByIndex(index) {
  return chapterModel.findOne({ index });
}

module.exports = { getAllChapters, getChapterByIndex };
