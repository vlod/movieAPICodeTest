process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../src/app');

const { expect } = chai;

chai.use(chaiHttp);
describe('GET /api/v1/', () => {
  it('should return the root page', async () => chai.request(server)
    .get('/api/v1')
    .then((res) => {
      expect(res).to.have.status(200);
    })
    .catch((err) => {
      console.error('error thrown: ', err);
      throw err;
    }));
});
