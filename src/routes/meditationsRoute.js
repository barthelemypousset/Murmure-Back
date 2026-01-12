const express = require('express');
const router = express.Router();
const meditationsController = require('../controllers/meditationsController');

router.get('/player', meditationsController.getPlayerMeditation);
router.post('/', meditationsController.createMeditation);

module.exports = router;
