const authorsRouter = require('express').Router();
const Author = require('../models/author');
const bcrypt = require('bcrypt');

// get all
authorsRouter.get('/', async (req, res) => {
  const authors = await Author.find({}).populate('blogs', {
    title: 1,
    url: 1,
    likes: 1,
  });
  res.json(authors);
});

//get specific
authorsRouter.get('/:id', async (req, res) => {
  const author = await Author.findById(req.params.id).populate('blogs', {
    title: 1,
    url: 1,
    likes: 1,
  });

  if (author) res.status(200).json(author);
  else res.status(400).json({ error: 'invalid author id' });
});

// new author
authorsRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!password || password.length < 4) {
    return res.status(400).json({
      error: 'password is not filled or is too short (min. length is 4)',
    });
  }

  const existingAuthor = await Author.findOne({ username });
  if (existingAuthor) {
    return res.status(400).json({ error: 'username must be unique' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const author = new Author({ username, name, passwordHash });

  const savedAuthor = await author.save();
  res.status(201).json(savedAuthor);
});

module.exports = authorsRouter;
