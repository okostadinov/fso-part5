const listHelper = require('../utils/list_helper');

describe('favorite blog', () => {
  test('of a list of 1 blog is the blog itself', () => {
    const blogs = [{ title: 'My 20s', author: 'Davidko', likes: 5 }];

    expect(listHelper.favoriteBlog(blogs)).toEqual({
      title: 'My 20s',
      author: 'Davidko',
      likes: 5,
    });
  });

  test('should be the last one', () => {
    const blogs = [
      { title: 'My 20s', author: 'Davidko', likes: 5 },
      { title: 'My 30s', author: 'Oliko', likes: 50 },
      { title: 'My 60s', author: 'Shefako', likes: 500 },
    ];

    expect(listHelper.favoriteBlog(blogs)).toEqual({
      title: 'My 60s',
      author: 'Shefako',
      likes: 500,
    });
  });

  test('should be the middle one', () => {
    const blogs = [
      { title: 'My 20s', author: 'Davidko', likes: 5 },
      { title: 'My 30s', author: 'Oliko', likes: 500 },
      { title: 'My 60s', author: 'Shefako', likes: 50 },
    ];

    expect(listHelper.favoriteBlog(blogs)).toEqual({
      title: 'My 30s',
      author: 'Oliko',
      likes: 500,
    });
  });

  test('of an empty list of blogs to be null', () => {
    const blogs = [];

    expect(listHelper.favoriteBlog(blogs)).toEqual(null);
  });
});
