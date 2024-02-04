const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blogData = request.body;

  const newBlog = {
    title: blogData.title,
    author: blogData.author,
    url: blogData.url,
    likes: blogData.likes ?? 0
  };

  const blog = new Blog(newBlog)
  const result = await blog.save();
  response.status(201).json(result);
});

module.exports = blogsRouter;
