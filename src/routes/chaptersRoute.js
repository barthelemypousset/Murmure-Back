const express = require('express');
const router = express.Router();

const chaptersController = require('../controllers/chaptersController');

router.get('/', chaptersController.getAll);
router.get('/:id', chaptersController.getByIndex);

module.exports = router;
