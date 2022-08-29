const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const Author = require('../models/author');
const jwt = require('jsonwebtoken');

// fetch all blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('author', {
    username: 1,
    name: 1,
  });

  res.json(blogs);
});

// get specific
blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);

  res.json(blog);
});

// add blog
blogsRouter.post('/', async (req, res) => {
  const { title, url, likes } = req.body;
  const author = req.author;

  const blog = new Blog({
    title,
    url,
    likes,
    author: author._id,
  });

  const addedBlog = await blog.save();

  author.blogs = author.blogs.concat(blog._id);
  await author.save();

  res.status(201).json(
    await addedBlog.populate('author', {
      username: 1,
      name: 1,
    })
  );
});

// delete blog
blogsRouter.delete('/:id', async (req, res) => {
  const author = req.author;
  const blogToDelete = await Blog.findById(req.params.id);
  if (!blogToDelete) return res.status(400).json({ error: 'invalid blog id' });

  if (blogToDelete.author.toString() === author.id.toString()) {
    await Blog.findByIdAndDelete(req.params.id);

    author.blogs = author.blogs.filter(
      (blogId) => blogId.toString() !== blogToDelete.id
    );
    await author.save();

    return res.status(204).end();
  }

  res
    .status(401)
    .json({ error: 'cannot authorize this action for the current user' });
});

// update blog
blogsRouter.put('/:id', async (req, res) => {
  const { title, author, url, likes } = req.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    req.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' }
  ).populate('author', {
    username: 1,
    name: 1,
  });

  res.json(updatedBlog);
});

module.exports = blogsRouter;
