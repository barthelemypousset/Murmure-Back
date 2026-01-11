const bcrypt = require('bcrypt');
const uid2 = require('uid2');
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
    token: uid2(32),
    progressNb: 0,
  });

  res.json({
    result: true,
    token: user.token,
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

  res.json({
    result: true,
    token: user.token,
    username: user.username,
    progressNb: user.progressNb,
  });
}

async function updateUsername(req, res) {
  if (!checkBody(req.body, ['token', 'newUsername'])) {
    return res.status(400).json({ result: false, error: 'Missing or empty fields' });
  }

  const user = await usersService.getByToken(req.body.token);
  if (!user) {
    return res.status(404).json({ result: false, error: 'User not found' });
  }

  await usersService.updateUsername(req.body.token, req.body.newUsername);
  res.json({ result: true, username: req.body.newUsername });
}

async function deleteUser(req, res) {
  if (!checkBody(req.body, ['token'])) {
    return res.status(400).json({ result: false, error: 'Missing or empty fields' });
  }

  const user = await usersService.getByToken(req.body.token);
  if (!user) {
    return res.status(404).json({ result: false, error: 'User not found' });
  }

  await usersService.deleteByToken(req.body.token);
  res.json({ result: true, message: 'User deleted successfully' });
}

async function updateProgress(req, res) {
  if (!checkBody(req.body, ['progressNb', 'token'])) {
    return res.status(400).json({ result: false, error: 'Missing or empty fields' });
  }

  const user = await usersService.getByToken(req.body.token);
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

  await usersService.updateProgress(req.body.token, req.body.progressNb);
  res.json({ result: true, progressNb: req.body.progressNb });
}

module.exports = {
  signup,
  signin,
  updateUsername,
  deleteUser,
  updateProgress,
};
