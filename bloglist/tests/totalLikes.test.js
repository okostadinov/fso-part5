const listHelper = require('../utils/list_helper');

describe('totalLikes', () => {
  test('of 1 blog likes is the same amount', () => {
    const blogs = [
      { title: 'My 20s', author: 'Davidko', url: 'random url', likes: 100 },
    ];

    expect(listHelper.totalLikes(blogs)).toBe(100);
  });

  test('of 2 blogs likes is the sum of both', () => {
    const blogs = [
      { title: 'My 20s', author: 'Davidko', url: 'random url', likes: 100 },
      { title: 'My 30s', author: 'Oliko', url: 'random url', likes: 1 },
    ];

    expect(listHelper.totalLikes(blogs)).toBe(101);
  });

  test('of 5 blogs likes is the sum of all 5', () => {
    const blogs = [
      { title: 'My 20s', author: 'Davidko', url: 'random url', likes: 0 },
      { title: 'My 30s', author: 'Oliko', url: 'random url', likes: 1 },
      { title: 'My 30s', author: 'Oliko', url: 'random url', likes: 2 },
      { title: 'My 30s', author: 'Oliko', url: 'random url', likes: 3 },
      { title: 'My 30s', author: 'Oliko', url: 'random url', likes: 4 },
    ];

    expect(listHelper.totalLikes(blogs)).toBe(10);
  });

  test('of 0 blogs likes to be 0', () => {
    const blogs = [];

    expect(listHelper.totalLikes(blogs)).toBe(0);
  });
});
