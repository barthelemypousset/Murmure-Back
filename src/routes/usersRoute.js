const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.post('/signup', usersController.signup);
router.post('/signin', usersController.signin);
router.put('/updateUsername', usersController.updateUsername);
router.delete('/deleteUser', usersController.deleteUser);
router.put('/progress', usersController.updateProgress);

module.exports = router;
