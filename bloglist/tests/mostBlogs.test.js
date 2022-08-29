const listHelper = require('../utils/list_helper');

describe('most blogs', () => {
  test('should be Davidko w/ 2', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Davidko', likes: 10 },
      { title: 'Blog 2', author: 'Oliko', likes: 20 },
      { title: 'Blog 3', author: 'Davidko', likes: 15 },
    ];

    expect(listHelper.mostBlogs(blogs)).toEqual({
      author: 'Davidko',
      blogs: 2,
    });
  });

  test('should be null when there are not blogs', () => {
    const blogs = [];

    expect(listHelper.mostBlogs(blogs)).toBe(null);
  });

  test('should be Shefa w/ 1', () => {
    const blogs = [{ title: 'My 60s', author: 'Shefa', likes: 20 }];

    expect(listHelper.mostBlogs(blogs)).toEqual({ author: 'Shefa', blogs: 1 });
  });

  test('should be Davidko w/ 3', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Davidko', likes: 10 },
      { title: 'Blog 2', author: 'Oliko', likes: 20 },
      { title: 'Blog 3', author: 'Davidko', likes: 15 },
      { title: 'Blog 3', author: 'Davidko', likes: 15 },
      { title: 'Blog 3', author: 'Shefa', likes: 15 },
      { title: 'Blog 3', author: 'Shefa', likes: 15 },
      { title: 'Blog 3', author: 'Shefa', likes: 15 },
    ];

    expect(listHelper.mostBlogs(blogs)).toEqual({
      author: 'Davidko',
      blogs: 3,
    });
  });
});
