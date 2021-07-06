const express = require('express');
const createError = require('http-errors');

const router = express.Router();

const PAGE_SIZE = 50;
const BASE_TEN = 10;

const ccyFormatter = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

/**
 * Return all movies
 * @params page - optional default 0
 */
router.get('/', (req, res, next) => {
  const page = req.query.page ? parseInt(req.query.page, BASE_TEN) : 0;

  const { movieDB } = req.app.locals;
  const dbResults = movieDB.prepare('SELECT movieId, imdbId, title, genres, releaseDate, budget FROM movies ORDER BY movieId LIMIT ? OFFSET ?').all(PAGE_SIZE, page * PAGE_SIZE);

  if (dbResults.length === 0) return next(createError(404, `No such page: ${page}`));

  const results = dbResults.map((row) => ({
    ...row,
    ...{
      genres: JSON.parse(row.genres), // TODO: investigate json1 extension: https://www.sqlite.org/json1.html
      budget: ccyFormatter(row.budget),
    } }));

  return res.json({ status: 'ok', results, page });
});

/**
 * Return all movies per year
 * @params year
 */
router.get('/year/:year', (req, res, next) => {
  if (req.params.year.length !== 4) return next(createError(400, 'Parameter \'year\' should be 4 digits'));
  const startDate = `${req.params.year}-01-01`;
  const endDate = `${req.params.year}-12-31`;

  const page = req.query.page ? parseInt(req.query.page, BASE_TEN) : 0;

  let dtOrder = 'ASC';
  if (req.query.order) {
    if (req.query.order.toUpperCase() !== 'ASC' && req.query.order.toUpperCase() !== 'DESC') {
      return next(createError(400, `Parameter 'order' should be either ASC or DESC but got: '${req.query.order}'`));
    }
    dtOrder = req.query.order.toUpperCase();
  }

  const { movieDB } = req.app.locals;
  // NB: cant use param for dtOrder as it inserts quotes
  const dbResults = movieDB.prepare(`SELECT movieId, imdbId, title, genres, releaseDate, budget FROM movies WHERE releaseDate between ? AND ? ORDER BY releaseDate ${dtOrder} LIMIT ? OFFSET ?`)
    .all(startDate, endDate, PAGE_SIZE, page * PAGE_SIZE);

  if (dbResults.length === 0) return next(createError(400, `No such page: ${page}`));

  const results = dbResults.map((row) => ({
    ...row,
    ...{
      genres: JSON.parse(row.genres), // TODO: investigate json1 extension: https://www.sqlite.org/json1.html
      budget: ccyFormatter(row.budget),
    } }));

  return res.json({ status: 'ok', results, page });
});

/**
 * Return movie details
 * @params movieId
 */
router.get('/:movieId', (req, res, next) => {
  const { movieDB, ratingsDB } = req.app.locals;
  const movieResult = movieDB.prepare('SELECT movieId, imdbId, title, genres, releaseDate, budget, runtime, language, productionCompanies FROM movies WHERE movieId=?').get(req.params.movieId);

  if (!movieResult) return next(createError(400, `No such movie with id: ${req.params.movieId}`));

  // pull average ratings
  const movieRatings = ratingsDB.prepare('SELECT round(avg(rating), 2) as average FROM ratings WHERE movieId=?').get(req.params.movieId);

  const results = {
    ...movieResult,
    ...{
      genres: JSON.parse(movieResult.genres),
      productionCompanies: JSON.parse(movieResult.productionCompanies),
      budget: ccyFormatter(movieResult.budget),
      averageRating: (movieRatings ? movieRatings.average : null),
    },
  };

  return res.json({ status: 'ok', results });
});

/**
 * Return movie by genreId
 * @params genreId
 */
router.get('/genres/:genreId', (req, res, next) => next(createError(501, 'Not yet implemented')));

module.exports = router;
