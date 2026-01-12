require('dotenv').config();
require('../src/models/connection');

const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

test("GET /chapters should return all chapters", async () => {
  const res = await request(app).get("/chapters");

  expect(res.status).toBe(200);
  expect(res.body.result).toBe(true);

  expect(res.body.chapters.length).toBeGreaterThan(1);
  expect(res.body.chapters[1].index).toBe(2);
});

test("GET /chapters/:id should return a single chapter", async () => {
  const res = await request(app).get(`/chapters/2`);

  expect(res.status).toBe(200);
  expect(res.body.result).toBe(true);

  expect(res.body.chapters.title).toBe("Chapitre 2: Le lâcher-prise");
});

test("GET /chapters/:id should return 404 if not found", async () => {
  const res = await request(app).get(`/chapters/404`);

  expect(res.status).toBe(404);
  expect(res.body.result).toBe(false);
});

test("GET /chapters/:id should return 400 for invalid ID", async () => {
  const res = await request(app).get("/chapters/invalidID");

  expect(res.status).toBe(400);
  expect(res.body.result).toBe(false);
});

afterAll(async () => {
  await mongoose.connection.close();
});
