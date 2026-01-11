var express = require('express');
var router = express.Router();

const User = require('../models/users');
const { checkBody } = require('../modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

router.post('/signup', (req, res) => {
  if (!checkBody(req.body, ['username', 'email', 'password'])) {
    res.status(400).json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ username: req.body.username }).then((data) => {
    if (data === null) {
      const hash = bcrypt.hashSync(req.body.password, 10);

      const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: hash,
        token: uid2(32),
        creationDate: new Date(),
        progressNb: 0,
      });

      newUser.save().then((newDoc) => {
        res.json({
          result: true,
          token: newDoc.token,
          username: newDoc.username,
          progressNb: newDoc.progressNb,
        });
      });
    } else {
      res.status(409).json({ result: false, error: 'User already exists' });
    }
  });
});

router.post('/signin', (req, res) => {
  if (!checkBody(req.body, ['email', 'password'])) {
    res.status(400).json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ email: req.body.email }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      res.json({ result: true, token: data.token, username: data.username, progressNb: data.progressNb });
    } else {
      res.status(404).json({ result: false, error: 'User not found or wrong password' });
    }
  });
});

router.put('/updateUsername', (req, res) => {
  if (!checkBody(req.body, ['token', 'newUsername'])) {
    res.status(400).json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token }).then((data) => {
    if (data) {
      User.updateOne({ token: req.body.token }, { username: req.body.newUsername }).then(() => {
        res.json({ result: true, username: req.body.newUsername });
      });
    } else {
      res.status(404).json({ result: false, error: 'User not found' });
    }
  });
});

router.delete('/deleteUser', (req, res) => {
  if (!checkBody(req.body, ['token'])) {
    res.status(400).json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  User.findOne({ token: req.body.token }).then((data) => {
    if (data) {
      User.deleteOne({ token: req.body.token }).then(() => {
        res.json({ result: true, message: 'User deleted successfully' });
      });
    } else {
      res.status(404).json({ result: false, error: 'User not found' });
    }
  });
});

router.put('/progress', (req, res) => {
  if (!checkBody(req.body, ['progressNb', 'token'])) {
    res.status(400).json({ result: false, error: 'Missing or empty fields' });
    return;
  }

  const token = req.body.token;

  User.findOne({ token: token }).then((data) => {
    if (data) {
      if (req.body.progressNb > data.progressNb) {
        User.updateOne({ token: token }, { progressNb: req.body.progressNb }).then(() => {
          res.json({ result: true, progressNb: req.body.progressNb });
        });
      } else {
        res
          .status(409)
          .json({ result: false, error: 'ProgressNb can not be decreased', currentProgress: data.progressNb });
      }
    } else {
      res.status(400).json({ result: false, error: 'User not found' });
    }
  });
});

module.exports = router;
