var express = require('express');
var router = express.Router();

const Chapter = require('../models/chapters');

router.get('/', async (req, res) => {
  const chapters = await Chapter.find().sort({ index: 1 });
  res.json({ result: true, chapters });
});

router.get('/:id', async (req, res) => {
  try {
    const chapters = await Chapter.findOne({ index: req.params.id });
    if (!chapters) return res.status(404).json({ result: false, message: 'Not found' });
    res.json({ result: true, chapters });
  } catch (err) {
    res.status(400).json({ result: false, message: 'Invalid ID' });
  }
});

module.exports = router;
