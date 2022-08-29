const logger = require('./logger');
const Author = require('../models/author');
const jwt = require('jsonwebtoken');

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(400).send({ error: err.message });
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).send({error: 'invalid token'})
  }
  next(err);
};

const tokenExtractor = (req, res, next) => {
  let auth = req.get('authorization');
  if (!auth) {
    return next();
  }

  auth = auth.split(' ');
  if (auth[0].toLowerCase() === 'bearer') {
    req.token = auth[1];
  }
  next();
};

const authorExtractor = async (req, res, next) => {
  if (!req.token) return next();
  
  const decodedToken = jwt.verify(req.token, process.env.SECRET);
  if (!decodedToken) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }
  const author = await Author.findById(decodedToken.id);
  req.author = author;
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  authorExtractor,
};
