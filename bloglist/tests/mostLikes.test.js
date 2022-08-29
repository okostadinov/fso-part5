const listHelper = require('../utils/list_helper');

describe('most likes', () => {
  test('should be Davidko w/ 25', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Davidko', likes: 10 },
      { title: 'Blog 2', author: 'Oliko', likes: 20 },
      { title: 'Blog 3', author: 'Davidko', likes: 15 },
    ];

    expect(listHelper.mostLikes(blogs)).toEqual({
      author: 'Davidko',
      likes: 25,
    });
  });

  test('should be null when there are not blogs', () => {
    const blogs = [];

    expect(listHelper.mostLikes(blogs)).toBe(null);
  });

  test('should be Shefa w/ 20', () => {
    const blogs = [{ title: 'My 60s', author: 'Shefa', likes: 20 }];

    expect(listHelper.mostLikes(blogs)).toEqual({ author: 'Shefa', likes: 20 });
  });

  test('should be Davidko w/ 45', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Davidko', likes: 15 },
      { title: 'Blog 2', author: 'Oliko', likes: 20 },
      { title: 'Blog 3', author: 'Davidko', likes: 15 },
      { title: 'Blog 3', author: 'Davidko', likes: 15 },
      { title: 'Blog 3', author: 'Shefa', likes: 15 },
      { title: 'Blog 3', author: 'Shefa', likes: 15 },
      { title: 'Blog 3', author: 'Shefa', likes: 15 },
    ];

    expect(listHelper.mostLikes(blogs)).toEqual({
      author: 'Davidko',
      likes: 45,
    });
  });

  test('should be Shefa w/ 46', () => {
    const blogs = [
      { title: 'Blog 1', author: 'Davidko', likes: 15 },
      { title: 'Blog 2', author: 'Oliko', likes: 20 },
      { title: 'Blog 3', author: 'Davidko', likes: 15 },
      { title: 'Blog 3', author: 'Davidko', likes: 15 },
      { title: 'Blog 3', author: 'Shefa', likes: 15 },
      { title: 'Blog 3', author: 'Shefa', likes: 15 },
      { title: 'Blog 3', author: 'Shefa', likes: 16 },
    ];

    expect(listHelper.mostLikes(blogs)).toEqual({
      author: 'Shefa',
      likes: 46,
    });
  });
});