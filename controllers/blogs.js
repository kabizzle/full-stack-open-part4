const blogsRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');
const config = require('../utils/config');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blogData = request.body;
  const decodedToken = jwt.verify(request.token, config.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({
      error: 'token invalid'
    });
  }
  const user = await User.findById(decodedToken.id);

  if (
    request.body.title === undefined ||
    request.body.title === null ||
    request.body.url === undefined ||
    request.body.url === null
  ) {
    return response.status(400).json({ error: 'missing title or url' });
  } else {
    const newBlog = {
      title: blogData.title,
      author: blogData.author,
      url: blogData.url,
      likes: blogData.likes ?? 0,
      user: user.id
    };

    const blog = new Blog(newBlog);
    const result = await blog.save();

    user.blogs = user.blogs.concat(result._id);
    await user.save();

    return response.status(201).json(result);
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  const decodedToken = jwt.verify(request.token, config.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({
      error: 'token invalid'
    });
  }
  const user = await User.findById(decodedToken.id);

  if ( blog.user.toString() === user.id){
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
  } else {
    response.status(400).json({
      error: 'User not authorized to delete this blog post.'
    })
  }
});

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true
  });
  response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;
