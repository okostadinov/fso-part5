const testingRouter = require('express').Router();
const Blog = require('../models/blog');
const Author = require('../models/author');

testingRouter.post('/reset', async (req, res) => {
  await Blog.deleteMany({});
  await Author.deleteMany({});

  res.status(204).end();
});

module.exports = testingRouter;
