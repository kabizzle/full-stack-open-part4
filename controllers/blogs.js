const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blogData = request.body;

  if (((request.body.title === undefined) || (request.body.title === null)) || ((request.body.url === undefined) || (request.body.url === null))) {
    return response.status(400).json({error: "missing title or url"})
  } else {
    const newBlog = {
      title: blogData.title,
      author: blogData.author,
      url: blogData.url,
      likes: blogData.likes ?? 0
    };

    const blog = new Blog(newBlog)
    const result = await blog.save();
    return response.status(201).json(result);
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
});

module.exports = blogsRouter;
