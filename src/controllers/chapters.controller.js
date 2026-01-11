// The controller act as the brain of the app, how to handle the req. It use the service to talk with the DB

const chaptersService = require('../services/chaptersService');

async function getAll(req, res) {
  try {
    const chapters = await chaptersService.getAllChapters();
    res.json({ result: true, chapters });
  } catch (err) {
    console.error(err);
    res.status(500).json({ result: false, message: 'server error' });
  }
}

async function getByIndex(req, res) {
  try {
    const chapters = await chaptersService.getChapterByIndex(req.params.id);
    if (!chapters) return res.status(404).json({ result: false, message: 'Not found' });
    res.json({ result: true, chapters });
  } catch (err) {
    console.error(err);
    res.status(400).json({ result: false, message: 'Invalid ID' });
  }
}

module.exports = { getAll, getByIndex };
