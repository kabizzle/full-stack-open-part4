/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;

const totalLikes = (blogs) => {
  let likes = 0;
  for (const blog of blogs) {
    likes += blog.likes;
  }

  return likes;
};

const favoriteBlog = (blogs) => {
  let currentMax = -9999;
  let blogMax = {};
  for (const blog of blogs) {
    if (blog.likes > currentMax) {
      blogMax = {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
      };
      currentMax = blog.likes;
    }
  }

  return blogMax;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
