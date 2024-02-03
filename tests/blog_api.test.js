const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const TestBlog = require('../models/testBlog');
const logger = require('../utils/logger');

const api = supertest(app);

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 10000);

test('identifier saved as id', async () => {
  const blogs = await TestBlog.find({});
  expect(blogs[0]?.id).toBeDefined();
});

afterAll(async () => {
  await mongoose.connection.close();
});
