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

module.exports = {
  dummy, totalLikes
};
