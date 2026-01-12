const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { checkBody } = require('../modules/checkBody');
const usersService = require('../services/usersService');

async function signup(req, res) {
  if (!checkBody(req.body, ['username', 'email', 'password'])) {
    return res.status(400).json({ result: false, error: 'Missing or empty fields' });
  }

  const existingUser = await usersService.getByUsername(req.body.username);
  if (existingUser) {
    return res.status(409).json({ result: false, error: 'User already exists' });
  }

  const hash = bcrypt.hashSync(req.body.password, 10);

  const user = await usersService.createUser({
    email: req.body.email,
    username: req.body.username,
    password: hash,
    progressNb: req.body.progressNb || 0,
  });

  const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.json({
    result: true,
    token: token,
    username: user.username,
    progressNb: user.progressNb,
  });
}

async function signin(req, res) {
  if (!checkBody(req.body, ['email', 'password'])) {
    return res.status(400).json({ result: false, error: 'Missing or empty fields' });
  }

  const user = await usersService.getByEmail(req.body.email);

  if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(404).json({ result: false, error: 'User not found or wrong password' });
  }

  const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.json({
    result: true,
    token: token,
    username: user.username,
    progressNb: user.progressNb,
  });
}

async function updateUsername(req, res) {
  if (!checkBody(req.body, ['newUsername'])) {
    return res.status(400).json({ result: false, error: 'Missing or empty fields' });
  }

  const user = await usersService.getById(req.user.userId);
  if (!user) {
    return res.status(404).json({ result: false, error: 'User not found' });
  }

  await usersService.updateUsername(req.user.userId, req.body.newUsername);
  res.json({ result: true, username: req.body.newUsername });
}

async function deleteUser(req, res) {
  const user = await usersService.getById(req.user.userId);
  if (!user) {
    return res.status(404).json({ result: false, error: 'User not found' });
  }

  await usersService.deleteById(req.user.userId);
  res.json({ result: true, message: 'User deleted successfully' });
}

async function updateProgress(req, res) {
  if (!checkBody(req.body, ['progressNb'])) {
    return res.status(400).json({ result: false, error: 'Missing or empty fields' });
  }

  const user = await usersService.getById(req.user.userId);
  if (!user) {
    return res.status(400).json({ result: false, error: 'User not found' });
  }

  if (req.body.progressNb <= user.progressNb) {
    return res.status(409).json({
      result: false,
      error: 'ProgressNb can not be decreased',
      currentProgress: user.progressNb,
    });
  }

  const updated = await usersService.updateProgress(req.user.userId, req.body.progressNb);
  if (updated.modifiedCount===0) {
    return res.status(409).json({ result: false, error: 'Update failed' });
  }

  res.json({ result: true, progressNb: req.body.progressNb });
}

module.exports = {
  signup,
  signin,
  updateUsername,
  deleteUser,
  updateProgress,
};
