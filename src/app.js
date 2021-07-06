const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const createError = require('http-errors');
const betterSQLite3 = require('better-sqlite3');

const movieDB = betterSQLite3(path.join(__dirname, '..', 'db', 'movies.db'));
const ratingsDB = betterSQLite3(path.join(__dirname, '..', 'db', 'ratings.db'));

const logger = require('./config/winston');
const indexRouter = require('./routes/index');

const app = express();

app.use(helmet()); // defaults: https://github.com/helmetjs/helmet
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);

// store movieDB in local space
app.locals.movieDB = movieDB;
app.locals.ratingsDB = ratingsDB;

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  logger.error(`[${err.status}]: ${err.message} ${req.method}:${req.path}`);
  logger.error(err.stack);
  res.json({ status: 'error', errStatus: err.status, message: err.message });
});

process.on('exit', () => {
  movieDB.close();
  ratingsDB.close();
});
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

module.exports = app;
