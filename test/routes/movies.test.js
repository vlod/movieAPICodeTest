process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../src/app');

const { expect } = chai;

chai.use(chaiHttp);
describe('GET /api/v1/movies', () => {
  it('should return the 1st page of movies', async () => chai.request(server)
    .get('/api/v1/movies')
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;

      expect(res.body).to.have.property('page');
      expect(res.body.page).to.be.equal(0);

      expect(res.body).to.have.property('results');
      expect(res.body.results).to.be.an('array');
      expect(res.body.results.length).to.equal(50);

      let row = res.body.results[0];
      expect(row).to.have.property('movieId');
      expect(row.movieId).to.equal(2);

      expect(row).to.have.property('imdbId');
      expect(row.imdbId).to.equal('tt0094675');

      expect(row).to.have.property('budget');
      expect(row.budget).to.equal('$0.00');

      expect(row).to.have.property('title');
      expect(row.title).to.equal('Ariel');

      expect(row).to.have.property('genres');
      expect(row.genres.length).to.equal(2);
      expect(row.genres[0].id).to.equal(18);
      expect(row.genres[0].name).to.equal('Drama');
      expect(row.genres[1].id).to.equal(80);
      expect(row.genres[1].name).to.equal('Crime');

      expect(row).to.have.property('releaseDate');
      expect(row.releaseDate).to.equal('1988-10-21');

      // eslint-disable-next-line prefer-destructuring
      row = res.body.results[2];
      expect(row).to.have.property('movieId');
      expect(row.movieId).to.equal(5);

      expect(row).to.have.property('imdbId');
      expect(row.imdbId).to.equal('tt0113101');

      expect(row).to.have.property('budget');
      expect(row.budget).to.equal('$4,000,000.00');

      expect(row).to.have.property('title');
      expect(row.title).to.equal('Four Rooms');

      expect(row).to.have.property('genres');
      expect(row.genres.length).to.equal(2);
      expect(row.genres[0].id).to.equal(80);
      expect(row.genres[0].name).to.equal('Crime');
      expect(row.genres[1].id).to.equal(35);
      expect(row.genres[1].name).to.equal('Comedy');

      expect(row).to.have.property('releaseDate');
      expect(row.releaseDate).to.equal('1995-12-09');

      // eslint-disable-next-line prefer-destructuring
      row = res.body.results[49];
      expect(row).to.have.property('movieId');
      expect(row.movieId).to.equal(85);

      expect(row).to.have.property('imdbId');
      expect(row.imdbId).to.equal('tt0082971');

      expect(row).to.have.property('budget');
      expect(row.budget).to.equal('$18,000,000.00');

      expect(row).to.have.property('title');
      expect(row.title).to.equal('Raiders of the Lost Ark');
    })
    .catch((err) => {
      console.error('error thrown: ', err);
      throw err;
    }));

  it('should return the last page of movies', async () => chai.request(server)
    .get('/api/v1/movies?page=908')
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;

      expect(res.body).to.have.property('page');
      expect(res.body.page).to.be.equal(908);

      expect(res.body).to.have.property('results');
      expect(res.body.results).to.be.an('array');
      expect(res.body.results.length).to.equal(30);

      let row = res.body.results[0];
      expect(row).to.have.property('movieId');
      expect(row.movieId).to.equal(459928);

      expect(row).to.have.property('title');
      expect(row.title).to.equal('12 Feet Deep');

      // eslint-disable-next-line prefer-destructuring
      row = res.body.results[29];
      expect(row).to.have.property('movieId');
      expect(row.movieId).to.equal(469172);

      expect(row).to.have.property('title');
      expect(row.title).to.equal('Manuel on the Island of Wonders');
    }));

  it('should return error for not found page', async () => chai.request(server)
    .get('/api/v1/movies?page=424242')
    .then((res) => {
      expect(res).to.have.status(404);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('No such page: 424242');
    }));

  it('should return error for non four digit year', async () => chai.request(server)
    .get('/api/v1/movies/year/42')
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Parameter \'year\' should be 4 digits');
    }));

  it('should return error for year with bad order parameter', async () => chai.request(server)
    .get('/api/v1/movies/year/1985?order=FOO')
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Parameter \'order\' should be either ASC or DESC but got: \'FOO\'');
    }));

  it('should return movies by year using default order of ASC', async () => chai.request(server)
    .get('/api/v1/movies/year/1985')
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('page');
      expect(res.body.page).to.be.equal(0);

      expect(res.body).to.have.property('results');
      expect(res.body.results).to.be.an('array');
      expect(res.body.results.length).to.equal(50);

      let row = res.body.results[0];
      expect(row).to.have.property('movieId');
      expect(row.movieId).to.equal(19127);

      expect(row).to.have.property('imdbId');
      expect(row.imdbId).to.equal('tt0090297');

      expect(row).to.have.property('budget');
      expect(row.budget).to.equal('$0.00');

      expect(row).to.have.property('title');
      expect(row.title).to.equal('Water');

      expect(row).to.have.property('releaseDate');
      expect(row.releaseDate).to.equal('1985-01-01');
      // TODO add genres.

      // eslint-disable-next-line prefer-destructuring
      row = res.body.results[49];
      expect(row).to.have.property('movieId');
      expect(row.movieId).to.equal(26578);

      expect(row).to.have.property('imdbId');
      expect(row.imdbId).to.equal('tt0087231');

      expect(row).to.have.property('budget');
      expect(row.budget).to.equal('$0.00');

      expect(row).to.have.property('title');
      expect(row.title).to.equal('The Falcon and the Snowman');

      expect(row).to.have.property('releaseDate');
      expect(row.releaseDate).to.equal('1985-01-25');
    }));

  it('should return movies by year using order of explicit ASC', async () => chai.request(server)
    .get('/api/v1/movies/year/1985?order=ASC')
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('page');
      expect(res.body.page).to.be.equal(0);

      expect(res.body).to.have.property('results');
      expect(res.body.results).to.be.an('array');
      expect(res.body.results.length).to.equal(50);

      let row = res.body.results[0];
      expect(row).to.have.property('movieId');
      expect(row.movieId).to.equal(19127);

      expect(row).to.have.property('imdbId');
      expect(row.imdbId).to.equal('tt0090297');

      expect(row).to.have.property('budget');
      expect(row.budget).to.equal('$0.00');

      expect(row).to.have.property('title');
      expect(row.title).to.equal('Water');

      expect(row).to.have.property('releaseDate');
      expect(row.releaseDate).to.equal('1985-01-01');
      // TODO add genres.

      // eslint-disable-next-line prefer-destructuring
      row = res.body.results[49];
      expect(row).to.have.property('movieId');
      expect(row.movieId).to.equal(26578);

      expect(row).to.have.property('imdbId');
      expect(row.imdbId).to.equal('tt0087231');

      expect(row).to.have.property('budget');
      expect(row.budget).to.equal('$0.00');

      expect(row).to.have.property('title');
      expect(row.title).to.equal('The Falcon and the Snowman');

      expect(row).to.have.property('releaseDate');
      expect(row.releaseDate).to.equal('1985-01-25');
    }));

  it('should return movies by year using order of explicit DESC', async () => chai.request(server)
    .get('/api/v1/movies/year/1985?order=DESC')
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('page');
      expect(res.body.page).to.be.equal(0);

      expect(res.body).to.have.property('results');
      expect(res.body.results).to.be.an('array');
      expect(res.body.results.length).to.equal(50);

      let row = res.body.results[0];
      expect(row).to.have.property('movieId');
      expect(row.movieId).to.equal(60363);

      expect(row).to.have.property('imdbId');
      expect(row.imdbId).to.equal('tt0089477');

      expect(row).to.have.property('budget');
      expect(row.budget).to.equal('$0.00');

      expect(row).to.have.property('title');
      expect(row.title).to.equal('Letter to Brezhnev');

      expect(row).to.have.property('releaseDate');
      expect(row.releaseDate).to.equal('1985-12-26');
      // TODO add genres.

      // eslint-disable-next-line prefer-destructuring
      row = res.body.results[49];
      expect(row).to.have.property('movieId');
      expect(row.movieId).to.equal(2189);

      expect(row).to.have.property('imdbId');
      expect(row.imdbId).to.equal('tt0090184');

      expect(row).to.have.property('budget');
      expect(row.budget).to.equal('$0.00');

      expect(row).to.have.property('title');
      expect(row.title).to.equal('Tomboy');

      expect(row).to.have.property('releaseDate');
      expect(row.releaseDate).to.equal('1985-11-14');
    }));

  it('should return error for movie details with bad unknown id', async () => chai.request(server)
    .get('/api/v1/movies/42')
    .then((res) => {
      expect(res).to.have.status(400);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('No such movie with id: 42');
    }));

  it('should return movie details', async () => chai.request(server)
    .get('/api/v1/movies/15')
    .then((res) => {
      expect(res).to.have.status(200);
      expect(res).to.be.json;
      expect(res.body).to.have.property('results');

      const row = res.body.results;
      expect(row).to.have.property('movieId');
      expect(row.movieId).to.equal(15);

      expect(row).to.have.property('imdbId');
      expect(row.imdbId).to.equal('tt0033467');

      expect(row).to.have.property('budget');
      expect(row.budget).to.equal('$839,727.00');

      expect(row).to.have.property('title');
      expect(row.title).to.equal('Citizen Kane');

      expect(row).to.have.property('releaseDate');
      expect(row.releaseDate).to.equal('1941-04-30');

      expect(row).to.have.property('genres');
      expect(row.genres.length).to.equal(2);
      expect(row.genres[0].id).to.equal(9648);
      expect(row.genres[0].name).to.equal('Mystery');
      expect(row.genres[1].id).to.equal(18);
      expect(row.genres[1].name).to.equal('Drama');

      expect(row).to.have.property('runtime');
      expect(row.runtime).to.equal(119);
      expect(row).to.have.property('language');
      expect(row.language).to.equal(null);

      expect(row).to.have.property('averageRating');
      expect(row.averageRating).to.equal(2.32);

      expect(row).to.have.property('productionCompanies');
      expect(row.productionCompanies.length).to.equal(2);
      expect(row.productionCompanies[0].id).to.equal(6);
      expect(row.productionCompanies[0].name).to.equal('RKO Radio Pictures');
      expect(row.productionCompanies[1].id).to.equal(11447);
      expect(row.productionCompanies[1].name).to.equal('Mercury Productions');
    }));

  it.skip('should return error for movie by genreId', async () => chai.request(server)
    .get('/api/v1/movies/genres/18')
    .then((res) => {
      expect(res).to.have.status(501);
      expect(res).to.be.json;
      expect(res.body).to.have.property('message');
      expect(res.body.message).to.equal('Not yet implemented');
    }));
});
