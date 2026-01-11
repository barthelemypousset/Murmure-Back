var express = require('express');
var router = express.Router();

const chaptersController = require('../controllers/chapters.controller');

router.get('/', chaptersController.getAll);
router.get('/:id', chaptersController.getByIndex);

module.exports = router;
