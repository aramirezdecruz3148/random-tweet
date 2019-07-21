const { Router } = require('express');
const Tweet = require('../models/Tweet');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      handle,
      text 
    } = req.body;

    Tweet
      .create({ handle, text })
      .then(tweet => res.send(tweet))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Tweet 
      .find()
      .select({ __v: false })
      .then(tweets => res.send(tweets))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Tweet
      .findById(req.params.id)
      .select({ __v: false })
      .then(tweet => res.send(tweet))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    const {
      text
    } = req.body;

    Tweet 
      .findByIdAndUpdate(req.params.id, { text }, { new: true })
      .select({ __v: false })
      .then(updatedTweet => res.send(updatedTweet))
      .catch(next);
  });
