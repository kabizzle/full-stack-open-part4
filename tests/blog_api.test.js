const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const listHelper = require('../utils/list_helper');
const Blog = require('../models/blogs');
const logger = require('../utils/logger');

const api = supertest(app);

describe('Blog List Tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    for (let blog of listHelper.biggerList) {
      let blogObject = new Blog(blog);
      await blogObject.save();
    }
    logger.test('Blogs saved');
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  }, 10000);

  test('identifier saved as id', async () => {
    const blogs = await Blog.find({});
    expect(blogs[0]?.id).toBeDefined();
  });

  test('adding a new blog is possible', async () => {
    const newBlog = {
      title: 'Unique Blog 1',
      author: 'Jane Doe',
      url: 'https://www.janedoe.com',
      likes: 3
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogList = await Blog.find({});

    logger.test(blogList);

    expect(blogList).toHaveLength(listHelper.biggerList.length + 1);

    expect(blogList.map(i => i.title)).toContain('Unique Blog 1');
  });

  test('likes value defaults to 0', async () => {
    const newBlogZeroLikes = {
      title: 'Unique Blog 2',
      author: 'Jane Doe',
      url: 'https://www.janedoe.com',
    };
    
    await api
    .post('/api/blogs')
    .send(newBlogZeroLikes)
    .expect(201)
    .expect('Content-Type', /application\/json/);

    const blogList = await Blog.find({});

    expect(listHelper.findLikes(blogList, "Unique Blog 2")).toEqual(0);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
