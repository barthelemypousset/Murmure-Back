const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Murmure-back' });
});

router.get('/version', function (req, res, next) {
  res.json({ result: true, version: "1.0" });
});

module.exports = router;
