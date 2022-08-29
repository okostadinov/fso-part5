const Blog = require('../models/blog');
const Author = require('../models/author');

const initialBlogs = [
  {
    title: 'My 10s',
    url: 'abc',
    likes: 50,
    author: null,
  },
  {
    title: 'My 20s',
    url: 'abc',
    likes: 500,
    author: null,
  },
  {
    title: 'My 60s',
    url: 'abc',
    likes: 5000,
    author: null,
  },
];

const initialAuthors = [
  {
    username: 'okostadinov',
    name: 'Oleg Kostadinov',
    password: 'admin',
    blogs: [],
  },
  {
    username: 'dkostadinov',
    name: 'David Kostadinov',
    password: 'qwerty123',
    blogs: [],
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const authorsInDb = async () => {
  const authors = await Author.find({});
  return authors.map((user) => user.toJSON());
};

module.exports = { initialBlogs, initialAuthors, blogsInDb, authorsInDb };
