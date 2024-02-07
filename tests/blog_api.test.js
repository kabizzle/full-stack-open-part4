const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const blog = require("../models/blog");

const api = supertest(app);

describe('Blog List Tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    let blogObject = new Blog(helper.initialBlogs[0]);
    await blogObject.save();

    blogObject = new Blog(helper.initialBlogs[1]);
    await blogObject.save();
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

  test('likes for a note can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    blogToUpdate.likes = 29;

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(blogToUpdate)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogList = await helper.blogsInDb();

    expect(helper.findLikes(blogList, `${blogToUpdate.title}`)).toEqual(29);
  });
});

describe('Tests with authorization', () => {
  let headers;

  beforeEach(async () => {
    await Blog.deleteMany({});

    let blogObject = new Blog(helper.initialBlogs[0]);
    await blogObject.save();

    blogObject = new Blog(helper.initialBlogs[1]);
    await blogObject.save();

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    };

    const userLogin = {
      username: 'mluukkai',
      password: 'salainen'
    };

    await api
      .post('/api/users')
      .send(newUser);
    
    const result = await api
    .post('/api/login')
    .send(userLogin);

    headers = {
      'Authorization': `Bearer ${result.body.token}`
    };
  });

  test('adding a new blog is possible with auth', async () => {

    const newBlog = {
      title: 'Unique Blog 1',
      author: 'Jane Doe',
      url: 'https://www.janedoe.com',
      likes: 3
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogList = await helper.blogsInDb();

    expect(blogList).toHaveLength(helper.initialBlogs.length + 1);

    expect(blogList.map((i) => i.title)).toContain('Unique Blog 1');
  });

test('adding a new blog fails without auth', async () => {

    const newBlog = {
      title: 'Unique Blog 1',
      author: 'Jane Doe',
      url: 'https://www.janedoe.com',
      likes: 3
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    const blogList = await helper.blogsInDb();

    expect(blogList).toHaveLength(helper.initialBlogs.length);

    expect(blogList.map((i) => i.title)).not.toContain('Unique Blog 1');
  });

  test('likes value defaults to 0', async () => {
    const newBlogZeroLikes = {
      title: 'Unique Blog 2',
      author: 'Jane Doe',
      url: 'https://www.janedoe.com'
    };

    await api
      .post('/api/blogs')
      .send(newBlogZeroLikes)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogList = await helper.blogsInDb();

    expect(helper.findLikes(blogList, 'Unique Blog 2')).toEqual(0);
  });

  test('missing title or url returns 400', async () => {
    const blogMissingTitleURL = {
      author: 'Jane Doe',
      likes: 23
    };

    await api
      .post('/api/blogs')
      .send(blogMissingTitleURL)
      .set(headers)
      .expect(400);
  }, 20000);

  test('a blog can be deleted with auth', async () => {
    const newBlog = {
      title: "New Blog to be Deleted",
      url: "http://google.com",
      author: "Larry Page",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtMiddle = await helper.blogsInDb();
    const blogToDelete = blogsAtMiddle.find(blog => blog.title === newBlog.title);

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set(headers)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtMiddle.length - 1);

    const contents = blogsAtEnd.map((r) => r.title);

    expect(contents).not.toContain(blogToDelete.title);
  });

  test('blog deletion fails without auth', async () => {
    const newBlog = {
      title: "New Blog to be Deleted",
      url: "http://google.com",
      author: "Larry Page",
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set(headers)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtMiddle = await helper.blogsInDb();
    const blogToDelete = blogsAtMiddle.find(blog => blog.title === newBlog.title);

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(blogsAtMiddle.length);

    const contents = blogsAtEnd.map((r) => r.title);

    expect(contents).toContain(blogToDelete.title);
  });
})

afterAll(async () => {
  await mongoose.connection.close();
});
