const request = require('supertest');
const app = require('../app');

/* 
Test de la route PUT users/updateUsername avec le user pol
  username: "pol"
  token: "8oRMCUkBxatlFAI-CILG5e8n6B74tpWq"
*/

it('Missing token', async () => {
  const res = await request(app).put('/users/updateUsername').send({
    newUsername: 'NewName',
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe('Missing or empty fields');
});

it('Missing newUsername', async () => {
  const res = await request(app).put('/users/updateUsername').send({
    token: '8oRMCUkBxatlFAI-CILG5e8n6B74tpWq',
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe('Missing or empty fields');
});

it('Empty fields', async () => {
  const res = await request(app).put('/users/updateUsername').send({
    token: '',
    newUsername: '',
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe('Missing or empty fields');
});

it('Invalid token', async () => {
  const res = await request(app).put('/users/updateUsername').send({
    token: 'randomString',
    newUsername: 'NewName',
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(false);
  expect(res.body.error).toBe('User not found');
});

it('Successful update', async () => {
  const res = await request(app).put('/users/updateUsername').send({
    token: '8oRMCUkBxatlFAI-CILG5e8n6B74tpWq',
    newUsername: 'Polpol',
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.username).toBe('Polpol');
});

it('Restore username', async () => {
  const res = await request(app).put('/users/updateUsername').send({
    token: '8oRMCUkBxatlFAI-CILG5e8n6B74tpWq',
    newUsername: 'pol',
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
  expect(res.body.username).toBe('pol');
});

/*  
  RESULTAT:
  
$ npx jest tests/users.test.js
  console.log
    [dotenv@17.2.3] injecting env (1) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops

      at _log (node_modules/dotenv/lib/main.js:142:11)

PUT /users/updateUsername 200 9.898 ms - 50
PUT /users/updateUsername 200 0.692 ms - 50
PUT /users/updateUsername 200 0.488 ms - 50
  console.log
    Database connected

      at log (models/connection.js:7:23)

PUT /users/updateUsername 200 1780.307 ms - 41
PUT /users/updateUsername 200 232.072 ms - 35
PUT /users/updateUsername 200 224.003 ms - 32
 PASS  tests/users.test.js
  √ Missing token (35 ms)                                                                       
  √ Missing newUsername (20 ms)                                                                 
  √ Empty fields (4 ms)                                                                         
  √ Invalid token (1784 ms)                                                                     
  √ Successful update (235 ms)                                                                  
  √ Restore username (227 ms)                                                                   
                                                                                                
Test Suites: 1 passed, 1 total                                                                  
Tests:       6 passed, 6 total                                                                  
Snapshots:   0 total
Time:        3.085 s
Ran all test suites matching tests/users.test.js.
*/