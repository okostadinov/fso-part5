const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const Author = require('../models/author');

loginRouter.post('/', async (req, res) => {
  const { username, password } = req.body;

  const author = await Author.findOne({ username });
  const correctPassword =
    author === null
      ? false
      : await bcrypt.compare(password, author.passwordHash);

  if (!(author && correctPassword)) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  const authorForToken = {
    username: author.username,
    id: author._id,
  };

  const token = jwt.sign(authorForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  res.status(200).send({ token, username: author.username, name: author.name });
});

module.exports = loginRouter;
