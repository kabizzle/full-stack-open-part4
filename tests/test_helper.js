const Blog = require('../models/blogs');

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5
  }
]; 

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs;
}

const findLikes = (blogs, title) => {
  for (let blog of blogs) {
    if (blog.title === title) {
      return blog.likes
    }
  }
}

module.exports = {
  initialBlogs, blogsInDb, findLikes
}