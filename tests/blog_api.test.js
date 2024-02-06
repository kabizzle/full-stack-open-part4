const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blogs');
const logger = require('../utils/logger');

const api = supertest(app);

describe('Blog List Tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    let blogObject = new Blog(helper.initialBlogs[0]);
    await blogObject.save();
    
    blogObject = new Blog(helper.initialBlogs[1]);
    await blogObject.save();

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

    const blogList = await helper.blogsInDb();

    logger.test(blogList);

    expect(blogList).toHaveLength(helper.initialBlogs.length + 1);

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

    const blogList = await helper.blogsInDb();

    expect(helper.findLikes(blogList, "Unique Blog 2")).toEqual(0);
  });

  test('missing title or url returns 400', async () => {
    const blogMissingTitleURL = {
      author: 'Jane Doe',
      likes: 23
    };
    
    await api
    .post('/api/blogs')
    .send(blogMissingTitleURL)
    .expect(400);

  }, 20000);

  test('a note can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)
    
    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length - 1
    )

    const contents = blogsAtEnd.map(r => r.title)

    expect(contents).not.toContain(blogToDelete.title)
  })

  test('likes for a note can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    blogToUpdate.likes = 29;

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogList = await helper.blogsInDb();

    expect(helper.findLikes(blogList, `${blogToUpdate.title}`)).toEqual(29);
  })
});

afterAll(async () => {
  await mongoose.connection.close();
});
