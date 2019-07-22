const { getRandomQuote } = require('../services/ronSwansonApi');

module.exports = (req, res, next) => {
  getRandomQuote()
    .then(quote => {
      req.quote = quote[0];
      next();
    });
};
