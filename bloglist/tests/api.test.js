const helper = require('./test_helper');
const mongoose = require('mongoose');
const Blog = require('../models/blog');
const Author = require('../models/author');
const supertest = require('supertest');
const app = require('../app');
const bcrypt = require('bcrypt');

// before running the tests clear the test db
// and fill it with the mock data
beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
  await Author.deleteMany({});
  await Author.insertMany(helper.initialAuthors);
});

const api = supertest(app);

/***** USERS API *****/
describe('creating a new author', () => {
  test('fails if no username is specified', async () => {
    const authorsAtStart = await helper.authorsInDb();

    const author = {
      username: '',
      name: 'David Kostadinov',
      password: 'testpassword',
    };

    await api
      .post('/api/authors')
      .send(author)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const authorsAtEnd = await helper.authorsInDb();
    expect(authorsAtStart).toEqual(authorsAtEnd);
  });

  test('fails if no password is specified or is too short', async () => {
    const authorsAtStart = await helper.authorsInDb();

    const author = {
      username: 'dkostadinov',
      name: 'David Kostadinov',
      password: '21',
    };

    const result = await api
      .post('/api/authors')
      .send(author)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain(
      'password is not filled or is too short (min. length is 4)'
    );

    const authorsAtEnd = await helper.authorsInDb();
    expect(authorsAtStart).toEqual(authorsAtEnd);
  });

  test('succeeds if username and password are valid', async () => {
    const authorsAtStart = await helper.authorsInDb();

    const author = {
      username: 'jkostadinova',
      name: 'Joanna Kostadinov',
      password: 'josifova',
    };

    await api
      .post('/api/authors')
      .send(author)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const authorsAtEnd = await helper.authorsInDb();
    expect(authorsAtEnd).toHaveLength(authorsAtStart.length + 1);

    const usernames = authorsAtEnd.map((author) => author.username);
    expect(usernames).toContain(author.username);
  });
});

/**** LOGIN API *****/
describe('author login', () => {
  test('works with correct author data', async () => {
    // author addition
    const authorsAtStart = await helper.authorsInDb();

    const author = {
      username: 'jkostadinova',
      name: 'Joanna Kostadinova',
      password: 'josifova',
    };

    const createAuthorResponse = await api.post('/api/authors').send(author);
    expect(createAuthorResponse.status).toBe(201);

    const authorsAtEnd = await helper.authorsInDb();
    expect(authorsAtEnd).toHaveLength(authorsAtStart.length + 1);

    // author login
    const loginResponse = await api.post('/api/login').send(author);
    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toEqual(
      expect.objectContaining({ username: author.username, name: author.name })
    );
  });
});

/**** BLOGS API *****/
describe('adding/fetching blogs', () => {
  test('get all blogs works', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('blogs have an id property', async () => {
    const blogs = await helper.blogsInDb();
    expect(blogs[0].id).toBeDefined();
  });

  test('adding a new blog to valid author works', async () => {
    // author addition
    const author = {
      username: 'jkostadinova',
      name: 'Joanna Kostadinova',
      password: 'josifova',
    };

    await api.post('/api/authors').send(author);

    // author login
    const loginResponse = await api.post('/api/login').send(author);
    const authorToken = loginResponse.body.token;

    // blog addition w/ token auth
    const blogsAtStart = await helper.blogsInDb();

    const newBlog = {
      title: 'My 30s',
      url: 'abc',
      likes: 3000,
    };

    const addBlogResponse = await api
      .post('/api/blogs')
      .set('authorization', `Bearer ${authorToken}`)
      .send(newBlog);

    expect(addBlogResponse.status).toBe(201);
    expect(addBlogResponse.body).toEqual(expect.objectContaining(newBlog));

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1);

    const blogAuthor = await Author.findOne({ username: author.username });
    expect(blogAuthor.blogs[0].toString()).toEqual(addBlogResponse.body.id);
  });

  test('adding a new blog to invalid author fails', async () => {
    // author addition
    const author = {
      username: 'jkostadinova',
      name: 'Joanna Kostadinova',
      password: 'josifova',
    };

    await api.post('/api/authors').send(author);

    // author login
    await api.post('/api/login').send(author);

    // blog addition w/ token auth
    const blogsAtStart = await helper.blogsInDb();

    const newBlog = {
      title: 'My 30s',
      url: 'abc',
      likes: 3000,
    };

    const addBlogResponse = await api
      .post('/api/blogs')
      // random invalid token
      .set('authorization', `Bearer 2131533dsfsdfdsg42535fdgdfg245dfdg24`)
      .send(newBlog);

    expect(addBlogResponse.status).toBe(401);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length);

    const blogAuthor = await Author.findOne({ username: author.username });
    expect(blogAuthor.blogs).toHaveLength(0);
  });
});

