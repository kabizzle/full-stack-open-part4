const listHelper = require('../utils/list_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listHelper.emptyList);
    expect(result).toBe(0);
  });

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listHelper.listWithOneBlog);
    expect(result).toBe(5);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listHelper.biggerList);
    expect(result).toBe(36);
  });
});

describe('favorite blog', () => {
  test('returns empty object for empty list', () => {
    const result = listHelper.favoriteBlog(listHelper.emptyList);
    expect(result).toEqual({});
  });

  test('blog with most likes', () => {
    const result = listHelper.favoriteBlog(listHelper.biggerList);
    expect(result).toEqual({
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    });
  });

  test('blogs with same likes, returns one', () => {
    const result = listHelper.favoriteBlog(listHelper.equalLikes);
    expect(result).toEqual({
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 14
    });
  });
});
