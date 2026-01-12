require('dotenv').config();
require('../src/models/connection');

const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');

let jwtToken;

// Generation Token JWT
beforeAll(async () => {
  const res = await request(app).post('/users/signin').send({
    email: 'pierre@pierre.com',
    password: process.env.TEST_USER_PASS,
  });

  expect(res.body.result).toBe(true);
  jwtToken = res.body.token;
});

// Test Midlleware (JWT)
it('Missing JWT', async () => {
  const res = await request(app).put('/users/updateUsername').send({ newUsername: 'Test' });

  expect(res.statusCode).toBe(401);
  expect(res.body.error).toBe('Missing token');
});

it('Invalid JWT', async () => {
  const res = await request(app)
    .put('/users/updateUsername')
    .set('Authorization', 'Bearer invalid.token.here')
    .send({ newUsername: 'Test' });

  expect(res.statusCode).toBe(401);
  expect(res.body.error).toBe('Invalid or expired token');
});

// Test Users Route
it('Successful update', async () => {
  const res = await request(app)
    .put('/users/updateUsername')
    .set('Authorization', `Bearer ${jwtToken}`)
    .send({ newUsername: 'Polpol' });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
});

it('Missing newUsername', async () => {
  const res = await request(app).put('/users/updateUsername').set('Authorization', `Bearer ${jwtToken}`);

  expect(res.statusCode).toBe(400);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe('Missing or empty fields');
});

it('Empty fields', async () => {
  const res = await request(app).put('/users/updateUsername').set('Authorization', `Bearer ${jwtToken}`).send({
    token: '',
    newUsername: '',
  });

  expect(res.statusCode).toBe(400);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe('Missing or empty fields');
});

it('Restore username', async () => {
  const res = await request(app).put('/users/updateUsername').set('Authorization', `Bearer ${jwtToken}`).send({
    token: '8oRMCUkBxatlFAI-CILG5e8n6B74tpWq',
    newUsername: 'pierre',
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.username).toBe('pierre');
});

afterAll(async () => {
  await mongoose.connection.close();
});
