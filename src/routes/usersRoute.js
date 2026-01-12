const express = require('express');
const router = express.Router();

const auth = require('../middleware/jwtAuth');

const usersController = require('../controllers/usersController');

router.post('/signup', usersController.signup);
router.post('/signin', usersController.signin);
router.put('/updateUsername', auth, usersController.updateUsername);
router.delete('/deleteUser', auth, usersController.deleteUser);
router.put('/progress', auth, usersController.updateProgress);

module.exports = router;