// if not set, `likes` defaults to 0 as per mongoose schema
describe('(not) required properties:', () => {
  test('if no likes are specified, default to 0 and add the blog', async () => {
    // author addition
    const author = {
      username: 'jkostadinova',
      name: 'Joanna Kostadinova',
      password: 'josifova',
    };

    await api.post('/api/authors').send(author);

    // author login
    const loginResponse = await api.post('/api/login').send(author);
    const authorToken = loginResponse.body.token;

    const newBlog = {
      title: 'My 100s',
      url: 'abc',
    };

    await api
      .post('/api/blogs')
      .set('authorization', `Bearer ${authorToken}`)
      .send(newBlog)
      .expect(201);

    const blogs = await helper.blogsInDb();
    const blog = blogs.find((blog) => blog.title === newBlog.title);
    expect(blog.likes).toBe(0);
  });

  test('if title and/or url is missing, return 400 without adding the blog', async () => {
    // author addition
    const author = {
      username: 'jkostadinova',
      name: 'Joanna Kostadinova',
      password: 'josifova',
    };

    await api.post('/api/authors').send(author);

    // author login
    const loginResponse = await api.post('/api/login').send(author);
    const authorToken = loginResponse.body.token;

    const newBlog = {
      title: 'My 70s',
    };

    await api
      .post('/api/blogs')
      .set('authorization', `Bearer ${authorToken}`)
      .send(newBlog)
      .expect(400);
  });
});

describe('deleting a blog', () => {
  test('with a valid id works', async () => {
    // author addition
    const author = {
      username: 'jkostadinova',
      name: 'Joanna Kostadinova',
      password: 'josifova',
    };

    await api.post('/api/authors').send(author);

    // author login
    const loginResponse = await api.post('/api/login').send(author);
    const authorToken = loginResponse.body.token;

    // blog addition w/ token auth
    const newBlog = {
      title: 'My 30s',
      url: 'abc',
      likes: 3000,
    };

    const newBlog2 = {
      title: 'My 40s',
      url: 'bcd',
      likes: 4000,
    };

    const addBlogResponse = await api
      .post('/api/blogs')
      .set('authorization', `Bearer ${authorToken}`)
      .send(newBlog);

    // add another blog for verification than only 1 is removed
    const secondBlogResponse = await api
      .post('/api/blogs')
      .set('authorization', `Bearer ${authorToken}`)
      .send(newBlog2);

    const blogsAfterAdd = await helper.blogsInDb();

    const blogToDelete = await Blog.findById(addBlogResponse.body.id);
    expect(blogToDelete).toEqual(expect.objectContaining(newBlog));

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('authorization', `Bearer ${authorToken}`)
      .expect(204);

    // verify blog is deleted
    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(blogsAfterAdd.length - 1);

    // verify one blog is left and it's the second one
    const blogAuthor = await Author.findOne({ username: author.username });
    expect(blogAuthor.blogs).toHaveLength(1);
    expect(blogAuthor.blogs[0].toString()).toEqual(secondBlogResponse.body.id);
  });
});

describe('updating a blog', () => {
  test('width a vaid id works', async () => {
    const blogsBefore = await helper.blogsInDb();
    const blogToUpdate = blogsBefore[0];

    const newBlog = { ...blogToUpdate, likes: 1 };
    await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog);

    const blogsAfter = await helper.blogsInDb();
    expect(blogsAfter.length).toBe(helper.initialBlogs.length);

    const likes = blogsAfter.map((blog) => blog.likes);
    expect(likes[0]).toBe(newBlog.likes);
  });
});

afterAll(() => mongoose.connection.close());
